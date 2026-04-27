import { Image, StyleSheet, type ImageSourcePropType } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';

export const DAWN_TILE_ASSETS: {
  id: string;
  label: string;
  source: ImageSourcePropType;
}[] = [
  { id: 'plum-spray', label: 'Plum spray', source: require('../../assets/dawn-cabinet/dawn-tiles/dawn-00-plum-spray.png') },
  { id: 'orchid-brush', label: 'Orchid brush', source: require('../../assets/dawn-cabinet/dawn-tiles/dawn-01-orchid-brush.png') },
  { id: 'chrysanthemum-crest', label: 'Chrysanthemum crest', source: require('../../assets/dawn-cabinet/dawn-tiles/dawn-02-chrysanthemum-crest.png') },
  { id: 'peony-bud', label: 'Peony bud', source: require('../../assets/dawn-cabinet/dawn-tiles/dawn-03-peony-bud.png') },
  { id: 'camellia-branch', label: 'Camellia branch', source: require('../../assets/dawn-cabinet/dawn-tiles/dawn-04-camellia-branch.png') },
  { id: 'maple-leaf', label: 'Maple leaf', source: require('../../assets/dawn-cabinet/dawn-tiles/dawn-05-maple-leaf.png') },
  { id: 'willow-sprig', label: 'Willow sprig', source: require('../../assets/dawn-cabinet/dawn-tiles/dawn-06-willow-sprig.png') },
  { id: 'pine-bough', label: 'Pine bough', source: require('../../assets/dawn-cabinet/dawn-tiles/dawn-07-pine-bough.png') },
  { id: 'snowflower', label: 'Snowflower', source: require('../../assets/dawn-cabinet/dawn-tiles/dawn-08-snowflower.png') },
  { id: 'spring-sprig', label: 'Spring sprig', source: require('../../assets/dawn-cabinet/dawn-tiles/dawn-09-spring-sprig.png') },
  { id: 'autumn-leaf', label: 'Autumn leaf', source: require('../../assets/dawn-cabinet/dawn-tiles/dawn-10-autumn-leaf.png') },
  { id: 'winter-branch', label: 'Winter branch', source: require('../../assets/dawn-cabinet/dawn-tiles/dawn-11-winter-branch.png') },
  { id: 'garden-gate', label: 'Garden gate', source: require('../../assets/dawn-cabinet/dawn-tiles/dawn-12-garden-gate.png') },
  { id: 'mountain-pavilion', label: 'Mountain pavilion', source: require('../../assets/dawn-cabinet/dawn-tiles/dawn-13-mountain-pavilion.png') },
  { id: 'folding-fan', label: 'Folding fan', source: require('../../assets/dawn-cabinet/dawn-tiles/dawn-14-folding-fan.png') },
  { id: 'painted-scroll', label: 'Painted scroll', source: require('../../assets/dawn-cabinet/dawn-tiles/dawn-15-painted-scroll.png') },
  { id: 'bronze-mirror', label: 'Bronze mirror', source: require('../../assets/dawn-cabinet/dawn-tiles/dawn-16-bronze-mirror.png') },
  { id: 'vermilion-tag', label: 'Vermilion tag', source: require('../../assets/dawn-cabinet/dawn-tiles/dawn-17-vermilion-tag.png') },
  { id: 'paper-charm', label: 'Paper charm', source: require('../../assets/dawn-cabinet/dawn-tiles/dawn-18-paper-charm.png') },
  { id: 'morning-aster', label: 'Morning aster', source: require('../../assets/dawn-cabinet/dawn-tiles/dawn-19-morning-aster.png') },
];

export const DAWN_VARIANT_COUNT = DAWN_TILE_ASSETS.length;

