import type { ImageSourcePropType } from 'react-native';
import type { MuseumArtwork } from './museumArtworks';
import { FRAME_MANIFEST } from './museumFrameCatalog.generated';

export type FrameShape =
  | 'portrait-2x3'
  | 'portrait-3x4'
  | 'portrait-4x5'
  | 'square-1x1'
  | 'landscape-4x3'
  | 'landscape-3x2'
  | 'landscape-16x9'
  | 'arched-portrait'
  | 'oval-portrait';

export type ArtFit = 'contain' | 'cover';
export type ArtMask = 'rect' | 'oval' | 'arch';

export interface InnerWindow {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FrameMeta {
  id: string;
  label: string;
  shape: FrameShape;
  style: string;
  outerAspectRatio: number;
  innerWindow: InnerWindow;
  artMask: ArtMask;
  safeArtFit: ArtFit;
  tags: string[];
  renderMode?: 'asset' | 'generated';
  assets?: {
    overlay: ImageSourcePropType;
    shadow?: ImageSourcePropType;
    mask?: ImageSourcePropType;
    preview?: ImageSourcePropType;
  };
  recommendedMat?: {
    enabled: boolean;
    color: string;
    width: number;
  };
  generatedStyle?: {
    outer: string;
    outerAlt: string;
    edge: string;
    edgeSoft: string;
    mat: string;
    matBorder: string;
    wallGlow: string;
  };
}

export interface ArtworkInput {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  department?: string;
  culture?: string;
  period?: string;
  medium?: string;
  classification?: string;
  mediumCategory?: string;
  geoRegion?: string;
  objectDate?: string;
}

const CURATED_FRAME_IDS = [
  'gilded-gallery-02',
  'black-gallery-03',
  'walnut-deep-05',
  'gilded-arch-06',
  'ivory-rococo-08',
  'walnut-gallery-09',
  'black-liner-10',
  'silver-gallery-13',
  'amber-gallery-15',
  'gilded-gallery-18',
  'gilded-oval-29',
  'ivory-gallery-35',
] as const;

const CURATED_FRAME_ID_SET = new Set<string>(CURATED_FRAME_IDS);

const GENERATED_LANDSCAPE_FRAMES: FrameMeta[] = [
  {
    id: 'generated-brass-landscape-4x3',
    label: 'Gallery Brass Landscape',
    shape: 'landscape-4x3',
    style: 'generated-brass',
    renderMode: 'generated',
    outerAspectRatio: 4 / 3,
    innerWindow: { x: 0.09, y: 0.14, width: 0.82, height: 0.68 },
    artMask: 'rect',
    safeArtFit: 'contain',
    tags: ['generated', 'landscape', 'gallery', 'gold', 'minimal'],
    recommendedMat: { enabled: true, color: '#f3eadb', width: 0.025 },
    generatedStyle: {
      outer: '#8a6738',
      outerAlt: '#bd9651',
      edge: 'rgba(255,226,173,0.55)',
      edgeSoft: 'rgba(255,244,220,0.15)',
      mat: '#f4ecdf',
      matBorder: 'rgba(109,83,45,0.32)',
      wallGlow: 'rgba(194,150,92,0.18)',
    },
  },
  {
    id: 'generated-walnut-landscape-3x2',
    label: 'Gallery Walnut Landscape',
    shape: 'landscape-3x2',
    style: 'generated-walnut',
    renderMode: 'generated',
    outerAspectRatio: 3 / 2,
    innerWindow: { x: 0.085, y: 0.13, width: 0.83, height: 0.7 },
    artMask: 'rect',
    safeArtFit: 'contain',
    tags: ['generated', 'landscape', 'wood', 'walnut', 'gallery'],
    recommendedMat: { enabled: true, color: '#efe5d7', width: 0.022 },
    generatedStyle: {
      outer: '#4a3223',
      outerAlt: '#73503a',
      edge: 'rgba(203,170,130,0.45)',
      edgeSoft: 'rgba(255,236,214,0.11)',
      mat: '#f0e7da',
      matBorder: 'rgba(97,70,49,0.3)',
      wallGlow: 'rgba(112,82,58,0.18)',
    },
  },
  {
    id: 'generated-black-landscape-16x9',
    label: 'Gallery Black Landscape',
    shape: 'landscape-16x9',
    style: 'generated-black',
    renderMode: 'generated',
    outerAspectRatio: 16 / 9,
    innerWindow: { x: 0.07, y: 0.16, width: 0.86, height: 0.64 },
    artMask: 'rect',
    safeArtFit: 'contain',
    tags: ['generated', 'landscape', 'black', 'minimal', 'modern'],
    recommendedMat: { enabled: true, color: '#f2eadf', width: 0.02 },
    generatedStyle: {
      outer: '#201d1c',
      outerAlt: '#383330',
      edge: 'rgba(213,201,187,0.35)',
      edgeSoft: 'rgba(255,255,255,0.08)',
      mat: '#f1e9de',
      matBorder: 'rgba(82,76,70,0.28)',
      wallGlow: 'rgba(78,71,66,0.18)',
    },
  },
];

function hashText(input: string): number {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }
  return hash;
}

