import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React, { use } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { AppColors } from '@/constants/theme'
import { useRouter } from 'expo-router';

const Logo = () => {
    const router = useRouter();
    return (
        <TouchableOpacity style={styles.logoView} onPress={() => router.push('/')}>
            <MaterialIcons
                name="shopping-cart"
                size={25}
                color={AppColors.primary[700]}
            />
            <Text style={styles.logoText}>Zyora</Text>
        </TouchableOpacity>
    )
}

export default Logo

const styles = StyleSheet.create({
    logoView: {
        flexDirection: "row",
        alignItems: "center",
    },
    logoText: {
        fontFamily: "Inter-Bold",
        fontSize: 20,
        color: AppColors.primary[700],
        marginLeft: 2,
    }
})