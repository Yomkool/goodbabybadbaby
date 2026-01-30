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
} from 'react-native';
import { router, Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
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

export default function AddPetScreen() {
  const insets = useSafeAreaInsets();
  const { user, addPet, signOut } = useAuthStore();

  const [name, setName] = useState('');
  const [species, setSpecies] = useState<SpeciesType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddPet = async () => {
    setError(null);

    // Validate
    if (!name.trim()) {
      setError('Please enter your pet\'s name.');
      return;
    }
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
      const { data, error: insertError } = await supabase
        .from('pets')
        .insert({
          user_id: user.id,
          name: name.trim(),
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
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>🐾</Text>
          </View>
          <Text style={styles.title}>Add Your First Pet</Text>
          <Text style={styles.subtitle}>
            Tell us about your furry (or scaly, or feathery) friend!
          </Text>
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
                  setName(text);
                  setError(null);
                }}
                autoCapitalize="words"
                autoCorrect={false}
              />
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
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoEmoji: {
    fontSize: 40,
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
    lineHeight: 24,
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
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  input: {
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
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
    paddingHorizontal: 8,
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
    fontSize: 12,
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
