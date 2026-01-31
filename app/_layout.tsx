import { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments, Href } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { useAuthStore } from '@/stores/authStore';
import LoadingScreen from '@/components/LoadingScreen';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(auth)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const { initialize, status } = useAuthStore();

  // Initialize auth on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && status !== 'loading') {
      SplashScreen.hideAsync();
    }
  }, [loaded, status]);

  // Show loading screen while fonts load or auth state is being determined
  if (!loaded || status === 'loading') {
    return <LoadingScreen message="Starting up..." />;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const { status, hasCompletedOnboarding } = useAuthStore();

  useEffect(() => {
    // Cast to string since Expo Router types may not be updated yet
    const firstSegment = segments[0] as string;
    const inAuthGroup = firstSegment === '(auth)';
    const inOnboardingGroup = firstSegment === '(onboarding)';

    if (status === 'unauthenticated') {
      // Not logged in -> go to auth screens
      if (!inAuthGroup) {
        router.replace('/(auth)/welcome' as Href);
      }
    } else if (status === 'authenticated') {
      if (!hasCompletedOnboarding) {
        // Logged in but hasn't completed onboarding -> go to onboarding
        if (!inOnboardingGroup) {
          router.replace('/(onboarding)/add-pet' as Href);
        }
      } else {
        // Logged in and completed onboarding -> go to main app
        if (inAuthGroup || inOnboardingGroup) {
          router.replace('/(tabs)' as Href);
        }
      }
    }
  }, [status, hasCompletedOnboarding, segments, router]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(create)"
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
