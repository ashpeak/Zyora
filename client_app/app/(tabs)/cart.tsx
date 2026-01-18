import Button from '@/components/Button';
import CartItem from '@/components/CartItem';
import { Title } from '@/components/CustomText';
import EmptyState from '@/components/EmptyState';
import MainLayout from '@/components/MainLayout';
import { AppColors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import axios from 'axios';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { BACKEND_API_URL } from '../../config';

const CartScreen = () => {
  const router = useRouter();
  const { items, clearCart, getTotalPrice } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const getSubtotal = getTotalPrice();
  const shippingCost = getSubtotal > 100 ? 0 : 5.99;
  const totalAmount = getSubtotal + shippingCost;

  const handlePlaceOrder = async () => {
    if (!user) {
      Toast.show({
        type: 'error',
        text1: 'Authentication Required',
        text2: 'Please log in to place an order.',
        position: 'bottom',
        visibilityTime: 2000,
      });
      return;
    }

    try {
      setLoading(true);
      
      const orderDetails = {
        user_email: user.email,
        items: items.map(item => ({
          product_id: item.product.id,
          title: item.product.title,
          price: item.product.price,
          image: item.product.image,
          quantity: item.quantity,
        })),
        total_price: totalAmount,
        payment_status: 'pending',
      }

      // Insert into orders table
      const { data, error } = await supabase.from('orders').insert([orderDetails]).select().single();

      if (error) {
        throw new Error("Failed to save order: " + error.message);
      }

      const payload = {
        price: totalAmount,
        email: user.email,
      }

      const response = await axios.post(`${BACKEND_API_URL}/api/checkout`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });


      const { paymentIntent, ephemeralKey, customer } = response.data;

      if (!paymentIntent || !ephemeralKey || !customer) {
        throw new Error("Invalid payment data received from server.");
      } else {
        // Navigate to Payment Screen with necessary params
        router.push({
          pathname: '/(tabs)/payment',
          params: {
            paymentIntent,
            ephemeralKey,
            customer,
            orderId: data.id,
            total: totalAmount
          },
        })
      }

    } catch (error) {
      console.error("Order placement error:", error);
      Toast.show({
        type: 'error',
        text1: 'Order Failed',
        text2: 'There was an issue placing your order. Please try again.',
        position: 'bottom',
        visibilityTime: 2000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainLayout>
      {items.length > 0 ? (
        <View style={styles.container}>
          <View style={styles.headerView}>
            <View style={styles.header}>
              <Title>Your Cart</Title>
              <Text style={styles.itemCount}>{items?.length} items</Text>
            </View>
            <View>
              <TouchableOpacity onPress={clearCart}>
                <Text style={{ color: AppColors.error }}>Clear Cart</Text>
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={items}
            keyExtractor={item => item.product.id.toString()}
            renderItem={({ item }) => <CartItem product={item.product} quantity={item.quantity} />}
            contentContainerStyle={styles.cartItemsContainer}
            showsVerticalScrollIndicator={false}
          />
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${getSubtotal.toFixed(2)}</Text>
            </View>
            {shippingCost > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValue}>${shippingCost.toFixed(2)}</Text>
              </View>
            )}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.summaryValue}>${totalAmount.toFixed(2)}</Text>
            </View>

            <Button
              onPress={handlePlaceOrder}
              style={styles.checkoutButton}
              title='Place Order'
              fullWidth disabled={!user || loading} />

            {!user && (
              <View style={styles.alertView}>
                <Text style={styles.alertText}>Please log in to place an order.</Text>
                <Link href={'/(tabs)/login'}>
                  <Text style={styles.loginText}>Log In</Text>
                </Link>
              </View>
            )}
          </View>
        </View>
      ) : (
        <EmptyState
          type='cart'
          message="Your cart is empty. Start adding products to your cart."
          actionLabel="Start Shopping"
          onAction={() => router.push('/(tabs)/shop')}
        />
      )}
    </MainLayout>
  )
}

export default CartScreen

const styles = StyleSheet.create({
  headerView: {
    paddingBottom: 5,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[200],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  container: {
    flex: 1,
    position: "relative",
  },
  header: {
    paddingBottom: 16,
    backgroundColor: AppColors.background.primary,
  },
  itemCount: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: AppColors.text.secondary,
    marginTop: 4,
  },
  cartItemsContainer: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  summaryContainer: {
    backgroundColor: AppColors.background.primary,
    paddingVertical: 20,
    // marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: AppColors.gray[200],
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: AppColors.text.secondary,
  },
  summaryValue: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: AppColors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.gray[200],
    marginVertical: 12,
  },
  totalLabel: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: AppColors.text.primary,
  },
  totalValue: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: AppColors.primary[600],
  },
  checkoutButton: {
    marginTop: 16,
  },
  alertView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  alertText: {
    fontWeight: "500",
    textAlign: "center",
    color: AppColors.error,
    marginRight: 3,
  },
  loginText: {
    fontWeight: "700",
    color: AppColors.primary[500],
  },
})