import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { POSTMARK_PACK_START_DATE } from '../src/data/postmarkMetadata';
import { buildPostmarkPack } from '../src/data/postmarkGenerator';

const outputPath = join(process.cwd(), 'src/data/postmarkPack.generated.ts');
const pack = buildPostmarkPack(POSTMARK_PACK_START_DATE);

const contents = `import type { PostmarkPackEntry } from './postmarkGenerator';

export const postmarkPackStartDate = ${JSON.stringify(POSTMARK_PACK_START_DATE)};
export const postmarkPack: PostmarkPackEntry[] = ${JSON.stringify(pack, null, 2)} as PostmarkPackEntry[];
`;

writeFileSync(outputPath, contents);
console.log(`Wrote ${pack.length} Postmark pack entries to ${outputPath}`);
