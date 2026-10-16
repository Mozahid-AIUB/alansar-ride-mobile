import { useEffect } from 'react';
import { Stack } from 'expo-router';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { restoreSession } from '@alansar/auth';

import { useSession } from '@/hooks/useSession';
import { setUpApi } from '@/services/api';
import { secureStorage } from '@/services/storage';

setUpApi();

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

export default function RootLayout() {
  const state = useSession();
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    void restoreSession(secureStorage);
  }, []);

  // Another account must never see the last one's cached rides.
  useEffect(() => {
    if (state.status === 'signedOut') queryClient.clear();
  }, [state.status]);

  // A beat while fonts and the saved session load, so nothing flashes in the wrong font or screen.
  if ((!fontsLoaded && !fontError) || state.status === 'restoring') return null;
  const signedIn = state.status === 'signedIn';

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          {/* Flipping these guards on sign-in / sign-out redirects automatically. */}
          <Stack.Protected guard={signedIn}>
            <Stack.Screen name="(tabs)" />
          </Stack.Protected>
          <Stack.Protected guard={!signedIn}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
          </Stack.Protected>
        </Stack>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
