import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { File } from 'expo-file-system';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';
import type { SpeciesType, Pet } from '@/types';

const SPECIES_OPTIONS: { value: SpeciesType; label: string; emoji: string }[] = [
  { value: 'dog', label: 'Dog', emoji: '🐕' },
  { value: 'cat', label: 'Cat', emoji: '🐈' },
  { value: 'bird', label: 'Bird', emoji: '🐦' },
  { value: 'rabbit', label: 'Rabbit', emoji: '🐰' },
  { value: 'hamster', label: 'Hamster', emoji: '🐹' },
  { value: 'guinea_pig', label: 'Guinea Pig', emoji: '🐹' },
  { value: 'fish', label: 'Fish', emoji: '🐟' },
  { value: 'reptile', label: 'Reptile', emoji: '🦎' },
  { value: 'amphibian', label: 'Amphibian', emoji: '🐸' },
  { value: 'horse', label: 'Horse', emoji: '🐴' },
  { value: 'farm', label: 'Farm Animal', emoji: '🐄' },
  { value: 'exotic', label: 'Exotic', emoji: '🦜' },
  { value: 'other', label: 'Other', emoji: '🐾' },
];

const MAX_NAME_LENGTH = 30;

interface AddPetModalProps {
  visible: boolean;
  onClose: () => void;
  onPetAdded: (pet: Pet) => void;
}

