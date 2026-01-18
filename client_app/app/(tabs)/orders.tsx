import { Title } from '@/components/CustomText';
import EmptyState from '@/components/EmptyState';
import Loader from '@/components/Loader';
import OrderItem from '@/components/OrderItem';
import Wrapper from '@/components/wrapper';
import { AppColors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';

interface Order {
  id: number;
  total_price: number;
  payment_status: string;
  created_at: string;
  items: {
    product_id: number;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }[];
}

const OrderDetailsModal = ({
  visible,
  order,
  onClose
}: {
  visible: boolean;
  order: Order | null;
  onClose: () => void;
}) => {

  const translateY = useSharedValue(300);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, {
        damping: 20, stiffness: 200
      });
      opacity.value = withTiming(1, { duration: 150 });
    } else {
      translateY.value = withTiming(300, { duration: 100 });
      opacity.value = withTiming(0, { duration: 100 });
    }
  }, [visible]);

  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!order) {
    return null;
  }

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalContent, animatedModalStyle]}>
          <LinearGradient colors={[AppColors.primary[50], AppColors.primary[100]]} style={styles.modalGradient}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Order #${order.id} Details</Text>
              <TouchableOpacity onPress={onClose}>
                <Feather name='x' size={24} color={AppColors.text.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.modalText}>
                Total: ${order?.total_price.toFixed(2)}
              </Text>
              <Text style={styles.modalText}>
                Status: {" "}
                {order.payment_status
                  ===
                  "success"
                  ? "Payment Done"
                  : "Pending"}
              </Text>
              <Text style={styles.modalText}>
                Placed: {new Date(order.created_at).
                  toLocaleDateString()}
              </Text>
              <Text style={styles.modalSectionTitle}>Items: </Text>

              <FlatList
                data={order.items}
                keyExtractor={(item) => item.product_id.toString()}
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
                style={styles.itemList}
                renderItem={({ item }) => (
                  <View style={styles.itemContainer}>
                    <Image
                      source={{ uri: item?.image }}
                      style={styles.itemImage}
                    />

                    <View style={styles.itemDetails}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <Text style={styles.itemText}>
                        Price: ${item.price.toFixed(2)}
                      </Text>
                      <Text style={styles.itemText}>
                        Quantity: {item.quantity}
                      </Text>
                      <Text style={styles.itemText}>
                        Subtotal: ${(item.price * item.quantity).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                )}
              />
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>

          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  )
}

const OrdersScreen = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);


  const fetchOrders = async (isRefreshing = false) => {
    if (!user) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          total_price,
          payment_status,
          created_at,
          items,
          user_email
        `)
        .eq('user_email', user?.email)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error("Error fetching orders: " + error.message);
      }

      setOrders(data || []);

    } catch (error) {
      console.log("Error fetching orders: " + error);
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [user, router])
  );

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
  }

  const handleDeleteOrder = async (orderId: number) => {
    try {
      if (!user) {
        throw new Error("User not logged in");
      }

      // Delete directly - RLS policy handles ownership verification
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId)
        .eq("user_email", user.email);

      if (error) {
        throw new Error("Failed to delete order: " + error?.message);
      }

      // Optimistically update UI - remove from local state instead of refetching
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));

      Toast.show({
        type: 'success',
        text1: 'Order Deleted',
        text2: 'The order has been successfully deleted.',
        position: 'bottom',
        visibilityTime: 2000,
      });

    } catch (error) {
      console.error("Error deleting order: ", error);
      Alert.alert("Error", "Failed to delete order. Please try again.");
    }
  }

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Wrapper>
        <Title>My Orders</Title>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </Wrapper>
    )
  }

  const handleClose = () => {
    setShowModal(false);
    setSelectedOrder(null);
  }

  return (
    <Wrapper>
      <Title>My Orders</Title>
      {orders?.length > 0 ? (
        <FlatList
          data={orders}
          keyExtractor={item => item.id.toString()}
          refreshing={refreshing}
          onRefresh={() => fetchOrders(true)}
          contentContainerStyle={{ marginTop: 10, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <OrderItem
              order={item}
              email={user?.email || ''}
              onDelete={() => handleDeleteOrder(item.id)}
              onViewDetails={() => handleViewDetails(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          type="cart"
          actionLabel="Start Shopping"
          onAction={() => router.push('/(tabs)/shop')}
          message="You have no orders yet." />
      )}

      <OrderDetailsModal
        visible={showModal}
        order={selectedOrder}
        onClose={handleClose}
      />
    </Wrapper>
  )
}

export default OrdersScreen

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: AppColors.error,
    textAlign: "center",
  },
  listContainer: {
    paddingVertical: 16,
    // paddingHorizontal: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "92%",
    maxHeight: "85%",
    borderRadius: 16,
    overflow: "hidden",
  },
  modalGradient: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: AppColors.text.primary,
  },
  modalBody: {
    marginBottom: 16,
    flexShrink: 1,
  },
  modalText: {
    fontFamily: "Inter-Regular",
    fontSize: 15,
    color: AppColors.text.primary,
    marginBottom: 10,
  },
  modalSectionTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 17,
    color: AppColors.text.primary,
    marginTop: 12,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: AppColors.primary[600],
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  closeButtonText: {
    fontFamily: "Inter-Medium",
    color: "#fff",
    fontSize: 15,
  },
  itemContainer: {
    flexDirection: "row",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[100],
    paddingBottom: 12,
    backgroundColor: AppColors.background.primary + "80",
    borderRadius: 8,
    padding: 8,
  },
  itemImage: {
    width: 70,
    height: 70,
    resizeMode: "contain",
    marginRight: 12,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontFamily: "Inter-Medium",
    fontSize: 15,
    color: AppColors.text.primary,
    marginBottom: 6,
  },
  itemText: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: AppColors.text.secondary,
    marginBottom: 4,
  },
  itemList: {
    maxHeight: 320,
  },
})