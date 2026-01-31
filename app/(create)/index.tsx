import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router, Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useCreatePostStore } from '@/stores';

const MAX_VIDEO_DURATION = 15; // seconds

export default function MediaPickerScreen() {
  const insets = useSafeAreaInsets();
  const { setMedia, reset } = useCreatePostStore();
  const [isLoading, setIsLoading] = useState(false);

  const validateAndSetMedia = async (asset: ImagePicker.ImagePickerAsset) => {
    const isVideo = asset.type === 'video';

    // Validate video duration
    if (isVideo && asset.duration) {
      const durationInSeconds = asset.duration / 1000;
      if (durationInSeconds > MAX_VIDEO_DURATION) {
        Alert.alert(
          'Video Too Long',
          `Please select a video that is ${MAX_VIDEO_DURATION} seconds or less.`
        );
        return false;
      }
    }

    // Validate image format
    if (!isVideo) {
      const uri = asset.uri.toLowerCase();
      const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.heic'];
      const hasValidExtension = validExtensions.some((ext) => uri.endsWith(ext));

      if (!hasValidExtension && asset.mimeType) {
        const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
        if (!validMimeTypes.includes(asset.mimeType)) {
          Alert.alert('Invalid Format', 'Please select a JPG, PNG, WebP, or HEIC image.');
          return false;
        }
      }
    }

    setMedia(asset.uri, isVideo ? 'video' : 'image');
    return true;
  };

  const pickFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to select media.'
        );
        return;
      }

      setIsLoading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: false,
        quality: 1,
        videoMaxDuration: MAX_VIDEO_DURATION,
      });

      if (result.canceled || !result.assets[0]) {
        setIsLoading(false);
        return;
      }

      const success = await validateAndSetMedia(result.assets[0]);
      setIsLoading(false);

      if (success) {
        router.push('/(create)/editor' as Href);
      }
    } catch (err) {
      console.error('Error picking media:', err);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to select media. Please try again.');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow camera access to take a photo or video.'
        );
        return;
      }

      setIsLoading(true);

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: false,
        quality: 1,
        videoMaxDuration: MAX_VIDEO_DURATION,
      });

      if (result.canceled || !result.assets[0]) {
        setIsLoading(false);
        return;
      }

      const success = await validateAndSetMedia(result.assets[0]);
      setIsLoading(false);

      if (success) {
        router.push('/(create)/editor' as Href);
      }
    } catch (err) {
      console.error('Error taking photo:', err);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to capture media. Please try again.');
    }
  };

  const handleCancel = () => {
    reset();
    router.back();
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 20 }]}>
      {/* Header with Cancel */}
      <View style={styles.header}>
        <Pressable onPress={handleCancel} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <FontAwesome name="camera" size={48} color="#4CAF50" />
        </View>
        <Text style={styles.title}>Create a Post</Text>
        <Text style={styles.subtitle}>
          Share your pet's good or bad baby moment
        </Text>

        {/* Media Selection Buttons */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.optionButton,
              pressed && styles.optionButtonPressed,
              isLoading && styles.optionButtonDisabled,
            ]}
            onPress={takePhoto}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#4CAF50" />
            ) : (
              <>
                <View style={styles.optionIcon}>
                  <FontAwesome name="camera" size={24} color="#4CAF50" />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Take Photo or Video</Text>
                  <Text style={styles.optionSubtitle}>Use your camera</Text>
                </View>
                <FontAwesome name="chevron-right" size={16} color="#ccc" />
              </>
            )}
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.optionButton,
              pressed && styles.optionButtonPressed,
              isLoading && styles.optionButtonDisabled,
            ]}
            onPress={pickFromGallery}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#4CAF50" />
            ) : (
              <>
                <View style={styles.optionIcon}>
                  <FontAwesome name="image" size={24} color="#4CAF50" />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Choose from Library</Text>
                  <Text style={styles.optionSubtitle}>Select existing media</Text>
                </View>
                <FontAwesome name="chevron-right" size={16} color="#ccc" />
              </>
            )}
          </Pressable>
        </View>

        {/* Info */}
        <View style={styles.infoContainer}>
          <FontAwesome name="info-circle" size={14} color="#999" />
          <Text style={styles.infoText}>
            Videos must be {MAX_VIDEO_DURATION} seconds or less
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  optionButtonPressed: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4CAF50',
  },
  optionButtonDisabled: {
    opacity: 0.7,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#999',
    marginLeft: 8,
  },
});
