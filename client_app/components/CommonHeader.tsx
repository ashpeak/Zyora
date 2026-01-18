import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { AppColors } from '@/constants/theme';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface CommonHeaderProps {
    isFav?: boolean;
    showCart?: boolean;
    handleToggleFav?: () => void;
}

const CommonHeader = ({
    isFav = false,
    showCart = false,
    handleToggleFav,
}: CommonHeaderProps) => {
    const router = useRouter();

    const handleBackButton = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.push('/');
        }
    }

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={handleBackButton} style={styles.backButton}>
                <Feather
                    name="arrow-left"
                    size={20}
                    color={AppColors.text.primary}
                />
            </TouchableOpacity>

            <View style={styles.buttonView}>

                <TouchableOpacity
                    style={[styles.favoriteButton]}
                    onPress={handleToggleFav}>
                    <Ionicons
                        name={isFav ? 'heart' : 'heart-outline'}
                        size={22}
                        color={isFav ? AppColors.error : AppColors.text.primary}
                        fill={isFav ? AppColors.error : 'transparent'}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.favoriteButton]}
                    onPress={() => router.push('/(tabs)/cart')}>
                    <Feather
                        name='shopping-cart'
                        size={20}
                        color={AppColors.text.primary}
                    />
                </TouchableOpacity>

            </View>
        </View>
    )
}

export default CommonHeader

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 16,
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: AppColors.background.secondary,
        alignItems: "center",
        justifyContent: "center",
    },
    favoriteButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: AppColors.background.secondary,
        alignItems: "center",
        justifyContent: "center",
    },
    activeFavoriteButton: {
        backgroundColor: AppColors.error,
    },

    buttonView: {
        flexDirection: "row",
        gap: 5
    }
})