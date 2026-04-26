import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import {
  getDailyMuseumArtwork,
  getMuseumArtworkById,
  MUSEUM_ARTWORKS,
  type MuseumArtwork,
} from '../src/data/museumArtworks';
import {
  buildFrameArtworkInput,
  CURATED_FRAME_MANIFEST,
  FRAME_MANIFEST,
  selectFrame,
} from '../src/data/museumFrames';
import { StaticFramedArtwork, useArtworkAspectRatio } from '../src/ui/museumFrames';

const FONT_SANS = 'DM Sans, Sora, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const FONT_SERIF = 'Instrument Serif, Georgia, "Times New Roman", serif';

const SAMPLE_IDS = [
  'met-436535',
  'met-39799',
  'met-467642',
  'met-38634',
];

function SampleSelectionCard({ artwork }: { artwork: MuseumArtwork }) {
  const aspectRatio = useArtworkAspectRatio(artwork.images.displayUrl);
  const frameArtwork = useMemo(
    () => buildFrameArtworkInput(artwork, aspectRatio),
    [artwork, aspectRatio]
  );
  const frame = useMemo(
    () =>
      selectFrame({
        artwork: frameArtwork,
        preferredFrameId: artwork.presentation?.preferredFrameId,
        allowSpecialShapes: artwork.presentation?.allowSpecialShapes ?? false,
      }),
    [artwork.presentation?.allowSpecialShapes, artwork.presentation?.preferredFrameId, frameArtwork]
  );

  return (
    <View style={styles.sampleCard}>
      <StaticFramedArtwork artwork={artwork} frame={frame} style={styles.sampleArtwork} />
      <Text style={styles.sampleTitle}>{artwork.title}</Text>
      <Text style={styles.sampleMeta}>
        {artwork.artist} · {frame.label}
      </Text>
    </View>
  );
}

function CatalogTile({
  artwork,
  frameIndex,
}: {
  artwork: MuseumArtwork;
  frameIndex: number;
}) {
  const frame = CURATED_FRAME_MANIFEST[frameIndex];
  return (
    <View style={styles.tile}>
      <StaticFramedArtwork artwork={artwork} frame={frame} style={styles.tileArtwork} />
      <Text style={styles.tileLabel}>{frame.label}</Text>
      <Text style={styles.tileMeta}>
        {frame.shape} · {frame.style}
      </Text>
    </View>
  );
}

export default function MuseumFramesScreen() {
  const todayArtwork = useMemo(() => getDailyMuseumArtwork(), []);
  const sampleArtworks = useMemo(
    () => SAMPLE_IDS.map((id) => getMuseumArtworkById(id)).filter(Boolean) as MuseumArtwork[],
    []
  );
  const gridArtwork = sampleArtworks[1] ?? todayArtwork ?? MUSEUM_ARTWORKS[0];

  return (
    <>
      <Stack.Screen options={{ title: 'Museum Frames' }} />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.eyebrow}>Museum QA</Text>
          <Text style={styles.title}>Frame Catalog Preview</Text>
          <Text style={styles.subtitle}>
            Deterministic selection samples with the smaller curated frame set now used by Museum.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selection Samples</Text>
            <View style={styles.sampleGrid}>
              {sampleArtworks.map((artwork) => (
                <SampleSelectionCard key={artwork.id} artwork={artwork} />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Catalog</Text>
            <Text style={styles.sectionNote}>
              Showing {CURATED_FRAME_MANIFEST.length} curated entries with{' '}
              {gridArtwork.title}. {FRAME_MANIFEST.length - CURATED_FRAME_MANIFEST.length} generated
              variants are currently suppressed because they do not hold up visually.
            </Text>
            <View style={styles.catalogGrid}>
              {CURATED_FRAME_MANIFEST.map((frame, index) => (
                <CatalogTile key={frame.id} artwork={gridArtwork} frameIndex={index} />
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0a09',
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 40,
  },
  eyebrow: {
    color: '#f5b455',
    fontSize: 11,
    fontFamily: FONT_SANS,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  title: {
    color: '#faf7f2',
    fontSize: 34,
    lineHeight: 38,
    fontFamily: FONT_SERIF,
    marginBottom: 8,
  },
  subtitle: {
    color: '#d8ccc2',
    fontSize: 14,
    lineHeight: 22,
    fontFamily: FONT_SANS,
    maxWidth: 640,
  },
  section: {
    marginTop: 26,
  },
  sectionTitle: {
    color: '#faf7f2',
    fontSize: 20,
    lineHeight: 24,
    fontFamily: FONT_SERIF,
    marginBottom: 10,
  },
  sectionNote: {
    color: '#a89a8f',
    fontSize: 13,
    lineHeight: 18,
    fontFamily: FONT_SANS,
    marginBottom: 14,
  },
  sampleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  sampleCard: {
    width: 248,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 12,
  },
  sampleArtwork: {
    width: '100%',
  },
  sampleTitle: {
    color: '#faf7f2',
    fontSize: 16,
    lineHeight: 20,
    fontFamily: FONT_SERIF,
    marginTop: 10,
  },
  sampleMeta: {
    color: '#a89a8f',
    fontSize: 12,
    lineHeight: 17,
    fontFamily: FONT_SANS,
    marginTop: 4,
  },
  catalogGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tile: {
    width: 170,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 12,
  },
  tileArtwork: {
    width: '100%',
  },
  tileLabel: {
    color: '#faf7f2',
    fontSize: 13,
    lineHeight: 17,
    fontFamily: FONT_SANS,
    fontWeight: '700',
    marginTop: 10,
  },
  tileMeta: {
    color: '#a89a8f',
    fontSize: 11,
    lineHeight: 16,
    fontFamily: FONT_SANS,
    marginTop: 4,
  },
});