const DAWN_VARIANT_PALETTES = [
  { main: '#b8731a', dark: '#6f3f12', red: '#cf5d34', soft: '#fff4d0' },
  { main: '#c08a16', dark: '#6d4b0d', red: '#ba4b30', soft: '#fff5d8' },
  { main: '#a66720', dark: '#5f3511', red: '#d16d42', soft: '#fff0cf' },
  { main: '#bd6f24', dark: '#75430f', red: '#c64d35', soft: '#fff7dc' },
  { main: '#d09120', dark: '#714912', red: '#b94c2d', soft: '#fff1c8' },
];

const DAWN_VARIANT_MOTIFS = [
  'plumSpray',
  'orchidSpray',
  'chrysanthemum',
  'peony',
  'camellia',
  'maple',
  'willow',
  'pine',
  'snowflower',
  'springSprig',
  'autumnLeaf',
  'winterBranch',
  'gardenGate',
  'mountainPavilion',
  'foldingFan',
  'paintedScroll',
  'bronzeMirror',
  'vermilionSeal',
  'paperCharm',
  'morningAster',
] as const;

export function DawnTileMark({ variant, useFallback }: { variant: number; useFallback?: boolean }) {
  const asset = DAWN_TILE_ASSETS[variant % DAWN_TILE_ASSETS.length];
  if (!asset || useFallback) {
    return <DawnTileFallbackMark variant={variant} />;
  }
  return (
    <Image
      accessibilityIgnoresInvertColors
      source={asset.source}
      resizeMode="contain"
      style={styles.dawnTileAsset}
    />
  );
}

export function DawnTileFallbackMark({ variant }: { variant: number }) {
  const palette = DAWN_VARIANT_PALETTES[variant % DAWN_VARIANT_PALETTES.length];
  const motif = DAWN_VARIANT_MOTIFS[variant % DAWN_VARIANT_MOTIFS.length];
  const motifIndex = variant % DAWN_VARIANT_COUNT;
  const insetTint = motifIndex % 2 === 0 ? '#fff8df' : '#fff1ce';
  return (
    <Svg width="100%" height="100%" viewBox="0 0 64 64">
      <Rect x={6} y={5} width={52} height={54} rx={10} fill={palette.soft} />
      <Rect x={6} y={5} width={52} height={54} rx={10} fill="none" stroke={palette.dark} strokeWidth={2.6} />
      <Rect x={12} y={11} width={40} height={42} rx={7} fill={insetTint} stroke={palette.main} strokeWidth={1.8} />
      <Path
        d="M18 18 H25 M18 18 V25 M39 18 H46 M46 18 V25 M18 46 H25 M18 39 V46 M39 46 H46 M46 39 V46"
        fill="none"
        stroke={palette.dark}
        strokeWidth={1.7}
        strokeLinecap="round"
        opacity={0.52}
      />
      <Line x1={22} y1={14} x2={42} y2={14} stroke={palette.red} strokeWidth={2} strokeLinecap="round" opacity={0.7} />
      <Line x1={22} y1={50} x2={42} y2={50} stroke={palette.red} strokeWidth={2} strokeLinecap="round" opacity={0.7} />
      {renderCurrentDawnMotif(motif, palette, motifIndex)}
    </Svg>
  );
}

const styles = StyleSheet.create({
  dawnTileAsset: {
    width: '100%',
    height: '100%',
  },
});

