import React from 'react';
import { StatusBar } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { useAppTheme } from '@hooks/useAppTheme';
import { Router } from '@routes';

const queryClient = new QueryClient();

function AppContent() {
  const { dark } = useAppTheme();

  return (
    <>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
      <Router />
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <AppContent />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
