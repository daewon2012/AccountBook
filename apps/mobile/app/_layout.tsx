import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { retry: false } } }));
  return <SafeAreaProvider><QueryClientProvider client={queryClient}><Stack><Stack.Screen name="(app)" options={{ headerShown: false }} /></Stack></QueryClientProvider></SafeAreaProvider>;
}
