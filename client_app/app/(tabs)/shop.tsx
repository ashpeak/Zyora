import { FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AppColors } from '@/constants/theme';
import Wrapper from '@/components/wrapper';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProductStore } from '@/store/productStore';
import EmptyState from '@/components/EmptyState';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';

const ShopScreen = () => {

    const { category: categoryParam } = useLocalSearchParams<{ category?: string }>();


    const {
        filteredProducts,
        categories,
        selectedCategory,
        loading,
        error,
        fetchProducts,
        fetchCategories,
        setCategory,
        sortProducts,
    } = useProductStore();

    const [products, setProducts] = useState([]);
    const [showSortModal, setShowSortModal] = useState(false);
    const [activeSortOption, setActiveSortOption] = useState<string | null>(null);
    const [isFilterActive, setIsFilterActive] = useState(false);

    const router = useRouter();

    useEffect(() => {
        fetchProducts();
        fetchCategories();

        if (categoryParam) {
            setCategory(categoryParam);
        } else {
            setCategory('All');
        }
    }, [categoryParam]);


    const renderHeader = () => {
        return (
            <View style={styles.header}>
                <Text style={styles.title}>All Products</Text>

                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity style={styles.searchRow} onPress={() => router.push("/(tabs)/search")}>
                        <View style={styles.searchContainer}>
                            <View style={styles.searchInput}>
                                <Text>Search products...</Text>
                            </View>
                        </View>
                        <View style={styles.searchButton}>
                            <Feather name="search" size={20} color="white" />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={[
                        styles.sortOptionView, isFilterActive && styles.activeSortButton,
                    ]}
                        onPress={() => setShowSortModal(true)}
                    >
                        <Feather
                            name='filter'
                            size={20}
                            color={AppColors.text.primary}
                        />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesContainer}
                >
                    <TouchableOpacity
                        style={[styles.categoryButton, selectedCategory === 'All' && styles.selectedCategory]}
                        onPress={() => setCategory(null)}
                    >
                        <Text style={[
                            styles.categoryText,
                            selectedCategory === 'All' && styles.selectedCategoryText
                        ]}>All</Text>
                    </TouchableOpacity>

                    {categories?.map((category) => (
                        <TouchableOpacity
                            key={category}
                            style={[styles.categoryButton, selectedCategory === category && styles.selectedCategory]}
                            onPress={() => setCategory(category)}
                        >
                            <Text
                                style={[
                                    styles.categoryText,
                                    selectedCategory === category && styles.selectedCategoryText
                                ]}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
                        </TouchableOpacity>
                    ))}

                </ScrollView>
            </View>
        );
    };

    const handleSort = (sortBy: 'price-asc' | 'price-desc' | "rating") => {
        sortProducts(sortBy);
        setActiveSortOption(sortBy);
        setShowSortModal(false);
        setIsFilterActive(true);
    };

    return (
        <Wrapper>
            {renderHeader()}
            {loading ? (
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                    <LoadingSpinner fullScreen />
                </View>
            ) : (filteredProducts.length === 0 ? (
                <EmptyState
                    type="search"
                    message="No products found matching your criteria."
                />
            ) : (
                <FlatList
                    data={filteredProducts}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    renderItem={({ item }) => (
                        <View style={styles.productContainer}>
                            <ProductCard product={item} customStyle={{ width: "100%" }} />
                        </View>
                    )}
                    contentContainerStyle={styles.productsGrid}
                    columnWrapperStyle={styles.columnWrapper}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<View style={styles.footer} />}
                />
            ))}

            <Modal
                visible={showSortModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowSortModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Sort By</Text>
                            <TouchableOpacity onPress={() => setShowSortModal(false)}>
                                <AntDesign
                                    name='close'
                                    size={24}
                                    color={AppColors.text.primary}
                                    onPress={() => setShowSortModal(false)}
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.sortOption} onPress={() => handleSort('price-asc')}
                        >
                            <Text style={[
                                styles.sortOptionText,
                                activeSortOption === 'price-asc' && styles.activeSortText
                            ]}>Price: Low to High</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.sortOption}
                            onPress={() => handleSort('price-desc')}
                        >
                            <Text style={[
                                styles.sortOptionText,
                                activeSortOption === 'price-desc' && styles.activeSortText
                            ]}>Price: High to Low</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.sortOption}
                            onPress={() => handleSort('rating')}
                        >
                            <Text style={[
                                styles.sortOptionText,
                                activeSortOption === 'rating' && styles.activeSortText
                            ]}>Highest Rated</Text>
                        </TouchableOpacity>

                        {isFilterActive && (
                            <TouchableOpacity
                                style={[styles.sortOption, { borderBottomWidth: 0 }]}
                                onPress={() => {
                                    // Reset sorting
                                    sortProducts('price-asc');
                                    setActiveSortOption(null);
                                    setIsFilterActive(false);
                                    setShowSortModal(false);
                                }}
                            >
                                <Text style={[styles.sortOptionText, {color: AppColors.error}]}>Clear Filters</Text>
                            </TouchableOpacity>
                        )}

                    </View>
                </View>
            </Modal>

        </Wrapper>
    )
}

