import { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { router, Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as ImageManipulator from 'expo-image-manipulator';
import { useCreatePostStore, AspectRatio } from '@/stores';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PREVIEW_SIZE = SCREEN_WIDTH - 48;
const MIN_SCALE = 1;
const MAX_SCALE = 4;

const ASPECT_RATIOS: { value: AspectRatio; label: string; ratio: number }[] = [
  { value: '1:1', label: '1:1', ratio: 1 },
  { value: '4:5', label: '4:5', ratio: 4 / 5 },
  { value: '9:16', label: '9:16', ratio: 9 / 16 },
];

export default function MediaEditorScreen() {
  const insets = useSafeAreaInsets();
  const {
    mediaUri,
    mediaType,
    aspectRatio,
    setAspectRatio,
    setCroppedUri,
  } = useCreatePostStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  // Gesture state for zoom and pan
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  // Bounds for clamping (computed from React state, used in worklets)
  const imageWidth = useSharedValue(PREVIEW_SIZE);
  const imageHeight = useSharedValue(PREVIEW_SIZE);
  const frameWidth = useSharedValue(PREVIEW_SIZE);
  const frameHeight = useSharedValue(PREVIEW_SIZE);

  // Store final transform values for crop calculation
  const finalTransformRef = useRef({ scale: 1, translateX: 0, translateY: 0 });

  // Video player for video preview
  const videoSource = mediaType === 'video' ? mediaUri : null;
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
  });

  // Get image dimensions on load
  useEffect(() => {
    if (!mediaUri) {
      router.back();
      return;
    }
    if (mediaType === 'image') {
      Image.getSize(mediaUri, (width, height) => {
        setImageDimensions({ width, height });
      });
    }
  }, [mediaUri, mediaType]);

  // Reset zoom/pan when aspect ratio changes
  useEffect(() => {
    scale.value = withSpring(1);
    savedScale.value = 1;
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
    finalTransformRef.current = { scale: 1, translateX: 0, translateY: 0 };
  }, [aspectRatio, scale, savedScale, translateX, translateY, savedTranslateX, savedTranslateY]);

  // Update shared values for bounds when dimensions change
  useEffect(() => {
    if (!imageDimensions) return;

    const selectedRatio = ASPECT_RATIOS.find((r) => r.value === aspectRatio);
    if (!selectedRatio) return;

    const ratio = selectedRatio.ratio;
    let fWidth: number, fHeight: number;
    if (ratio <= 1) {
      fWidth = PREVIEW_SIZE * ratio;
      fHeight = PREVIEW_SIZE;
    } else {
      fWidth = PREVIEW_SIZE;
      fHeight = PREVIEW_SIZE / ratio;
    }

    frameWidth.value = fWidth;
    frameHeight.value = fHeight;

    const imgRatio = imageDimensions.width / imageDimensions.height;
    const frameRatio = fWidth / fHeight;

    if (imgRatio > frameRatio) {
      imageHeight.value = fHeight;
      imageWidth.value = fHeight * imgRatio;
    } else {
      imageWidth.value = fWidth;
      imageHeight.value = fWidth / imgRatio;
    }
  }, [imageDimensions, aspectRatio, frameWidth, frameHeight, imageWidth, imageHeight]);

  const getPreviewDimensions = useCallback(() => {
    const selectedRatio = ASPECT_RATIOS.find((r) => r.value === aspectRatio);
    if (!selectedRatio) return { width: PREVIEW_SIZE, height: PREVIEW_SIZE };

    const ratio = selectedRatio.ratio;
    if (ratio <= 1) {
      return { width: PREVIEW_SIZE * ratio, height: PREVIEW_SIZE };
    } else {
      return { width: PREVIEW_SIZE, height: PREVIEW_SIZE / ratio };
    }
  }, [aspectRatio]);

  // Calculate how the image should be sized to fill the frame (cover mode)
  const getImageDisplaySize = useCallback(() => {
    if (!imageDimensions) return { width: PREVIEW_SIZE, height: PREVIEW_SIZE };

    const previewDims = getPreviewDimensions();
    const imgRatio = imageDimensions.width / imageDimensions.height;
    const frameRatio = previewDims.width / previewDims.height;

    // Scale image to cover the frame (similar to cover mode)
    if (imgRatio > frameRatio) {
      // Image is wider - fit by height
      const displayHeight = previewDims.height;
      const displayWidth = displayHeight * imgRatio;
      return { width: displayWidth, height: displayHeight };
    } else {
      // Image is taller - fit by width
      const displayWidth = previewDims.width;
      const displayHeight = displayWidth / imgRatio;
      return { width: displayWidth, height: displayHeight };
    }
  }, [imageDimensions, getPreviewDimensions]);

  const updateFinalTransform = useCallback(
    (s: number, tx: number, ty: number) => {
      finalTransformRef.current = { scale: s, translateX: tx, translateY: ty };
    },
    []
  );

  // Pinch gesture for zooming
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      'worklet';
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, savedScale.value * e.scale));
      scale.value = newScale;

      // Clamp translation when scale changes using shared values
      const scaledW = imageWidth.value * newScale;
      const scaledH = imageHeight.value * newScale;
      const maxX = Math.max(0, (scaledW - frameWidth.value) / 2);
      const maxY = Math.max(0, (scaledH - frameHeight.value) / 2);
      translateX.value = Math.max(-maxX, Math.min(maxX, translateX.value));
      translateY.value = Math.max(-maxY, Math.min(maxY, translateY.value));
    })
    .onEnd(() => {
      'worklet';
      savedScale.value = scale.value;
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
      runOnJS(updateFinalTransform)(scale.value, translateX.value, translateY.value);
    });

  // Pan gesture for moving
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      'worklet';
      const newX = savedTranslateX.value + e.translationX;
      const newY = savedTranslateY.value + e.translationY;

      // Clamp using shared values
      const scaledW = imageWidth.value * scale.value;
      const scaledH = imageHeight.value * scale.value;
      const maxX = Math.max(0, (scaledW - frameWidth.value) / 2);
      const maxY = Math.max(0, (scaledH - frameHeight.value) / 2);
      translateX.value = Math.max(-maxX, Math.min(maxX, newX));
      translateY.value = Math.max(-maxY, Math.min(maxY, newY));
    })
    .onEnd(() => {
      'worklet';
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
      runOnJS(updateFinalTransform)(scale.value, translateX.value, translateY.value);
    });

  // Double tap to reset zoom
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      'worklet';
      scale.value = withSpring(1);
      savedScale.value = 1;
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      savedTranslateX.value = 0;
      savedTranslateY.value = 0;
      runOnJS(updateFinalTransform)(1, 0, 0);
    });

  const composedGestures = Gesture.Simultaneous(
    pinchGesture,
    Gesture.Race(doubleTapGesture, panGesture)
  );

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const applyCropWithTransform = useCallback(async () => {
    if (!mediaUri || mediaType !== 'image' || !imageDimensions) return null;

    const selectedRatio = ASPECT_RATIOS.find((r) => r.value === aspectRatio);
    if (!selectedRatio) return null;

    const { width: imgWidth, height: imgHeight } = imageDimensions;
    const targetRatio = selectedRatio.ratio;
    const previewDims = getPreviewDimensions();
    const imageDisplaySize = getImageDisplaySize();

    const { scale: s, translateX: tx, translateY: ty } = finalTransformRef.current;

    // Calculate the ratio of actual image pixels to displayed pixels
    const pixelRatioX = imgWidth / imageDisplaySize.width;
    const pixelRatioY = imgHeight / imageDisplaySize.height;

    // Frame position relative to scaled image center
    const frameLeft = -previewDims.width / 2 - tx;
    const frameTop = -previewDims.height / 2 - ty;

    // Convert to unscaled image display coordinates
    const unscaledLeft = frameLeft / s;
    const unscaledTop = frameTop / s;
    const unscaledWidth = previewDims.width / s;
    const unscaledHeight = previewDims.height / s;

    // Convert to actual image pixel coordinates (relative to image center)
    const imgCenterX = imgWidth / 2;
    const imgCenterY = imgHeight / 2;

    let cropX = imgCenterX + unscaledLeft * pixelRatioX;
    let cropY = imgCenterY + unscaledTop * pixelRatioY;
    let cropWidth = unscaledWidth * pixelRatioX;
    let cropHeight = unscaledHeight * pixelRatioY;

    // Ensure crop stays within image bounds
    cropX = Math.max(0, Math.min(imgWidth - 1, cropX));
    cropY = Math.max(0, Math.min(imgHeight - 1, cropY));
    cropWidth = Math.min(cropWidth, imgWidth - cropX);
    cropHeight = Math.min(cropHeight, imgHeight - cropY);

    // Ensure minimum size
    cropWidth = Math.max(10, cropWidth);
    cropHeight = Math.max(10, cropHeight);

    // Adjust to maintain aspect ratio
    const currentCropRatio = cropWidth / cropHeight;
    if (Math.abs(currentCropRatio - targetRatio) > 0.01) {
      if (currentCropRatio > targetRatio) {
        cropWidth = cropHeight * targetRatio;
      } else {
        cropHeight = cropWidth / targetRatio;
      }
    }

    try {
      const manipulated = await ImageManipulator.manipulateAsync(
        mediaUri,
        [
          {
            crop: {
              originX: Math.round(cropX),
              originY: Math.round(cropY),
              width: Math.round(cropWidth),
              height: Math.round(cropHeight),
            },
          },
        ],
        { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
      );

      return manipulated.uri;
    } catch (err) {
      console.error('Error cropping image:', err);
      return null;
    }
  }, [mediaUri, mediaType, imageDimensions, aspectRatio, getPreviewDimensions, getImageDisplaySize]);

  const handleNext = async () => {
    if (!mediaUri) return;

    setIsProcessing(true);
    try {
      if (mediaType === 'image') {
        const croppedUri = await applyCropWithTransform();
        if (croppedUri) {
          setCroppedUri(croppedUri);
        }
      }
      router.push('/(create)/details' as Href);
    } catch (err) {
      console.error('Error processing media:', err);
      Alert.alert('Error', 'Failed to process media. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const previewDimensions = getPreviewDimensions();
  const imageDisplaySize = getImageDisplaySize();

  if (!mediaUri) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 20 }]}>
      {/* Media Preview */}
      <View style={styles.previewContainer}>
        <View
          style={[
            styles.previewWrapper,
            {
              width: previewDimensions.width,
              height: previewDimensions.height,
            },
          ]}
        >
          {isProcessing && (
            <View style={styles.processingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}
          {mediaType === 'video' && player ? (
            <VideoView
              player={player}
              style={styles.preview}
              contentFit="cover"
              nativeControls
            />
          ) : mediaType === 'image' && imageDimensions ? (
            <GestureDetector gesture={composedGestures}>
              <Animated.View style={styles.gestureContainer}>
                <Animated.Image
                  source={{ uri: mediaUri }}
                  style={[
                    {
                      width: imageDisplaySize.width,
                      height: imageDisplaySize.height,
                    },
                    animatedImageStyle,
                  ]}
                  resizeMode="cover"
                />
              </Animated.View>
            </GestureDetector>
          ) : null}
        </View>
        {mediaType === 'image' && (
          <Text style={styles.zoomHint}>Pinch to zoom, drag to pan, double-tap to reset</Text>
        )}
      </View>

      {/* Aspect Ratio Selector (only for images) */}
      {mediaType === 'image' && (
        <View style={styles.ratioSection}>
          <Text style={styles.sectionLabel}>Aspect Ratio</Text>
          <View style={styles.ratioContainer}>
            {ASPECT_RATIOS.map((ratio) => (
              <Pressable
                key={ratio.value}
                style={[
                  styles.ratioButton,
                  aspectRatio === ratio.value && styles.ratioButtonSelected,
                ]}
                onPress={() => setAspectRatio(ratio.value)}
                disabled={isProcessing}
              >
                <View
                  style={[
                    styles.ratioIcon,
                    {
                      width: ratio.ratio <= 1 ? 24 * ratio.ratio : 24,
                      height: ratio.ratio <= 1 ? 24 : 24 / ratio.ratio,
                    },
                    aspectRatio === ratio.value && styles.ratioIconSelected,
                  ]}
                />
                <Text
                  style={[
                    styles.ratioLabel,
                    aspectRatio === ratio.value && styles.ratioLabelSelected,
                  ]}
                >
                  {ratio.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* Video info */}
      {mediaType === 'video' && (
        <View style={styles.videoInfo}>
          <FontAwesome name="video-camera" size={16} color="#666" />
          <Text style={styles.videoInfoText}>Video posts use original dimensions</Text>
        </View>
      )}

      {/* Next Button */}
      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.nextButton,
            pressed && styles.nextButtonPressed,
            isProcessing && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.nextButtonText}>Next</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  previewWrapper: {
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  gestureContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  zoomHint: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  ratioSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  ratioContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  ratioButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    minWidth: 80,
  },
  ratioButtonSelected: {
    backgroundColor: '#e8f5e9',
  },
  ratioIcon: {
    backgroundColor: '#ccc',
    borderRadius: 2,
    marginBottom: 8,
  },
  ratioIconSelected: {
    backgroundColor: '#4CAF50',
  },
  ratioLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  ratioLabelSelected: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  videoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 8,
  },
  videoInfoText: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  nextButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  nextButtonDisabled: {
    opacity: 0.7,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
