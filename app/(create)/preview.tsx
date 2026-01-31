import { useEffect, useState } from 'react';
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
import { Video, ResizeMode } from 'expo-av';
import { File } from 'expo-file-system';
import { useCreatePostStore, useAuthStore } from '@/stores';
import { supabase } from '@/lib/supabase';
import type { SpeciesType } from '@/types';

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

  const [uploadProgress, setUploadProgress] = useState<string>('');

  const selectedPet = pets.find((p) => p.id === selectedPetId);

  useEffect(() => {
    if (!mediaUri || !selectedPetId || !postType) {
      router.back();
    }
  }, [mediaUri, selectedPetId, postType]);

  const uploadMedia = async (): Promise<string | null> => {
    const uri = croppedUri || mediaUri;
    if (!uri || !user) return null;

    try {
      setUploadProgress('Uploading media...');

      const file = new File(uri);
      const arrayBuffer = await file.arrayBuffer();

      const extension = mediaType === 'video' ? 'mp4' : 'jpg';
      const contentType = mediaType === 'video' ? 'video/mp4' : 'image/jpeg';
      const fileName = `${user.id}/${Date.now()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from('posts')
        .upload(fileName, arrayBuffer, {
          contentType,
          upsert: false,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }

      const { data: urlData } = supabase.storage.from('posts').getPublicUrl(fileName);
      return urlData.publicUrl;
    } catch (err) {
      console.error('Error uploading media:', err);
      return null;
    }
  };

  const createPost = async () => {
    if (!user || !selectedPetId || !postType) {
      setError('Missing required information');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Upload media
      const mediaUrl = await uploadMedia();
      if (!mediaUrl) {
        setError('Failed to upload media. Please try again.');
        setIsUploading(false);
        return;
      }

      setUploadProgress('Creating post...');

      // Create post record
      const { error: insertError } = await supabase.from('posts').insert({
        user_id: user.id,
        pet_id: selectedPetId,
        media_type: mediaType || 'image',
        media_url: mediaUrl,
        type: postType,
        tags: selectedTags,
      });

      if (insertError) {
        console.error('Insert error:', insertError);
        setError('Failed to create post. Please try again.');
        setIsUploading(false);
        return;
      }

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
      setError('An unexpected error occurred. Please try again.');
      setIsUploading(false);
    }
  };

  const handlePost = () => {
    Alert.alert('Share Post?', 'Are you ready to share this moment with the world?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Share', onPress: createPost },
    ]);
  };

  const displayUri = croppedUri || mediaUri;

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
          {mediaType === 'video' ? (
            <Video
              source={{ uri: displayUri }}
              style={styles.media}
              resizeMode={ResizeMode.COVER}
              shouldPlay
              isLooping
              isMuted={false}
              useNativeControls
            />
          ) : (
            <Image
              source={{ uri: displayUri }}
              style={styles.media}
              resizeMode="cover"
            />
          )}
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
            <ActivityIndicator size="small" color="#4CAF50" />
            <Text style={styles.uploadingText}>{uploadProgress}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  uploadingText: {
    fontSize: 16,
    color: '#666',
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