export default ShopScreen;

const styles = StyleSheet.create({
    header: {
        paddingBottom: 16,
        backgroundColor: AppColors.background.primary,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.gray[200],
    },
    title: {
        fontFamily: "Inter-Bold",
        fontSize: 24,
        color: AppColors.text.primary,
        marginBottom: 16,
    },
    searchRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        position: "relative",
        flex: 1,
        marginRight: 5,
    },
    searchContainer: {
        flex: 1,
    },
    searchInput: {
        backgroundColor: AppColors.background.secondary,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: AppColors.gray[300],
        color: AppColors.text.primary,
    },
    searchInputStyle: {
        backgroundColor: AppColors.background.secondary,
        borderRadius: 8,
        borderColor: "transparent",
    },
    searchButton: {
        backgroundColor: AppColors.primary[500],
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        width: 45,
        height: 45,
        alignItems: "center",
        justifyContent: "center",
        // marginLeft: 8,
        position: "absolute",
        right: 0,
    },
    sortButton: {
        backgroundColor: AppColors.background.secondary,
        borderRadius: 8,
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 8,
    },
    activeSortButton: {
        borderWidth: 1,
        borderColor: AppColors.error,
    },
    activeSortText: {
        color: AppColors.primary[600],
        fontWeight: "bold"
    },
    categoriesContainer: {
        paddingVertical: 8,
    },
    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: AppColors.background.secondary,
        marginRight: 8,
    },
    selectedCategory: {
        backgroundColor: AppColors.primary[500],
    },
    categoryText: {
        fontFamily: "Inter-Medium",
        fontSize: 14,
        color: AppColors.text.primary,
    },
    selectedCategoryText: {
        color: AppColors.background.primary,
    },
    productsGrid: {
        paddingHorizontal: 5,
        paddingTop: 16,
        paddingBottom: 50,
    },
    columnWrapper: {
        justifyContent: "space-between",
    },
    productContainer: {
        width: "48%",
    },
    footer: {
        height: 100,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "Orgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: AppColors.background.primary,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 24,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    modalTitle: {
        fontFamily: "Inter-SemiBold",
        fontSize: 18,
        color: AppColors.text.primary,
    },
    sortOptionView: {
        borderWidth: 1,
        borderColor: AppColors.gray[200],
        width: 45,
        height: 45,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    sortOption: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.gray[200],
    },
    activeSortOption: {
        backgroundColor: AppColors.background.secondary,
    },
    sortOptionText: {
        fontFamily: "Inter-Regular",
        fontSize: 16,
        color: AppColors.text.primary,
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
    },
})