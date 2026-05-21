#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { VARIANTS } from './src/variantLabCore.mjs';

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = Number(process.env.LIBERTIES_LAB_CDP_PORT ?? 9237);
const baseUrl = process.env.LIBERTIES_LAB_URL ?? 'http://127.0.0.1:8125';
const userDataDir = mkdtempSync(join(tmpdir(), 'liberties-lab-chrome-'));

const chrome = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${userDataDir}`,
  '--window-size=1440,1000',
  `${baseUrl}/?variant=${VARIANTS[0].id}&puzzle=0`,
], { stdio: 'ignore' });

async function getJson(url, init) {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
  return response.json();
}

async function waitForTarget() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const targets = await getJson(`http://127.0.0.1:${port}/json/list`);
      const page = targets.find((target) => target.type === 'page' && target.webSocketDebuggerUrl);
      if (page) return page;
    } catch {
      // Chrome is still booting.
    }
    await delay(100);
  }
  throw new Error('Timed out waiting for Chrome debugging target.');
}

class CdpSession {
  constructor(wsUrl) {
    this.nextId = 1;
    this.pending = new Map();
    this.events = new Map();
    this.socket = new WebSocket(wsUrl);
    this.socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else resolve(message.result);
        return;
      }
      if (message.method && this.events.has(message.method)) {
        const listeners = this.events.get(message.method);
        this.events.set(message.method, []);
        listeners.forEach((resolve) => resolve(message.params));
      }
    });
  }

  async ready() {
    if (this.socket.readyState === WebSocket.OPEN) return;
    await new Promise((resolve, reject) => {
      this.socket.addEventListener('open', resolve, { once: true });
      this.socket.addEventListener('error', reject, { once: true });
    });
  }

  send(method, params = {}) {
    const id = this.nextId;
    this.nextId += 1;
    const promise = new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });
    this.socket.send(JSON.stringify({ id, method, params }));
    return promise;
  }

  once(method) {
    return new Promise((resolve) => {
      const listeners = this.events.get(method) ?? [];
      listeners.push(resolve);
      this.events.set(method, listeners);
    });
  }

  close() {
    this.socket.close();
  }
}

async function evaluate(session, expression) {
  const result = await session.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text ?? 'Runtime evaluation failed');
  }
  return result.result.value;
}

async function run() {
  const target = await waitForTarget();
  const session = new CdpSession(target.webSocketDebuggerUrl);
  await session.ready();
  await session.send('Page.enable');
  await session.send('Runtime.enable');
  await delay(700);

  const checks = [];
  for (const variant of VARIANTS) {
    const result = await evaluate(session, `new Promise((resolve) => {
      const target = [...document.querySelectorAll('.variant-button')].find((button) => button.textContent.includes(${JSON.stringify(variant.name)}));
      target.click();
      setTimeout(() => {
        document.querySelector('[data-auto]').click();
        setTimeout(() => {
          resolve({
            title: document.querySelector('[data-title]').textContent,
            status: document.querySelector('[data-status]').textContent,
            cells: document.querySelectorAll('.cell').length,
            active: document.querySelector('.variant-button.active strong').textContent,
            captures: document.querySelector('[data-metrics]').textContent,
          });
        }, 90);
      }, 90);
    })`);
    const passed =
      result.title === variant.name &&
      result.status.includes('Settled in') &&
      result.cells > 0 &&
      result.active === variant.shortName;
    checks.push({ variantId: variant.id, passed, ...result });
  }

  session.close();
  return checks;
}

try {
  const checks = await run();
  checks.forEach((check) => {
    console.log(`${check.passed ? 'ok' : 'FAIL'} ${check.variantId} | ${check.status}`);
  });
  if (checks.some((check) => !check.passed)) process.exitCode = 1;
} finally {
  chrome.kill();
  await delay(250);
  rmSync(userDataDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
}
