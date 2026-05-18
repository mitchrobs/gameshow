import { writeFileSync } from 'node:fs';
import {
  formatThreadlineShippedPackMarkdown,
  getThreadlineShippedCopyAudit,
} from '../src/data/threadlineShippedPack.ts';
import { formatThreadlineCopyAuditIssues } from '../src/data/threadlineCopyAudit.ts';

declare const process: { argv: string[]; exitCode?: number; stderr: { write(message: string): void } };

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

const audit = getThreadlineShippedCopyAudit();
if (audit.criticalIssues.length > 0) {
  process.stderr.write(
    [
      `Threadline copy audit failed with ${audit.criticalIssues.length} critical issue(s).`,
      ...formatThreadlineCopyAuditIssues(audit.criticalIssues).slice(0, 40),
      '',
    ].join('\n')
  );
  process.exitCode = 1;
}
