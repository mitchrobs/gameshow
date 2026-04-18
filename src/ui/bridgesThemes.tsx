import type { ReactNode } from 'react';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  Polygon,
  Polyline,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

export type BridgesThemeId = 'ocean' | 'ice' | 'desert' | 'volcano' | 'forest' | 'chicago';
export type BridgesThemeMode = 'themed' | 'plain';

type BridgeMaterial = 'rope' | 'plank' | 'log' | 'ice' | 'stone' | 'steel';
type AmbientMaterial = 'ripple' | 'snow' | 'sand' | 'ember' | 'firefly' | 'skyline';

export interface BridgesVisualTheme {
  id: BridgesThemeId;
  name: string;
  icon: string;
  tagline: string;
  bg: string;
  bgDeep: string;
  waterRipple: string;
  gridLine: string;
  onBg: string;
  accent: string;
  completionText: string;
  danger: string;
  island: {
    fill: string;
    stroke: string;
    highlight: string;
    shadow: string;
    number: string;
  };
  bridge: {
    type: BridgeMaterial;
    color: string;
    accent: string;
    post: string;
  };
  ambient: {
    type: AmbientMaterial;
    color: string;
  };
  celebrationTitle: string;
}

export interface DailyBridgesTheme {
  emoji: string;
  label: string;
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

interface ThemeBridgeProps {
  theme: BridgesVisualTheme;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  count: 1 | 2;
  margin: number;
  preview?: boolean;
}

interface ThemeIslandProps {
  theme: BridgesVisualTheme;
  island: ThemedBoardIsland;
  radius: number;
}

export const BRIDGES_THEMES: Record<BridgesThemeId, BridgesVisualTheme> = {
  ocean: {
    id: 'ocean',
    name: 'Deep Harbor',
    icon: '~',
    tagline: 'Wooden piers and weathered planks across the bay',
    bg: '#1e3a52',
    bgDeep: '#0f2338',
    waterRipple: '#3a6a8a',
    gridLine: 'rgba(180, 220, 240, 0.06)',
    onBg: '#f4ead5',
    accent: '#7aa5c2',
    completionText: '#0f2338',
    danger: '#f05c5c',
    island: {
      fill: '#d9c9a8',
      stroke: '#8a7a58',
      highlight: '#f0e0bc',
      shadow: '#3a2f1a',
      number: '#ffffff',
    },
    bridge: {
      type: 'plank',
      color: '#8a6a42',
      accent: '#5a4228',
      post: '#3a2818',
    },
    ambient: { type: 'ripple', color: '#7aa5c2' },
    celebrationTitle: 'Harbor open.',
  },
  ice: {
    id: 'ice',
    name: 'Hoarfrost',
    icon: '*',
    tagline: 'Frozen shelves and shards of crystal ice',
    bg: '#d8e8f0',
    bgDeep: '#a8c8d8',
    waterRipple: '#a8c2d8',
    gridLine: 'rgba(40, 80, 120, 0.08)',
    onBg: '#1a3850',
    accent: '#6aa8d0',
    completionText: '#1a3850',
    danger: '#c84747',
    island: {
      fill: '#eaf4fa',
      stroke: '#6a8aa8',
      highlight: '#ffffff',
      shadow: '#4a6a88',
      number: '#2a4868',
    },
    bridge: {
      type: 'ice',
      color: '#b8d8ea',
      accent: '#6a90b0',
      post: '#3a5878',
    },
    ambient: { type: 'snow', color: '#ffffff' },
    celebrationTitle: 'Crystal bloom.',
  },
  desert: {
    id: 'desert',
    name: 'Desert Trails',
    icon: '^',
    tagline: 'Sun-bleached dunes, rope bridges strung between mesas',
    bg: '#e8d4a8',
    bgDeep: '#d4b878',
    waterRipple: '#d4b878',
    gridLine: 'rgba(90, 60, 20, 0.08)',
    onBg: '#3a1f0a',
    accent: '#c97a2a',
    completionText: '#3a1f0a',
    danger: '#c84747',
    island: {
      fill: '#8a5a2e',
      stroke: '#5a3818',
      highlight: '#b88a4a',
      shadow: '#3a1f0a',
      number: '#f4ead5',
    },
    bridge: {
      type: 'rope',
      color: '#8a5a2e',
      accent: '#5a3818',
      post: '#3a1f0a',
    },
    ambient: { type: 'sand', color: '#f4e8c8' },
    celebrationTitle: 'Sun bloom.',
  },
  volcano: {
    id: 'volcano',
    name: 'Ember Isles',
    icon: 'A',
    tagline: 'Obsidian stepping stones across rivers of lava',
    bg: '#1a0e0a',
    bgDeep: '#0a0604',
    waterRipple: '#c84a18',
    gridLine: 'rgba(220, 80, 40, 0.08)',
    onBg: '#f8d078',
    accent: '#e85818',
    completionText: '#0a0604',
    danger: '#ff6b6b',
    island: {
      fill: '#2a1e18',
      stroke: '#0a0604',
      highlight: '#5a4638',
      shadow: '#000000',
      number: '#f8d078',
    },
    bridge: {
      type: 'stone',
      color: '#3a2e28',
      accent: '#1a100a',
      post: '#080402',
    },
    ambient: { type: 'ember', color: '#f88848' },
    celebrationTitle: 'Embers lit.',
  },
  forest: {
    id: 'forest',
    name: 'Mossbrook',
    icon: '#',
    tagline: 'Moss-capped boulders in a quiet forest pond',
    bg: '#1f3020',
    bgDeep: '#0f1e10',
    waterRipple: '#3a5a38',
    gridLine: 'rgba(180, 240, 180, 0.05)',
    onBg: '#e8e8d0',
    accent: '#a8d878',
    completionText: '#0f1e10',
    danger: '#f05c5c',
    island: {
      fill: '#4a7a3a',
      stroke: '#2a4a1a',
      highlight: '#7ab058',
      shadow: '#0f1e0a',
      number: '#f4f0d8',
    },
    bridge: {
      type: 'log',
      color: '#5a4028',
      accent: '#3a2818',
      post: '#2a1808',
    },
    ambient: { type: 'firefly', color: '#f8e878' },
    celebrationTitle: 'Lights rising.',
  },
  chicago: {
    id: 'chicago',
    name: 'Chicago',
    icon: 'M',
    tagline: 'Oxblood truss bridges over the river, between limestone blocks',
    bg: '#223042',
    bgDeep: '#121a28',
    waterRipple: '#3a5a78',
    gridLine: 'rgba(200, 220, 240, 0.06)',
    onBg: '#e4ddc8',
    accent: '#c8432e',
    completionText: '#ffffff',
    danger: '#f05c5c',
    island: {
      fill: '#b8b0a0',
      stroke: '#6a6458',
      highlight: '#e4ddc8',
      shadow: '#3a3630',
      number: '#2a2620',
    },
    bridge: {
      type: 'steel',
      color: '#8a2e22',
      accent: '#4a1610',
      post: '#2a0a08',
    },
    ambient: { type: 'skyline', color: '#0a1420' },
    celebrationTitle: 'Skyline salute.',
  },
};

export const DAILY_BRIDGES_THEMES: DailyBridgesTheme[] = [
  { emoji: '🌊', label: BRIDGES_THEMES.ocean.name, theme: BRIDGES_THEMES.ocean },
  { emoji: '❄️', label: BRIDGES_THEMES.ice.name, theme: BRIDGES_THEMES.ice },
  { emoji: '🏜️', label: BRIDGES_THEMES.desert.name, theme: BRIDGES_THEMES.desert },
  { emoji: '🌋', label: BRIDGES_THEMES.volcano.name, theme: BRIDGES_THEMES.volcano },
  { emoji: '🌿', label: BRIDGES_THEMES.forest.name, theme: BRIDGES_THEMES.forest },
  { emoji: '🌉', label: BRIDGES_THEMES.chicago.name, theme: BRIDGES_THEMES.chicago },
];

export function getDailyBridgesTheme(seed: number): DailyBridgesTheme {
  return DAILY_BRIDGES_THEMES[seed % DAILY_BRIDGES_THEMES.length] ?? DAILY_BRIDGES_THEMES[0];
}

export function isBridgesThemeMode(value: string | null | undefined): value is BridgesThemeMode {
  return value === 'themed' || value === 'plain';
}

function fraction(seed: number): number {
  return ((Math.sin(seed * 9301.37) * 43758.5453) % 1 + 1) % 1;
}

function renderAmbient(theme: BridgesVisualTheme, width: number, height: number): ReactNode[] {
  const bits: ReactNode[] = [];

  switch (theme.ambient.type) {
    case 'ripple':
      for (let i = 0; i < 8; i += 1) {
        const x = fraction(i * 3 + 1) * width;
        const y = fraction(i * 3 + 2) * height;
        const r = 14 + fraction(i * 3 + 3) * 22;
        bits.push(
          <G key={`ripple-${i}`} opacity={0.25}>
            <Circle cx={x} cy={y} r={r} fill="none" stroke={theme.ambient.color} strokeWidth={0.8} />
            <Circle cx={x} cy={y} r={r * 0.55} fill="none" stroke={theme.ambient.color} strokeWidth={0.5} />
          </G>
        );
      }
      break;
    case 'sand':
      for (let i = 0; i < 60; i += 1) {
        bits.push(
          <Ellipse
            key={`sand-${i}`}
            cx={fraction(i * 5 + 1) * width}
            cy={fraction(i * 5 + 2) * height}
            rx={10 + fraction(i * 5 + 3) * 40}
            ry={0.6}
            fill={theme.ambient.color}
            opacity={0.25}
          />
        );
      }
      break;
    case 'firefly':
      for (let i = 0; i < 16; i += 1) {
        bits.push(
          <Circle
            key={`firefly-${i}`}
            cx={fraction(i * 7 + 1) * width}
            cy={fraction(i * 7 + 2) * height}
            r={1.2 + fraction(i) * 1.3}
            fill={theme.ambient.color}
            opacity={0.45 + fraction(i + 17) * 0.35}
          />
        );
      }
      break;
    case 'snow':
      for (let i = 0; i < 32; i += 1) {
        bits.push(
          <Circle
            key={`snow-${i}`}
            cx={fraction(i * 11 + 1) * width}
            cy={fraction(i * 11 + 2) * height}
            r={0.8 + fraction(i) * 0.9}
            fill={theme.ambient.color}
            opacity={0.68}
          />
        );
      }
      bits.push(
        <Path
          key="aurora"
          d={`M 0 ${height * 0.18} Q ${width * 0.3} ${height * 0.05} ${width * 0.6} ${
            height * 0.15
          } T ${width} ${height * 0.1}`}
          fill="none"
          stroke="#8ac8d0"
          strokeWidth={20}
          opacity={0.15}
        />
      );
      break;
    case 'ember':
      for (let i = 0; i < 22; i += 1) {
        bits.push(
          <Circle
            key={`ember-${i}`}
            cx={fraction(i * 13 + 1) * width}
            cy={fraction(i * 13 + 2) * height}
            r={1 + fraction(i) * 1.7}
            fill={theme.ambient.color}
            opacity={0.5 + fraction(i + 9) * 0.3}
          />
        );
      }
      bits.push(
        <Path
          key="crack"
          d={`M 0 ${height * 0.7} L ${width * 0.3} ${height * 0.65} L ${width * 0.5} ${
            height * 0.75
          } L ${width * 0.8} ${height * 0.68} L ${width} ${height * 0.78}`}
          fill="none"
          stroke="#e85818"
          strokeWidth={1}
          opacity={0.35}
        />
      );
      break;
    case 'skyline': {
      let x = 0;
      let i = 0;
      while (x < width) {
        const buildingWidth = 18 + fraction(i * 2 + 1) * 30;
        const buildingHeight = 30 + fraction(i * 2 + 2) * 70;
        bits.push(
          <Rect
            key={`building-${i}`}
            x={x}
            y={height * 0.14 - buildingHeight}
            width={buildingWidth - 2}
            height={buildingHeight}
            fill={theme.ambient.color}
            opacity={0.9}
          />
        );
        x += buildingWidth;
        i += 1;
      }
      break;
    }
  }

  return bits;
}

function SceneBackdrop({
  theme,
  width,
  height,
  cellSize,
}: {
  theme: BridgesVisualTheme;
  width: number;
  height: number;
  cellSize: number;
}) {
  const gridSize = Math.max(24, cellSize || 48);
  const cols = Math.ceil(width / gridSize);
  const rows = Math.ceil(height / gridSize);
  const gradientId = `bridges-bg-${theme.id}`;

  return (
    <G>
      <Defs>
        <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={theme.bg} />
          <Stop offset="100%" stopColor={theme.bgDeep} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill={`url(#${gradientId})`} />
      {renderAmbient(theme, width, height)}
      <G stroke={theme.gridLine} strokeWidth={1}>
        {Array.from({ length: cols + 1 }).map((_, i) => (
          <Line key={`v-${i}`} x1={i * gridSize} y1={0} x2={i * gridSize} y2={height} />
        ))}
        {Array.from({ length: rows + 1 }).map((_, i) => (
          <Line key={`h-${i}`} x1={0} y1={i * gridSize} x2={width} y2={i * gridSize} />
        ))}
      </G>
    </G>
  );
}

function renderIslandDecor(theme: BridgesVisualTheme, cx: number, cy: number, r: number) {
  switch (theme.id) {
    case 'desert':
      return (
        <G>
          <Ellipse cx={cx} cy={cy + r * 0.5} rx={r * 1.1} ry={r * 0.3} fill={theme.island.shadow} opacity={0.35} />
          <Path
            d={`M ${cx - r} ${cy + 2} Q ${cx - r * 0.6} ${cy - r * 1.1} ${cx} ${cy - r * 1.05} Q ${
              cx + r * 0.6
            } ${cy - r * 1.1} ${cx + r} ${cy + 2} Z`}
            fill={theme.island.fill}
            stroke={theme.island.stroke}
            strokeWidth={1.5}
          />
          <Path
            d={`M ${cx - r * 0.7} ${cy - 4} Q ${cx - r * 0.3} ${cy - r * 0.9} ${cx + r * 0.1} ${
              cy - r * 0.7
            }`}
            fill="none"
            stroke={theme.island.highlight}
            strokeWidth={1}
            opacity={0.6}
          />
        </G>
      );
    case 'ocean':
      return (
        <G>
          <Ellipse cx={cx} cy={cy + r * 0.6} rx={r * 1.15} ry={r * 0.28} fill="#000000" opacity={0.35} />
          <Ellipse cx={cx} cy={cy} rx={r * 1.05} ry={r * 0.95} fill={theme.island.fill} stroke={theme.island.stroke} strokeWidth={1.5} />
          <Ellipse cx={cx - r * 0.3} cy={cy - r * 0.4} rx={r * 0.6} ry={r * 0.3} fill={theme.island.highlight} opacity={0.55} />
        </G>
      );
    case 'forest':
      return (
        <G>
          <Ellipse cx={cx} cy={cy + r * 0.55} rx={r * 1.1} ry={r * 0.25} fill="#000000" opacity={0.4} />
          <Path
            d={`M ${cx} ${cy - r} a ${r} ${r} 0 1 0 0.1 0 L ${cx + r * 0.15} ${cy - r * 0.1} L ${
              cx - r * 0.1
            } ${cy + r * 0.1} Z`}
            fill={theme.island.fill}
            stroke={theme.island.stroke}
            strokeWidth={1.5}
          />
          <Path
            d={`M ${cx - r * 0.5} ${cy - r * 0.4} Q ${cx - r * 0.8} ${cy} ${cx - r * 0.6} ${cy + r * 0.5}`}
            fill="none"
            stroke={theme.island.highlight}
            strokeWidth={1.2}
            opacity={0.5}
          />
        </G>
      );
    case 'ice':
      return (
        <G>
          <Ellipse cx={cx} cy={cy + r * 0.6} rx={r * 1.1} ry={r * 0.25} fill="#3a5878" opacity={0.3} />
          <Polygon
            points={`${cx - r},${cy - r * 0.1} ${cx - r * 0.6},${cy - r * 0.9} ${cx + r * 0.2},${cy - r} ${
              cx + r * 0.9
            },${cy - r * 0.3} ${cx + r},${cy + r * 0.5} ${cx + r * 0.3},${cy + r * 0.85} ${
              cx - r * 0.6
            },${cy + r * 0.7} ${cx - r * 0.95},${cy + r * 0.3}`}
            fill={theme.island.fill}
            stroke={theme.island.stroke}
            strokeWidth={1.5}
          />
          <Polyline
            points={`${cx - r * 0.6},${cy - r * 0.4} ${cx - r * 0.1},${cy - r * 0.5} ${cx + r * 0.3},${
              cy - r * 0.1
            }`}
            fill="none"
            stroke={theme.island.highlight}
            strokeWidth={1.2}
            opacity={0.8}
          />
        </G>
      );
    case 'volcano':
      return (
        <G>
          <Ellipse cx={cx} cy={cy + r * 0.6} rx={r * 1.05} ry={r * 0.22} fill="#e85818" opacity={0.35} />
          <Polygon
            points={`${cx - r * 0.9},${cy + r * 0.2} ${cx - r * 0.4},${cy - r * 0.8} ${
              cx + r * 0.3
            },${cy - r * 0.95} ${cx + r * 0.95},${cy - r * 0.1} ${cx + r * 0.8},${cy + r * 0.7} ${
              cx - r * 0.3
            },${cy + r * 0.9} ${cx - r * 0.95},${cy + r * 0.4}`}
            fill={theme.island.fill}
            stroke={theme.island.stroke}
            strokeWidth={1.5}
          />
          <Polygon
            points={`${cx - r * 0.4},${cy - r * 0.8} ${cx + r * 0.3},${cy - r * 0.95} ${cx + r * 0.1},${
              cy - r * 0.2
            } ${cx - r * 0.3},${cy - r * 0.3}`}
            fill={theme.island.highlight}
            opacity={0.35}
          />
        </G>
      );
    case 'chicago':
      return (
        <G>
          <Rect x={cx - r * 0.95} y={cy + r * 0.4} width={r * 1.9} height={r * 0.3} fill="#000000" opacity={0.4} rx={2} />
          <Rect
            x={cx - r * 0.95}
            y={cy - r * 0.95}
            width={r * 1.9}
            height={r * 1.9}
            rx={r * 0.18}
            fill={theme.island.fill}
            stroke={theme.island.stroke}
            strokeWidth={1.5}
          />
          <Line x1={cx - r * 0.95} y1={cy - r * 0.3} x2={cx + r * 0.95} y2={cy - r * 0.3} stroke={theme.island.stroke} strokeWidth={0.6} opacity={0.5} />
          <Line x1={cx - r * 0.95} y1={cy + r * 0.3} x2={cx + r * 0.95} y2={cy + r * 0.3} stroke={theme.island.stroke} strokeWidth={0.6} opacity={0.5} />
          <Line x1={cx} y1={cy - r * 0.95} x2={cx} y2={cy - r * 0.3} stroke={theme.island.stroke} strokeWidth={0.6} opacity={0.5} />
          <Line x1={cx - r * 0.5} y1={cy - r * 0.3} x2={cx - r * 0.5} y2={cy + r * 0.3} stroke={theme.island.stroke} strokeWidth={0.6} opacity={0.5} />
          <Line x1={cx + r * 0.5} y1={cy - r * 0.3} x2={cx + r * 0.5} y2={cy + r * 0.3} stroke={theme.island.stroke} strokeWidth={0.6} opacity={0.5} />
          <Line x1={cx} y1={cy + r * 0.3} x2={cx} y2={cy + r * 0.95} stroke={theme.island.stroke} strokeWidth={0.6} opacity={0.5} />
        </G>
      );
  }
}

function ThemeIsland({ theme, island, radius }: ThemeIslandProps) {
  const { x, y } = island;
  const completed = island.satisfied && !island.over;
  const badgeFill = island.over ? theme.danger : completed ? theme.accent : 'rgba(0,0,0,0.28)';
  const badgeText = island.over ? '#ffffff' : completed ? theme.completionText : theme.island.number;

  return (
    <G>
      {island.selected && (
        <Circle cx={x} cy={y} r={radius + 8} fill="none" stroke={theme.accent} strokeWidth={2.4} opacity={0.85} />
      )}
      {island.focused && !island.selected && (
        <Circle cx={x} cy={y} r={radius + 5} fill="none" stroke={theme.bridge.color} strokeWidth={1.6} strokeDasharray="3 4" opacity={0.75} />
      )}
      {renderIslandDecor(theme, x, y, radius)}
      <Circle cx={x} cy={y} r={radius * 0.56} fill={badgeFill} />
      <SvgText
        x={x}
        y={y + radius * 0.24}
        textAnchor="middle"
        fontSize={radius * 0.72}
        fontWeight="700"
        fill={badgeText}
      >
        {island.requiredBridges}
      </SvgText>
    </G>
  );
}

function ThemeBridge({ theme, x1, y1, x2, y2, count, margin, preview = false }: ThemeBridgeProps) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len <= margin * 2) return null;

  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const px1 = x1 + (dx * margin) / len;
  const py1 = y1 + (dy * margin) / len;
  const bridgeLen = len - margin * 2;
  const offset = 5;

  if (preview) {
    return (
      <G transform={`translate(${px1} ${py1}) rotate(${angle})`} opacity={0.36}>
        <Line
          x1={0}
          y1={0}
          x2={bridgeLen}
          y2={0}
          stroke={theme.accent}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray="5 8"
        />
      </G>
    );
  }

  const renderOne = (laneOffset: number) => {
    switch (theme.bridge.type) {
      case 'rope':
        return (
          <G key={`rope-${laneOffset}`} transform={`translate(0 ${laneOffset})`}>
            <Rect x={0} y={-4} width={3} height={8} fill={theme.bridge.post} />
            <Rect x={bridgeLen - 3} y={-4} width={3} height={8} fill={theme.bridge.post} />
            <Path
              d={`M 2 0 Q ${bridgeLen / 2} 3 ${bridgeLen - 2} 0`}
              fill="none"
              stroke={theme.bridge.color}
              strokeWidth={2.2}
              strokeLinecap="round"
            />
            <Path
              d={`M 2 0 Q ${bridgeLen / 2} 3 ${bridgeLen - 2} 0`}
              fill="none"
              stroke={theme.bridge.accent}
              strokeWidth={0.6}
              strokeLinecap="round"
              strokeDasharray="2 2"
              opacity={0.8}
            />
          </G>
        );
      case 'plank': {
        const planks = Math.max(3, Math.floor(bridgeLen / 10));
        return (
          <G key={`plank-${laneOffset}`} transform={`translate(0 ${laneOffset})`}>
            <Line x1={0} y1={0} x2={bridgeLen} y2={0} stroke={theme.bridge.accent} strokeWidth={8} strokeLinecap="round" />
            {Array.from({ length: planks }).map((_, i) => {
              const px = (i + 0.5) * (bridgeLen / planks);
              return <Rect key={i} x={px - 3.5} y={-3} width={7} height={6} rx={1} fill={theme.bridge.color} stroke={theme.bridge.accent} strokeWidth={0.4} />;
            })}
          </G>
        );
      }
      case 'log':
        return (
          <G key={`log-${laneOffset}`} transform={`translate(0 ${laneOffset})`}>
            <Rect x={0} y={-4} width={bridgeLen} height={8} rx={3} fill={theme.bridge.color} stroke={theme.bridge.post} strokeWidth={1} />
            <Line x1={0} y1={-1} x2={bridgeLen} y2={-1} stroke={theme.bridge.accent} strokeWidth={0.8} opacity={0.6} />
            <Circle cx={0} cy={0} r={4} fill={theme.bridge.accent} stroke={theme.bridge.post} strokeWidth={1} />
            <Circle cx={bridgeLen} cy={0} r={4} fill={theme.bridge.accent} stroke={theme.bridge.post} strokeWidth={1} />
          </G>
        );
      case 'ice':
        return (
          <G key={`ice-${laneOffset}`} transform={`translate(0 ${laneOffset})`}>
            <Rect x={0} y={-3} width={bridgeLen} height={6} fill={theme.bridge.color} stroke={theme.bridge.accent} strokeWidth={0.8} opacity={0.9} />
            <Polyline
              points={`0,-3 ${bridgeLen * 0.2},-1 ${bridgeLen * 0.5},-3 ${bridgeLen * 0.8},-1 ${bridgeLen},-3`}
              fill="none"
              stroke="#ffffff"
              strokeWidth={0.6}
              opacity={0.8}
            />
            <Polyline
              points={`0,3 ${bridgeLen * 0.3},1 ${bridgeLen * 0.7},3 ${bridgeLen},3`}
              fill="none"
              stroke={theme.bridge.accent}
              strokeWidth={0.5}
              opacity={0.6}
            />
          </G>
        );
      case 'stone': {
        const stones = Math.max(3, Math.floor(bridgeLen / 14));
        return (
          <G key={`stone-${laneOffset}`} transform={`translate(0 ${laneOffset})`}>
            <Line x1={0} y1={0} x2={bridgeLen} y2={0} stroke={theme.bridge.post} strokeWidth={10} opacity={0.7} />
            {Array.from({ length: stones }).map((_, i) => {
              const px = (i + 0.5) * (bridgeLen / stones);
              return (
                <G key={i} transform={`translate(${px} 0)`}>
                  <Rect x={-5} y={-4} width={10} height={8} rx={1.5} fill={theme.bridge.color} stroke={theme.bridge.accent} strokeWidth={0.8} />
                  <Line x1={-3} y1={-2} x2={3} y2={-2} stroke={theme.bridge.accent} strokeWidth={0.5} opacity={0.6} />
                </G>
              );
            })}
          </G>
        );
      }
      case 'steel': {
        const panelCount = Math.max(4, Math.floor(bridgeLen / 12));
        const members: ReactNode[] = [];
        for (let i = 1; i < panelCount; i += 1) {
          const px = (i * bridgeLen) / panelCount;
          members.push(<Line key={`v-${i}`} x1={px} y1={-5} x2={px} y2={3} stroke={theme.bridge.color} strokeWidth={1.2} />);
        }
        for (let i = 0; i < panelCount - 1; i += 1) {
          const p0 = (i * bridgeLen) / panelCount;
          const p1 = ((i + 1) * bridgeLen) / panelCount;
          members.push(<Line key={`a-${i}`} x1={p0} y1={2} x2={p1} y2={-5} stroke={theme.bridge.color} strokeWidth={0.9} opacity={0.9} />);
          members.push(<Line key={`b-${i}`} x1={p0} y1={-5} x2={p1} y2={2} stroke={theme.bridge.color} strokeWidth={0.9} opacity={0.9} />);
        }
        return (
          <G key={`steel-${laneOffset}`} transform={`translate(0 ${laneOffset})`}>
            <Rect x={0} y={2} width={bridgeLen} height={2.5} fill={theme.bridge.color} />
            <Rect x={4} y={-6} width={Math.max(0, bridgeLen - 8)} height={2} fill={theme.bridge.color} opacity={0.9} />
            {members}
          </G>
        );
      }
    }
  };

  return (
    <G transform={`translate(${px1} ${py1}) rotate(${angle})`}>
      {count === 1 ? renderOne(0) : [renderOne(-offset), renderOne(offset)]}
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
  const islandsById = new Map(islands.map((island) => [island.id, island]));
  const margin = islandRadius * 0.92;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <SceneBackdrop theme={theme} width={width} height={height} cellSize={cellSize} />
      {previewBridges.map((bridge) => {
        const start = islandsById.get(bridge.island1);
        const end = islandsById.get(bridge.island2);
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
            margin={margin}
            preview
          />
        );
      })}
      {bridges.map((bridge) => {
        const start = islandsById.get(bridge.island1);
        const end = islandsById.get(bridge.island2);
        if (!start || !end) return null;
        return (
          <ThemeBridge
            key={`${bridge.island1}-${bridge.island2}`}
            theme={theme}
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            count={bridge.count}
            margin={margin}
          />
        );
      })}
      {islands.map((island) => (
        <ThemeIsland key={island.id} theme={theme} island={island} radius={islandRadius} />
      ))}
    </Svg>
  );
}

