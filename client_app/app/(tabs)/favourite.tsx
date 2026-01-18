import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useFavouriteStore } from '@/store/favouriteStore'
import HomeHeader from '@/components/HomeHeader';
import Wrapper from '@/components/wrapper';
import { AppColors } from '@/constants/theme';
import { FlatList } from 'react-native';
import ProductCard from '@/components/ProductCard';
import EmptyState from '@/components/EmptyState';
import { useRouter } from 'expo-router';

const favouriteScreen = () => {
  const router = useRouter();
  const { favoriteItems, resetFavorite } = useFavouriteStore();

  const navigateToProducts = () => {
    router.push('/(tabs)/shop');
  }

  return (
    <View style={{ flex: 1 }}>
      <HomeHeader />
      <Wrapper customStyle={{ paddingTop: 10 }}>
        {favoriteItems?.length > 0 ? (
          <>
            <View style={styles.headerView}>
              <View>
                <Text style={styles.title}>Favourite product list</Text>
                <Text style={styles.itemCount}>{favoriteItems.length}</Text>
              </View>
              <View>
                <TouchableOpacity onPress={resetFavorite}>
                  <Text style={styles.resetText}>Reset Favorites</Text>
                </TouchableOpacity>
              </View>
            </View>

            <FlatList
              data={favoriteItems}
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
              ListFooterComponent={<View style={styles.footer} />}
            />
          </>
        ) : (
          <EmptyState
            type='favorites'
            message="You haven&apos;t added any favorite products yet."
            actionLabel='Start Shopping'
            onAction={navigateToProducts}
          />
        )}
      </Wrapper>
    </View>
  )
}

export default favouriteScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
  },
  headerView: {
    paddingBottom: 5,
    backgroundColor: AppColors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[200],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  resetText: {
    color: AppColors.error,
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: AppColors.text.primary,
  },
  itemCount: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: AppColors.text.secondary,
    marginTop: 2,
  },
  productsGrid: {
    paddingTop: 10,
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
})