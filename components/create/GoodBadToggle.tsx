import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { PostType } from '@/types';

interface GoodBadToggleProps {
  value: PostType | null;
  onChange: (value: PostType) => void;
  disabled?: boolean;
}

export function GoodBadToggle({ value, onChange, disabled }: GoodBadToggleProps) {
  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.option,
          styles.goodOption,
          value === 'good' && styles.goodOptionSelected,
          pressed && !disabled && styles.optionPressed,
          disabled && styles.optionDisabled,
        ]}
        onPress={() => onChange('good')}
        disabled={disabled}
      >
        <Text style={styles.emoji}>☀️</Text>
        <Text
          style={[
            styles.label,
            value === 'good' && styles.goodLabelSelected,
          ]}
        >
          Good Baby
        </Text>
        <Text style={styles.description}>Being adorable & wholesome</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.option,
          styles.badOption,
          value === 'bad' && styles.badOptionSelected,
          pressed && !disabled && styles.optionPressed,
          disabled && styles.optionDisabled,
        ]}
        onPress={() => onChange('bad')}
        disabled={disabled}
      >
        <Text style={styles.emoji}>😈</Text>
        <Text
          style={[
            styles.label,
            value === 'bad' && styles.badLabelSelected,
          ]}
        >
          Bad Baby
        </Text>
        <Text style={styles.description}>Being mischievous & naughty</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
  },
  optionPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  optionDisabled: {
    opacity: 0.6,
  },
  goodOption: {},
  badOption: {},
  goodOptionSelected: {
    backgroundColor: '#fff9c4',
    borderColor: '#fbc02d',
  },
  badOptionSelected: {
    backgroundColor: '#ffebee',
    borderColor: '#ef5350',
  },
  emoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  goodLabelSelected: {
    color: '#f57f17',
  },
  badLabelSelected: {
    color: '#c62828',
  },
  description: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
