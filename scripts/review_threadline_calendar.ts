import { writeFileSync } from 'node:fs';
import { formatThreadlineShippedPackMarkdown } from '../src/data/threadlineShippedPack.ts';

declare const process: { argv: string[] };

function readArg(name: string): string | null {
  const prefix = `--${name}=`;
  const entry = process.argv.find((arg) => arg.startsWith(prefix));
  return entry ? entry.slice(prefix.length) : null;
}

const markdown = formatThreadlineShippedPackMarkdown();
const writePath = readArg('write');

if (writePath) {
  writeFileSync(writePath, markdown);
} else {
  console.log(markdown);
}
