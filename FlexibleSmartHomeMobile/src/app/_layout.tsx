import { Stack } from 'expo-router';

import '../shared/i18n';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/login" options={{ headerShown: false, gestureEnabled: false }} />
    </Stack>
  );
}
