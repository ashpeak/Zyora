import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { AppColors } from '@/constants/theme'
import Wrapper from '@/components/wrapper'
import { useProductStore } from '@/store/productStore'
import TextInput from '@/components/TextInput'
import { AntDesign, Feather } from '@expo/vector-icons'
import LoadingSpinner from '@/components/LoadingSpinner'
import EmptyState from '@/components/EmptyState'
import { FlatList } from 'react-native'
import ProductCard from '@/components/ProductCard'

const SearchScreen = () => {

  const [searchQuery, setSearchQuery] = useState('')
  const searchTimeOutRef = useRef<Number | null>(null);

  const {
    filteredProducts,
    loading,
    error,
    searchProductsRealTime
  } = useProductStore();

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (searchTimeOutRef.current) {
        clearTimeout(searchTimeOutRef.current as unknown as number);
      }
    }
  }, []);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);

    if (searchTimeOutRef.current) {
      clearTimeout(searchTimeOutRef.current as unknown as number);
    }

    if (searchQuery.length >= 3) {
      // If less than 3 characters, clear the filtered products
      searchTimeOutRef.current = setTimeout(() => {
        searchProductsRealTime(text);
      }, 500); // Debounce time of 500ms
    } else {
      searchProductsRealTime('');
    }
  }

  const handleClearSearch = () => {
    setSearchQuery('');
    searchProductsRealTime('');
  }

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.title}>Search Products</Text>

        <View style={styles.searchRow}>

          <View style={styles.searchContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                value={searchQuery}
                onChangeText={handleSearchChange}
                placeholder="Search for products..."
                inputStyle={styles.searchInputStyle}
                style={styles.searchInput}
              />

              {searchQuery?.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={handleClearSearch}
                >
                  <AntDesign name="close" size={16} color={AppColors.gray[500]} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <TouchableOpacity
            onPress={() => searchProductsRealTime(searchQuery)}
            style={styles.searchButton}>
            <Feather name="search" size={24} color={AppColors.background.primary} />
          </TouchableOpacity>

        </View>
      </View>
    );
  }

  return (
    <Wrapper>
      {renderHeader()}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (filteredProducts.length === 0 && searchQuery ? (
        <EmptyState
          type='search'
          message='No products found matching your search query.'
        />
      ) : (
        <FlatList
          data={searchQuery ? filteredProducts : []}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.productContainer}>
              <ProductCard
                product={item}
                customStyle={{ width: "100%" }}
              />
            </View>
          )}
          contentContainerStyle={styles.productsGrid}
          columnWrapperStyle={styles.columnWrapper}
          ListFooterComponent={<View style={styles.footer}></View>}
          ListEmptyComponent={
            (searchQuery ? (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>Enter at least 3 characters to search.</Text>
              </View>
            ) : null)
          }
        />
      ))}
    </Wrapper>
  )
}

export default SearchScreen

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
  },
  searchContainer: {
    flex: 1,
  },
  inputWrapper: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    marginBottom: 0,
    flex: 1,
  },
  searchInputStyle: {
    backgroundColor: AppColors.background.secondary,
    borderRadius: 8,
    borderColor: "transparent",
    paddingRight: 40, // Make room for the clear button
  },
  clearButton: {
    position: "absolute",
    right: 12,
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: AppColors.gray[200],
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  searchButton: {
    backgroundColor: AppColors.primary[500],
    borderRadius: 8,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  productsGrid: {
    paddingHorizontal: 8,
    paddingTop: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  productContainer: {
    width: "48%",
    marginBottom: 16,
  },
  footer: {
    height: 100,
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: AppColors.error,
    fontSize: 16,
    textAlign: "center",
  },
  emptyStateContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: AppColors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
  },
})