import { existsSync, readFileSync, statSync } from 'node:fs';
import { isAbsolute, join, relative } from 'node:path';
import { REPO_ROOT } from '../config.js';

export interface ViewImageInput {
  /** Repo-relative or absolute path to a PNG file under tmp/moji-mash or assets/genmoji. */
  path: string;
}

export interface ViewImageImage {
  /** Base64-encoded PNG bytes. */
  base64: string;
  mediaType: 'image/png';
  /** Caption included alongside the image block, so the agent has context. */
  caption: string;
}

export interface ViewImageResult {
  path: string;
  absPath: string;
  sizeBytes: number;
  /** Always a single-element array — modelled as array for symmetry with multi-image tools. */
  images: ViewImageImage[];
}

const MAX_BYTES = 5 * 1024 * 1024; // Anthropic vision block cap

/**
 * Surface a staged or promoted PNG to the agent as a vision-attached tool
 * result. Intended for inspecting variants the agent did NOT just generate —
 * e.g. non-recommended variants from a prior generate_moji run, or resuming
 * a previous session's staged images. Fresh generate_moji / refine_moji
 * already attach the recommended variant automatically.
 *
 * Access is sandboxed to the repo root. PNGs only (png is the only format
 * produced by scripts/generate_moji.py).
 */
export function viewImageTool(input: ViewImageInput): ViewImageResult {
  const rawPath = String(input.path ?? '').trim();
  if (!rawPath) throw new Error('view_image: path is required');

  const absPath = isAbsolute(rawPath) ? rawPath : join(REPO_ROOT, rawPath);

  // Sandbox: must resolve under repo root. relative() returns "../..." when it doesn't.
  const rel = relative(REPO_ROOT, absPath);
  if (rel.startsWith('..') || isAbsolute(rel)) {
    throw new Error(`view_image: path must be inside the repo root (got ${rawPath})`);
  }

  if (!absPath.toLowerCase().endsWith('.png')) {
    throw new Error(`view_image: only .png files are viewable (got ${rawPath})`);
  }
  if (!existsSync(absPath)) {
    throw new Error(`view_image: file does not exist at ${rel}`);
  }
  const stat = statSync(absPath);
  if (!stat.isFile()) {
    throw new Error(`view_image: not a regular file: ${rel}`);
  }
  if (stat.size > MAX_BYTES) {
    throw new Error(
      `view_image: file too large (${stat.size} bytes; max ${MAX_BYTES})`,
    );
  }

  const buf = readFileSync(absPath);
  const base64 = buf.toString('base64');

  return {
    path: rel,
    absPath,
    sizeBytes: stat.size,
    images: [
      {
        base64,
        mediaType: 'image/png',
        caption: `Staged image at ${rel} (${stat.size} bytes)`,
      },
    ],
  };
}
