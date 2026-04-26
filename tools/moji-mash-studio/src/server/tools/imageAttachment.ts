import { existsSync, readFileSync, statSync } from 'node:fs';
import type { ViewImageImage } from './viewImage.js';

const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Helper for tools that want to attach a generated PNG to their tool_result
 * so the agent can see it without a separate view_image call. Returns null
 * (not throws) on failure — missing-attachment is non-fatal; the JSON result
 * always still lands.
 */
export function loadImageAttachment(
  absPath: string,
  caption: string,
): ViewImageImage | null {
  try {
    if (!existsSync(absPath)) return null;
    const stat = statSync(absPath);
    if (!stat.isFile() || stat.size > MAX_BYTES) return null;
    const base64 = readFileSync(absPath).toString('base64');
    return { base64, mediaType: 'image/png', caption };
  } catch {
    return null;
  }
}
