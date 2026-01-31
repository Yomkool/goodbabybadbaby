import type { SpeciesType } from '@/types';

export const SPECIES_EMOJI: Record<SpeciesType, string> = {
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

export const SPECIES_OPTIONS: { value: SpeciesType; label: string; emoji: string }[] = [
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

export function getSpeciesEmoji(species: SpeciesType | string): string {
  return SPECIES_EMOJI[species as SpeciesType] || '🐾';
}
