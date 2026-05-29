import Svg, { Circle, ClipPath, Defs, G, Path, Rect, Text as SvgText } from 'react-native-svg';
import type { PostmarkStampArtBox, PostmarkStampSpec } from '../data/postmarkStamps';

const POSTMARK_BLUE = '#1547D6';
const STAMP_PAPER = '#fffdf8';
const STAMP_BORDER = 'rgba(94, 107, 129, 0.24)';
const STAMP_ACTIVE_BORDER = 'rgba(21, 71, 214, 0.72)';
const STAMP_SHADOW = 'rgba(21, 71, 214, 0.1)';

interface PostmarkStampGlyphProps {
  spec: PostmarkStampSpec;
  number: number | string;
  fill: string;
  active?: boolean;
  shadow?: boolean;
}

interface PostmarkStampSvgProps extends PostmarkStampGlyphProps {
  size: number;
}

interface PostmarkStampOnBoardProps extends PostmarkStampGlyphProps {
  x: number;
  y: number;
  size: number;
}

function parseHexColor(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) return null;
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function mixHexColor(hex: string, target: string, amount: number): string {
  const source = parseHexColor(hex);
  const destination = parseHexColor(target);
  if (!source || !destination) return hex;
  const mix = (from: number, to: number) => Math.round(from + (to - from) * amount);
  return `rgb(${mix(source.r, destination.r)}, ${mix(source.g, destination.g)}, ${mix(
    source.b,
    destination.b
  )})`;
}

function isLandscapeStyle(style: PostmarkStampSpec['artworkStyle']): boolean {
  return (
    style === 'arc-field' ||
    style === 'moon-field' ||
    style === 'sun-field' ||
    style === 'wide-horizon' ||
    style === 'hill-field' ||
    style === 'crop-field' ||
    style === 'ribbon-field' ||
    style === 'ridge-lines' ||
    style === 'terrace-field' ||
    style === 'split-sun' ||
    style === 'split-field'
  );
}

function isTerraceStyle(style: PostmarkStampSpec['artworkStyle']): boolean {
  return (
    style === 'crop-field' ||
    style === 'terrace-field' ||
    style === 'ribbon-field' ||
    style === 'ridge-lines' ||
    style === 'split-field'
  );
}

function isBlockStyle(style: PostmarkStampSpec['artworkStyle']): boolean {
  return (
    style === 'checker-field' ||
    style === 'block-stack' ||
    style === 'window-grid' ||
    style === 'chevron-fold'
  );
}

function posterStripePath(
  x: number,
  y: number,
  w: number,
  h: number,
  topStartRatio: number,
  topWidthRatio: number,
  bottomStartRatio: number,
  bottomWidthRatio: number
): string {
  const topStart = x + w * topStartRatio;
  const topEnd = topStart + w * topWidthRatio;
  const bottomStart = x + w * bottomStartRatio;
  const bottomEnd = bottomStart + w * bottomWidthRatio;
  return `M${topStart} ${y}L${topEnd} ${y}L${bottomEnd} ${y + h}L${bottomStart} ${y + h}Z`;
}

