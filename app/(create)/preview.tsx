import { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { router, Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useCreatePostStore, useAuthStore } from '@/stores';
import { supabase } from '@/lib/supabase';
import {
  validateMedia,
  quickCompress,
  processVideoForUpload,
  uploadMediaWithRetry,
  getFileInfo,
  UploadTask,
} from '@/lib/media';
import type { SpeciesType, Database } from '@/types';

type MediaInsert = Database['public']['Tables']['media']['Insert'];
type PostInsert = Database['public']['Tables']['posts']['Insert'];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PREVIEW_SIZE = SCREEN_WIDTH - 48;

const SPECIES_EMOJI: Record<SpeciesType, string> = {
  dog: '🐕',
  cat: '🐈',
  bird: '🐦',
  rabbit: '🐰',
  hamster: '🐹',
  guinea_pig: '🐹',
  fish: '🐟',
  reptile: '🦎',
  amphibian: '🐸',
  horse: '🐴',
  farm: '🐄',
  exotic: '🦜',
  other: '🐾',
};

export default function PostPreviewScreen() {
  const insets = useSafeAreaInsets();
  const { pets, user } = useAuthStore();
  const {
    mediaUri,
    mediaType,
    croppedUri,
    selectedPetId,
    postType,
    selectedTags,
    isUploading,
    error,
    setIsUploading,
    setError,
    reset,
  } = useCreatePostStore();

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [videoDuration, setVideoDuration] = useState<number | undefined>();
  const uploadTaskRef = useRef<UploadTask | null>(null);

  const selectedPet = pets.find((p) => p.id === selectedPetId);
  const displayUri = croppedUri || mediaUri;

  // Video player for video preview
  const player = useVideoPlayer(
    mediaType === 'video' ? displayUri : null,
    (player) => {
      player.loop = true;
      player.play();
    }
  );

  // Get video duration from player
  useEffect(() => {
    if (player && mediaType === 'video') {
      const checkDuration = () => {
        if (player.duration && player.duration > 0) {
          setVideoDuration(player.duration * 1000); // Convert to milliseconds
        }
      };
      // Check immediately and after a short delay (player may need time to load)
      checkDuration();
      const timeout = setTimeout(checkDuration, 500);
      return () => clearTimeout(timeout);
    }
  }, [player, mediaType]);

  useEffect(() => {
    if (!mediaUri || !selectedPetId || !postType) {
      router.back();
    }
  }, [mediaUri, selectedPetId, postType]);

  const createPost = async () => {
    if (!user || !selectedPetId || !postType) {
      setError('Missing required information');
      return;
    }

    const uri = croppedUri || mediaUri;
    if (!uri || !mediaType) {
      setError('No media selected');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Step 1: Validate media
      setUploadStatus('Validating...');
      const validation = await validateMedia(
        uri,
        mediaType,
        videoDuration ? videoDuration / 1000 : undefined
      );
      if (!validation.valid) {
        setError(validation.error || 'Invalid media');
        setIsUploading(false);
        return;
      }
      setUploadProgress(10);

      // Step 2: Process media (compress image or generate video thumbnail)
      let processedUri = uri;
      let thumbnailUrl: string | undefined;
      let fileSize: number | undefined;

      if (mediaType === 'image') {
        setUploadStatus('Compressing image...');
        const compressed = await quickCompress(uri, 0.8);
        processedUri = compressed.uri;
        // Get compressed file size
        const fileInfo = await getFileInfo(processedUri);
        fileSize = fileInfo?.size;
        setUploadProgress(30);
      } else if (mediaType === 'video') {
        setUploadStatus('Generating thumbnail...');
        const videoResult = await processVideoForUpload(uri, videoDuration);

        // Get video file size (from original, since we don't compress video yet)
        const fileInfo = await getFileInfo(uri);
        fileSize = fileInfo?.size;

        // Upload thumbnail first
        setUploadStatus('Uploading thumbnail...');
        const thumbUpload = await uploadMediaWithRetry(
          videoResult.thumbnailUri,
          user.id,
          'image',
          {
            bucket: 'posts',
            folder: 'thumbnails',
            onProgress: (p) => setUploadProgress(30 + p * 0.15),
          }
        );
        thumbnailUrl = thumbUpload.publicUrl;
        setUploadProgress(45);
      }

      // Step 3: Upload main media
      setUploadStatus('Uploading media...');
      const uploadResult = await uploadMediaWithRetry(
        processedUri,
        user.id,
        mediaType,
        {
          bucket: 'posts',
          onProgress: (p) => setUploadProgress(45 + p * 0.45),
        }
      );
      setUploadProgress(90);

      // Step 4: Create media record
      setUploadStatus('Saving media...');
      const mediaData: MediaInsert = {
        user_id: user.id,
        type: mediaType,
        original_url: uploadResult.publicUrl,
        file_size: fileSize,
        thumbnail_url: mediaType === 'video' ? thumbnailUrl : undefined,
        duration:
          mediaType === 'video' && videoDuration
            ? Math.round(videoDuration / 1000)
            : undefined,
      };

      const { data: mediaRecord, error: mediaError } = await supabase
        .from('media')
        .insert(mediaData)
        .select('id')
        .single();

      if (mediaError || !mediaRecord) {
        console.error('Media insert error:', mediaError);
        setError('Failed to save media. Please try again.');
        setIsUploading(false);
        return;
      }

      // Step 5: Create post record
      setUploadStatus('Creating post...');
      const postData: PostInsert = {
        user_id: user.id,
        pet_id: selectedPetId,
        media_id: mediaRecord.id,
        type: postType,
        tags: selectedTags,
      };

      const { error: insertError } = await supabase.from('posts').insert(postData);

      if (insertError) {
        console.error('Insert error:', insertError);
        setError('Failed to create post. Please try again.');
        setIsUploading(false);
        return;
      }

      setUploadProgress(100);

      // Success!
      setIsUploading(false);
      reset();

      Alert.alert('Success!', 'Your post has been shared!', [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)' as Href),
        },
      ]);
    } catch (err) {
      console.error('Error creating post:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage === 'Upload cancelled' ? 'Upload cancelled' : errorMessage);
      setIsUploading(false);
    }
  };

  const cancelUpload = () => {
    if (uploadTaskRef.current) {
      uploadTaskRef.current.cancel();
      uploadTaskRef.current = null;
    }
    setIsUploading(false);
    setError('Upload cancelled');
  };

  const handlePost = () => {
    Alert.alert('Share Post?', 'Are you ready to share this moment with the world?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Share', onPress: createPost },
    ]);
  };

  if (!displayUri || !selectedPet || !postType) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
      >
        {/* Media Preview */}
        <View style={styles.mediaContainer}>
          {mediaType === 'video' && player ? (
            <VideoView
              player={player}
              style={styles.media}
              contentFit="cover"
              nativeControls
            />
          ) : mediaType === 'image' ? (
            <Image
              source={{ uri: displayUri }}
              style={styles.media}
              resizeMode="cover"
            />
          ) : null}
        </View>

        {/* Post Info */}
        <View style={styles.infoSection}>
          {/* Pet */}
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <FontAwesome name="paw" size={16} color="#666" />
              <Text style={styles.infoLabelText}>Pet</Text>
            </View>
            <View style={styles.petInfo}>
              {selectedPet.avatar_url ? (
                <Image
                  source={{ uri: selectedPet.avatar_url }}
                  style={styles.petAvatar}
                />
              ) : (
                <View style={styles.petAvatarPlaceholder}>
                  <Text style={styles.petAvatarEmoji}>
                    {SPECIES_EMOJI[selectedPet.species] || '🐾'}
                  </Text>
                </View>
              )}
              <Text style={styles.petName}>{selectedPet.name}</Text>
            </View>
          </View>

          {/* Type */}
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <FontAwesome name="star" size={16} color="#666" />
              <Text style={styles.infoLabelText}>Type</Text>
            </View>
            <View
              style={[
                styles.typeBadge,
                postType === 'good' ? styles.goodBadge : styles.badBadge,
              ]}
            >
              <Text style={styles.typeEmoji}>
                {postType === 'good' ? '☀️' : '😈'}
              </Text>
              <Text
                style={[
                  styles.typeText,
                  postType === 'good' ? styles.goodText : styles.badText,
                ]}
              >
                {postType === 'good' ? 'Good Baby' : 'Bad Baby'}
              </Text>
            </View>
          </View>

          {/* Tags */}
          {selectedTags.length > 0 && (
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <FontAwesome name="tags" size={16} color="#666" />
                <Text style={styles.infoLabelText}>Tags</Text>
              </View>
              <View style={styles.tagsContainer}>
                {selectedTags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Error */}
        {error && (
          <View style={styles.errorContainer}>
            <FontAwesome name="exclamation-circle" size={16} color="#f44336" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        {isUploading ? (
          <View style={styles.uploadingContainer}>
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <ActivityIndicator size="small" color="#4CAF50" />
                <Text style={styles.uploadingText}>{uploadStatus}</Text>
                <Text style={styles.progressPercent}>{Math.round(uploadProgress)}%</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View
                  style={[styles.progressBar, { width: `${uploadProgress}%` }]}
                />
              </View>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.cancelButtonPressed,
              ]}
              onPress={cancelUpload}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.postButton,
              pressed && styles.postButtonPressed,
            ]}
            onPress={handlePost}
          >
            <FontAwesome name="paper-plane" size={18} color="#fff" />
            <Text style={styles.postButtonText}>Share Post</Text>
          </Pressable>
        )}
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
  scrollContent: {
    paddingTop: 16,
  },
  mediaContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  media: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    borderRadius: 12,
    backgroundColor: '#000',
  },
  infoSection: {
    paddingHorizontal: 24,
    gap: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    gap: 8,
  },
  infoLabelText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  petInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  petAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  petAvatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  petAvatarEmoji: {
    fontSize: 18,
  },
  petName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  goodBadge: {
    backgroundColor: '#fff9c4',
  },
  badBadge: {
    backgroundColor: '#ffebee',
  },
  typeEmoji: {
    fontSize: 16,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  goodText: {
    color: '#f57f17',
  },
  badText: {
    color: '#c62828',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    flex: 1,
  },
  tag: {
    backgroundColor: '#e8f5e9',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 13,
    color: '#4CAF50',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 24,
    marginTop: 16,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: '#f44336',
    marginLeft: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  uploadingContainer: {
    gap: 12,
  },
  progressSection: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  uploadingText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonPressed: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  postButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    minHeight: 52,
  },
  postButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  postButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
