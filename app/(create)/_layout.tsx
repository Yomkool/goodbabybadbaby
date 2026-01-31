import { Stack } from 'expo-router';

export default function CreateLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#fff' },
        headerTitleStyle: { fontWeight: '600', color: '#333' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: '#fff' },
        animation: 'slide_from_right',
        presentation: 'modal',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'New Post',
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="editor"
        options={{
          title: 'Edit',
        }}
      />
      <Stack.Screen
        name="details"
        options={{
          title: 'Details',
        }}
      />
      <Stack.Screen
        name="preview"
        options={{
          title: 'Preview',
        }}
      />
    </Stack>
  );
}