function DrawPosterArtwork({
  x,
  y,
  w,
  h,
  fill,
  style,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  style: PostmarkStampSpec['artworkStyle'];
}) {
  const coral = mixHexColor(fill, '#f04f42', 0.68);
  const warm = mixHexColor(fill, '#f0b646', 0.42);
  const deep = mixHexColor(fill, '#34264f', 0.56);
  const indigo = mixHexColor(fill, '#174fb7', 0.46);
  const wine = mixHexColor(fill, '#6c2848', 0.48);
  const paper = STAMP_PAPER;
  const isOffset = style === 'offset-register' || style === 'ribbon-stack';
  const isFolded = style === 'folded-bars' || style === 'woven-register';
  const isBanded = style === 'banded-slash';
  const stripeA = isOffset
    ? posterStripePath(x, y, w, h, -0.02, 0.13, 0.44, 0.13)
    : posterStripePath(x, y, w, h, 0.12, 0.14, -0.08, 0.14);
  const stripeB = isOffset
    ? posterStripePath(x, y, w, h, 0.33, 0.12, -0.02, 0.12)
    : posterStripePath(x, y, w, h, 0.39, 0.13, 0.1, 0.13);
  const stripeC = isOffset
    ? posterStripePath(x, y, w, h, 0.66, 0.13, 0.24, 0.13)
    : posterStripePath(x, y, w, h, 0.7, 0.14, 0.34, 0.14);
  const stripeD = posterStripePath(x, y, w, h, 0.18, 0.16, 0.72, 0.16);
  const stripeE = posterStripePath(x, y, w, h, 0.52, 0.15, 0.83, 0.15);

  return (
    <G>
      <Rect x={x} y={y} width={w} height={h} fill={isBanded ? warm : coral} />
      <Rect x={x} y={y} width={w} height={h * 0.18} fill={mixHexColor(coral, paper, 0.18)} />
      <Path d={stripeA} fill={paper} />
      <Path d={stripeB} fill={isFolded ? deep : indigo} />
      <Path d={stripeC} fill={paper} />
      <Path d={stripeD} fill={isFolded ? indigo : wine} opacity={0.95} />
      <Path d={stripeE} fill={isBanded ? deep : indigo} opacity={0.92} />
      <Rect
        x={x + w * 0.08}
        y={y + h * 0.48}
        width={w * 0.82}
        height={h * 0.1}
        fill={mixHexColor(coral, paper, 0.12)}
        opacity={isBanded ? 0.9 : 0.72}
      />
      <Rect
        x={x + w * 0.2}
        y={y + h * 0.72}
        width={w * 0.48}
        height={h * 0.08}
        fill={mixHexColor(coral, '#f6d05d', 0.42)}
        opacity={isOffset ? 0.86 : 0.62}
      />
      <Path
        d={posterStripePath(x, y, w, h, 0.02, 0.08, 0.56, 0.08)}
        fill={mixHexColor(fill, paper, 0.18)}
        opacity={style === 'angle-stack' ? 0.94 : 0.58}
      />
    </G>
  );
}

