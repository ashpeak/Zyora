import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { StripeProvider } from '@stripe/stripe-react-native';
import { EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY } from '../config';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {

  return (
    <StripeProvider
      publishableKey={EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""}
      merchantIdentifier="merchant.com.zyora"
    >
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
      <Toast />
    </StripeProvider>
  );
}
