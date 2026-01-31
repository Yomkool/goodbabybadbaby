import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useCreatePostStore, useAuthStore } from '@/stores';
import { GoodBadToggle, PetSelector, TagSelector, AddPetModal } from '@/components/create';
import type { Pet } from '@/types';

export default function PostDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { pets } = useAuthStore();
  const {
    mediaUri,
    selectedPetId,
    postType,
    selectedTags,
    error,
    setPet,
    setPostType,
    addTag,
    removeTag,
    setError,
  } = useCreatePostStore();

  const [showAddPetModal, setShowAddPetModal] = useState(false);

  useEffect(() => {
    if (!mediaUri) {
      router.back();
      return;
    }
    // Auto-select first pet if only one
    if (pets.length === 1 && !selectedPetId) {
      setPet(pets[0].id);
    }
  }, [mediaUri, pets, selectedPetId, setPet]);

  const handleAddPet = () => {
    setShowAddPetModal(true);
  };

  const handlePetAdded = (pet: Pet) => {
    // Auto-select the newly added pet
    setPet(pet.id);
  };

  const validateAndProceed = () => {
    if (!selectedPetId) {
      setError('Please select a pet');
      return;
    }
    if (!postType) {
      setError('Please select Good Baby or Bad Baby');
      return;
    }

    setError(null);
    router.push('/(create)/preview' as Href);
  };

  const canProceed = selectedPetId && postType;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Pet Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Which pet is this?</Text>
          <Text style={styles.sectionSubtitle}>
            Select the star of this post
          </Text>
          <PetSelector
            pets={pets}
            selectedPetId={selectedPetId}
            onSelect={setPet}
            onAddPet={handleAddPet}
          />
        </View>

        {/* Good/Bad Toggle */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Is this a...</Text>
          <Text style={styles.sectionSubtitle}>
            Choose what type of baby moment this is
          </Text>
          <GoodBadToggle value={postType} onChange={setPostType} />
        </View>

        {/* Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Tags (Optional)</Text>
          <Text style={styles.sectionSubtitle}>
            Help others discover your post
          </Text>
          <TagSelector
            selectedTags={selectedTags}
            onAddTag={addTag}
            onRemoveTag={removeTag}
            maxTags={5}
          />
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
            styles.nextButton,
            pressed && styles.nextButtonPressed,
            !canProceed && styles.nextButtonDisabled,
          ]}
          onPress={validateAndProceed}
          disabled={!canProceed}
        >
          <Text style={styles.nextButtonText}>Preview Post</Text>
          <FontAwesome name="arrow-right" size={16} color="#fff" />
        </Pressable>
      </View>

      {/* Add Pet Modal */}
      <AddPetModal
        visible={showAddPetModal}
        onClose={() => setShowAddPetModal(false)}
        onPetAdded={handlePetAdded}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
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
  nextButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    minHeight: 52,
  },
  nextButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