function renderCurrentDawnMotif(
  motif: (typeof DAWN_VARIANT_MOTIFS)[number],
  palette: (typeof DAWN_VARIANT_PALETTES)[number],
  motifIndex: number
) {
  const accentOpacity = motifIndex % 2 === 0 ? 0.82 : 0.68;

  switch (motif) {
    case 'plumSpray':
      return (
        <G>
          <Path d="M20 44 C26 37 32 34 45 20" fill="none" stroke={palette.dark} strokeWidth={2.9} strokeLinecap="round" />
          <Path d="M28 36 C24 31 23 26 26 21" fill="none" stroke={palette.dark} strokeWidth={1.9} strokeLinecap="round" opacity={0.72} />
          <Path d="M35 30 C39 29 43 31 46 35" fill="none" stroke={palette.dark} strokeWidth={1.9} strokeLinecap="round" opacity={0.72} />
          {[
            [27, 22],
            [31, 28],
            [39, 25],
            [43, 36],
          ].map(([cx, cy], index) => (
            <G key={`plum-spray-${index}`} transform={`rotate(${index * 18} ${cx} ${cy})`}>
              <Ellipse cx={cx} cy={cy - 3.2} rx={2.2} ry={3.5} fill={palette.red} opacity={0.78} />
              <Ellipse cx={cx + 3.1} cy={cy} rx={2.2} ry={3.5} fill={palette.red} opacity={0.62} transform={`rotate(72 ${cx + 3.1} ${cy})`} />
              <Ellipse cx={cx - 3.1} cy={cy} rx={2.2} ry={3.5} fill={palette.main} opacity={0.62} transform={`rotate(-72 ${cx - 3.1} ${cy})`} />
              <Circle cx={cx} cy={cy} r={1.5} fill={palette.dark} opacity={0.7} />
            </G>
          ))}
        </G>
      );
    case 'orchidSpray':
      return (
        <G>
          <Path d="M22 45 C27 31 33 22 45 17" fill="none" stroke={palette.dark} strokeWidth={2.8} strokeLinecap="round" />
          <Path d="M32 31 C23 28 19 21 24 17 C30 18 33 24 32 31Z" fill={palette.red} opacity={0.55} />
          <Path d="M34 31 C44 28 48 21 43 17 C37 18 33 24 34 31Z" fill={palette.main} opacity={0.55} />
          <Path d="M33 31 C39 37 39 43 33 48 C28 42 28 36 33 31Z" fill={palette.main} opacity={0.42} />
          <Path d="M24 42 C28 39 31 38 35 38" fill="none" stroke={palette.red} strokeWidth={2} strokeLinecap="round" opacity={0.7} />
        </G>
      );
    case 'chrysanthemum':
      return (
        <G>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
            <Path
              key={`chrysanthemum-${index}`}
              d="M32 19 C36 24 36 31 32 36 C28 31 28 24 32 19Z"
              fill={index % 2 ? palette.red : palette.main}
              opacity={0.45}
              transform={`rotate(${index * 45} 32 32)`}
            />
          ))}
          <Circle cx={32} cy={32} r={4} fill={palette.dark} opacity={0.76} />
          <Circle cx={32} cy={32} r={1.7} fill={palette.soft} />
        </G>
      );
    case 'peony':
      return (
        <G>
          <Path d="M20 36 C21 24 29 20 32 29 C35 20 43 24 44 36 C39 47 25 47 20 36Z" fill={palette.red} opacity={0.38} />
          <Path d="M24 35 C25 25 32 22 32 32 C32 22 39 25 40 35 C37 43 27 43 24 35Z" fill={palette.main} opacity={0.48} />
          <Path d="M23 43 C29 39 36 39 42 43" fill="none" stroke={palette.dark} strokeWidth={2.7} strokeLinecap="round" />
          <Path d="M26 47 C30 44 34 44 38 47" fill="none" stroke={palette.red} strokeWidth={2.2} strokeLinecap="round" opacity={accentOpacity} />
        </G>
      );
    case 'camellia':
      return (
        <G>
          {[0, 1, 2, 3, 4].map((index) => (
            <Path
              key={`camellia-${index}`}
              d="M32 19 C37 25 37 33 32 38 C27 33 27 25 32 19Z"
              fill={index % 2 ? palette.red : palette.main}
              opacity={0.52}
              transform={`rotate(${index * 72} 32 32)`}
            />
          ))}
          <Path d="M22 45 C28 40 35 39 43 42" fill="none" stroke={palette.dark} strokeWidth={2.6} strokeLinecap="round" />
          <Ellipse cx={38} cy={43} rx={4.2} ry={7} fill={palette.main} opacity={0.34} transform="rotate(63 38 43)" />
          <Circle cx={32} cy={32} r={3.3} fill={palette.dark} opacity={0.72} />
        </G>
      );
    case 'maple':
      return (
        <G>
          <Path
            d="M32 18 L35 28 L43 24 L39 33 L47 36 L38 39 L40 48 L32 42 L24 48 L26 39 L17 36 L25 33 L21 24 L29 28Z"
            fill={palette.red}
            opacity={0.58}
            stroke={palette.dark}
            strokeWidth={2}
            strokeLinejoin="round"
          />
          <Line x1={32} y1={42} x2={32} y2={50} stroke={palette.dark} strokeWidth={2.2} strokeLinecap="round" />
        </G>
      );
    case 'willow':
      return (
        <G>
          <Path d="M23 17 C34 24 39 34 41 48" fill="none" stroke={palette.dark} strokeWidth={2.8} strokeLinecap="round" />
          {[25, 30, 35, 39].map((y, index) => (
            <G key={`willow-${index}`}>
              <Path d={`M${27 + index * 2} ${y} C23 ${y + 5} 22 ${y + 8} 25 ${y + 11}`} fill="none" stroke={index % 2 ? palette.red : palette.main} strokeWidth={2.2} strokeLinecap="round" opacity={0.72} />
              <Path d={`M${32 + index * 2} ${y + 1} C37 ${y + 5} 38 ${y + 8} 35 ${y + 11}`} fill="none" stroke={index % 2 ? palette.main : palette.red} strokeWidth={2.2} strokeLinecap="round" opacity={0.62} />
            </G>
          ))}
        </G>
      );
    case 'pine':
      return (
        <G>
          <Path d="M33 18 C30 28 30 38 34 48" fill="none" stroke={palette.dark} strokeWidth={2.8} strokeLinecap="round" />
          <Path d="M18 27 C25 23 32 23 39 27" fill="none" stroke={palette.main} strokeWidth={2.8} strokeLinecap="round" opacity={0.72} />
          <Path d="M20 34 C28 30 36 30 44 34" fill="none" stroke={palette.dark} strokeWidth={2.8} strokeLinecap="round" />
          <Path d="M23 42 C30 38 37 38 44 42" fill="none" stroke={palette.red} strokeWidth={2.4} strokeLinecap="round" opacity={0.74} />
          <Line x1={22} y1={28} x2={31} y2={35} stroke={palette.main} strokeWidth={1.7} strokeLinecap="round" opacity={0.58} />
          <Line x1={41} y1={34} x2={33} y2={41} stroke={palette.main} strokeWidth={1.7} strokeLinecap="round" opacity={0.58} />
        </G>
      );
    case 'snowflower':
      return (
        <G>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <Ellipse
              key={`snowflower-${index}`}
              cx={32}
              cy={22}
              rx={2.5}
              ry={8.8}
              fill={index % 2 ? palette.red : palette.main}
              opacity={0.45}
              transform={`rotate(${index * 60} 32 32)`}
            />
          ))}
          <Path d="M24 43 C29 39 35 39 40 43" fill="none" stroke={palette.dark} strokeWidth={2.4} strokeLinecap="round" />
          <Circle cx={32} cy={32} r={3.2} fill={palette.dark} opacity={0.72} />
        </G>
      );
    case 'springSprig':
      return (
        <G>
          <Path d="M21 46 C26 35 32 25 43 18" fill="none" stroke={palette.dark} strokeWidth={2.7} strokeLinecap="round" />
          <Ellipse cx={29} cy={34} rx={4.2} ry={8.5} fill={palette.main} opacity={0.5} transform="rotate(-44 29 34)" />
          <Ellipse cx={36} cy={27} rx={4.2} ry={8.5} fill={palette.red} opacity={0.48} transform="rotate(48 36 27)" />
          <Path d="M42 18 C43 24 41 28 36 31" fill="none" stroke={palette.main} strokeWidth={2.2} strokeLinecap="round" opacity={0.68} />
          <Circle cx={43} cy={18} r={2.4} fill={palette.red} opacity={0.84} />
        </G>
      );
    case 'autumnLeaf':
      return (
        <G>
          <Path
            d="M21 39 C25 24 38 18 46 25 C42 38 32 45 21 39Z"
            fill={palette.main}
            opacity={0.48}
            stroke={palette.dark}
            strokeWidth={2.2}
            strokeLinejoin="round"
          />
          <Path d="M23 39 C31 34 37 29 45 24" fill="none" stroke={palette.red} strokeWidth={2.3} strokeLinecap="round" opacity={0.82} />
          <Path d="M30 35 C28 30 29 27 34 24 M36 31 C39 31 42 34 43 38" fill="none" stroke={palette.dark} strokeWidth={1.6} strokeLinecap="round" opacity={0.62} />
        </G>
      );
    case 'winterBranch':
      return (
        <G>
          <Path d="M20 44 C29 37 35 27 43 18" fill="none" stroke={palette.dark} strokeWidth={2.9} strokeLinecap="round" />
          <Path d="M29 36 C26 31 26 26 30 22 M35 28 C40 29 43 32 45 37" fill="none" stroke={palette.dark} strokeWidth={1.9} strokeLinecap="round" opacity={0.76} />
          <Ellipse cx={29} cy={22} rx={2.8} ry={4.6} fill={palette.red} opacity={0.72} transform="rotate(36 29 22)" />
          <Ellipse cx={45} cy={37} rx={2.8} ry={4.6} fill={palette.main} opacity={0.58} transform="rotate(-34 45 37)" />
          <Circle cx={35} cy={29} r={1.9} fill={palette.red} opacity={0.8} />
        </G>
      );
    case 'gardenGate':
      return (
        <G>
          <Path d="M21 45 V29 C21 21 27 17 32 17 C37 17 43 21 43 29 V45" fill="none" stroke={palette.dark} strokeWidth={3} strokeLinecap="round" />
          <Path d="M25 45 V31 C25 26 29 23 32 23 C35 23 39 26 39 31 V45" fill="none" stroke={palette.main} strokeWidth={2.3} strokeLinecap="round" opacity={0.72} />
          <Line x1={19} y1={45} x2={45} y2={45} stroke={palette.red} strokeWidth={2.6} strokeLinecap="round" opacity={0.8} />
          <Path d="M25 29 H39" stroke={palette.dark} strokeWidth={1.9} strokeLinecap="round" opacity={0.62} />
        </G>
      );
    case 'mountainPavilion':
      return (
        <G>
          <Path d="M18 40 L26 30 L32 36 L39 24 L47 40" fill="none" stroke={palette.main} strokeWidth={2.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.66} />
          <Path d="M23 31 H42 L36 25 H29Z" fill={palette.red} opacity={0.56} stroke={palette.dark} strokeWidth={2} strokeLinejoin="round" />
          <Line x1={28} y1={31} x2={28} y2={43} stroke={palette.dark} strokeWidth={2.1} strokeLinecap="round" />
          <Line x1={37} y1={31} x2={37} y2={43} stroke={palette.dark} strokeWidth={2.1} strokeLinecap="round" />
          <Line x1={23} y1={43} x2={42} y2={43} stroke={palette.dark} strokeWidth={2.4} strokeLinecap="round" />
        </G>
      );
    case 'foldingFan':
      return (
        <G>
          <Path d="M19 44 C22 24 42 24 45 44Z" fill={palette.main} opacity={0.33} stroke={palette.dark} strokeWidth={2.4} />
          {[23, 27, 32, 37, 41].map((x) => (
            <Line key={`folding-fan-${x}`} x1={32} y1={44} x2={x} y2={25} stroke={palette.red} strokeWidth={1.8} opacity={0.68} />
          ))}
          <Line x1={20} y1={44} x2={44} y2={44} stroke={palette.dark} strokeWidth={2.8} strokeLinecap="round" />
        </G>
      );
    case 'paintedScroll':
      return (
        <G>
          <Rect x={24} y={18} width={16} height={27} rx={3} fill="#fff8df" stroke={palette.dark} strokeWidth={2.4} />
          <Line x1={22} y1={18} x2={42} y2={18} stroke={palette.main} strokeWidth={2.6} strokeLinecap="round" />
          <Line x1={22} y1={45} x2={42} y2={45} stroke={palette.main} strokeWidth={2.6} strokeLinecap="round" />
          <Path d="M29 26 C34 23 36 30 31 32 C27 34 28 40 36 38" fill="none" stroke={palette.dark} strokeWidth={2.2} strokeLinecap="round" />
          <Rect x={33} y={36} width={4.8} height={4.8} rx={1} fill={palette.red} opacity={0.82} />
        </G>
      );
    case 'bronzeMirror':
      return (
        <G>
          <Path d="M24 20 H40 L45 27 V38 L40 45 H24 L19 38 V27Z" fill="none" stroke={palette.dark} strokeWidth={2.6} strokeLinejoin="round" />
          <Path d="M27 26 H37 L40 30 V36 L37 40 H27 L24 36 V30Z" fill={palette.main} opacity={0.28} stroke={palette.red} strokeWidth={1.9} strokeLinejoin="round" />
          <Line x1={32} y1={45} x2={32} y2={50} stroke={palette.dark} strokeWidth={2.3} strokeLinecap="round" />
          <Line x1={28} y1={50} x2={36} y2={50} stroke={palette.red} strokeWidth={2.2} strokeLinecap="round" opacity={0.78} />
        </G>
      );
    case 'vermilionSeal':
      return (
        <G>
          <Rect x={21} y={21} width={22} height={22} rx={3.5} fill={palette.red} opacity={0.72} stroke={palette.dark} strokeWidth={2.1} />
          <Path d="M27 28 H37 M27 35 H34 M30 27 V38 M37 29 V39" fill="none" stroke="#fff1ce" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M20 47 C26 44 38 44 44 47" fill="none" stroke={palette.dark} strokeWidth={2.3} strokeLinecap="round" opacity={0.72} />
        </G>
      );
    case 'paperCharm':
      return (
        <G>
          <Line x1={32} y1={17} x2={32} y2={23} stroke={palette.dark} strokeWidth={2.2} strokeLinecap="round" />
          <Path d="M24 23 H40 L37 46 H27Z" fill={palette.main} opacity={0.34} stroke={palette.dark} strokeWidth={2.4} strokeLinejoin="round" />
          <Path d="M28 31 H36 M29 37 H35" stroke={palette.red} strokeWidth={2.2} strokeLinecap="round" opacity={0.78} />
          <Path d="M27 46 C30 49 34 49 37 46" fill="none" stroke={palette.red} strokeWidth={2} strokeLinecap="round" opacity={0.72} />
        </G>
      );
    case 'morningAster':
    default:
      return (
        <G>
          {[0, 1, 2, 3, 4, 5, 6].map((index) => (
            <Path
              key={`aster-${index}`}
              d="M32 20 C35 25 35 31 32 36 C29 31 29 25 32 20Z"
              fill={index % 2 ? palette.main : palette.red}
              opacity={0.45}
              transform={`rotate(${index * 51.4 + 8} 32 32)`}
            />
          ))}
          <Path d="M23 44 C29 39 36 39 42 44" fill="none" stroke={palette.dark} strokeWidth={2.6} strokeLinecap="round" />
          <Circle cx={32} cy={32} r={3.5} fill={palette.dark} opacity={0.76} />
          <Circle cx={32} cy={32} r={1.4} fill={palette.soft} />
        </G>
      );
  }
}