function DrawBlockArtwork({
  x,
  y,
  w,
  h,
  fill,
  style,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  style: PostmarkStampSpec['artworkStyle'];
}) {
  const paper = STAMP_PAPER;
  const base = mixHexColor(fill, '#ef5b45', 0.54);
  const gold = mixHexColor(fill, '#f0cf4f', 0.55);
  const teal = mixHexColor(fill, '#0a8a72', 0.52);
  const plum = mixHexColor(fill, '#4e3a72', 0.5);
  const blue = mixHexColor(fill, '#1755bf', 0.5);
  const muted = mixHexColor(fill, '#c8d1e8', 0.48);
  const col = w / 4;
  const row = h / 4;

  if (style === 'window-grid') {
    return (
      <G>
        <Rect x={x} y={y} width={w} height={h} fill={plum} />
        <Rect x={x + col * 0.35} y={y + row * 0.45} width={col * 1.25} height={row * 1.25} fill={gold} />
        <Rect x={x + col * 1.9} y={y + row * 0.35} width={col * 1.45} height={row * 1.1} fill={muted} />
        <Rect x={x + col * 0.6} y={y + row * 2.05} width={col * 1.4} height={row * 1.25} fill={teal} />
        <Rect x={x + col * 2.35} y={y + row * 1.8} width={col * 1.05} height={row * 1.45} fill={base} />
        <Path d={posterStripePath(x, y, w, h, 0.0, 0.1, 0.58, 0.1)} fill={paper} opacity={0.82} />
        <Path d={posterStripePath(x, y, w, h, 0.55, 0.11, 0.08, 0.11)} fill={blue} opacity={0.9} />
      </G>
    );
  }

  if (style === 'chevron-fold') {
    return (
      <G>
        <Rect x={x} y={y} width={w} height={h} fill={base} />
        <Path d={`M${x} ${y + h * 0.1}L${x + w * 0.48} ${y + h * 0.5}L${x} ${y + h * 0.9}Z`} fill={gold} />
        <Path d={`M${x + w} ${y + h * 0.1}L${x + w * 0.52} ${y + h * 0.5}L${x + w} ${y + h * 0.9}Z`} fill={teal} />
        <Path d={`M${x + w * 0.15} ${y}L${x + w * 0.5} ${y + h * 0.32}L${x + w * 0.85} ${y}Z`} fill={paper} opacity={0.9} />
        <Path d={`M${x + w * 0.15} ${y + h}L${x + w * 0.5} ${y + h * 0.68}L${x + w * 0.85} ${y + h}Z`} fill={plum} opacity={0.92} />
        <Rect x={x + w * 0.43} y={y} width={w * 0.14} height={h} fill={blue} opacity={0.88} />
      </G>
    );
  }

  return (
    <G>
      <Rect x={x} y={y} width={w} height={h} fill={style === 'block-stack' ? teal : base} />
      <Rect x={x} y={y} width={col * 1.7} height={row * 1.55} fill={paper} opacity={0.9} />
      <Rect x={x + col * 1.7} y={y} width={col * 1.05} height={row * 1.55} fill={blue} />
      <Rect x={x + col * 2.75} y={y} width={col * 1.25} height={row * 1.55} fill={gold} />
      <Rect x={x} y={y + row * 1.55} width={col * 0.95} height={row * 1.25} fill={plum} />
      <Rect x={x + col * 0.95} y={y + row * 1.55} width={col * 1.6} height={row * 1.25} fill={gold} />
      <Rect x={x + col * 2.55} y={y + row * 1.55} width={col * 1.45} height={row * 1.25} fill={paper} opacity={0.86} />
      <Rect x={x} y={y + row * 2.8} width={col * 1.4} height={row * 1.2} fill={blue} />
      <Rect x={x + col * 1.4} y={y + row * 2.8} width={col * 1.3} height={row * 1.2} fill={base} />
      <Rect x={x + col * 2.7} y={y + row * 2.8} width={col * 1.3} height={row * 1.2} fill={plum} />
      <Path d={posterStripePath(x, y, w, h, 0.08, 0.08, 0.68, 0.08)} fill={paper} opacity={0.78} />
    </G>
  );
}

