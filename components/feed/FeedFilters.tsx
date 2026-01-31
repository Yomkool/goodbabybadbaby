import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import type { FeedType, FeedFilter, SpeciesType } from '@/types';

interface FeedFiltersProps {
  feedType: FeedType;
  filter: FeedFilter;
  species?: SpeciesType;
  onFeedTypeChange: (type: FeedType) => void;
  onFilterChange: (filter: FeedFilter) => void;
  onSpeciesChange: (species: SpeciesType | undefined) => void;
}

const SPECIES: { value: SpeciesType; label: string; emoji: string }[] = [
  { value: 'dog', label: 'Dogs', emoji: '🐕' },
  { value: 'cat', label: 'Cats', emoji: '🐈' },
  { value: 'bird', label: 'Birds', emoji: '🐦' },
  { value: 'rabbit', label: 'Rabbits', emoji: '🐰' },
  { value: 'hamster', label: 'Hamsters', emoji: '🐹' },
  { value: 'guinea_pig', label: 'Guinea Pigs', emoji: '🐹' },
  { value: 'fish', label: 'Fish', emoji: '🐟' },
  { value: 'reptile', label: 'Reptiles', emoji: '🦎' },
  { value: 'horse', label: 'Horses', emoji: '🐴' },
  { value: 'other', label: 'Other', emoji: '🐾' },
];

export function FeedFilters({
  feedType,
  filter,
  species,
  onFeedTypeChange,
  onFilterChange,
  onSpeciesChange,
}: FeedFiltersProps) {
  const [showSpecies, setShowSpecies] = useState(false);
  const selectedSpecies = SPECIES.find((s) => s.value === species);

  return (
    <View style={styles.container}>
      {/* Feed type tabs */}
      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, feedType === 'hot' && styles.tabActive]}
          onPress={() => onFeedTypeChange('hot')}
        >
          <Text style={[styles.tabText, feedType === 'hot' && styles.tabTextActive]}>Hot</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, feedType === 'new' && styles.tabActive]}
          onPress={() => onFeedTypeChange('new')}
        >
          <Text style={[styles.tabText, feedType === 'new' && styles.tabTextActive]}>New</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, feedType === 'following' && styles.tabActive]}
          onPress={() => onFeedTypeChange('following')}
        >
          <Text style={[styles.tabText, feedType === 'following' && styles.tabTextActive]}>Following</Text>
        </Pressable>
      </View>

      {/* Filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
        <Pressable
          style={[styles.chip, filter === 'all' && styles.chipActive]}
          onPress={() => onFilterChange('all')}
        >
          <Text style={[styles.chipText, filter === 'all' && styles.chipTextActive]}>All</Text>
        </Pressable>
        <Pressable
          style={[styles.chip, filter === 'good' && styles.chipGood]}
          onPress={() => onFilterChange('good')}
        >
          <Text style={styles.chipEmoji}>😇</Text>
        </Pressable>
        <Pressable
          style={[styles.chip, filter === 'bad' && styles.chipBad]}
          onPress={() => onFilterChange('bad')}
        >
          <Text style={styles.chipEmoji}>😈</Text>
        </Pressable>
        <Pressable
          style={[styles.chip, species && styles.chipActive]}
          onPress={() => setShowSpecies(true)}
        >
          <Text style={styles.chipEmoji}>{selectedSpecies?.emoji || '🐾'}</Text>
          <FontAwesome name="caret-down" size={10} color="rgba(255,255,255,0.7)" />
        </Pressable>
      </ScrollView>

      {/* Species modal */}
      <Modal visible={showSpecies} transparent animationType="fade" onRequestClose={() => setShowSpecies(false)}>
        <Pressable style={styles.modalBg} onPress={() => setShowSpecies(false)}>
          <View style={styles.modal}>
            <Pressable
              style={[styles.speciesRow, !species && styles.speciesRowActive]}
              onPress={() => { onSpeciesChange(undefined); setShowSpecies(false); }}
            >
              <Text style={styles.speciesEmoji}>🌐</Text>
              <Text style={styles.speciesLabel}>All</Text>
            </Pressable>
            {SPECIES.map((s) => (
              <Pressable
                key={s.value}
                style={[styles.speciesRow, species === s.value && styles.speciesRowActive]}
                onPress={() => { onSpeciesChange(s.value); setShowSpecies(false); }}
              >
                <Text style={styles.speciesEmoji}>{s.emoji}</Text>
                <Text style={styles.speciesLabel}>{s.label}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 4,
    paddingBottom: 6,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 6,
  },
  tab: {
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
  },
  tabText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
  },
  chips: {
    paddingHorizontal: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 3,
    gap: 4,
  },
  chipActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  chipGood: {
    backgroundColor: 'rgba(251,192,45,0.5)',
  },
  chipBad: {
    backgroundColor: 'rgba(239,83,80,0.5)',
  },
  chipText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  chipTextActive: {
    color: '#fff',
  },
  chipEmoji: {
    fontSize: 12,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    width: 200,
    maxHeight: 400,
  },
  speciesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
  },
  speciesRowActive: {
    backgroundColor: '#e8f5e9',
  },
  speciesEmoji: {
    fontSize: 18,
    marginRight: 10,
  },
  speciesLabel: {
    fontSize: 14,
    color: '#000',
  },
});