export function getShapeBucket(aspect: number): FrameShape {
  if (!Number.isFinite(aspect) || aspect <= 0) return 'portrait-3x4';
  if (aspect < 0.72) return 'portrait-2x3';
  if (aspect < 0.85) return 'portrait-3x4';
  if (aspect < 0.95) return 'portrait-4x5';
  if (aspect <= 1.08) return 'square-1x1';
  if (aspect <= 1.45) return 'landscape-4x3';
  if (aspect <= 1.7) return 'landscape-3x2';
  return 'landscape-16x9';
}

export function inferArtworkAspectRatio(artwork: ArtworkInput): number {
  if (artwork.width && artwork.height && artwork.height > 0) {
    return artwork.width / artwork.height;
  }

  return 0.75;
}

function getArtworkDescriptorText(artwork: ArtworkInput): string {
  return [
    artwork.department,
    artwork.culture,
    artwork.period,
    artwork.medium,
    artwork.classification,
    artwork.mediumCategory,
    artwork.geoRegion,
    artwork.objectDate,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function scoreFrameForArtwork(frame: FrameMeta, artwork: ArtworkInput): number {
  const text = getArtworkDescriptorText(artwork);
  const artAspect = inferArtworkAspectRatio(artwork);
  const openingAspect = frame.innerWindow.width / frame.innerWindow.height;
  const aspectDelta = Math.abs(Math.log(openingAspect / artAspect));
  let score = 0;

  if (/europe|renaissance|baroque|rococo|old master|impression|painting|oil/.test(text)) {
    if (frame.tags.includes('gold')) score += 3;
    if (frame.tags.includes('ornate')) score += 2;
    if (frame.tags.includes('classic')) score += 2;
  }

  if (/print|drawing|etching|lithograph|paper|photograph|ukiyo-e/.test(text)) {
    if (frame.tags.includes('minimal')) score += 3;
    if (frame.tags.includes('black')) score += 2;
    if (frame.tags.includes('modern')) score += 1;
  }

  if (/asian|japan|china|korea|islamic|textile|ceramic|metalwork/.test(text)) {
    if (frame.tags.includes('wood')) score += 2;
    if (frame.tags.includes('soft')) score += 2;
    if (frame.tags.includes('minimal')) score += 1;
  }

  if (/africa|sculpture|buddhist|egypt|mediterranean|ancient/.test(text)) {
    if (frame.tags.includes('wood')) score += 2;
    if (frame.tags.includes('classic')) score += 1;
    if (frame.tags.includes('special')) score += 1;
  }

  if (/modern|contemporary|abstract|circus|neo-impression/.test(text)) {
    if (frame.tags.includes('modern')) score += 3;
    if (frame.tags.includes('minimal')) score += 2;
    if (frame.tags.includes('black')) score += 1;
  }

  if (/portrait|head|bodhisattva|crowned/.test(text)) {
    if (frame.tags.includes('portrait')) score += 2;
    if (frame.tags.includes('special')) score += 1;
  }

  if (/landscape|wave|field|garden|delaware|circus/.test(text) && frame.shape.startsWith('landscape')) {
    score += 2;
  }

  if (aspectDelta < 0.08) score += 4;
  else if (aspectDelta < 0.16) score += 2;
  else if (aspectDelta > 0.28) score -= 6;
  else if (aspectDelta > 0.2) score -= 3;

  return score;
}

function sortByDeterministicChoice(
  candidates: FrameMeta[],
  artwork: ArtworkInput,
  scoreLookup: Map<string, number>
): FrameMeta[] {
  const artKey = [
    artwork.alt,
    artwork.period,
    artwork.objectDate,
    artwork.mediumCategory,
    artwork.geoRegion,
  ]
    .filter(Boolean)
    .join(':');

  return [...candidates].sort((left, right) => {
    const scoreDelta = (scoreLookup.get(right.id) ?? 0) - (scoreLookup.get(left.id) ?? 0);
    if (scoreDelta !== 0) return scoreDelta;
    return hashText(`${artKey}:${left.id}`) - hashText(`${artKey}:${right.id}`);
  });
}

function getCandidateFramesForBucket(frames: FrameMeta[], bucket: FrameShape): FrameMeta[] {
  const exact = frames.filter((frame) => frame.shape === bucket);
  if (exact.length > 0) return exact;

  if (bucket === 'landscape-3x2' || bucket === 'landscape-16x9') {
    const landscapes = frames.filter((frame) => frame.shape.startsWith('landscape'));
    if (landscapes.length > 0) return landscapes;
  }

  if (bucket === 'portrait-2x3') {
    const portraits = frames.filter(
      (frame) => frame.shape === 'portrait-3x4' || frame.shape === 'portrait-4x5'
    );
    if (portraits.length > 0) return portraits;
  }

  return exact;
}

export function selectFrame({
  artwork,
  frames = CURATED_FRAME_MANIFEST,
  preferredFrameId,
  recentFrameIds = [],
  allowSpecialShapes = false,
}: {
  artwork: ArtworkInput;
  frames?: FrameMeta[];
  preferredFrameId?: string;
  recentFrameIds?: string[];
  allowSpecialShapes?: boolean;
}): FrameMeta {
  if (preferredFrameId) {
    const preferred = frames.find((frame) => frame.id === preferredFrameId);
    if (preferred) return preferred;
  }

  const aspect = inferArtworkAspectRatio(artwork);
  const bucket = getShapeBucket(aspect);

  const specialShapes = new Set<FrameShape>(['arched-portrait', 'oval-portrait']);
  let candidates = getCandidateFramesForBucket(frames, bucket);

  if (!allowSpecialShapes) {
    candidates = candidates.filter((frame) => !specialShapes.has(frame.shape));
  }

  if (candidates.length === 0) {
    candidates = frames.filter((frame) => frame.shape === 'portrait-3x4');
  }

  const unused = candidates.filter((frame) => !recentFrameIds.includes(frame.id));
  const pool = unused.length > 0 ? unused : candidates;
  const scoreLookup = new Map(pool.map((frame) => [frame.id, scoreFrameForArtwork(frame, artwork)]));
  return sortByDeterministicChoice(pool, artwork, scoreLookup)[0];
}

export function buildFrameArtworkInput(
  artwork: MuseumArtwork,
  aspectRatio?: number
): ArtworkInput {
  return {
    src: artwork.images.displayUrl,
    alt: artwork.title,
    width: aspectRatio ?? 0.75,
    height: 1,
    culture: artwork.geoRegion,
    period: artwork.periodTag,
    medium: artwork.medium,
    classification: artwork.mediumCategory,
    mediumCategory: artwork.mediumCategory,
    geoRegion: artwork.geoRegion,
    objectDate: artwork.objectDate,
  };
}

export const CURATED_FRAME_MANIFEST = [
  ...FRAME_MANIFEST.filter((frame) => CURATED_FRAME_ID_SET.has(frame.id)),
  ...GENERATED_LANDSCAPE_FRAMES,
];

export { FRAME_MANIFEST };
