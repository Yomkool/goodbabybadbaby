import { StyleSheet, Pressable } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useAuthStore } from '@/stores/authStore';

export default function TabOneScreen() {
  const { user, signOut, isLoading } = useAuthStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.label}>Logged in as:</Text>
          <Text style={styles.userName}>{user.display_name}</Text>
        </View>
      )}

      <Pressable
        style={({ pressed }) => [styles.logoutButton, pressed && styles.logoutButtonPressed]}
        onPress={signOut}
        disabled={isLoading}
      >
        <Text style={styles.logoutButtonText}>{isLoading ? 'Signing out...' : 'Sign Out'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 30,
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
  logoutButton: {
    backgroundColor: '#f44336',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
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
