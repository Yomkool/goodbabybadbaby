import { useEffect } from 'react';
import { View } from 'react-native';
import { router, Href } from 'expo-router';

// This is a placeholder screen - the actual create flow is in /(create)
// The tab button navigates directly to /(create) via the Link component
export default function CreatePlaceholder() {
  useEffect(() => {
    // If somehow we land on this screen, redirect to the create flow
    router.replace('/(create)' as Href);
  }, []);

  return <View />;
}
