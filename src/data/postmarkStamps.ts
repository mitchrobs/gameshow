export type PostmarkStampFamily = 'inbox-tile' | 'signal-block' | 'soft-alert';

export type PostmarkStampEdgeTreatment = 'app-tile' | 'inbox-card' | 'soft-alert';

export type PostmarkStampArtworkStyle =
  | 'angle-stack'
  | 'arc-field'
  | 'banded-slash'
  | 'block-stack'
  | 'checker-field'
  | 'chevron-fold'
  | 'crop-field'
  | 'folded-bars'
  | 'hill-field'
  | 'moon-field'
  | 'offset-register'
  | 'ribbon-field'
  | 'ribbon-stack'
  | 'ridge-lines'
  | 'split-field'
  | 'split-sun'
  | 'sun-field'
  | 'terrace-field'
  | 'wide-horizon'
  | 'window-grid'
  | 'woven-register';

export interface PostmarkStampNumberBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PostmarkStampArtBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PostmarkStampSpec {
  id: string;
  family: PostmarkStampFamily;
  label: string;
  viewBox: '0 0 100 100';
  path: string;
  artBox: PostmarkStampArtBox;
  artworkStyle: PostmarkStampArtworkStyle;
  numberBox: PostmarkStampNumberBox;
  edgeTreatment: PostmarkStampEdgeTreatment;
}

export interface PostmarkStampSeed {
  date: string;
  dayNumber: number;
  startId: string;
  startIndex?: number;
}

export const POSTMARK_STAMP_VIEWBOX = '0 0 100 100' as const;
export const POSTMARK_STAMP_PERFORATED_PATH =
  'M10 5H22C22 12 31 12 31 5H39C39 12 48 12 48 5H56C56 12 65 12 65 5H73C73 12 82 12 82 5H90C93 5 95 7 95 10V18C88 18 88 27 95 27V35C88 35 88 44 95 44V52C88 52 88 61 95 61V69C88 69 88 78 95 78V90C95 93 93 95 90 95H82C82 88 73 88 73 95H65C65 88 56 88 56 95H48C48 88 39 88 39 95H31C31 88 22 88 22 95H10C7 95 5 93 5 90V78C12 78 12 69 5 69V61C12 61 12 52 5 52V44C12 44 12 35 5 35V27C12 27 12 18 5 18V10C5 7 7 5 10 5Z';

const POSTMARK_ART_BOXES: PostmarkStampArtBox[] = [
  { x: 0, y: 0, width: 100, height: 100 },
];

const POSTMARK_NOTIFICATION_BADGE: PostmarkStampNumberBox = { x: 66, y: -5, width: 40, height: 40 };

const STAMP_STYLES: PostmarkStampArtworkStyle[] = [
  'angle-stack',
  'woven-register',
  'folded-bars',
  'checker-field',
  'offset-register',
  'ribbon-stack',
  'block-stack',
  'banded-slash',
  'chevron-fold',
  'moon-field',
  'sun-field',
  'wide-horizon',
  'crop-field',
  'terrace-field',
  'arc-field',
  'hill-field',
  'split-field',
  'split-sun',
  'ridge-lines',
  'window-grid',
  'ribbon-field',
];

const FAMILY_CONFIG: {
  family: PostmarkStampFamily;
  labelPrefix: string;
  edgeTreatment: PostmarkStampEdgeTreatment;
  count: number;
}[] = [
  { family: 'inbox-tile', labelPrefix: 'Inbox', edgeTreatment: 'inbox-card', count: 14 },
  { family: 'signal-block', labelPrefix: 'Signal', edgeTreatment: 'app-tile', count: 13 },
  { family: 'soft-alert', labelPrefix: 'Alert', edgeTreatment: 'soft-alert', count: 13 },
];

function titleCaseStyle(style: PostmarkStampArtworkStyle): string {
  return style
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export const postmarkStampSpecs: PostmarkStampSpec[] = FAMILY_CONFIG.flatMap(
  ({ family, labelPrefix, edgeTreatment, count }, familyIndex) =>
    Array.from({ length: count }, (_, index) => {
      const globalIndex =
        FAMILY_CONFIG.slice(0, familyIndex).reduce((sum, config) => sum + config.count, 0) +
        index;
      const artworkStyle = STAMP_STYLES[(globalIndex + familyIndex * 3) % STAMP_STYLES.length]!;
      return {
        id: `${family}-${String(index + 1).padStart(2, '0')}`,
        family,
        label: `${labelPrefix} ${titleCaseStyle(artworkStyle)}`,
        viewBox: POSTMARK_STAMP_VIEWBOX,
        path: POSTMARK_STAMP_PERFORATED_PATH,
        artBox: POSTMARK_ART_BOXES[(globalIndex + familyIndex) % POSTMARK_ART_BOXES.length]!,
        artworkStyle,
        numberBox: POSTMARK_NOTIFICATION_BADGE,
        edgeTreatment,
      } satisfies PostmarkStampSpec;
    })
);

export const postmarkStampDirectionSpecs = postmarkStampSpecs;

const stampSpecById = new Map(postmarkStampSpecs.map((spec) => [spec.id, spec]));

export function getPostmarkStampSpecById(id: string): PostmarkStampSpec | undefined {
  return stampSpecById.get(id);
}

export function hashPostmarkStampSeed(seed: string): number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function getPostmarkStampForStart(seed: PostmarkStampSeed): PostmarkStampSpec {
  const hash = hashPostmarkStampSeed(
    `${seed.date}|${seed.dayNumber}|${seed.startId}|${seed.startIndex ?? 0}`
  );
  return postmarkStampSpecs[hash % postmarkStampSpecs.length]!;
}

export function getPostmarkStampFamilyLabel(family: PostmarkStampFamily): string {
  if (family === 'inbox-tile') return 'Poster Stamps';
  if (family === 'signal-block') return 'Landscape Stamps';
  return 'Perforated Studies';
}
