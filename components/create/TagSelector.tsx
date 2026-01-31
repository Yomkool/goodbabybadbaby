import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import type { CuratedTag } from '@/types';

interface TagSelectorProps {
  selectedTags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  maxTags?: number;
  disabled?: boolean;
}

export function TagSelector({
  selectedTags,
  onAddTag,
  onRemoveTag,
  maxTags = 5,
  disabled,
}: TagSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [curatedTags, setCuratedTags] = useState<CuratedTag[]>([]);
  const [filteredTags, setFilteredTags] = useState<CuratedTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCuratedTags();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = curatedTags.filter(
        (tag) =>
          tag.tag.toLowerCase().includes(query) &&
          !selectedTags.includes(tag.tag)
      );
      setFilteredTags(filtered.slice(0, 10));
    } else {
      // Show popular/all tags when no search
      const available = curatedTags.filter(
        (tag) => !selectedTags.includes(tag.tag)
      );
      setFilteredTags(available.slice(0, 10));
    }
  }, [searchQuery, curatedTags, selectedTags]);

  const fetchCuratedTags = async () => {
    try {
      const { data, error } = await supabase
        .from('curated_tags')
        .select('*')
        .order('tag', { ascending: true });

      if (error) {
        console.error('Error fetching tags:', error);
        return;
      }

      setCuratedTags(data || []);
    } catch (err) {
      console.error('Error fetching tags:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTag = (tag: string) => {
    if (selectedTags.length >= maxTags) {
      return;
    }
    onAddTag(tag);
    setSearchQuery('');
  };

  const canAddMore = selectedTags.length < maxTags;

  return (
    <View style={styles.container}>
      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <View style={styles.selectedContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.selectedTags}
          >
            {selectedTags.map((tag) => (
              <View key={tag} style={styles.selectedTag}>
                <Text style={styles.selectedTagText}>{tag}</Text>
                <Pressable
                  onPress={() => onRemoveTag(tag)}
                  disabled={disabled}
                  hitSlop={8}
                >
                  <FontAwesome name="times" size={12} color="#4CAF50" />
                </Pressable>
              </View>
            ))}
          </ScrollView>
          <Text style={styles.tagCount}>
            {selectedTags.length}/{maxTags}
          </Text>
        </View>
      )}

      {/* Search Input */}
      {canAddMore && (
        <View style={styles.searchContainer}>
          <FontAwesome name="search" size={14} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tags..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            editable={!disabled}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <FontAwesome name="times-circle" size={16} color="#ccc" />
            </Pressable>
          )}
        </View>
      )}

      {/* Available Tags */}
      {canAddMore && (
        <View style={styles.availableTags}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#4CAF50" />
          ) : filteredTags.length > 0 ? (
            <View style={styles.tagChips}>
              {filteredTags.map((tag) => (
                <Pressable
                  key={tag.id}
                  style={({ pressed }) => [
                    styles.tagChip,
                    pressed && styles.tagChipPressed,
                  ]}
                  onPress={() => handleSelectTag(tag.tag)}
                  disabled={disabled}
                >
                  <Text style={styles.tagChipText}>{tag.tag}</Text>
                  <FontAwesome name="plus" size={10} color="#666" />
                </Pressable>
              ))}
            </View>
          ) : searchQuery.trim() ? (
            <Text style={styles.noTagsText}>No matching tags found</Text>
          ) : (
            <Text style={styles.noTagsText}>No tags available</Text>
          )}
        </View>
      )}

      {!canAddMore && (
        <Text style={styles.maxTagsText}>Maximum {maxTags} tags selected</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  selectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedTags: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 8,
  },
  selectedTagText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  tagCount: {
    fontSize: 12,
    color: '#999',
    marginLeft: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    paddingVertical: 4,
  },
  availableTags: {
    minHeight: 40,
  },
  tagChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    gap: 6,
  },
  tagChipPressed: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4CAF50',
  },
  tagChipText: {
    fontSize: 13,
    color: '#666',
  },
  noTagsText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 8,
  },
  maxTagsText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
});
