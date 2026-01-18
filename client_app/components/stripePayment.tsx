import { supabase } from '@/lib/supabase';
import { useStripe } from '@stripe/stripe-react-native';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { Alert, StyleSheet } from 'react-native';

type Props = {
    paymentIntent: string;
    ephemeralKey: string;
    customer: string;
    orderId: string;
    userEmail: string;
    onSuccess?: () => void;
}

const StripePayment = ({
    paymentIntent,
    ephemeralKey,
    customer,
    orderId,
    userEmail,
    onSuccess
}: Props) => {

    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const router = useRouter();

    const returnUrl = Linking.createURL('/(tabs)/orders');

    // Initialize Payment Sheet
    const initializePaymentSheet = async () => {
        const { error } = await initPaymentSheet({
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
            merchantDisplayName: 'Zyora Shop',
            returnURL: returnUrl,
        });
        if (error) {
            console.error('Error initializing payment sheet:', error);
        }
    };

    const updatePaymentStatus = async () => {
        console.log(userEmail, orderId);
        try {
            const { data, error } = await supabase
                .from('orders')
                .update({ payment_status: 'success' })
                .eq('id', orderId)
                .eq('user_email', userEmail)
                .select();

            if (error) {
                console.error('Error updating payment status:', error);
                throw new Error('Failed to update payment status: ' + error.message);
            }

            if (!data || data.length === 0) {
                throw new Error('Order not found or you do not have permission to update it');
            }
        } catch (err) {
            console.error('Unexpected error updating payment status:', err);
            throw err;
        }
    }

    const handlePayment = async () => {
        try {
            await initializePaymentSheet();
            const { error: presentError } = await presentPaymentSheet();
            if (presentError) {
                throw new Error("Payment failed: " + presentError.message);
            }

            await updatePaymentStatus();

            Alert.alert('Payment Successful', 'Your payment was processed successfully.', [
                {
                    text: 'OK',
                    onPress: () => {
                        if (onSuccess) {
                            onSuccess();
                        } else {
                            router.push('/(tabs)/orders');
                        }
                    }
                }
            ]);
        } catch (error: any) {
            console.error('Payment error:', error);
            Alert.alert('Payment Error', error?.message || 'An error occurred during payment processing.');
        }
    }

    return { handlePayment };
}

export default StripePayment

const styles = StyleSheet.create({})