function DrawLandscapeArtwork({
  x,
  y,
  w,
  h,
  fill,
  style,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  style: PostmarkStampSpec['artworkStyle'];
}) {
  const sky = mixHexColor(fill, '#c8d2f2', 0.7);
  const dusk = mixHexColor(fill, '#50456f', 0.56);
  const green = mixHexColor(fill, '#0a835f', 0.58);
  const yellow = mixHexColor(fill, '#d9d94b', 0.64);
  const deepGreen = mixHexColor(fill, '#0a5d54', 0.48);
  const softHill = mixHexColor(fill, '#7d78a8', 0.48);
  const fieldTop =
    y + h * (style === 'wide-horizon' ? 0.62 : style === 'arc-field' ? 0.43 : 0.5);
  const terrace = isTerraceStyle(style);
  const sunX =
    x + w * (style === 'moon-field' ? 0.62 : style === 'split-sun' ? 0.5 : 0.72);
  const sunY = y + h * (style === 'wide-horizon' ? 0.3 : 0.22);

  return (
    <G>
      <Rect x={x} y={y} width={w} height={h} fill={sky} />
      {style === 'split-sun' && (
        <Rect x={x + w * 0.5} y={y} width={w * 0.5} height={fieldTop} fill={mixHexColor(sky, '#f0cf69', 0.28)} />
      )}
      <Path
        d={`M${x} ${fieldTop - h * 0.08}C${x + w * 0.22} ${fieldTop - h * 0.15} ${
          x + w * 0.35
        } ${fieldTop + h * 0.08} ${x + w * 0.52} ${fieldTop + h * 0.04}C${x + w * 0.66} ${
          fieldTop
        } ${x + w * 0.74} ${fieldTop - h * 0.1} ${x + w} ${
          fieldTop - h * 0.05
        }V${fieldTop + h * 0.09}H${x}Z`}
        fill={softHill}
      />
      <Path
        d={`M${x} ${fieldTop}C${x + w * 0.26} ${fieldTop - h * 0.1} ${
          x + w * 0.35
        } ${fieldTop + h * 0.12} ${x + w * 0.54} ${fieldTop + h * 0.05}C${x + w * 0.7} ${
          fieldTop
        } ${x + w * 0.78} ${fieldTop - h * 0.05} ${x + w} ${fieldTop}V${y + h}H${x}Z`}
        fill={dusk}
      />
      <Rect x={x} y={fieldTop + h * 0.08} width={w} height={h * 0.42} fill={green} />
      <Path d={`M${x + w * 0.5} ${fieldTop + h * 0.08}L${x + w} ${fieldTop + h * 0.08}V${
        y + h
      }H${x + w * 0.5}Z`} fill={yellow} opacity={terrace ? 0.9 : 0.72} />
      <Path
        d={`M${x + w * 0.5} ${fieldTop + h * 0.08}C${x + w * 0.36} ${fieldTop + h * 0.2} ${
          x + w * 0.26
        } ${y + h * 0.74} ${x + w * 0.1} ${y + h}H${x + w * 0.2}C${x + w * 0.34} ${
          y + h * 0.78
        } ${x + w * 0.42} ${fieldTop + h * 0.22} ${x + w * 0.54} ${
          fieldTop + h * 0.08
        }Z`}
        fill={terrace ? green : yellow}
      />
      <Path
        d={`M${x + w * 0.5} ${fieldTop + h * 0.08}C${x + w * 0.62} ${fieldTop + h * 0.22} ${
          x + w * 0.74
        } ${y + h * 0.76} ${x + w * 0.91} ${y + h}H${x + w * 0.78}C${x + w * 0.66} ${
          y + h * 0.78
        } ${x + w * 0.58} ${fieldTop + h * 0.25} ${x + w * 0.47} ${
          fieldTop + h * 0.08
        }Z`}
        fill={deepGreen}
        opacity={terrace ? 0.92 : 0.76}
      />
      <Path
        d={`M${x + w * 0.02} ${y + h}C${x + w * 0.18} ${y + h * 0.82} ${
          x + w * 0.31
        } ${fieldTop + h * 0.2} ${x + w * 0.5} ${fieldTop + h * 0.08}`}
        fill="none"
        stroke={yellow}
        strokeWidth={3.2}
        opacity={0.85}
      />
      <Path
        d={`M${x + w * 0.97} ${y + h}C${x + w * 0.82} ${y + h * 0.78} ${
          x + w * 0.68
        } ${fieldTop + h * 0.22} ${x + w * 0.5} ${fieldTop + h * 0.08}`}
        fill="none"
        stroke={green}
        strokeWidth={3.2}
        opacity={0.8}
      />
      {style === 'arc-field' && (
        <G opacity={0.82}>
          <Path
            d={`M${x + w * 0.02} ${y + h * 0.96}C${x + w * 0.2} ${y + h * 0.48} ${
              x + w * 0.78
            } ${y + h * 0.48} ${x + w * 0.98} ${y + h * 0.96}`}
            fill="none"
            stroke={yellow}
            strokeWidth={5.2}
          />
          <Path
            d={`M${x + w * 0.16} ${y + h}C${x + w * 0.3} ${y + h * 0.63} ${
              x + w * 0.7
            } ${y + h * 0.63} ${x + w * 0.84} ${y + h}`}
            fill="none"
            stroke={green}
            strokeWidth={4.2}
          />
        </G>
      )}
      {style === 'ridge-lines' && (
        <G opacity={0.72}>
          <Path d={`M${x} ${y + h * 0.7}H${x + w}`} stroke={STAMP_PAPER} strokeWidth={3} />
          <Path d={`M${x} ${y + h * 0.82}H${x + w}`} stroke={yellow} strokeWidth={3} />
          <Path d={`M${x} ${y + h * 0.58}H${x + w}`} stroke={deepGreen} strokeWidth={3} />
        </G>
      )}
      <Circle
        cx={sunX}
        cy={sunY}
        r={w * (style === 'split-sun' ? 0.13 : 0.085)}
        fill={STAMP_PAPER}
        opacity={style === 'hill-field' ? 0.72 : 0.95}
      />
    </G>
  );
}

