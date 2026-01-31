import { useState, useEffect, useCallback } from 'react';
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PREVIEW_SIZE = SCREEN_WIDTH - 48;

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
    croppedUri,
  } = useCreatePostStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  // Video player for video preview
  const videoSource = mediaType === 'video' ? (previewUri || mediaUri) : null;
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
  });

  useEffect(() => {
    if (!mediaUri) {
      router.back();
      return;
    }
    // Initialize preview with original media
    setPreviewUri(mediaUri);
  }, [mediaUri]);

  const applyAspectRatio = useCallback(async () => {
    if (!mediaUri || mediaType !== 'image') return;

    setIsProcessing(true);
    try {
      // Get image dimensions
      const imageInfo = await new Promise<{ width: number; height: number }>((resolve) => {
        Image.getSize(mediaUri, (width, height) => {
          resolve({ width, height });
        });
      });

      const selectedRatio = ASPECT_RATIOS.find((r) => r.value === aspectRatio);
      if (!selectedRatio) return;

      const { width: imgWidth, height: imgHeight } = imageInfo;
      const targetRatio = selectedRatio.ratio;

      // Calculate crop dimensions to match target aspect ratio
      let cropWidth: number;
      let cropHeight: number;
      let cropX: number;
      let cropY: number;

      const currentRatio = imgWidth / imgHeight;

      if (currentRatio > targetRatio) {
        // Image is wider than target - crop width
        cropHeight = imgHeight;
        cropWidth = imgHeight * targetRatio;
        cropX = (imgWidth - cropWidth) / 2;
        cropY = 0;
      } else {
        // Image is taller than target - crop height
        cropWidth = imgWidth;
        cropHeight = imgWidth / targetRatio;
        cropX = 0;
        cropY = (imgHeight - cropHeight) / 2;
      }

      // Apply crop
      const manipulated = await ImageManipulator.manipulateAsync(
        mediaUri,
        [
          {
            crop: {
              originX: cropX,
              originY: cropY,
              width: cropWidth,
              height: cropHeight,
            },
          },
        ],
        { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
      );

      setPreviewUri(manipulated.uri);
      setCroppedUri(manipulated.uri);
    } catch (err) {
      console.error('Error applying aspect ratio:', err);
      Alert.alert('Error', 'Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [mediaUri, mediaType, aspectRatio, setCroppedUri]);

  useEffect(() => {
    // When aspect ratio changes for images, we show the crop preview
    if (mediaType === 'image' && mediaUri) {
      applyAspectRatio();
    }
  }, [aspectRatio, mediaUri, mediaType, applyAspectRatio]);

  const handleNext = async () => {
    if (!mediaUri) return;

    setIsProcessing(true);
    try {
      if (mediaType === 'image' && !croppedUri) {
        // If no crop applied yet, apply it now
        await applyAspectRatio();
      }
      router.push('/(create)/details' as Href);
    } catch (err) {
      console.error('Error processing media:', err);
      Alert.alert('Error', 'Failed to process media. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPreviewDimensions = () => {
    const selectedRatio = ASPECT_RATIOS.find((r) => r.value === aspectRatio);
    if (!selectedRatio) return { width: PREVIEW_SIZE, height: PREVIEW_SIZE };

    const ratio = selectedRatio.ratio;
    if (ratio <= 1) {
      // Portrait or square
      return { width: PREVIEW_SIZE * ratio, height: PREVIEW_SIZE };
    } else {
      // Landscape
      return { width: PREVIEW_SIZE, height: PREVIEW_SIZE / ratio };
    }
  };

  const previewDimensions = getPreviewDimensions();

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
          ) : mediaType === 'image' ? (
            <Image
              source={{ uri: previewUri || mediaUri }}
              style={styles.preview}
              resizeMode="cover"
            />
          ) : null}
        </View>
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
