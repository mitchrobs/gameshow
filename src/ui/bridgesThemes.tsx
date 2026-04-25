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
    post?: string;
    type: 'plank' | 'ice' | 'rope' | 'stone' | 'log' | 'steel';
  };
  island: {
    fill: string;
    stroke: string;
    highlight: string;
    number: string;
    shadow: string;
  };
  ambient: {
    type: 'ripple' | 'sand' | 'firefly' | 'snow' | 'ember' | 'skyline';
    color: string;
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
    gridLine: 'rgba(180, 220, 240, 0.06)',
    bridge: { color: '#8a6a42', accent: '#5a4228', post: '#3a2818', type: 'plank' },
    island: {
      fill: '#d9c9a8',
      stroke: '#8a7a58',
      highlight: '#f0e0bc',
      number: '#ffffff',
      shadow: '#3a2f1a',
    },
    ambient: { type: 'ripple', color: '#7aa5c2' },
    celebrationTitle: 'Harbor open.',
  },
  ice: {
    id: 'ice',
    name: 'Hoarfrost',
    icon: '❄',
    tagline: 'Frozen shelves and shards of crystal ice',
    bg: '#d8e8f0',
    bgDeep: '#a8c8d8',
    onBg: '#1a3850',
    accent: '#6aa8d0',
    gridLine: 'rgba(40, 80, 120, 0.08)',
    bridge: { color: '#b8d8ea', accent: '#6a90b0', post: '#3a5878', type: 'ice' },
    island: {
      fill: '#eaf4fa',
      stroke: '#6a8aa8',
      highlight: '#ffffff',
      number: '#2a4868',
      shadow: '#4a6a88',
    },
    ambient: { type: 'snow', color: '#ffffff' },
    celebrationTitle: 'Crystal bloom.',
  },
  desert: {
    id: 'desert',
    name: 'Desert Trails',
    icon: '☀',
    tagline: 'Sun-bleached dunes and rope bridges between mesas',
    bg: '#e8d4a8',
    bgDeep: '#d4b878',
    onBg: '#3a1f0a',
    accent: '#c97a2a',
    gridLine: 'rgba(90, 60, 20, 0.08)',
    bridge: { color: '#8a5a2e', accent: '#5a3818', post: '#3a1f0a', type: 'rope' },
    island: {
      fill: '#8a5a2e',
      stroke: '#5a3818',
      highlight: '#b88a4a',
      number: '#f4ead5',
      shadow: '#3a1f0a',
    },
    ambient: { type: 'sand', color: '#f4e8c8' },
    celebrationTitle: 'Sun bloom.',
  },
  volcano: {
    id: 'volcano',
    name: 'Ember Isles',
    icon: '△',
    tagline: 'Obsidian stepping stones over lava channels',
    bg: '#1a0e0a',
    bgDeep: '#0a0604',
    onBg: '#f8d078',
    accent: '#e85818',
    gridLine: 'rgba(220, 80, 40, 0.08)',
    bridge: { color: '#3a2e28', accent: '#1a100a', post: '#080402', type: 'stone' },
    island: {
      fill: '#2a1e18',
      stroke: '#0a0604',
      highlight: '#5a4638',
      number: '#f8d078',
      shadow: '#000000',
    },
    ambient: { type: 'ember', color: '#f88848' },
    celebrationTitle: 'Embers lit.',
  },
  forest: {
    id: 'forest',
    name: 'Mossbrook',
    icon: '♣',
    tagline: 'Lily pads and fallen logs across a forest pond',
    bg: '#1f3020',
    bgDeep: '#0f1e10',
    onBg: '#e8e8d0',
    accent: '#a8d878',
    gridLine: 'rgba(180, 240, 180, 0.05)',
    bridge: { color: '#5a4028', accent: '#3a2818', post: '#2a1808', type: 'log' },
    island: {
      fill: '#4a7a3a',
      stroke: '#2a4a1a',
      highlight: '#7ab058',
      number: '#f4f0d8',
      shadow: '#0f1e0a',
    },
    ambient: { type: 'firefly', color: '#f8e878' },
    celebrationTitle: 'Lights rising.',
  },
  chicago: {
    id: 'chicago',
    name: 'Chicago',
    icon: '▲',
    tagline: 'Oxblood truss bridges over the river, between limestone blocks',
    bg: '#223042',
    bgDeep: '#121a28',
    onBg: '#e4ddc8',
    accent: '#c8432e',
    gridLine: 'rgba(200, 220, 240, 0.06)',
    bridge: { color: '#8a2e22', accent: '#4a1610', post: '#2a0a08', type: 'steel' },
    island: {
      fill: '#b8b0a0',
      stroke: '#6a6458',
      highlight: '#e4ddc8',
      number: '#2a2620',
      shadow: '#3a3630',
    },
    ambient: { type: 'skyline', color: '#0a1420' },
    celebrationTitle: 'Skyline salute.',
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

function seededValue(seed: number): number {
  const value = Math.sin(seed * 9301.37) * 43758.5453;
  return value - Math.floor(value);
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
  const bits: ReactNode[] = [];

  switch (theme.ambient.type) {
    case 'ripple':
      for (let index = 0; index < 8; index += 1) {
        const x = seededValue(index * 3 + 1) * width;
        const y = seededValue(index * 3 + 2) * height;
        const radius = 14 + seededValue(index * 3 + 3) * 22;
        bits.push(
          <G key={`${theme.id}-ripple-${index}`} opacity={0.22 * opacityScale}>
            <Circle cx={x} cy={y} r={radius} fill="none" stroke={theme.ambient.color} strokeWidth={0.8} />
            <Circle cx={x} cy={y} r={radius * 0.55} fill="none" stroke={theme.ambient.color} strokeWidth={0.5} />
          </G>
        );
      }
      break;
    case 'sand':
      for (let index = 0; index < 48; index += 1) {
        const x = seededValue(index * 5 + 1) * width;
        const y = seededValue(index * 5 + 2) * height;
        const radius = 10 + seededValue(index * 5 + 3) * 34;
        bits.push(
          <Ellipse
            key={`${theme.id}-sand-${index}`}
            cx={x}
            cy={y}
            rx={radius}
            ry={0.7}
            fill={theme.ambient.color}
            opacity={0.2 * opacityScale}
          />
        );
      }
      break;
    case 'firefly':
      for (let index = 0; index < 16; index += 1) {
        const x = seededValue(index * 7 + 1) * width;
        const y = seededValue(index * 7 + 2) * height;
        bits.push(
          <Circle
            key={`${theme.id}-firefly-${index}`}
            cx={x}
            cy={y}
            r={1.6}
            fill={theme.ambient.color}
            opacity={0.45 * opacityScale}
          />
        );
      }
      break;
    case 'snow':
      for (let index = 0; index < 34; index += 1) {
        const x = seededValue(index * 11 + 1) * width;
        const y = seededValue(index * 11 + 2) * height;
        bits.push(
          <Circle
            key={`${theme.id}-snow-${index}`}
            cx={x}
            cy={y}
            r={0.8 + seededValue(index) * 0.8}
            fill={theme.ambient.color}
            opacity={0.55 * opacityScale}
          />
        );
      }
      bits.push(
        <Path
          key={`${theme.id}-aurora`}
          d={`M 0 ${height * 0.18} Q ${width * 0.3} ${height * 0.05} ${width * 0.6} ${height * 0.15} T ${width} ${height * 0.1}`}
          fill="none"
          stroke="#8ac8d0"
          strokeWidth={20}
          opacity={0.1 * opacityScale}
          strokeLinecap="round"
        />
      );
      break;
    case 'ember':
      for (let index = 0; index < 18; index += 1) {
        const x = seededValue(index * 13 + 1) * width;
        const y = seededValue(index * 13 + 2) * height;
        bits.push(
          <Circle
            key={`${theme.id}-ember-${index}`}
            cx={x}
            cy={y}
            r={1 + seededValue(index) * 1.5}
            fill={theme.ambient.color}
            opacity={0.52 * opacityScale}
          />
        );
      }
      bits.push(
        <Path
          key={`${theme.id}-crack`}
          d={`M 0 ${height * 0.7} L ${width * 0.3} ${height * 0.65} L ${width * 0.5} ${height * 0.75} L ${width * 0.8} ${height * 0.68} L ${width} ${height * 0.78}`}
          fill="none"
          stroke={theme.accent}
          strokeWidth={1}
          opacity={0.28 * opacityScale}
        />
      );
      break;
    case 'skyline': {
      let x = 0;
      let index = 0;
      while (x < width) {
        const blockWidth = 18 + seededValue(index * 2 + 1) * 30;
        const blockHeight = 30 + seededValue(index * 2 + 2) * 70;
        bits.push(
          <Rect
            key={`${theme.id}-building-${index}`}
            x={x}
            y={height * 0.12 - blockHeight}
            width={blockWidth - 2}
            height={blockHeight}
            fill={theme.ambient.color}
            opacity={0.84 * opacityScale}
          />
        );
        const rows = Math.floor(blockHeight / 12);
        const cols = Math.max(0, Math.floor(blockWidth / 6) - 1);
        for (let row = 1; row < rows; row += 1) {
          for (let col = 1; col < cols; col += 1) {
            if (seededValue(index * 100 + row * 7 + col) > 0.58) {
              bits.push(
                <Rect
                  key={`${theme.id}-window-${index}-${row}-${col}`}
                  x={x + col * 6}
                  y={height * 0.12 - blockHeight + row * 12}
                  width={1.5}
                  height={2.5}
                  fill="#d0a048"
                  opacity={0.58 * opacityScale}
                />
              );
            }
          }
        }
        x += blockWidth;
        index += 1;
      }
      break;
    }
  }

  return <G>{bits}</G>;
}

function ThemeBridge({
  theme,
  x1,
  y1,
  x2,
  y2,
  count,
  cellSize,
  islandRadius,
  preview = false,
}: {
  theme: BridgesVisualTheme;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  count: 1 | 2;
  cellSize: number;
  islandRadius: number;
  preview?: boolean;
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const margin = islandRadius * 0.96;
  const startX = x1 + (dx * margin) / length;
  const startY = y1 + (dy * margin) / length;
  const bridgeLength = Math.max(0, length - margin * 2);
  const offsetSize = Math.max(4, Math.min(7, cellSize * 0.18));
  const offsets = count === 2 ? [-offsetSize, offsetSize] : [0];
  const dash = materialDash(theme, preview, cellSize);

  const renderPreviewLine = (offset: number, index: number) => (
    <Line
      key={`${theme.id}-preview-${index}`}
      x1={0}
      y1={offset}
      x2={bridgeLength}
      y2={offset}
      stroke={theme.accent}
      strokeWidth={bridgeStrokeWidth(theme, count, true, cellSize)}
      strokeLinecap="round"
      strokeDasharray={dash}
      opacity={0.82}
    />
  );

  const renderBridgeSegment = (offset: number, index: number) => {
    if (preview) return renderPreviewLine(offset, index);

    switch (theme.bridge.type) {
      case 'rope':
        return (
          <G key={`${theme.id}-rope-${index}`} transform={`translate(0 ${offset})`}>
            <Rect x={0} y={-4} width={3} height={8} fill={theme.bridge.post ?? theme.bridge.accent} rx={1} />
            <Rect x={bridgeLength - 3} y={-4} width={3} height={8} fill={theme.bridge.post ?? theme.bridge.accent} rx={1} />
            <Path
              d={`M 2 0 Q ${bridgeLength / 2} 3 ${bridgeLength - 2} 0`}
              fill="none"
              stroke={theme.bridge.color}
              strokeWidth={2.2}
              strokeLinecap="round"
            />
            <Path
              d={`M 2 0 Q ${bridgeLength / 2} 3 ${bridgeLength - 2} 0`}
              fill="none"
              stroke={theme.bridge.accent}
              strokeWidth={0.7}
              strokeLinecap="round"
              strokeDasharray="2 2"
              opacity={0.85}
            />
          </G>
        );
      case 'plank': {
        const planks = Math.max(3, Math.floor(bridgeLength / 10));
        return (
          <G key={`${theme.id}-plank-${index}`} transform={`translate(0 ${offset})`}>
            <Line x1={0} y1={0} x2={bridgeLength} y2={0} stroke={theme.bridge.accent} strokeWidth={8} strokeLinecap="round" />
            {Array.from({ length: planks }, (_, plankIndex) => {
              const plankX = (plankIndex + 0.5) * (bridgeLength / planks);
              return (
                <Rect
                  key={`${theme.id}-plank-board-${plankIndex}`}
                  x={plankX - 3.5}
                  y={-3}
                  width={7}
                  height={6}
                  rx={1}
                  fill={theme.bridge.color}
                  stroke={theme.bridge.accent}
                  strokeWidth={0.45}
                />
              );
            })}
          </G>
        );
      }
      case 'log':
        return (
          <G key={`${theme.id}-log-${index}`} transform={`translate(0 ${offset})`}>
            <Rect
              x={0}
              y={-4}
              width={bridgeLength}
              height={8}
              rx={3}
              fill={theme.bridge.color}
              stroke={theme.bridge.post ?? theme.bridge.accent}
              strokeWidth={1}
            />
            <Line x1={0} y1={-1} x2={bridgeLength} y2={-1} stroke={theme.bridge.accent} strokeWidth={0.8} opacity={0.6} />
            <Circle cx={0} cy={0} r={4} fill={theme.bridge.accent} stroke={theme.bridge.post ?? theme.bridge.accent} strokeWidth={1} />
            <Circle cx={bridgeLength} cy={0} r={4} fill={theme.bridge.accent} stroke={theme.bridge.post ?? theme.bridge.accent} strokeWidth={1} />
          </G>
        );
      case 'ice':
        return (
          <G key={`${theme.id}-ice-${index}`} transform={`translate(0 ${offset})`}>
            <Rect
              x={0}
              y={-3}
              width={bridgeLength}
              height={6}
              fill={theme.bridge.color}
              stroke={theme.bridge.accent}
              strokeWidth={0.8}
              opacity={0.92}
            />
            <Polyline
              points={`0,-3 ${bridgeLength * 0.2},-1 ${bridgeLength * 0.5},-3 ${bridgeLength * 0.8},-1 ${bridgeLength},-3`}
              fill="none"
              stroke="#ffffff"
              strokeWidth={0.6}
              opacity={0.82}
            />
            <Polyline
              points={`0,3 ${bridgeLength * 0.3},1 ${bridgeLength * 0.7},3 ${bridgeLength},3`}
              fill="none"
              stroke={theme.bridge.accent}
              strokeWidth={0.5}
              opacity={0.55}
            />
          </G>
        );
      case 'stone': {
        const stones = Math.max(3, Math.floor(bridgeLength / 14));
        return (
          <G key={`${theme.id}-stone-${index}`} transform={`translate(0 ${offset})`}>
            <Line x1={0} y1={0} x2={bridgeLength} y2={0} stroke={theme.bridge.post ?? theme.bridge.accent} strokeWidth={10} opacity={0.7} />
            {Array.from({ length: stones }, (_, stoneIndex) => {
              const stoneX = (stoneIndex + 0.5) * (bridgeLength / stones);
              return (
                <G key={`${theme.id}-stone-block-${stoneIndex}`} transform={`translate(${stoneX} 0)`}>
                  <Rect x={-5} y={-4} width={10} height={8} rx={1.5} fill={theme.bridge.color} stroke={theme.bridge.accent} strokeWidth={0.8} />
                  <Line x1={-3} y1={-2} x2={3} y2={-2} stroke={theme.bridge.accent} strokeWidth={0.5} opacity={0.6} />
                </G>
              );
            })}
          </G>
        );
      }
      case 'steel': {
        const struts = Math.max(4, Math.floor(bridgeLength / 12));
        return (
          <G key={`${theme.id}-steel-${index}`} transform={`translate(0 ${offset})`}>
            <Rect x={0} y={2} width={bridgeLength} height={2.5} fill={theme.bridge.color} />
            <Rect x={4} y={-6} width={Math.max(0, bridgeLength - 8)} height={2} fill={theme.bridge.color} opacity={0.92} />
            {Array.from({ length: struts - 1 }, (_, strutIndex) => {
              const strutX = ((strutIndex + 1) * bridgeLength) / struts;
              return (
                <Line
                  key={`${theme.id}-steel-v-${strutIndex}`}
                  x1={strutX}
                  y1={-5}
                  x2={strutX}
                  y2={3}
                  stroke={theme.bridge.color}
                  strokeWidth={1.2}
                />
              );
            })}
            {Array.from({ length: struts - 1 }, (_, spanIndex) => {
              const left = (spanIndex * bridgeLength) / struts;
              const right = ((spanIndex + 1) * bridgeLength) / struts;
              return (
                <G key={`${theme.id}-steel-d-${spanIndex}`}>
                  <Line x1={left} y1={2} x2={right} y2={-5} stroke={theme.bridge.color} strokeWidth={0.9} />
                  <Line x1={left} y1={-5} x2={right} y2={2} stroke={theme.bridge.color} strokeWidth={0.9} />
                </G>
              );
            })}
          </G>
        );
      }
    }
  };

  return (
    <G transform={`translate(${startX} ${startY}) rotate(${angle})`} opacity={preview ? 0.52 : 1}>
      {offsets.map((offset, index) => renderBridgeSegment(offset, index))}
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
  const badgeY = theme.id === 'ocean' ? island.y + radius * 0.28 : island.y;
  const badgeRadius = theme.id === 'ocean' ? radius * 0.52 : radius * 0.55;
  const numberSize = theme.id === 'ocean' ? radius * 0.8 : radius * 0.72;
  const badgeTextY = badgeY + numberSize * 0.32;
  const baseStroke = island.over ? '#d65454' : theme.island.stroke;
  const badgeFill = island.satisfied ? theme.accent : 'rgba(0,0,0,0.32)';
  const badgeText = island.satisfied ? theme.island.shadow : theme.island.number;

  return (
    <G>
      {island.focused && !island.selected && (
        <Circle
          cx={island.x}
          cy={island.y}
          r={radius + 8}
          fill="none"
          stroke={`${theme.onBg}55`}
          strokeWidth={2}
        />
      )}
      {island.selected && (
        <Circle
          cx={island.x}
          cy={island.y}
          r={radius + 9}
          fill="none"
          stroke={theme.accent}
          strokeWidth={2.5}
          opacity={0.92}
        />
      )}
      {theme.id === 'desert' && (
        <G>
          <Ellipse cx={island.x} cy={island.y + radius * 0.5} rx={radius * 1.1} ry={radius * 0.3} fill={theme.island.shadow} opacity={0.35} />
          <Path
            d={`M ${island.x - radius} ${island.y + 2} Q ${island.x - radius * 0.6} ${island.y - radius * 1.1} ${island.x} ${island.y - radius * 1.05} Q ${island.x + radius * 0.6} ${island.y - radius * 1.1} ${island.x + radius} ${island.y + 2} Z`}
            fill={theme.island.fill}
            stroke={baseStroke}
            strokeWidth={1.5}
          />
          <Path
            d={`M ${island.x - radius * 0.7} ${island.y - 4} Q ${island.x - radius * 0.3} ${island.y - radius * 0.9} ${island.x + radius * 0.1} ${island.y - radius * 0.7}`}
            fill="none"
            stroke={theme.island.highlight}
            strokeWidth={1}
            opacity={0.6}
          />
        </G>
      )}
      {theme.id === 'ocean' && (
        <G>
          <Ellipse cx={island.x} cy={island.y + radius * 0.6} rx={radius * 1.15} ry={radius * 0.28} fill="#000000" opacity={0.35} />
          <Ellipse cx={island.x} cy={island.y} rx={radius * 1.05} ry={radius * 0.95} fill={theme.island.fill} stroke={baseStroke} strokeWidth={1.5} />
          <Ellipse cx={island.x - radius * 0.3} cy={island.y - radius * 0.4} rx={radius * 0.6} ry={radius * 0.3} fill={theme.island.highlight} opacity={0.55} />
        </G>
      )}
      {theme.id === 'forest' && (
        <G>
          <Ellipse cx={island.x} cy={island.y + radius * 0.55} rx={radius * 1.1} ry={radius * 0.25} fill="#000000" opacity={0.4} />
          <Path
            d={`M ${island.x} ${island.y - radius} a ${radius} ${radius} 0 1 0 0.1 0 L ${island.x + radius * 0.15} ${island.y - radius * 0.1} L ${island.x - radius * 0.1} ${island.y + radius * 0.1} Z`}
            fill={theme.island.fill}
            stroke={baseStroke}
            strokeWidth={1.5}
          />
          <Path
            d={`M ${island.x - radius * 0.5} ${island.y - radius * 0.4} Q ${island.x - radius * 0.8} ${island.y} ${island.x - radius * 0.6} ${island.y + radius * 0.5}`}
            fill="none"
            stroke={theme.island.highlight}
            strokeWidth={1.2}
            opacity={0.5}
          />
        </G>
      )}
      {theme.id === 'ice' && (
        <G>
          <Ellipse cx={island.x} cy={island.y + radius * 0.6} rx={radius * 1.1} ry={radius * 0.25} fill={theme.bridge.post ?? theme.island.shadow} opacity={0.3} />
          <Polygon
            points={`
              ${island.x - radius},${island.y - radius * 0.1}
              ${island.x - radius * 0.6},${island.y - radius * 0.9}
              ${island.x + radius * 0.2},${island.y - radius}
              ${island.x + radius * 0.9},${island.y - radius * 0.3}
              ${island.x + radius},${island.y + radius * 0.5}
              ${island.x + radius * 0.3},${island.y + radius * 0.85}
              ${island.x - radius * 0.6},${island.y + radius * 0.7}
              ${island.x - radius * 0.95},${island.y + radius * 0.3}
            `}
            fill={theme.island.fill}
            stroke={baseStroke}
            strokeWidth={1.5}
          />
          <Polyline
            points={`${island.x - radius * 0.6},${island.y - radius * 0.4} ${island.x - radius * 0.1},${island.y - radius * 0.5} ${island.x + radius * 0.3},${island.y - radius * 0.1}`}
            fill="none"
            stroke={theme.island.highlight}
            strokeWidth={1.2}
            opacity={0.8}
          />
        </G>
      )}
      {theme.id === 'volcano' && (
        <G>
          <Ellipse cx={island.x} cy={island.y + radius * 0.6} rx={radius * 1.05} ry={radius * 0.22} fill={theme.accent} opacity={0.35} />
          <Polygon
            points={`
              ${island.x - radius * 0.9},${island.y + radius * 0.2}
              ${island.x - radius * 0.4},${island.y - radius * 0.8}
              ${island.x + radius * 0.3},${island.y - radius * 0.95}
              ${island.x + radius * 0.95},${island.y - radius * 0.1}
              ${island.x + radius * 0.8},${island.y + radius * 0.7}
              ${island.x - radius * 0.3},${island.y + radius * 0.9}
              ${island.x - radius * 0.95},${island.y + radius * 0.4}
            `}
            fill={theme.island.fill}
            stroke={baseStroke}
            strokeWidth={1.5}
          />
          <Polygon
            points={`
              ${island.x - radius * 0.4},${island.y - radius * 0.8}
              ${island.x + radius * 0.3},${island.y - radius * 0.95}
              ${island.x + radius * 0.1},${island.y - radius * 0.2}
              ${island.x - radius * 0.3},${island.y - radius * 0.3}
            `}
            fill={theme.island.highlight}
            opacity={0.35}
          />
        </G>
      )}
      {theme.id === 'chicago' && (
        <G>
          <Rect x={island.x - radius * 0.95} y={island.y + radius * 0.4} width={radius * 1.9} height={radius * 0.3} fill="#000000" opacity={0.4} rx={2} />
          <Rect
            x={island.x - radius * 0.95}
            y={island.y - radius * 0.95}
            width={radius * 1.9}
            height={radius * 1.9}
            rx={radius * 0.18}
            fill={theme.island.fill}
            stroke={baseStroke}
            strokeWidth={1.5}
          />
          <Line x1={island.x - radius * 0.95} y1={island.y - radius * 0.3} x2={island.x + radius * 0.95} y2={island.y - radius * 0.3} stroke={baseStroke} strokeWidth={0.6} opacity={0.5} />
          <Line x1={island.x - radius * 0.95} y1={island.y + radius * 0.3} x2={island.x + radius * 0.95} y2={island.y + radius * 0.3} stroke={baseStroke} strokeWidth={0.6} opacity={0.5} />
          <Line x1={island.x} y1={island.y - radius * 0.95} x2={island.x} y2={island.y - radius * 0.3} stroke={baseStroke} strokeWidth={0.6} opacity={0.5} />
          <Line x1={island.x - radius * 0.5} y1={island.y - radius * 0.3} x2={island.x - radius * 0.5} y2={island.y + radius * 0.3} stroke={baseStroke} strokeWidth={0.6} opacity={0.5} />
          <Line x1={island.x + radius * 0.5} y1={island.y - radius * 0.3} x2={island.x + radius * 0.5} y2={island.y + radius * 0.3} stroke={baseStroke} strokeWidth={0.6} opacity={0.5} />
          <Line x1={island.x} y1={island.y + radius * 0.3} x2={island.x} y2={island.y + radius * 0.95} stroke={baseStroke} strokeWidth={0.6} opacity={0.5} />
        </G>
      )}
      <Circle cx={island.x} cy={badgeY} r={badgeRadius} fill={badgeFill} />
      <SvgText
        x={island.x}
        y={badgeTextY}
        textAnchor="middle"
        fontSize={numberSize}
        fontWeight="700"
        fill={badgeText}
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
            islandRadius={islandRadius}
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
            islandRadius={islandRadius}
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
