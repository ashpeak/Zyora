import { StyleSheet, StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import React from 'react'
import { AppColors } from '@/constants/theme';
import Logo from './Logo';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFavouriteStore } from '@/store/favouriteStore';
import { useCartStore } from '@/store/cartStore';

const HomeHeader = ({customStyle} : {customStyle?: StyleProp<ViewStyle>}) => {
    const router = useRouter();
    const { favoriteItems, } = useFavouriteStore();
    const { items } = useCartStore();
    return (
        <View style={[styles.container, styles.header, { paddingTop: useSafeAreaInsets().top + 16 }, customStyle]}>
            <Logo />

            <View style={styles.iconContainer}>
                <TouchableOpacity style={styles.searchButton} onPress={() => router.push('/(tabs)/search')}>
                    <Feather name='search' size={20} color={AppColors.primary[700]} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.searchButton} onPress={() => router.push('/(tabs)/favourite')}>
                    <MaterialCommunityIcons name='heart-outline' size={20} color={AppColors.primary[700]} />
                    <View style={styles.itemsView}>
                        <Text style={styles.itemsText}>{favoriteItems?.length ?? 0}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.searchButton} onPress={() => router.push('/(tabs)/cart')}>
                    <MaterialCommunityIcons name='cart-outline' size={20} color={AppColors.primary[700]} />
                    <View style={styles.itemsView}>
                        <Text style={styles.itemsText}>{items?.length ?? 0}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default HomeHeader

const styles = StyleSheet.create({
    container: {
        backgroundColor: AppColors.background.primary
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: AppColors.gray[300],
        paddingBottom: 5,
        paddingHorizontal: 20,
    },

    itemsView: {
        position: "absolute",
        top: - 5,
        right: - 5,
        borderRadius: 50,
        width: 16,
        height: 16,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: AppColors.primary[500],
        backgroundColor: AppColors.background.primary,
    },

    iconContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
    },

    searchButton: {
        backgroundColor: AppColors.primary[50],
        borderRadius: 5,
        width: 35,
        height: 35,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 8,
        borderWidth: 1,
        borderColor: AppColors.primary[500],
        position: "relative",
    },
    itemsText: {
        fontSize: 10,
        color: AppColors.accent[500],
        fontWeight: 800,
    },

})