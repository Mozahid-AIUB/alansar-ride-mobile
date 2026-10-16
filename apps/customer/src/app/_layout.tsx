import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { restoreSession } from '@alansar/auth';

import { useSession } from '@/hooks/useSession';
import { setUpApi } from '@/services/api';
import { secureStorage } from '@/services/storage';

setUpApi();

export default function RootLayout() {
  const state = useSession();

  useEffect(() => {
    void restoreSession(secureStorage);
  }, []);

  // A beat while the saved session is read, so a signed-in user never sees Welcome flash.
  if (state.status === 'restoring') return null;
  const signedIn = state.status === 'signedIn';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        {/* Flipping these guards on sign-in / sign-out redirects automatically. */}
        <Stack.Protected guard={signedIn}>
          <Stack.Screen name="home" />
        </Stack.Protected>
        <Stack.Protected guard={!signedIn}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </GestureHandlerRootView>
  );
}