export function ThemedBridgeCelebration({
  theme,
  width = 220,
  height = 92,
}: {
  theme: BridgesVisualTheme;
  width?: number;
  height?: number;
}) {
  const centerX = width / 2;
  const centerY = height / 2;

  const burst = Array.from({ length: 18 }).map((_, i) => {
    const angle = (i / 18) * Math.PI * 2;
    const distance = 28 + fraction(i + theme.id.length) * 28;
    return (
      <Circle
        key={`burst-${i}`}
        cx={centerX + Math.cos(angle) * distance}
        cy={centerY + Math.sin(angle) * distance * 0.62}
        r={1.8 + fraction(i + 7) * 1.8}
        fill={i % 2 === 0 ? theme.accent : theme.ambient.color}
        opacity={0.72}
      />
    );
  });

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Defs>
        <LinearGradient id={`celebration-${theme.id}`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor={theme.bg} />
          <Stop offset="100%" stopColor={theme.bgDeep} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} rx={8} fill={`url(#celebration-${theme.id})`} />
      {theme.id === 'ocean' && (
        <G opacity={0.75}>
          {[18, 34, 52].map((r) => (
            <Circle key={r} cx={centerX} cy={centerY} r={r} fill="none" stroke={theme.waterRipple} strokeWidth={1.4} />
          ))}
        </G>
      )}
      {theme.id === 'ice' && (
        <G opacity={0.78}>
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            return (
              <Line
                key={i}
                x1={centerX}
                y1={centerY}
                x2={centerX + Math.cos(angle) * 72}
                y2={centerY + Math.sin(angle) * 30}
                stroke="#ffffff"
                strokeWidth={1.5}
                strokeLinecap="round"
              />
            );
          })}
        </G>
      )}
      {theme.id === 'volcano' && (
        <Ellipse cx={centerX} cy={height - 18} rx={62} ry={12} fill={theme.accent} opacity={0.45} />
      )}
      {theme.id === 'chicago' && (
        <G opacity={0.72}>
          <Path d={`M ${centerX - 82} ${height} L ${centerX - 36} 8 L ${centerX - 18} 8 L ${centerX - 55} ${height} Z`} fill={theme.accent} opacity={0.35} />
          <Path d={`M ${centerX + 82} ${height} L ${centerX + 36} 8 L ${centerX + 18} 8 L ${centerX + 55} ${height} Z`} fill={theme.accent} opacity={0.35} />
        </G>
      )}
      {theme.id === 'desert' && (
        <G opacity={0.72}>
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            return (
              <Line
                key={i}
                x1={centerX}
                y1={centerY}
                x2={centerX + Math.cos(angle) * 84}
                y2={centerY + Math.sin(angle) * 36}
                stroke="#f4e8c8"
                strokeWidth={1.5}
                strokeLinecap="round"
              />
            );
          })}
        </G>
      )}
      {theme.id === 'forest' && (
        <G opacity={0.78}>
          {Array.from({ length: 22 }).map((_, i) => (
            <Circle
              key={i}
              cx={fraction(i * 5 + 1) * width}
              cy={fraction(i * 5 + 2) * height}
              r={1.5 + fraction(i) * 2}
              fill={theme.ambient.color}
            />
          ))}
        </G>
      )}
      {burst}
      <Circle cx={centerX} cy={centerY} r={18} fill={theme.accent} opacity={0.92} />
      <SvgText x={centerX} y={centerY + 6} textAnchor="middle" fontSize={19} fontWeight="800" fill={theme.completionText}>
        ✓
      </SvgText>
    </Svg>
  );
}
