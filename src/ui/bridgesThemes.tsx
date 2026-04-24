import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import {
  BRIDGES_THEME_BY_ID,
  type BridgesThemeDescriptor,
  type BridgesThemeId,
} from '../data/bridgesMetadata';

export type BridgesThemeMode = 'themed' | 'plain';

export function isBridgesThemeMode(value: string | null | undefined): value is BridgesThemeMode {
  return value === 'themed' || value === 'plain';
}

export interface BridgesVisualTheme {
  id: BridgesThemeId;
  name: string;
  icon: string;
  tagline: string;
  bg: string;
  bgDeep: string;
  onBg: string;
  accent: string;
  gridLine: string;
  bridge: {
    color: string;
    accent: string;
    type: 'plank' | 'ice' | 'rope' | 'stone' | 'log' | 'steel';
  };
  island: {
    fill: string;
    stroke: string;
    highlight: string;
    number: string;
  };
  celebrationTitle: string;
}

export interface DailyBridgesTheme extends BridgesThemeDescriptor {
  theme: BridgesVisualTheme;
}

export interface ThemedBoardIsland {
  id: number;
  x: number;
  y: number;
  requiredBridges: number;
  count: number;
  selected: boolean;
  focused: boolean;
  satisfied: boolean;
  over: boolean;
}

export interface ThemedBoardBridge {
  island1: number;
  island2: number;
  count: 1 | 2;
}

interface ThemedBridgesBoardProps {
  theme: BridgesVisualTheme;
  width: number;
  height: number;
  cellSize: number;
  islandRadius: number;
  islands: ThemedBoardIsland[];
  bridges: ThemedBoardBridge[];
  previewBridges: ThemedBoardBridge[];
}

const BRIDGES_THEMES: Record<BridgesThemeId, BridgesVisualTheme> = {
  ocean: {
    id: 'ocean',
    name: 'Deep Harbor',
    icon: '~',
    tagline: 'Wooden piers and weathered planks across the bay',
    bg: '#1e3a52',
    bgDeep: '#0f2338',
    onBg: '#f4ead5',
    accent: '#7aa5c2',
    gridLine: 'rgba(180, 220, 240, 0.08)',
    bridge: { color: '#8a6a42', accent: '#5a4228', type: 'plank' },
    island: { fill: '#d9c9a8', stroke: '#8a7a58', highlight: '#f0e0bc', number: '#112537' },
    celebrationTitle: 'Harbor open.',
  },
  ice: {
    id: 'ice',
    name: 'Hoarfrost',
    icon: '*',
    tagline: 'Frozen shelves and shards of crystal ice',
    bg: '#d8e8f0',
    bgDeep: '#a8c8d8',
    onBg: '#1a3850',
    accent: '#6aa8d0',
    gridLine: 'rgba(40, 80, 120, 0.08)',
    bridge: { color: '#b8d8ea', accent: '#6a90b0', type: 'ice' },
    island: { fill: '#eaf4fa', stroke: '#6a8aa8', highlight: '#ffffff', number: '#2a4868' },
    celebrationTitle: 'Crystal bloom.',
  },
  desert: {
    id: 'desert',
    name: 'Desert Trails',
    icon: '^',
    tagline: 'Sun-bleached dunes and rope bridges between mesas',
    bg: '#e8d4a8',
    bgDeep: '#d4b878',
    onBg: '#3a1f0a',
    accent: '#c97a2a',
    gridLine: 'rgba(90, 60, 20, 0.08)',
    bridge: { color: '#8a5a2e', accent: '#5a3818', type: 'rope' },
    island: { fill: '#8a5a2e', stroke: '#5a3818', highlight: '#b88a4a', number: '#f4ead5' },
    celebrationTitle: 'Sun bloom.',
  },
  volcano: {
    id: 'volcano',
    name: 'Ember Isles',
    icon: 'A',
    tagline: 'Obsidian stepping stones over lava channels',
    bg: '#1a0e0a',
    bgDeep: '#0a0604',
    onBg: '#f8d078',
    accent: '#e85818',
    gridLine: 'rgba(220, 80, 40, 0.08)',
    bridge: { color: '#3a2e28', accent: '#1a100a', type: 'stone' },
    island: { fill: '#2a1e18', stroke: '#0a0604', highlight: '#5a4638', number: '#f8d078' },
    celebrationTitle: 'Embers lit.',
  },
  forest: {
    id: 'forest',
    name: 'Mossbrook',
    icon: '#',
    tagline: 'Moss-capped boulders above a quiet pond',
    bg: '#1f3020',
    bgDeep: '#0f1e10',
    onBg: '#e8e8d0',
    accent: '#a8d878',
    gridLine: 'rgba(180, 240, 180, 0.06)',
    bridge: { color: '#5a4028', accent: '#3a2818', type: 'log' },
    island: { fill: '#4a7a3a', stroke: '#2a4a1a', highlight: '#7ab058', number: '#f4f0d8' },
    celebrationTitle: 'Lights rising.',
  },
  chicago: {
    id: 'chicago',
    name: 'Chicago',
    icon: 'M',
    tagline: 'Steel trusses over the river between limestone blocks',
    bg: '#223042',
    bgDeep: '#121a28',
    onBg: '#f1ebe2',
    accent: '#d46a52',
    gridLine: 'rgba(220, 220, 220, 0.07)',
    bridge: { color: '#9c3a34', accent: '#d9c5b2', type: 'steel' },
    island: { fill: '#d7c7b2', stroke: '#5b5148', highlight: '#f3e7d8', number: '#233142' },
    celebrationTitle: 'River linked.',
  },
};

