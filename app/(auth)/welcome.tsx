import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Link, router, Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Logo and Branding */}
      <View style={styles.brandingContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>🐾</Text>
        </View>
        <Text style={styles.title}>Good Baby</Text>
        <Text style={styles.titleAlt}>Bad Baby</Text>
        <Text style={styles.subtitle}>Share your pet's best (and worst) moments</Text>
      </View>

      {/* Auth Options */}
      <View style={styles.authContainer}>
        {/* Email Auth Button */}
        <Pressable
          style={({ pressed }) => [styles.button, styles.emailButton, pressed && styles.buttonPressed]}
          onPress={() => router.push('/(auth)/login' as Href)}
        >
          <FontAwesome name="envelope" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Continue with Email</Text>
        </Pressable>

        {/* Social Auth Buttons - Coming in Ticket 045 */}
        <View style={styles.socialButtonsContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.socialButton,
              styles.disabledButton,
              pressed && styles.buttonPressed,
            ]}
            disabled
          >
            <FontAwesome name="apple" size={20} color="#999" style={styles.buttonIcon} />
            <Text style={[styles.buttonText, styles.disabledText]}>Continue with Apple</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.socialButton,
              styles.disabledButton,
              pressed && styles.buttonPressed,
            ]}
            disabled
          >
            <FontAwesome name="google" size={20} color="#999" style={styles.buttonIcon} />
            <Text style={[styles.buttonText, styles.disabledText]}>Continue with Google</Text>
          </Pressable>

          <Text style={styles.comingSoonText}>Social login coming soon!</Text>
        </View>

        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <Link href={'/(auth)/signup' as Href} asChild>
            <Pressable>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </Pressable>
          </Link>
        </View>
      </View>

      {/* Terms */}
      <Text style={styles.termsText}>
        By continuing, you agree to our Terms of Service and Privacy Policy
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  brandingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoEmoji: {
    fontSize: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#4CAF50',
    letterSpacing: -1,
  },
  titleAlt: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FF5722',
    letterSpacing: -1,
    marginTop: -4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
  },
  authContainer: {
    paddingBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  emailButton: {
    backgroundColor: '#333',
  },
  socialButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  disabledText: {
    color: '#999',
  },
  socialButtonsContainer: {
    marginTop: 12,
  },
  comingSoonText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 4,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  signUpText: {
    fontSize: 14,
    color: '#666',
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  termsText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    paddingBottom: 16,
  },
});
