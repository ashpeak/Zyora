import Button from '@/components/Button'
import StripePayment from '@/components/stripePayment'
import { AppColors } from '@/constants/theme'
import { useAuthStore } from '@/store/authStore'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const getStringParam = (param: string | string[] | undefined): string => {
    return Array.isArray(param) ? param[0] : (param || '');
}

const Payment = () => {
    const router = useRouter();
    const { paymentIntent, ephemeralKey, customer, orderId, total } = useLocalSearchParams();
    const {user} = useAuthStore();
    const totalAmount = parseFloat(getStringParam(total));

    const stripe = StripePayment({
        paymentIntent: getStringParam(paymentIntent),
        ephemeralKey: getStringParam(ephemeralKey),
        customer: getStringParam(customer),
        orderId: getStringParam(orderId),
        userEmail: user?.email || '',
        onSuccess: () => {
            router.push('/(tabs)/orders');
        }
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Complete your payment</Text>
            <Text style={styles.subtitle}>Please confirm your payment details to complete your purchase.</Text>
            <Text style={styles.totalPrice}>Total Amount: ${totalAmount.toFixed(2)}</Text>

            <Button
                title='Complete payment'
                fullWidth
                onPress={stripe.handlePayment}
                style={styles.button}
            />
        </View>
    )
}

export default Payment

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: AppColors.background.primary,
        justifyContent: "center",
    },
    title: {
        fontFamily: "Inter-Bold",
        fontSize: 24,
        color: AppColors.text.primary,
        textAlign: "center",
        marginBottom: 16,
    },
    subtitle: {
        fontFamily: "Inter-Regular",
        fontSize: 16,
        color: AppColors.text.secondary,
        textAlign: "center",
        marginBottom: 32,
    },
    totalPrice: {
        fontFamily: "Inter-Bold",
        fontSize: 20,
        color: AppColors.text.primary,
        textAlign: "center",
        marginBottom: 20,
    },
    button: {
        marginTop: 20,
    },
})