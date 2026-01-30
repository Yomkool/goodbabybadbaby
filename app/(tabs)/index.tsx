import { StyleSheet, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text, View } from '@/components/Themed';
import { useAuthStore } from '@/stores/authStore';

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const { user, pets, signOut, isLoading } = useAuthStore();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
      ]}
    >
      <Text style={styles.title}>Welcome!</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.label}>Logged in as:</Text>
          <Text style={styles.userName}>{user.display_name}</Text>
        </View>
      )}

      {pets.length > 0 && (
        <View style={styles.petsSection}>
          <Text style={styles.sectionTitle}>Your Pets</Text>
          {pets.map((pet) => (
            <View key={pet.id} style={styles.petCard}>
              <Text style={styles.petEmoji}>
                {pet.species === 'dog' ? '🐕' :
                 pet.species === 'cat' ? '🐈' :
                 pet.species === 'bird' ? '🐦' :
                 pet.species === 'rabbit' ? '🐰' :
                 pet.species === 'fish' ? '🐟' :
                 pet.species === 'reptile' ? '🦎' :
                 pet.species === 'horse' ? '🐴' : '🐾'}
              </Text>
              <View style={styles.petInfo}>
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petSpecies}>{pet.species}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>
          Feed will be implemented in upcoming tickets
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.logoutButton, pressed && styles.logoutButtonPressed]}
        onPress={signOut}
        disabled={isLoading}
      >
        <Text style={styles.logoutButtonText}>{isLoading ? 'Signing out...' : 'Sign Out'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
  },
  petsSection: {
    width: '100%',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#666',
  },
  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  petEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  petInfo: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  petName: {
    fontSize: 16,
    fontWeight: '600',
  },
  petSpecies: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  placeholder: {
    backgroundColor: '#f0f0f0',
    padding: 40,
    borderRadius: 12,
    marginVertical: 20,
    width: '100%',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 20,
  },
  logoutButtonPressed: {
    opacity: 0.8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
