import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getPostmarkStampFamilyLabel,
  postmarkStampDirectionSpecs,
  type PostmarkStampFamily,
} from '../src/data/postmarkStamps';
import { resolveScreenAccent, type ThemeTokens, useDaybreakTheme } from '../src/constants/theme';
import { PostmarkStampSvg } from '../src/ui/PostmarkStamp';

const POSTMARK_BLUE = '#1547D6';
const PAGE_BACKGROUND = '#f5f1eb';
const SURFACE = '#fffdf8';
const INK = '#342b25';
const MUTED = 'rgba(52, 43, 37, 0.64)';
const STAMP_SAMPLE_NUMBERS = [1, 6, 12] as const;
const STAMP_SAMPLE_COLORS = ['#cf6682', '#9274d7', '#52b99e', '#e4b63f', '#c87564', '#579fdb'];
const FAMILY_ORDER: PostmarkStampFamily[] = ['inbox-tile', 'signal-block', 'soft-alert'];

export default function PostmarkStampDirectionsScreen() {
  const router = useRouter();
  const theme = useDaybreakTheme();
  const screenAccent = useMemo(() => resolveScreenAccent('postmark', theme), [theme]);
  const styles = useMemo(() => createStyles(theme), [theme]);
  const groupedSpecs = useMemo(
    () =>
      FAMILY_ORDER.map((family) => ({
        family,
        specs: postmarkStampDirectionSpecs.filter((spec) => spec.family === family),
      })),
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false, title: 'Postmark Stamps' }} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [styles.homeButton, pressed && styles.homeButtonPressed]}
            onPress={() => router.push('/postmark')}
          >
            <Text style={styles.homeButtonText}>Postmark</Text>
          </Pressable>
          <Text style={styles.topLabel}>Direction Sheet</Text>
        </View>

        <View style={styles.hero}>
          <Text style={styles.kicker}>Postmark</Text>
          <Text style={styles.title}>Stamp Directions</Text>
          <Text style={styles.subtitle}>
            40 SVG mini stamps · blue border numbers · poster and landscape artwork
          </Text>
          <View style={[styles.blueSwatch, { borderColor: screenAccent.main }]}>
            <View style={styles.blueDot} />
            <Text style={styles.blueText}>Marks and game accent use {POSTMARK_BLUE}</Text>
          </View>
        </View>

        {groupedSpecs.map(({ family, specs }) => (
          <View key={family} style={styles.familySection}>
            <Text style={styles.familyTitle}>{getPostmarkStampFamilyLabel(family)}</Text>
            <View style={styles.specGrid}>
              {specs.map((spec, specIndex) => (
                <View key={spec.id} style={styles.specCard}>
                  <View style={styles.specMeta}>
                    <Text style={styles.specLabel}>{spec.label}</Text>
                    <Text style={styles.specId}>{spec.edgeTreatment}</Text>
                  </View>
                  <View style={styles.sampleRow}>
                    {STAMP_SAMPLE_NUMBERS.map((sampleNumber, numberIndex) => {
                      const color =
                        STAMP_SAMPLE_COLORS[
                          (specIndex + numberIndex + FAMILY_ORDER.indexOf(family) * 2) %
                            STAMP_SAMPLE_COLORS.length
                        ]!;
                      return (
                        <View key={`${spec.id}-${sampleNumber}`} style={styles.sampleStamp}>
                          <PostmarkStampSvg
                            spec={spec}
                            number={sampleNumber}
                            fill={color}
                            size={76}
                            shadow={false}
                          />
                        </View>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(theme: ThemeTokens) {
  const spacing = theme.spacing;
  const radius = theme.borderRadius;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: PAGE_BACKGROUND,
    },
    content: {
      width: '100%',
      maxWidth: 980,
      alignSelf: 'center',
      padding: spacing.lg,
      paddingBottom: spacing.xxl,
      gap: spacing.lg,
    },
    topBar: {
      minHeight: 34,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    homeButton: {
      minHeight: 32,
      minWidth: 86,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.sm,
      borderWidth: 1,
      borderColor: 'rgba(52, 43, 37, 0.18)',
      backgroundColor: SURFACE,
    },
    homeButtonPressed: {
      opacity: 0.78,
      transform: [{ scale: 0.98 }],
    },
    homeButtonText: {
      color: INK,
      fontSize: 13,
      fontWeight: '800',
    },
    topLabel: {
      color: MUTED,
      fontSize: 13,
      fontWeight: '900',
      letterSpacing: 0.4,
    },
    hero: {
      gap: spacing.xs,
    },
    kicker: {
      color: POSTMARK_BLUE,
      fontSize: 13,
      fontWeight: '900',
      letterSpacing: 0.4,
    },
    title: {
      color: INK,
      fontSize: 36,
      fontWeight: '900',
    },
    subtitle: {
      maxWidth: 620,
      color: MUTED,
      fontSize: 14,
      fontWeight: '700',
      lineHeight: 21,
    },
    blueSwatch: {
      marginTop: spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      alignSelf: 'flex-start',
      borderRadius: 999,
      borderWidth: 1,
      backgroundColor: 'rgba(21, 71, 214, 0.08)',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    blueDot: {
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: POSTMARK_BLUE,
    },
    blueText: {
      color: INK,
      fontSize: 13,
      fontWeight: '800',
    },
    familySection: {
      gap: spacing.md,
    },
    familyTitle: {
      color: INK,
      fontSize: 18,
      fontWeight: '900',
    },
    specGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
    },
    specCard: {
      width: 310,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: 'rgba(52, 43, 37, 0.14)',
      backgroundColor: SURFACE,
      padding: spacing.md,
      gap: spacing.md,
    },
    specMeta: {
      gap: 2,
    },
    specLabel: {
      color: INK,
      fontSize: 14,
      fontWeight: '900',
    },
    specId: {
      color: MUTED,
      fontSize: 12,
      fontWeight: '800',
      textTransform: 'uppercase',
    },
    sampleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    sampleStamp: {
      width: 86,
      height: 86,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.sm,
      backgroundColor: 'rgba(52, 43, 37, 0.035)',
    },
  });
}
