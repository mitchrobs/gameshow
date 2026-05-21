#!/usr/bin/env node

import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const distDir = process.argv[2] ?? 'dist';
const siteUrl = normalizeSiteUrl(
  process.argv[3] ?? process.env.GITHUB_PAGES_URL ?? 'https://mitchrobs.github.io/gameshow/'
);

function normalizeSiteUrl(value) {
  return value.endsWith('/') ? value : `${value}/`;
}

async function readRouteNames() {
  try {
    const files = await readdir(distDir);
    return files
      .filter((file) => file.endsWith('.html'))
      .map((file) => (file === 'index.html' ? '' : file));
  } catch (error) {
    console.warn(`Could not read ${distDir}: ${error.message}`);
    return [''];
  }
}

function extractScriptPaths(html) {
  const paths = new Set();
  const scriptPattern = /<script[^>]+src=["']([^"']+)["']/g;
  let match;

  while ((match = scriptPattern.exec(html))) {
    const source = match[1];
    if (source.includes('/_expo/static/js/')) {
      paths.add(source);
    }
  }

  return [...paths];
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.text();
}

async function fetchBytes(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('javascript')) {
    throw new Error(`expected JavaScript, got ${contentType || 'unknown content type'}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

function localPathForScript(scriptPath) {
  const marker = '/_expo/static/js/';
  const markerIndex = scriptPath.indexOf(marker);
  if (markerIndex === -1) return null;
  return path.join(distDir, scriptPath.slice(markerIndex + 1));
}

async function main() {
  if (typeof fetch !== 'function') {
    console.warn('No global fetch available; skipping previous Pages asset preservation.');
    return;
  }

  const routeNames = await readRouteNames();
  const scriptPaths = new Set();

  for (const routeName of routeNames) {
    const routeUrl = new URL(routeName, siteUrl);
    routeUrl.searchParams.set('__preserve', String(Date.now()));

    try {
      const html = await fetchText(routeUrl.href);
      for (const scriptPath of extractScriptPaths(html)) {
        scriptPaths.add(scriptPath);
      }
    } catch (error) {
      console.warn(`Could not inspect previous Pages route ${routeUrl.href}: ${error.message}`);
    }
  }

  let copied = 0;
  for (const scriptPath of scriptPaths) {
    const targetPath = localPathForScript(scriptPath);
    if (!targetPath) continue;

    const scriptUrl = new URL(scriptPath.replace(/^\/gameshow\//, ''), siteUrl);
    try {
      const bytes = await fetchBytes(scriptUrl.href);
      await mkdir(path.dirname(targetPath), { recursive: true });
      await writeFile(targetPath, bytes, { flag: 'wx' });
      copied += 1;
    } catch (error) {
      if (error?.code !== 'EEXIST') {
        console.warn(`Could not preserve ${scriptUrl.href}: ${error.message}`);
      }
    }
  }

  console.log(`Preserved ${copied} previous GitHub Pages JS chunk${copied === 1 ? '' : 's'}.`);
}

main().catch((error) => {
  console.warn(`Previous Pages asset preservation skipped: ${error.message}`);
});
