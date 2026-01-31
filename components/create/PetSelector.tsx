import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import type { Pet } from '@/types';
import { getSpeciesEmoji } from '@/lib/constants/species';

interface PetSelectorProps {
  pets: Pet[];
  selectedPetId: string | null;
  onSelect: (petId: string) => void;
  onAddPet?: () => void;
  disabled?: boolean;
}

export function PetSelector({
  pets,
  selectedPetId,
  onSelect,
  onAddPet,
  disabled,
}: PetSelectorProps) {
  if (pets.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No pets added yet</Text>
        {onAddPet && (
          <Pressable
            style={({ pressed }) => [
              styles.addPetButton,
              pressed && styles.addPetButtonPressed,
            ]}
            onPress={onAddPet}
          >
            <FontAwesome name="plus" size={14} color="#4CAF50" />
            <Text style={styles.addPetButtonText}>Add a Pet</Text>
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {pets.map((pet) => (
        <Pressable
          key={pet.id}
          style={({ pressed }) => [
            styles.petCard,
            selectedPetId === pet.id && styles.petCardSelected,
            pressed && !disabled && styles.petCardPressed,
            disabled && styles.petCardDisabled,
          ]}
          onPress={() => onSelect(pet.id)}
          disabled={disabled}
        >
          {pet.avatar_url ? (
            <Image source={{ uri: pet.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarEmoji}>
                {getSpeciesEmoji(pet.species)}
              </Text>
            </View>
          )}
          <Text
            style={[
              styles.petName,
              selectedPetId === pet.id && styles.petNameSelected,
            ]}
            numberOfLines={1}
          >
            {pet.name}
          </Text>
          {selectedPetId === pet.id && (
            <View style={styles.checkmark}>
              <FontAwesome name="check" size={10} color="#fff" />
            </View>
          )}
        </Pressable>
      ))}

      {onAddPet && (
        <Pressable
          style={({ pressed }) => [
            styles.addPetCard,
            pressed && styles.addPetCardPressed,
          ]}
          onPress={onAddPet}
          disabled={disabled}
        >
          <View style={styles.addPetIcon}>
            <FontAwesome name="plus" size={20} color="#4CAF50" />
          </View>
          <Text style={styles.addPetLabel}>Add Pet</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
    gap: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 12,
  },
  addPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
    backgroundColor: '#fff',
    gap: 8,
  },
  addPetButtonPressed: {
    backgroundColor: '#e8f5e9',
  },
  addPetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  petCard: {
    alignItems: 'center',
    width: 80,
    position: 'relative',
  },
  petCardSelected: {},
  petCardPressed: {
    opacity: 0.8,
  },
  petCardDisabled: {
    opacity: 0.6,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: '#e0e0e0',
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#e0e0e0',
  },
  avatarEmoji: {
    fontSize: 28,
  },
  petName: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
    textAlign: 'center',
  },
  petNameSelected: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  checkmark: {
    position: 'absolute',
    top: 0,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  addPetCard: {
    alignItems: 'center',
    width: 80,
  },
  addPetCardPressed: {
    opacity: 0.7,
  },
  addPetIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#4CAF50',
  },
  addPetLabel: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 6,
    fontWeight: '500',
  },
});
