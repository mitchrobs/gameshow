import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  GestureResponderEvent,
  Image,
  PanResponder,
  PanResponderGestureState,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ImageStyle,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import type { MuseumArtwork } from '../data/museumArtworks';
import type { FrameMeta } from '../data/museumFrames';

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const FONT_SANS = 'DM Sans, Sora, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const COLORS = {
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.14)',
  hintBg: 'rgba(12, 10, 9, 0.52)',
  hintText: 'rgba(255,255,255,0.82)',
  textDim: '#d8ccc2',
  wallGlow: 'rgba(255,255,255,0.03)',
  black: '#000000',
};

export type MuseumFrameSize = 'stage' | 'hero' | 'card' | 'thumb' | 'share';

export function useArtworkAspectRatio(uri: string, fallback = 1.25): number {
  const [aspectRatio, setAspectRatio] = useState(fallback);

  useEffect(() => {
    let cancelled = false;
    Image.getSize(
      uri,
      (width, height) => {
        if (!cancelled && width > 0 && height > 0) {
          setAspectRatio(width / height);
        }
      },
      () => {
        if (!cancelled) {
          setAspectRatio(fallback);
        }
      }
    );

    return () => {
      cancelled = true;
    };
  }, [fallback, uri]);

  return aspectRatio;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getTouchDistance(touches: readonly { pageX: number; pageY: number }[]): number {
  if (touches.length < 2) return 1;
  const [first, second] = touches;
  return Math.hypot(first.pageX - second.pageX, first.pageY - second.pageY);
}

function windowStyleFromFrame(frame: FrameMeta): ViewStyle {
  return {
    left: `${frame.innerWindow.x * 100}%`,
    top: `${frame.innerWindow.y * 100}%`,
    width: `${frame.innerWindow.width * 100}%`,
    height: `${frame.innerWindow.height * 100}%`,
  };
}

function windowMaskStyleFromFrame(frame: FrameMeta): ViewStyle | object {
  const fallback: ViewStyle = {};

  if (frame.artMask === 'oval') {
    fallback.borderRadius = 9999;
  } else if (frame.artMask === 'arch') {
    fallback.borderTopLeftRadius = 9999;
    fallback.borderTopRightRadius = 9999;
  }

  if (Platform.OS !== 'web' || !frame.assets?.mask) {
    return fallback;
  }

  const resolved = Image.resolveAssetSource(frame.assets.mask);
  if (!resolved?.uri) {
    return fallback;
  }

  return {
    ...fallback,
    WebkitMaskImage: `url("${resolved.uri}")`,
    maskImage: `url("${resolved.uri}")`,
    WebkitMaskSize: '100% 100%',
    maskSize: '100% 100%',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
  } as object;
}

function artResizeMode(frame: FrameMeta): 'contain' | 'cover' {
  return frame.safeArtFit === 'cover' ? 'cover' : 'contain';
}

function isGeneratedFrame(frame: FrameMeta): boolean {
  return frame.renderMode === 'generated';
}

function getGeneratedFrameMetrics(frame: FrameMeta) {
  if (frame.shape === 'landscape-16x9') {
    return { framePadding: 16, matPadding: 12, radius: 12 };
  }
  if (frame.shape === 'landscape-3x2') {
    return { framePadding: 16, matPadding: 12, radius: 13 };
  }
  return { framePadding: 15, matPadding: 11, radius: 14 };
}

function GeneratedFrameShell({
  frame,
  style,
  children,
}: {
  frame: FrameMeta;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}) {
  const palette = frame.generatedStyle;
  const metrics = getGeneratedFrameMetrics(frame);

  if (!palette) {
    return <View style={[styles.staticShell, style]}>{children}</View>;
  }

  return (
    <View
      style={[
        styles.generatedShell,
        style,
        {
          aspectRatio: frame.outerAspectRatio,
          borderRadius: metrics.radius,
          borderColor: palette.edge,
          backgroundColor: palette.outer,
          padding: metrics.framePadding,
          shadowColor: palette.wallGlow,
        },
      ]}
    >
      <View
        style={[
          styles.generatedTint,
          {
            borderRadius: Math.max(6, metrics.radius - 3),
            backgroundColor: palette.outerAlt,
          },
        ]}
      />
      <View
        style={[
          styles.generatedBevel,
          {
            borderRadius: Math.max(6, metrics.radius - 3),
            borderColor: palette.edgeSoft,
          },
        ]}
      />
      <View
        style={[
          styles.generatedMatLayer,
          {
            borderRadius: Math.max(5, metrics.radius - 7),
            backgroundColor: palette.mat,
            borderColor: palette.matBorder,
            padding: metrics.matPadding,
          },
        ]}
      >
        <View style={styles.generatedArtWindow}>{children}</View>
      </View>
    </View>
  );
}

interface FramedArtworkProps {
  artwork: MuseumArtwork;
  frame: FrameMeta;
  uri?: string;
  style?: StyleProp<ViewStyle>;
}

export function StaticFramedArtwork({
  artwork,
  frame,
  uri,
  style,
}: FramedArtworkProps) {
  if (isGeneratedFrame(frame)) {
    return (
      <GeneratedFrameShell frame={frame} style={style}>
        <Image
          source={{ uri: uri ?? artwork.images.displayUrl }}
          style={styles.artFill}
          resizeMode={artResizeMode(frame)}
        />
      </GeneratedFrameShell>
    );
  }

  const maskStyle = useMemo(() => windowMaskStyleFromFrame(frame), [frame]);

  return (
    <View style={[styles.staticShell, style, { aspectRatio: frame.outerAspectRatio }]}>
      {frame.assets?.shadow ? <Image source={frame.assets.shadow} style={styles.assetFill} /> : null}
      <View style={[styles.artWindow, windowStyleFromFrame(frame), maskStyle]}>
        <Image
          source={{ uri: uri ?? artwork.images.displayUrl }}
          style={styles.artFill}
          resizeMode={artResizeMode(frame)}
        />
      </View>
      {frame.assets?.overlay ? <Image source={frame.assets.overlay} style={styles.assetFill} /> : null}
    </View>
  );
}

interface ArtworkLayerProps {
  uri: string;
  opacity: number;
  transformStyle: object;
  resizeMode: 'contain' | 'cover';
  onLoad?: () => void;
  onError?: () => void;
}

function ArtworkLayer({
  uri,
  opacity,
  transformStyle,
  resizeMode,
  onLoad,
  onError,
}: ArtworkLayerProps) {
  return (
    <View style={[styles.artLayer, transformStyle, { opacity }]}>
      {Platform.OS === 'web' ? (
        <>
          <View
            style={[
              styles.artLayer,
              {
                backgroundImage: `url("${uri}")`,
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: resizeMode === 'cover' ? 'cover' : 'contain',
              } as object,
            ]}
          />
          <Image
            source={{ uri }}
            style={styles.hiddenProbeImage}
            resizeMode={resizeMode}
            onLoad={onLoad}
            onError={onError}
          />
        </>
      ) : (
        <Image
          source={{ uri }}
          style={styles.artFill}
          resizeMode={resizeMode}
          onLoad={onLoad}
          onError={onError}
        />
      )}
    </View>
  );
}

interface MuseumArtworkViewerProps {
  artwork: MuseumArtwork;
  frame: FrameMeta;
  height: number;
  onInteraction: () => void;
}

export function MuseumArtworkViewer({
  artwork,
  frame,
  height,
  onInteraction,
}: MuseumArtworkViewerProps) {
  const { width } = useWindowDimensions();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showControls, setShowControls] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [displayLoaded, setDisplayLoaded] = useState(false);
  const [highResLoaded, setHighResLoaded] = useState(false);
  const [displayFailed, setDisplayFailed] = useState(false);
  const zoomRef = useRef(zoom);
  const panRef = useRef(pan);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gestureRef = useRef({
    startDistance: 1,
    startZoom: 1,
    startPan: { x: 0, y: 0 },
  });
  const hintOpacity = useRef(new Animated.Value(1)).current;

  const showFullRes = zoom > 1.05;
  const resizeMode = artResizeMode(frame);
  const maskStyle = useMemo(() => windowMaskStyleFromFrame(frame), [frame]);

  const clearControlsTimer = useCallback(() => {
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
      controlsTimerRef.current = null;
    }
  }, []);

  const revealControls = useCallback(() => {
    clearControlsTimer();
    setShowControls(true);
    controlsTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 2600);
  }, [clearControlsTimer]);

  const hideHint = useCallback(() => {
    setShowHint(false);
    Animated.timing(hintOpacity, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [hintOpacity]);

  const markInteraction = useCallback(() => {
    onInteraction();
    if (showHint) hideHint();
    revealControls();
  }, [hideHint, onInteraction, revealControls, showHint]);

  const updateZoom = useCallback((value: number) => {
    const nextZoom = clamp(value, MIN_ZOOM, MAX_ZOOM);
    zoomRef.current = nextZoom;
    setZoom(nextZoom);
    if (nextZoom === MIN_ZOOM) {
      panRef.current = { x: 0, y: 0 };
      setPan({ x: 0, y: 0 });
    }
  }, []);

  const updatePan = useCallback((value: { x: number; y: number }) => {
    if (zoomRef.current <= MIN_ZOOM) {
      panRef.current = { x: 0, y: 0 };
      setPan({ x: 0, y: 0 });
      return;
    }

    const limit = 120 * zoomRef.current;
    const nextPan = {
      x: clamp(value.x, -limit, limit),
      y: clamp(value.y, -limit, limit),
    };
    panRef.current = nextPan;
    setPan(nextPan);
  }, []);

  const resetView = useCallback(() => {
    updateZoom(MIN_ZOOM);
    updatePan({ x: 0, y: 0 });
    revealControls();
  }, [revealControls, updatePan, updateZoom]);

  useEffect(() => {
    setZoom(1);
    zoomRef.current = 1;
    setPan({ x: 0, y: 0 });
    panRef.current = { x: 0, y: 0 };
    setShowControls(false);
    setShowHint(true);
    hintOpacity.setValue(1);
    setDisplayLoaded(false);
    setHighResLoaded(false);
    setDisplayFailed(false);
  }, [artwork.id, frame.id, hintOpacity]);

  useEffect(() => {
    const timer = setTimeout(() => {
      hideHint();
    }, 3600);
    return () => clearTimeout(timer);
  }, [hideHint]);

  useEffect(() => {
    Image.prefetch(artwork.images.displayUrl);
  }, [artwork.images.displayUrl]);

  useEffect(() => {
    if (!showFullRes) return;
    Image.prefetch(artwork.images.fullUrl);
  }, [artwork.images.fullUrl, showFullRes]);

  useEffect(() => {
    return () => clearControlsTimer();
  }, [clearControlsTimer]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: (event) => event.nativeEvent.touches.length > 1,
        onStartShouldSetPanResponderCapture: () => false,
        onMoveShouldSetPanResponder: (_event, gestureState) =>
          Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2,
        onPanResponderGrant: (event: GestureResponderEvent) => {
          const touches = event.nativeEvent.touches;
          gestureRef.current = {
            startDistance: getTouchDistance(touches),
            startZoom: zoomRef.current,
            startPan: panRef.current,
          };
        },
        onPanResponderMove: (
          event: GestureResponderEvent,
          gestureState: PanResponderGestureState
        ) => {
          const touches = event.nativeEvent.touches;
          markInteraction();
          if (touches.length >= 2) {
            const nextZoom =
              gestureRef.current.startZoom *
              (getTouchDistance(touches) / gestureRef.current.startDistance);
            updateZoom(nextZoom);
            return;
          }

          if (zoomRef.current <= MIN_ZOOM) return;

          updatePan({
            x: gestureRef.current.startPan.x + gestureState.dx,
            y: gestureRef.current.startPan.y + gestureState.dy,
          });
        },
      }),
    [markInteraction, updatePan, updateZoom]
  );

  const preferredMaxWidth =
    frame.shape.startsWith('landscape') ? 560 : frame.artMask === 'rect' ? 520 : 500;
  const maxWidth = Math.min(width - 32, preferredMaxWidth);
  const maxHeight = height * 0.48;
  let frameWidth = maxWidth;
  let frameHeight = frameWidth / frame.outerAspectRatio;
  if (frameHeight > maxHeight) {
    frameHeight = maxHeight;
    frameWidth = frameHeight * frame.outerAspectRatio;
  }

  const transformStyle = {
    transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale: zoom }],
  } as const;

  const loadingVisible = !displayLoaded && !displayFailed;
  const hardFailure = displayFailed;
  const artworkVisible = displayLoaded || highResLoaded || hardFailure;

  if (isGeneratedFrame(frame)) {
    const preferredMaxWidth =
      frame.shape === 'landscape-16x9' ? Math.min(width - 32, 620) : Math.min(width - 32, 600);
    const maxHeight = height * 0.46;
    let generatedWidth = preferredMaxWidth;
    let generatedHeight = generatedWidth / frame.outerAspectRatio;
    if (generatedHeight > maxHeight) {
      generatedHeight = maxHeight;
      generatedWidth = generatedHeight * frame.outerAspectRatio;
    }

    return (
      <View style={[styles.viewer, { height }]}>
        <View style={styles.viewerWallGlow} />

        <GeneratedFrameShell
          frame={frame}
          style={[styles.stageShell, { width: generatedWidth, height: generatedHeight }]}
        >
          <View style={styles.generatedArtWindow} {...panResponder.panHandlers}>
            {!displayFailed && (
              <ArtworkLayer
                uri={artwork.images.displayUrl}
                transformStyle={transformStyle}
                opacity={displayLoaded && !(showFullRes && highResLoaded) ? 1 : 0.01}
                resizeMode={resizeMode}
                onLoad={() => setDisplayLoaded(true)}
                onError={() => setDisplayFailed(true)}
              />
            )}
            {showFullRes ? (
              <ArtworkLayer
                uri={artwork.images.fullUrl}
                transformStyle={transformStyle}
                opacity={highResLoaded ? 1 : 0.01}
                resizeMode={resizeMode}
                onLoad={() => setHighResLoaded(true)}
              />
            ) : null}
          </View>
        </GeneratedFrameShell>

        {artworkVisible && showHint ? (
          <Animated.View style={[styles.pinchHint, { opacity: hintOpacity }]}>
            <Text style={styles.pinchHintText}>Pinch to look closer</Text>
          </Animated.View>
        ) : null}

        {loadingVisible ? (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingCard}>
              <Text style={styles.loadingTitle}>{artwork.title}</Text>
              <Text style={styles.loadingMeta}>
                {artwork.artist} · {artwork.objectDate}
              </Text>
            </View>
          </View>
        ) : null}

        {hardFailure ? (
          <View style={styles.fallbackArtwork}>
            <Text style={styles.fallbackTitle}>{artwork.title}</Text>
            <Text style={styles.loadingMeta}>{artwork.artist}</Text>
          </View>
        ) : null}

        {artworkVisible ? (
          <View style={styles.zoomLauncherWrap}>
            <Pressable
              style={({ pressed }) => [styles.zoomLauncher, pressed && styles.zoomLauncherPressed]}
              onPress={() => {
                markInteraction();
                setShowControls((current) => !current);
              }}
            >
              <Text style={styles.zoomLauncherText}>Zoom</Text>
            </Pressable>
          </View>
        ) : null}

        {artworkVisible && showControls ? (
          <View style={styles.zoomControls}>
            <Pressable
              style={({ pressed }) => [styles.zoomButton, pressed && styles.zoomButtonPressed]}
              onPress={() => {
                markInteraction();
                updateZoom(zoom + 0.35);
              }}
            >
              <Text style={styles.zoomButtonText}>+</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.zoomButton, pressed && styles.zoomButtonPressed]}
              onPress={() => {
                markInteraction();
                updateZoom(zoom - 0.35);
              }}
            >
              <Text style={styles.zoomButtonText}>-</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.zoomResetButton, pressed && styles.zoomButtonPressed]}
              onPress={resetView}
            >
              <Text style={styles.zoomResetText}>Return</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    );
  }

  return (
    <View style={[styles.viewer, { height }]}>
      <View style={styles.viewerWallGlow} />

      <View style={[styles.stageShell, { width: frameWidth, height: frameHeight }]}>
        {frame.assets?.shadow ? <Image source={frame.assets.shadow} style={styles.assetFill} /> : null}

        <View
          style={[styles.artWindow, windowStyleFromFrame(frame), maskStyle]}
          {...panResponder.panHandlers}
        >
          {!displayFailed && (
            <ArtworkLayer
              uri={artwork.images.displayUrl}
              transformStyle={transformStyle}
              opacity={displayLoaded && !(showFullRes && highResLoaded) ? 1 : 0.01}
              resizeMode={resizeMode}
              onLoad={() => setDisplayLoaded(true)}
              onError={() => setDisplayFailed(true)}
            />
          )}
          {showFullRes && (
            <ArtworkLayer
              uri={artwork.images.fullUrl}
              transformStyle={transformStyle}
              opacity={highResLoaded ? 1 : 0.01}
              resizeMode={resizeMode}
              onLoad={() => setHighResLoaded(true)}
            />
          )}
        </View>

        {frame.assets?.overlay ? <Image source={frame.assets.overlay} style={styles.assetFill} /> : null}
      </View>

      {artworkVisible && showHint ? (
        <Animated.View style={[styles.pinchHint, { opacity: hintOpacity }]}>
          <Text style={styles.pinchHintText}>Pinch to look closer</Text>
        </Animated.View>
      ) : null}

      {loadingVisible ? (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <Text style={styles.loadingTitle}>{artwork.title}</Text>
            <Text style={styles.loadingMeta}>
              {artwork.artist} · {artwork.objectDate}
            </Text>
          </View>
        </View>
      ) : null}

      {hardFailure ? (
        <View style={styles.fallbackArtwork}>
          <Text style={styles.fallbackTitle}>{artwork.title}</Text>
          <Text style={styles.loadingMeta}>{artwork.artist}</Text>
        </View>
      ) : null}

      {artworkVisible ? (
        <View style={styles.zoomLauncherWrap}>
          <Pressable
            style={({ pressed }) => [
              styles.zoomLauncher,
              pressed && styles.zoomLauncherPressed,
            ]}
            onPress={() => {
              markInteraction();
              setShowControls((current) => !current);
            }}
          >
            <Text style={styles.zoomLauncherText}>Zoom</Text>
          </Pressable>
        </View>
      ) : null}

      {artworkVisible && showControls ? (
        <View style={styles.zoomControls}>
          <Pressable
            style={({ pressed }) => [styles.zoomButton, pressed && styles.zoomButtonPressed]}
            onPress={() => {
              markInteraction();
              updateZoom(zoom + 0.35);
            }}
          >
            <Text style={styles.zoomButtonText}>+</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.zoomButton, pressed && styles.zoomButtonPressed]}
            onPress={() => {
              markInteraction();
              updateZoom(zoom - 0.35);
            }}
          >
            <Text style={styles.zoomButtonText}>-</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.zoomResetButton, pressed && styles.zoomButtonPressed]}
            onPress={resetView}
          >
            <Text style={styles.zoomResetText}>Return</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  viewer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    paddingTop: 80,
  },
  viewerWallGlow: {
    position: 'absolute',
    top: '18%',
    width: '68%',
    height: '46%',
    borderRadius: 28,
    backgroundColor: COLORS.wallGlow,
    shadowColor: COLORS.black,
    shadowOpacity: 0.22,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 0 },
  },
  stageShell: {
    position: 'relative',
  },
  generatedShell: {
    position: 'relative',
    borderWidth: 1.5,
    shadowOpacity: 0.22,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  generatedTint: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.32,
  },
  generatedBevel: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
  },
  generatedMatLayer: {
    flex: 1,
    borderWidth: 1,
  },
  generatedArtWindow: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#0d0b0a',
  },
  staticShell: {
    width: '100%',
    position: 'relative',
  },
  assetFill: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  } as ImageStyle,
  artWindow: {
    position: 'absolute',
    overflow: 'hidden',
  },
  artFill: {
    width: '100%',
    height: '100%',
  },
  artLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  hiddenProbeImage: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  pinchHint: {
    position: 'absolute',
    top: '43%',
    alignSelf: 'center',
    minHeight: 34,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: COLORS.hintBg,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinchHintText: {
    color: COLORS.hintText,
    fontSize: 12,
    fontFamily: FONT_SANS,
    fontWeight: '500',
  },
  zoomLauncherWrap: {
    position: 'absolute',
    right: 16,
    bottom: 18,
  },
  zoomLauncher: {
    minHeight: 34,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: 'rgba(12, 10, 9, 0.44)',
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomLauncherPressed: {
    backgroundColor: 'rgba(12, 10, 9, 0.66)',
  },
  zoomLauncherText: {
    color: COLORS.textDim,
    fontSize: 11,
    fontFamily: FONT_SANS,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  zoomControls: {
    position: 'absolute',
    right: 16,
    bottom: 60,
    gap: 8,
    alignItems: 'flex-end',
  },
  zoomButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(12, 10, 9, 0.72)',
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomButtonPressed: {
    backgroundColor: 'rgba(12, 10, 9, 0.9)',
  },
  zoomButtonText: {
    color: '#faf7f2',
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '700',
  },
  zoomResetButton: {
    minHeight: 34,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: 'rgba(12, 10, 9, 0.72)',
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomResetText: {
    color: COLORS.textDim,
    fontSize: 12,
    fontFamily: FONT_SANS,
    fontWeight: '600',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  loadingCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    backgroundColor: 'rgba(23, 19, 17, 0.9)',
    paddingHorizontal: 22,
    paddingVertical: 24,
    alignItems: 'center',
  },
  loadingTitle: {
    color: '#faf7f2',
    fontSize: 30,
    lineHeight: 34,
    fontFamily: 'Instrument Serif, Georgia, "Times New Roman", serif',
    textAlign: 'center',
    marginBottom: 6,
  },
  loadingMeta: {
    color: COLORS.textDim,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: FONT_SANS,
    textAlign: 'center',
  },
  fallbackArtwork: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#171311',
  },
  fallbackTitle: {
    color: '#faf7f2',
    fontSize: 34,
    lineHeight: 38,
    fontFamily: 'Instrument Serif, Georgia, "Times New Roman", serif',
    textAlign: 'center',
    marginBottom: 6,
  },
});