export function getBridgesVisualTheme(themeId: BridgesThemeId): BridgesVisualTheme {
  return BRIDGES_THEMES[themeId];
}

export function getBridgesDailyTheme(themeId: BridgesThemeId): DailyBridgesTheme {
  const descriptor = BRIDGES_THEME_BY_ID[themeId];
  return {
    ...descriptor,
    theme: BRIDGES_THEMES[themeId],
  };
}

function bridgeStrokeWidth(
  theme: BridgesVisualTheme,
  count: 1 | 2,
  preview: boolean,
  cellSize: number
): number {
  const base = Math.max(3.6, Math.min(7.2, cellSize * 0.16));
  if (preview) return Math.max(3, base * 0.9);
  if (theme.bridge.type === 'rope') return count === 2 ? base * 1.1 : base * 0.92;
  if (theme.bridge.type === 'steel') return count === 2 ? base * 1.35 : base * 1.02;
  return count === 2 ? base * 1.2 : base;
}

function materialDash(
  theme: BridgesVisualTheme,
  preview: boolean,
  cellSize: number
): string | undefined {
  const long = Math.max(8, Math.round(cellSize * 0.34));
  const medium = Math.max(5, Math.round(cellSize * 0.2));
  const short = Math.max(2, Math.round(cellSize * 0.08));
  if (preview) return `${medium} ${long}`;
  if (theme.bridge.type === 'rope') return `${short + 2} ${medium + 1}`;
  if (theme.bridge.type === 'plank' || theme.bridge.type === 'log') return `${long} ${medium}`;
  if (theme.bridge.type === 'steel') return `${long + 2} ${medium} ${short} ${medium}`;
  return undefined;
}

function AmbientBackdrop({
  theme,
  width,
  height,
  islandCount,
}: {
  theme: BridgesVisualTheme;
  width: number;
  height: number;
  islandCount: number;
}) {
  const opacityScale = islandCount >= 15 ? 0.45 : islandCount >= 12 ? 0.65 : 1;
  const accents = [
    { x: width * 0.15, y: height * 0.2, r: 36, opacity: 0.08 },
    { x: width * 0.78, y: height * 0.15, r: 28, opacity: 0.1 },
    { x: width * 0.28, y: height * 0.72, r: 24, opacity: 0.08 },
    { x: width * 0.72, y: height * 0.82, r: 30, opacity: 0.08 },
  ];

  return (
    <G>
      {accents.map((accent, index) => (
        <Circle
          key={`${theme.id}-ambient-${index}`}
          cx={accent.x}
          cy={accent.y}
          r={accent.r}
          fill={theme.accent}
          opacity={accent.opacity * opacityScale}
        />
      ))}
    </G>
  );
}

function ThemeBridge({
  theme,
  x1,
  y1,
  x2,
  y2,
  count,
  cellSize,
  preview = false,
}: {
  theme: BridgesVisualTheme;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  count: 1 | 2;
  cellSize: number;
  preview?: boolean;
}) {
  const horizontal = y1 === y2;
  const offsetSize = Math.max(4, Math.min(7, cellSize * 0.18));
  const primaryOffset = count === 2 ? -offsetSize : 0;
  const secondaryOffset = count === 2 ? offsetSize : 0;
  const offsets = count === 2 ? [primaryOffset, secondaryOffset] : [0];
  const dash = materialDash(theme, preview, cellSize);

  return (
    <G opacity={preview ? 0.52 : 1}>
      {offsets.map((offset, index) => {
        const dx = horizontal ? 0 : offset;
        const dy = horizontal ? offset : 0;
        return (
          <Line
            key={`${theme.id}-bridge-${x1}-${y1}-${x2}-${y2}-${index}`}
            x1={x1 + dx}
            y1={y1 + dy}
            x2={x2 + dx}
            y2={y2 + dy}
            stroke={preview ? theme.accent : theme.bridge.color}
            strokeWidth={bridgeStrokeWidth(theme, count, preview, cellSize)}
            strokeLinecap="round"
            strokeDasharray={dash}
          />
        );
      })}
      {!preview && (
        <Line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={theme.bridge.accent}
          strokeWidth={1.5}
          opacity={0.32}
          strokeLinecap="round"
        />
      )}
    </G>
  );
}

