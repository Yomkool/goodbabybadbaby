import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { router, Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { File } from 'expo-file-system';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';
import type { SpeciesType } from '@/types';

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
const MIN_NAME_LENGTH = 1;

export default function AddPetScreen() {
  const insets = useSafeAreaInsets();
  const { user, addPet, signOut, skipOnboarding } = useAuthStore();

  const [name, setName] = useState('');
  const [species, setSpecies] = useState<SpeciesType | null>(null);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSpeciesEmoji = (speciesType: SpeciesType | null) => {
    if (!speciesType) return '🐾';
    return SPECIES_OPTIONS.find((s) => s.value === speciesType)?.emoji || '🐾';
  };

  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to upload a pet avatar.'
        );
        return;
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets[0]) {
        return;
      }

      const asset = result.assets[0];

      // Validate image type
      const uri = asset.uri.toLowerCase();
      if (!uri.endsWith('.jpg') && !uri.endsWith('.jpeg') && !uri.endsWith('.png') && !uri.endsWith('.webp')) {
        // Check mime type instead since URI might not have extension
        if (asset.mimeType && !['image/jpeg', 'image/png', 'image/webp'].includes(asset.mimeType)) {
          Alert.alert('Invalid Format', 'Please select a JPG, PNG, or WebP image.');
          return;
        }
      }

      setIsUploadingImage(true);

      // Compress and resize image
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
      // Request camera permission
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow camera access to take a photo of your pet.'
        );
        return;
      }

      // Take photo
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets[0]) {
        return;
      }

      setIsUploadingImage(true);

      // Compress and resize image
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
      // Use expo-file-system File class to read as ArrayBuffer (works properly in React Native)
      const file = new File(avatarUri);
      const arrayBuffer = await file.arrayBuffer();

      const fileName = `${petId}-${Date.now()}.jpg`;
      const filePath = `pet-avatars/${fileName}`;

      // Upload to Supabase Storage
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

      // Get public URL
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (err) {
      console.error('Error uploading avatar:', err);
      return null;
    }
  };

  const handleAddPet = async () => {
    setError(null);

    // Validate name
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Please enter your pet\'s name.');
      return;
    }
    if (trimmedName.length < MIN_NAME_LENGTH) {
      setError('Pet name must be at least 1 character.');
      return;
    }
    if (trimmedName.length > MAX_NAME_LENGTH) {
      setError(`Pet name must be ${MAX_NAME_LENGTH} characters or less.`);
      return;
    }

    // Validate species
    if (!species) {
      setError('Please select your pet\'s species.');
      return;
    }

    if (!user) {
      setError('You must be logged in to add a pet.');
      return;
    }

    setIsLoading(true);

    try {
      // First create the pet without avatar
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
        if (insertError.message.includes('network')) {
          setError('Network error. Please check your connection and try again.');
        } else {
          setError('Failed to add pet. Please try again.');
        }
        setIsLoading(false);
        return;
      }

      // Upload avatar if provided
      let avatarUrl: string | null = null;
      if (avatarUri) {
        avatarUrl = await uploadAvatar(data.id);

        // Update pet with avatar URL
        if (avatarUrl) {
          await supabase
            .from('pets')
            .update({ avatar_url: avatarUrl })
            .eq('id', data.id);

          data.avatar_url = avatarUrl;
        }
      }

      // Add pet to local state
      addPet(data);

      // Navigate to main app
      router.replace('/(tabs)' as Href);
    } catch (err) {
      console.error('Error adding pet:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Adding a Pet?',
      'You\'ll need a pet to post content. You can always add one later from your profile.',
      [
        { text: 'Add Pet Now', style: 'cancel' },
        {
          text: 'Skip for Now',
          style: 'destructive',
          onPress: () => {
            skipOnboarding();
            router.replace('/(tabs)' as Href);
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Add Your First Pet</Text>
          <Text style={styles.subtitle}>
            Good Baby Bad Baby is all about sharing your pet's adorable (and mischievous) moments. Let's start by adding your furry, scaly, or feathery friend!
          </Text>
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <Pressable
            style={({ pressed }) => [
              styles.avatarContainer,
              pressed && styles.avatarPressed,
            ]}
            onPress={showImageOptions}
            disabled={isUploadingImage}
          >
            {isUploadingImage ? (
              <ActivityIndicator size="large" color="#4CAF50" />
            ) : avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarEmoji}>{getSpeciesEmoji(species)}</Text>
                <View style={styles.avatarAddBadge}>
                  <FontAwesome name="camera" size={14} color="#fff" />
                </View>
              </View>
            )}
          </Pressable>

          {/* Explicit Add Photo Button */}
          <Pressable
            style={({ pressed }) => [
              styles.addPhotoButton,
              pressed && styles.addPhotoButtonPressed,
            ]}
            onPress={showImageOptions}
            disabled={isUploadingImage}
          >
            <FontAwesome name="camera" size={16} color="#4CAF50" style={{ marginRight: 8 }} />
            <Text style={styles.addPhotoButtonText}>
              {avatarUri ? 'Change Photo' : 'Add Photo'}
            </Text>
          </Pressable>
          <Text style={styles.avatarHint}>(optional)</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Pet Name Input */}
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

          {/* Add Pet Button */}
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
                <FontAwesome name="paw" size={20} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.addButtonText}>Add Pet & Continue</Text>
              </>
            )}
          </Pressable>

          {/* Skip Button */}
          <Pressable
            style={({ pressed }) => [styles.skipButton, pressed && styles.skipButtonPressed]}
            onPress={handleSkip}
            disabled={isLoading}
          >
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </Pressable>
          <Text style={styles.skipHint}>You'll need a pet to post!</Text>
        </View>

        {/* Sign Out Link */}
        <Pressable style={styles.signOutLink} onPress={signOut}>
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarPressed: {
    opacity: 0.8,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarEmoji: {
    fontSize: 50,
  },
  avatarAddBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
    backgroundColor: '#fff',
  },
  addPhotoButtonPressed: {
    backgroundColor: '#e8f5e9',
  },
  addPhotoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  avatarHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 24,
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
    paddingVertical: 16,
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
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 12,
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
    fontSize: 28,
    marginBottom: 4,
  },
  speciesLabel: {
    fontSize: 11,
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
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: 52,
  },
  addButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  addButtonDisabled: {
    opacity: 0.7,
  },
  buttonIcon: {
    marginRight: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 12,
  },
  skipButtonPressed: {
    opacity: 0.7,
  },
  skipButtonText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  skipHint: {
    fontSize: 12,
    color: '#ccc',
    textAlign: 'center',
    marginTop: 4,
  },
  signOutLink: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 16,
  },
  signOutText: {
    fontSize: 14,
    color: '#999',
  },
});
