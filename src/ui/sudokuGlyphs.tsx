import { StyleSheet, View } from 'react-native';
import Svg, {
  Circle,
  Ellipse,
  Line,
  Path,
  Polyline,
} from 'react-native-svg';

export type SudokuDigitDisplayMode = 'numeric' | 'glyph';
export type SudokuGlyphVariant = 'display' | 'micro';

export const SUDOKU_GLYPH_DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

interface SudokuGlyphProps {
  digit: number;
  size: number;
  color: string;
  variant?: SudokuGlyphVariant;
}

interface GlyphStrokeProps {
  color: string;
  strokeWidth: number;
}

function getStrokeProps(color: string, strokeWidth: number) {
  return {
    fill: 'none' as const,
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
}

function ReedGlyph({ color, strokeWidth }: GlyphStrokeProps) {
  return (
    <>
      <Line x1="12" y1="5" x2="12" y2="20" {...getStrokeProps(color, strokeWidth)} />
      <Path
        d="M12 6C13.6 6.4 15 7.6 15.8 9.2C14.1 9.5 12.8 8.7 12 7.4"
        {...getStrokeProps(color, strokeWidth)}
      />
    </>
  );
}

function ArchGlyph({ color, strokeWidth }: GlyphStrokeProps) {
  return (
    <>
      <Path
        d="M7 18V13.5C7 8.8 9 6 12 6C15 6 17 8.8 17 13.5V18"
        {...getStrokeProps(color, strokeWidth)}
      />
      <Line x1="7" y1="18" x2="9" y2="18" {...getStrokeProps(color, strokeWidth)} />
      <Line x1="15" y1="18" x2="17" y2="18" {...getStrokeProps(color, strokeWidth)} />
    </>
  );
}

function WaterGlyph({ color, strokeWidth, variant }: GlyphStrokeProps & { variant: SudokuGlyphVariant }) {
  return (
    <>
      <Polyline
        points="4,9 7,7 10,9 13,7 16,9 20,7"
        {...getStrokeProps(color, strokeWidth)}
      />
      {variant === 'display' ? (
        <>
          <Polyline
            points="5,13 8,11 11,13 14,11 17,13"
            {...getStrokeProps(color, strokeWidth)}
          />
          <Polyline
            points="6,17 9,15 12,17 15,15 18,17"
            {...getStrokeProps(color, strokeWidth)}
          />
        </>
      ) : (
        <Polyline
          points="6,15 9,13 12,15 15,13 18,15"
          {...getStrokeProps(color, strokeWidth)}
        />
      )}
    </>
  );
}

function BasketGlyph({ color, strokeWidth, variant }: GlyphStrokeProps & { variant: SudokuGlyphVariant }) {
  return (
    <>
      <Line x1="6" y1="18" x2="18" y2="18" {...getStrokeProps(color, strokeWidth)} />
      <Path
        d={variant === 'display' ? 'M7 18C7.5 12.2 9.5 9.4 12 9.4C14.5 9.4 16.5 12.2 17 18' : 'M7 18C7.8 13.2 9.8 11 12 11C14.2 11 16.2 13.2 17 18'}
        {...getStrokeProps(color, strokeWidth)}
      />
      {variant === 'display' && (
        <Path d="M9 10.2H15" {...getStrokeProps(color, strokeWidth)} />
      )}
    </>
  );
}

function HandGlyph({ color, strokeWidth, variant }: GlyphStrokeProps & { variant: SudokuGlyphVariant }) {
  return (
    <>
      <Line x1="7.5" y1="18" x2="7.5" y2="11.5" {...getStrokeProps(color, strokeWidth)} />
      <Line x1="10.5" y1="18" x2="10.5" y2="8.8" {...getStrokeProps(color, strokeWidth)} />
      <Line x1="13.5" y1="18" x2="13.5" y2="8.2" {...getStrokeProps(color, strokeWidth)} />
      <Line x1="16.5" y1="18" x2="16.5" y2={variant === 'display' ? '10.2' : '11.2'} {...getStrokeProps(color, strokeWidth)} />
      <Path
        d={variant === 'display' ? 'M7.5 14C6.2 13.1 5 13.6 5 15.4C5 16.8 6.1 17.7 7.5 18' : 'M7.5 14.4C6.4 13.8 5.5 14.3 5.5 15.6C5.5 16.6 6.3 17.4 7.5 18'}
        {...getStrokeProps(color, strokeWidth)}
      />
      <Line x1="7.5" y1="18" x2="16.5" y2="18" {...getStrokeProps(color, strokeWidth)} />
    </>
  );
}

function EyeGlyph({ color, strokeWidth, variant }: GlyphStrokeProps & { variant: SudokuGlyphVariant }) {
  return (
    <>
      <Path
        d="M4.5 12C6.8 8.2 9.2 6.6 12 6.6C14.8 6.6 17.2 8.2 19.5 12C17.2 15.8 14.8 17.4 12 17.4C9.2 17.4 6.8 15.8 4.5 12Z"
        {...getStrokeProps(color, strokeWidth)}
      />
      <Circle
        cx="12"
        cy="12"
        r={variant === 'display' ? 1.9 : 1.5}
        fill={color}
      />
    </>
  );
}

function FeatherGlyph({ color, strokeWidth, variant }: GlyphStrokeProps & { variant: SudokuGlyphVariant }) {
  return (
    <>
      <Line x1="12" y1="5" x2="12" y2="19" {...getStrokeProps(color, strokeWidth)} />
      <Polyline
        points={variant === 'display' ? '12,6 16,8 12,10 16,12 12,14 15,17' : '12,6.5 15.2,9 12,11.5 15,15'}
        {...getStrokeProps(color, strokeWidth)}
      />
      <Polyline
        points={variant === 'display' ? '12,8 8,10 12,12 8.5,14 12,16' : '12,8.8 9.2,11 12,13.2 9.6,15.5'}
        {...getStrokeProps(color, strokeWidth)}
      />
    </>
  );
}

function CoilGlyph({ color, strokeWidth, variant }: GlyphStrokeProps & { variant: SudokuGlyphVariant }) {
  return (
    <>
      <Path
        d={variant === 'display'
          ? 'M11.8 6C16 6 18.6 8.4 18.6 11.2C18.6 14.2 16.2 16.4 13.2 16.4C10.2 16.4 8 14.4 8 12.1C8 10.1 9.6 8.6 11.7 8.6C13.7 8.6 15.1 10 15.1 11.8C15.1 13.6 13.8 14.8 12 14.8'
          : 'M12 6.8C15.6 6.8 17.8 8.8 17.8 11.4C17.8 14 15.8 15.9 13 15.9C10.3 15.9 8.5 14.2 8.5 12.1C8.5 10.3 9.9 9.1 11.6 9.1C13.3 9.1 14.4 10.2 14.4 11.8C14.4 13.2 13.4 14.1 12.2 14.1'}
        {...getStrokeProps(color, strokeWidth)}
      />
      <Line x1="12" y1="14.8" x2="12" y2="19" {...getStrokeProps(color, strokeWidth)} />
    </>
  );
}

function AnkhGlyph({ color, strokeWidth, variant }: GlyphStrokeProps & { variant: SudokuGlyphVariant }) {
  return (
    <>
      <Ellipse
        cx="12"
        cy={variant === 'display' ? '7.4' : '8.2'}
        rx={variant === 'display' ? '3.9' : '3.2'}
        ry={variant === 'display' ? '3.2' : '2.8'}
        {...getStrokeProps(color, strokeWidth)}
      />
      <Line x1="12" y1={variant === 'display' ? '10.6' : '11'} x2="12" y2="19" {...getStrokeProps(color, strokeWidth)} />
      <Line x1="7.2" y1="14" x2="16.8" y2="14" {...getStrokeProps(color, strokeWidth)} />
    </>
  );
}

function renderGlyph(digit: number, color: string, strokeWidth: number, variant: SudokuGlyphVariant) {
  switch (digit) {
    case 1:
      return <ReedGlyph color={color} strokeWidth={strokeWidth} />;
    case 2:
      return <ArchGlyph color={color} strokeWidth={strokeWidth} />;
    case 3:
      return <WaterGlyph color={color} strokeWidth={strokeWidth} variant={variant} />;
    case 4:
      return <BasketGlyph color={color} strokeWidth={strokeWidth} variant={variant} />;
    case 5:
      return <HandGlyph color={color} strokeWidth={strokeWidth} variant={variant} />;
    case 6:
      return <EyeGlyph color={color} strokeWidth={strokeWidth} variant={variant} />;
    case 7:
      return <FeatherGlyph color={color} strokeWidth={strokeWidth} variant={variant} />;
    case 8:
      return <CoilGlyph color={color} strokeWidth={strokeWidth} variant={variant} />;
    case 9:
      return <AnkhGlyph color={color} strokeWidth={strokeWidth} variant={variant} />;
    default:
      return null;
  }
}

export function isSudokuDigitDisplayMode(
  value: string | null | undefined
): value is SudokuDigitDisplayMode {
  return value === 'numeric' || value === 'glyph';
}

export function SudokuGlyph({
  digit,
  size,
  color,
  variant = 'display',
}: SudokuGlyphProps) {
  if (!Number.isInteger(digit) || digit < 1 || digit > 9) {
    return null;
  }

  const strokeWidth = variant === 'micro' ? 2.25 : 1.95;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        {renderGlyph(digit, color, strokeWidth, variant)}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