function ThemeIsland({
  theme,
  island,
  radius,
}: {
  theme: BridgesVisualTheme;
  island: ThemedBoardIsland;
  radius: number;
}) {
  const ringColor = island.over
    ? '#d65454'
    : island.satisfied
      ? '#7ed38a'
      : island.selected
        ? theme.accent
        : island.focused
          ? `${theme.onBg}AA`
          : theme.island.stroke;

  return (
    <G>
      <Circle cx={island.x} cy={island.y} r={radius + 1.5} fill={`${theme.bgDeep}55`} />
      <Circle cx={island.x} cy={island.y} r={radius} fill={theme.island.fill} stroke={ringColor} strokeWidth={2.5} />
      <Circle cx={island.x - radius * 0.28} cy={island.y - radius * 0.28} r={radius * 0.32} fill={theme.island.highlight} opacity={0.35} />
      <SvgText
        x={island.x}
        y={island.y + radius * 0.34}
        textAnchor="middle"
        fontSize={radius * 0.92}
        fontWeight="800"
        fill={theme.island.number}
      >
        {island.requiredBridges}
      </SvgText>
    </G>
  );
}

export function ThemedBridgesBoard({
  theme,
  width,
  height,
  cellSize,
  islandRadius,
  islands,
  bridges,
  previewBridges,
}: ThemedBridgesBoardProps) {
  const islandPositions = new Map(islands.map((island) => [island.id, island]));

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Defs>
        <LinearGradient id={`${theme.id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor={theme.bg} />
          <Stop offset="100%" stopColor={theme.bgDeep} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} rx={16} fill={`url(#${theme.id}-bg)`} />
      <AmbientBackdrop
        theme={theme}
        width={width}
        height={height}
        islandCount={islands.length}
      />
      <Rect
        x={cellSize * 0.2}
        y={cellSize * 0.2}
        width={width - cellSize * 0.4}
        height={height - cellSize * 0.4}
        rx={14}
        fill="none"
        stroke={theme.gridLine}
        strokeWidth={1}
      />

      {previewBridges.map((bridge) => {
        const start = islandPositions.get(bridge.island1);
        const end = islandPositions.get(bridge.island2);
        if (!start || !end) return null;
        return (
          <ThemeBridge
            key={`preview-${bridge.island1}-${bridge.island2}`}
            theme={theme}
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            count={1}
            cellSize={cellSize}
            preview
          />
        );
      })}

      {bridges.map((bridge) => {
        const start = islandPositions.get(bridge.island1);
        const end = islandPositions.get(bridge.island2);
        if (!start || !end) return null;
        return (
          <ThemeBridge
            key={`bridge-${bridge.island1}-${bridge.island2}`}
            theme={theme}
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            count={bridge.count}
            cellSize={cellSize}
          />
        );
      })}

      {islands.map((island) => (
        <ThemeIsland key={island.id} theme={theme} island={island} radius={islandRadius} />
      ))}
    </Svg>
  );
}

export function ThemedBridgeCelebration({ theme }: { theme: BridgesVisualTheme }) {
  return (
    <Svg width={220} height={92} viewBox="0 0 220 92">
      <Defs>
        <LinearGradient id={`${theme.id}-celebrate`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor={theme.accent} stopOpacity="0.9" />
          <Stop offset="100%" stopColor={theme.onBg} stopOpacity="0.25" />
        </LinearGradient>
      </Defs>
      <Rect x={8} y={18} width={204} height={56} rx={18} fill={`${theme.bg}22`} stroke={`${theme.accent}66`} />
      <Path
        d="M24 60 C48 24, 82 24, 108 60 S168 96, 196 36"
        fill="none"
        stroke={`url(#${theme.id}-celebrate)`}
        strokeWidth={8}
        strokeLinecap="round"
      />
      <Circle cx={34} cy={30} r={8} fill={theme.accent} opacity={0.85} />
      <Circle cx={110} cy={22} r={6} fill={theme.onBg} opacity={0.55} />
      <Circle cx={184} cy={58} r={9} fill={theme.accent} opacity={0.65} />
    </Svg>
  );
}
