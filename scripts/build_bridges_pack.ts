import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { BRIDGES_PACK_START_DATE } from '../src/data/bridgesMetadata';
import { buildBridgesPack } from '../src/data/bridgesGenerator';

const outputPath = join(process.cwd(), 'src/data/bridgesPack.generated.ts');
const pack = buildBridgesPack(BRIDGES_PACK_START_DATE);

const contents = `import type { BridgesPackEntry } from './bridgesGenerator';

export const bridgesPackStartDate = ${JSON.stringify(BRIDGES_PACK_START_DATE)};
export const bridgesPack: BridgesPackEntry[] = ${JSON.stringify(pack, null, 2)} as BridgesPackEntry[];
`;

writeFileSync(outputPath, contents);
console.log(`Wrote ${pack.length} Bridges pack entries to ${outputPath}`);