export function AddPetModal({ visible, onClose, onPetAdded }: AddPetModalProps) {
  const insets = useSafeAreaInsets();
  const { user, addPet } = useAuthStore();

  const [name, setName] = useState('');
  const [species, setSpecies] = useState<SpeciesType | null>(null);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setName('');
    setSpecies(null);
    setAvatarUri(null);
    setError(null);
  };

  const handleClose = () => {
    if (isLoading) return;
    resetForm();
    onClose();
  };

  const getSpeciesEmoji = (speciesType: SpeciesType | null) => {
    if (!speciesType) return '🐾';
    return SPECIES_OPTIONS.find((s) => s.value === speciesType)?.emoji || '🐾';
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to upload a pet avatar.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets[0]) return;

      const asset = result.assets[0];
      const uri = asset.uri.toLowerCase();
      if (
        !uri.endsWith('.jpg') &&
        !uri.endsWith('.jpeg') &&
        !uri.endsWith('.png') &&
        !uri.endsWith('.webp')
      ) {
        if (
          asset.mimeType &&
          !['image/jpeg', 'image/png', 'image/webp'].includes(asset.mimeType)
        ) {
          Alert.alert('Invalid Format', 'Please select a JPG, PNG, or WebP image.');
          return;
        }
      }

      setIsUploadingImage(true);
      const manipulated = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 400, height: 400 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      setAvatarUri(manipulated.uri);
      setIsUploadingImage(false);
    } catch (err) {
      console.error('Error picking image:', err);
      setIsUploadingImage(false);
      Alert.alert('Error', 'Failed to process image. Please try again.');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow camera access to take a photo of your pet.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets[0]) return;

      setIsUploadingImage(true);
      const manipulated = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 400, height: 400 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      setAvatarUri(manipulated.uri);
      setIsUploadingImage(false);
    } catch (err) {
      console.error('Error taking photo:', err);
      setIsUploadingImage(false);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const showImageOptions = () => {
    Alert.alert('Add Pet Photo', 'Choose how to add a photo', [
      { text: 'Take Photo', onPress: takePhoto },
      { text: 'Choose from Library', onPress: pickImage },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const uploadAvatar = async (petId: string): Promise<string | null> => {
    if (!avatarUri) return null;

    try {
      const file = new File(avatarUri);
      const arrayBuffer = await file.arrayBuffer();
      const fileName = `${petId}-${Date.now()}.jpg`;
      const filePath = `pet-avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      return urlData.publicUrl;
    } catch (err) {
      console.error('Error uploading avatar:', err);
      return null;
    }
  };

  const handleAddPet = async () => {
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Please enter your pet's name.");
      return;
    }
    if (trimmedName.length > MAX_NAME_LENGTH) {
      setError(`Pet name must be ${MAX_NAME_LENGTH} characters or less.`);
      return;
    }
    if (!species) {
      setError("Please select your pet's species.");
      return;
    }
    if (!user) {
      setError('You must be logged in to add a pet.');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: insertError } = await supabase
        .from('pets')
        .insert({
          user_id: user.id,
          name: trimmedName,
          species,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error adding pet:', insertError);
        setError('Failed to add pet. Please try again.');
        setIsLoading(false);
        return;
      }

      // Upload avatar if provided
      let avatarUrl: string | null = null;
      if (avatarUri) {
        avatarUrl = await uploadAvatar(data.id);
        if (avatarUrl) {
          await supabase.from('pets').update({ avatar_url: avatarUrl }).eq('id', data.id);
          data.avatar_url = avatarUrl;
        }
      }

      // Add pet to auth store
      addPet(data);

      // Notify parent and close
      onPetAdded(data);
      resetForm();
      onClose();
    } catch (err) {
      console.error('Error adding pet:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Pressable onPress={handleClose} disabled={isLoading}>
            <Text style={[styles.cancelText, isLoading && styles.textDisabled]}>
              Cancel
            </Text>
          </Pressable>
          <Text style={styles.headerTitle}>Add New Pet</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <Pressable
              style={({ pressed }) => [
                styles.avatarContainer,
                pressed && styles.avatarPressed,
              ]}
              onPress={showImageOptions}
              disabled={isUploadingImage || isLoading}
            >
              {isUploadingImage ? (
                <ActivityIndicator size="large" color="#4CAF50" />
              ) : avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarEmoji}>{getSpeciesEmoji(species)}</Text>
                  <View style={styles.avatarAddBadge}>
                    <FontAwesome name="camera" size={12} color="#fff" />
                  </View>
                </View>
              )}
            </Pressable>
            <Text style={styles.avatarHint}>Tap to add photo (optional)</Text>
          </View>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Pet's Name</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="What's your pet's name?"
                placeholderTextColor="#999"
                value={name}
                onChangeText={(text) => {
                  if (text.length <= MAX_NAME_LENGTH) {
                    setName(text);
                    setError(null);
                  }
                }}
                autoCapitalize="words"
                autoCorrect={false}
                maxLength={MAX_NAME_LENGTH}
                editable={!isLoading}
              />
              <Text style={styles.charCount}>
                {name.length}/{MAX_NAME_LENGTH}
              </Text>
            </View>
          </View>

          {/* Species Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Species</Text>
            <View style={styles.speciesGrid}>
              {SPECIES_OPTIONS.map((option) => (
                <Pressable
                  key={option.value}
                  style={[
                    styles.speciesOption,
                    species === option.value && styles.speciesOptionSelected,
                  ]}
                  onPress={() => {
                    setSpecies(option.value);
                    setError(null);
                  }}
                  disabled={isLoading}
                >
                  <Text style={styles.speciesEmoji}>{option.emoji}</Text>
                  <Text
                    style={[
                      styles.speciesLabel,
                      species === option.value && styles.speciesLabelSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <FontAwesome name="exclamation-circle" size={16} color="#f44336" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.addButtonPressed,
              isLoading && styles.addButtonDisabled,
            ]}
            onPress={handleAddPet}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <FontAwesome name="paw" size={18} color="#fff" />
                <Text style={styles.addButtonText}>Add Pet</Text>
              </>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cancelText: {
    fontSize: 16,
    color: '#666',
  },
  textDisabled: {
    opacity: 0.5,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarPressed: {
    opacity: 0.8,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarEmoji: {
    fontSize: 40,
  },
  avatarAddBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  speciesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  speciesOption: {
    width: '31%',
    margin: '1.16%',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  speciesOptionSelected: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4CAF50',
  },
  speciesEmoji: {
    fontSize: 24,
    marginBottom: 2,
  },
  speciesLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  speciesLabelSelected: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: '#f44336',
    marginLeft: 8,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    minHeight: 52,
  },
  addButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  addButtonDisabled: {
    opacity: 0.7,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
