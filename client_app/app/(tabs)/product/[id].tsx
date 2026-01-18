import { Dimensions, Image, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import CommonHeader from '@/components/CommonHeader';
import { AppColors } from '@/constants/theme';
import Wrapper from '@/components/wrapper';
import { Product } from '@/types';
import { getProductById } from '@/lib/api';
import { ScrollView } from 'react-native';
import LoadingSpinner from '@/components/LoadingSpinner';
import Button from '@/components/Button';
import Rating from '@/components/Rating';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
const { width } = Dimensions.get('window');
import { useCartStore } from '@/store/cartStore';
import { useFavouriteStore } from '@/store/favouriteStore';

const singleProductScreen = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    const { addItem } = useCartStore();
    const { isFavorite, toggleFavorite } = useFavouriteStore();
    const isFav = isFavorite(product?.id || 0);

    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            try {
                const res = await getProductById(Number(id));
                setProduct(res);
            } catch (error) {
                setError('Failed to load product data.');
                console.error('Error fetching product data:', error);
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchProductData();
        }
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            addItem(product, quantity);
        }

        Toast.show({
            type: "success",
            text1: "Product added to cart",
            text2: `${product?.title} has been added to your cart`,
            visibilityTime: 2000,
        });
    };

    if (loading) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <LoadingSpinner />
            </View>
        );
    }

    if (error || !product) {
        return (
            <Wrapper>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={[
                        styles.errorText,
                        { fontSize: 20, fontWeight: 'bold' }
                    ]}>{error || 'Product not found.'}</Text>
                    <Button
                        title="Go Back"
                        onPress={() => router.back()}
                        style={styles.errorButton} />
                </View>
            </Wrapper>
        );
    }

    return (
        <View style={{
            backgroundColor: AppColors.background.primary,
            paddingTop: 30,
            position: 'relative',
        }}>
            <CommonHeader
                isFav={isFav}
                handleToggleFav={() => toggleFavorite(product)}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.imageContainer}>
                    <Image source={{ uri: product?.image }} style={styles.productImage} resizeMode="contain" />
                </View>

                <View style={styles.productInfo}>
                    <Text style={styles.category}>{product?.category.charAt(0).toUpperCase() + product?.category.slice(1)}</Text>
                    <Text style={styles.title}>{product?.title.charAt(0).toUpperCase() + product?.title.slice(1)}</Text>
                    <View style={styles.ratingContainer}>
                        <Rating rating={product?.rating?.rate} count={product?.rating?.count} />
                    </View>

                    <Text style={styles.price}>${product?.price.toFixed(2)}</Text>
                    <View style={styles.divider} />
                    <Text style={styles.descriptionTitle}>Description</Text>
                    <Text style={styles.description}>{product?.description}</Text>
                    <View style={styles.quantityContainer}>
                        <Text style={styles.quantityTitle}>Quantity</Text>
                        <View style={styles.quantityControls}>
                            <TouchableOpacity
                                onPress={() => {
                                    if (quantity > 1) {
                                        setQuantity(prev => prev - 1);
                                    }
                                }}
                                disabled={quantity <= 1}
                                style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
                            >
                                <AntDesign name="minus" size={16} color={AppColors.primary[600]} />
                            </TouchableOpacity>
                            <Text style={styles.quantityValue}>{quantity}</Text>
                            <TouchableOpacity
                                onPress={() => setQuantity(prev => prev + 1)}
                                style={styles.quantityButton}
                            >
                                <AntDesign name="plus" size={16} color={AppColors.primary[600]} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Text style={styles.totalPrice}>Total: ${(product?.price * quantity).toFixed(2)}</Text>
                <Button
                    title="Add to Cart"
                    style={styles.addToCartButton}
                    onPress={handleAddToCart}
                />
            </View>
        </View>
    )
}

export default singleProductScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.background.primary,
    },
    imageContainer: {
        width: width,
        height: width,
        alignItems: "center",
        justifyContent: "center",
        // marginBottom: 16,
    },
    productImage: {
        width: "80%",
        height: "80%",
    },
    productInfo: {
        paddingHorizontal: 24,
        paddingBottom: 120,
        paddingTop: 10,
        backgroundColor: AppColors.background.secondary,
    },
    category: {
        fontFamily: "Inter-Medium",
        fontSize: 14,
        color: AppColors.text.secondary,
        marginBottom: 8,
        textTransform: "capitalize",
    },
    title: {
        fontFamily: "Inter-Bold",
        fontSize: 24,
        color: AppColors.text.primary,
        marginBottom: 8,
    },
    ratingContainer: {
        marginBottom: 16,
    },
    price: {
        fontFamily: "Inter-Bold",
        fontSize: 24,
        color: AppColors.primary[600],
        marginBottom: 16,
    },
    divider: {
        height: 1,
        backgroundColor: AppColors.gray[200],
        marginBottom: 16,
    },
    descriptionTitle: {
        fontFamily: "Inter-SemiBold",
        fontSize: 18,
        color: AppColors.text.primary,
        marginBottom: 8,
    },
    description: {
        fontFamily: "Inter-Regular",
        fontSize: 16,
        color: AppColors.text.secondary,
        lineHeight: 24,
        marginBottom: 24,
    },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 24,
    },
    quantityTitle: {
        fontFamily: "Inter-SemiBold",
        fontSize: 16,
        color: AppColors.text.primary,
    },
    quantityControls: {
        flexDirection: "row",
        alignItems: "center",
    },
    quantityButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: AppColors.background.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    quantityButtonDisabled: {
        backgroundColor: AppColors.gray[50],
    },
    quantityValue: {
        fontFamily: "Inter-Medium",
        fontSize: 16,
        color: AppColors.text.primary,
        paddingHorizontal: 16,
    },
    footer: {
        position: "absolute",
        bottom: 50,
        left: 0,
        right: 0,
        backgroundColor: AppColors.background.primary,
        borderTopWidth: 1,
        borderTopColor: AppColors.gray[200],
        paddingHorizontal: 24,
        paddingVertical: 16,
        paddingBottom: 32,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    totalPrice: {
        fontFamily: "Inter-Bold",
        fontSize: 18,
        color: AppColors.text.primary,
    },
    addToCartButton: {
        width: "50%",
    },
    errorContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    errorText: {
        fontFamily: "Inter-Medium",
        fontSize: 16,
        color: AppColors.error,
        textAlign: "center",
        marginBottom: 16,
    },
    errorButton: {
        marginTop: 8,
    },
})