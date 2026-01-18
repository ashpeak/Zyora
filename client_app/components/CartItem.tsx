import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Product } from '@/types'
import { useRouter } from 'expo-router';
import { useCartStore } from '@/store/cartStore';
import { AppColors } from '@/constants/theme';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

interface CartItemProps {
    product: Product;
    quantity?: number;
}

const CartItem = ({ product, quantity }: CartItemProps) => {
    const router = useRouter();
    const { updateItemQuantity, removeItem } = useCartStore();

    const handleRemove = () => {
        Toast.show({
            type: 'success',
            text1: 'Removed from Cart',
            text2: `${product.title} has been removed from your cart.`,
            position: 'top',
            visibilityTime: 2000,
        });
        removeItem(product.id);
    }

    const decreaseQuantity = () => {
        if (quantity && quantity > 1) {
            updateItemQuantity(product.id, quantity - 1);
        } else {
            Toast.show({
                type: 'info',
                text1: 'Minimum Quantity Reached',
                text2: `You must have at least 1 item in your cart.`,
                position: 'top',
                visibilityTime: 2000,
            });
        }
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.imageContainer} onPress={() => router.push(`/product/${product.id}`)}>
                <Image source={{ uri: product.image }} style={styles.image} resizeMode='contain' />
            </TouchableOpacity>
            <View style={styles.details}>
                <Text style={styles.title} numberOfLines={2}>{product?.title}</Text>
                <Text style={styles.price}>${(product.price * quantity!).toFixed(2)}</Text>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity style={styles.quantityButton} onPress={decreaseQuantity}>
                        <AntDesign
                            name='minus'
                            size={16}
                            color={AppColors.text.primary}
                        />
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{quantity}</Text>
                    <TouchableOpacity style={styles.quantityButton} onPress={() => updateItemQuantity(product.id, quantity! + 1)}>
                        <AntDesign
                            name='plus'
                            size={16}
                            color={AppColors.text.primary}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
                        <FontAwesome
                            name='trash-o'
                            size={16}
                            color={AppColors.error}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default CartItem

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: 16,
        backgroundColor: AppColors.background.primary,
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
        borderWidth: 1,
        borderColor: AppColors.primary[200],
    },
    imageContainer: {
        width: 80,
        height: 80,
        backgroundColor: AppColors.background.secondary,
        borderRadius: 8,
        overflow: "hidden",
        marginRight: 16,
    },
    image: {
        width: "100%",
        height: "100%",
    },
    details: {
        flex: 1,
        justifyContent: "space-between",
    },
    title: {
        fontSize: 16,
        fontWeight: "500",
        color: AppColors.text.primary,
        marginBottom: 4,
    },

    price: {
        fontSize: 16,
        fontWeight: "600",
        color: AppColors.primary[600],
        marginBottom: 8,
    },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    quantityButton: {
        width: 28,
        height: 28,
        borderRadius: 4,
        backgroundColor: AppColors.background.secondary,
        alignItems: "center",
        justifyContent: "center",
    },
    quantity: {
        fontSize: 14,
        fontWeight: "500",
        color: AppColors.text.primary,
        paddingHorizontal: 12,
    },
    removeButton: {
        marginLeft: "auto",
        width: 28,
        height: 28,
        borderRadius: 4,
        backgroundColor: AppColors.background.secondary,
        alignItems: "center",
        justifyContent: "center",
    },
})