function StampArtwork({
  artBox,
  fill,
  style,
}: {
  artBox: PostmarkStampArtBox;
  fill: string;
  style: PostmarkStampSpec['artworkStyle'];
}) {
  const x = artBox.x;
  const y = artBox.y;
  const w = artBox.width;
  const h = artBox.height;

  return (
    <G>
      {isBlockStyle(style) ? (
        <DrawBlockArtwork x={x} y={y} w={w} h={h} fill={fill} style={style} />
      ) : isLandscapeStyle(style) ? (
        <DrawLandscapeArtwork x={x} y={y} w={w} h={h} fill={fill} style={style} />
      ) : (
        <DrawPosterArtwork x={x} y={y} w={w} h={h} fill={fill} style={style} />
      )}
    </G>
  );
}

export function PostmarkStampGlyph({
  spec,
  number,
  fill,
  active = false,
  shadow = true,
}: PostmarkStampGlyphProps) {
  const label = String(number);
  const strokeColor = active ? STAMP_ACTIVE_BORDER : STAMP_BORDER;
  const strokeWidth = active ? 2.5 : 1.2;
  const numberBox = spec.numberBox;
  const digits = Math.max(1, label.length);
  const fontSize = Math.min(numberBox.height * 0.58, numberBox.width / (digits * 0.58));
  const textX = numberBox.x + numberBox.width / 2;
  const textY = numberBox.y + numberBox.height / 2 + fontSize * 0.35;
  const badgeRadius = Math.min(numberBox.width, numberBox.height) / 2;
  const clipId = `postmark-stamp-clip-${spec.id}-${label}`;

  return (
    <G>
      <Defs>
        <ClipPath id={clipId}>
          <Path d={spec.path} />
        </ClipPath>
      </Defs>
      {shadow && (
        <Path
          d={spec.path}
          fill={STAMP_SHADOW}
          opacity={0.8}
          transform="translate(1.5 2.3)"
        />
      )}
      <G clipPath={`url(#${clipId})`}>
        <StampArtwork artBox={spec.artBox} fill={fill} style={spec.artworkStyle} />
      </G>
      <Path d={spec.path} fill="none" stroke={STAMP_PAPER} strokeWidth={3.6} opacity={0.88} />
      <Path d={spec.path} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
      <Circle
        cx={textX}
        cy={numberBox.y + numberBox.height / 2}
        r={badgeRadius}
        fill={POSTMARK_BLUE}
        stroke={STAMP_PAPER}
        strokeWidth={2.8}
      />
      <SvgText
        x={textX}
        y={textY}
        textAnchor="middle"
        fontSize={fontSize}
        fontWeight="900"
        fill={STAMP_PAPER}
      >
        {label}
      </SvgText>
    </G>
  );
}

export function PostmarkStampSvg(props: PostmarkStampSvgProps) {
  return (
    <Svg width={props.size} height={props.size} viewBox={props.spec.viewBox} overflow="visible">
      <PostmarkStampGlyph {...props} />
    </Svg>
  );
}

export function PostmarkStampOnBoard({ x, y, size, ...props }: PostmarkStampOnBoardProps) {
  const scale = size / 100;
  return (
    <G transform={`translate(${x} ${y}) scale(${scale})`}>
      <PostmarkStampGlyph {...props} />
    </G>
  );
}
