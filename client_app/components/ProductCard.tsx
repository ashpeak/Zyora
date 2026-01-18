import { Image, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import React from 'react'
import { Product } from '@/types';
import { AppColors } from '@/constants/theme';
import Button from './Button';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import Rating from './Rating';
import { useCartStore } from '@/store/cartStore';
import { useFavouriteStore } from '@/store/favouriteStore';
import { Ionicons } from '@expo/vector-icons';

interface ProductCardProps {
    product: Product;
    compact?: boolean;
    customStyle?: StyleProp<ViewStyle>;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false, customStyle }) => {
    const { title, price, image, category, rating } = product;
    const router = useRouter();

    const handleProductRoute = () => {
        router.push(`/product/${product.id}`);
    }

    const { addItem } = useCartStore();
    const { isFavorite, toggleFavorite } = useFavouriteStore();
    const isFav = isFavorite(product.id);

    const handleAddToCart = () => {
        addItem(product, 1);
        Toast.show({
            type: 'success',
            text1: 'Added to Cart',
            text2: `${title} has been added to your cart.`,
            visibilityTime: 2000,
        });
    };

    return (
        <TouchableOpacity
            style={[styles.card, compact && styles.compactCard, customStyle]}
            activeOpacity={0.8}
            onPress={handleProductRoute}
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.image} resizeMode="contain" />
                <TouchableOpacity style={styles.favoriteButton}>
                    <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={24} color={isFav ? AppColors.error : AppColors.gray[400]}
                        onPress={() => toggleFavorite(product)}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <Text style={styles.category}>{category}</Text>
                <Text style={styles.title} numberOfLines={compact ? 1 : 2} ellipsizeMode='tail'>{title}</Text>

                <View style={styles.footer}>
                    <Text style={[styles.price, !compact && { marginBottom: 5 }]}>${price.toFixed(2)}</Text>

                    <View style={!compact && { marginBottom: 7 }}>
                        <Rating rating={rating?.rate} count={rating?.count} />
                    </View>

                    {!compact && <Button
                        title="Add to Cart"
                        size="small"
                        variant="outline"
                        onPress={handleAddToCart}
                    />}
                </View>

            </View>
        </TouchableOpacity>
    )
}

export default ProductCard

const styles = StyleSheet.create({
    title: {
        fontSize: 14,
        fontWeight: "500",
        color: AppColors.text.primary,
        marginBottom: 8,
    },
    content: {
        padding: 12,
        backgroundColor: AppColors.background.secondary,
    },
    footer: {
        // flexDirection: "row",
        // alignItems: "center",
        justifyContent: "space-between",
    },
    favoriteButton: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: 20,
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
        borderColor: AppColors.warning,
    },
    price: {
        fontSize: 16,
        fontWeight: "600",
        color: AppColors.primary[600],
    },
    compactCard: {
        width: 150,
        marginRight: 12,
    },
    imageContainer: {
        position: "relative",
        height: 150,
        backgroundColor: AppColors.background.primary,
        padding: 5,
    },
    category: {
        fontSize: 12,
        color: AppColors.text.tertiary,
        textTransform: "capitalize",
        marginBottom: 4,
    },
    card: {
        backgroundColor: AppColors.background.primary,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
        overflow: "hidden",
        width: "48%",
        marginBottom: 16,
        borderWidth: 1,
        borderColor: AppColors.gray[200],
    },
    image: {
        width: "100%",
        height: "100%",
    },
    ratingText: {
        marginBottom: 8,
        textTransform: "capitalize",
        color: AppColors.gray[600],
    }
})