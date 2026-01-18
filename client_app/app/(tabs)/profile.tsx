import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import Wrapper from '@/components/wrapper';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';
import { AppColors } from '@/constants/theme';
import Button from '@/components/Button';
import { Entypo, Feather, FontAwesome, FontAwesome6, Foundation, MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const ProfileScreen = () => {
    const { user, logout, checkSession, isLoading } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            checkSession();
        }
    }, [user]);

    const menuItems = [
        {
            id: "cart",
            icon: (
                <FontAwesome name='shopping-cart' size={20} color={AppColors.primary[500]} />
            ),
            title: "My Cart",
            onPress: () => router.push('/(tabs)/cart'),
        },
        {
            id: "orders",
            icon: (
                <FontAwesome6 name="box" size={20} color={AppColors.primary[500]} />
            ),
            title: "My Orders",
            onPress: () => router.push('/(tabs)/orders'),
        },
        {
            id: "payment",
            icon: (
                <Foundation name='credit-card' size={23} color={AppColors.primary[500]} />
            ),
            title: "Payment Methods",
            onPress: () => { },
        },
        {
            id: "address",
            icon: (
                <Entypo name='home' size={20} color={AppColors.primary[500]} />
            ),
            title: "Shipping Addresses",
            onPress: () => { },
        },
        {
            id: "settings",
            icon: (
                <FontAwesome name='cog' size={20} color={AppColors.primary[500]} />
            ),
            title: "Settings",
            onPress: () => { },
        }
    ]

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await logout();
                            router.replace('/(tabs)/login');

                            Toast.show({
                                type: 'success',
                                text1: 'Logged out successfully',
                                visibilityTime: 2000,
                            });
                        } catch (error) {
                            console.error("Logout failed:", error);
                            Alert.alert("Error", "Failed to logout. Please try again.");
                        }
                    }
                },
            ]
        )
    }

    return (
        <Wrapper>
            {user ? (
                <View>
                    <View style={styles.header}>
                        <Text style={styles.title}>My Profile</Text>
                    </View>
                    <View style={styles.profileCard}>
                        <View style={styles.avatarContainer}>
                            <Feather name='user' size={40} color={AppColors.gray[400]} />
                        </View>

                        <View style={styles.profileInfo}>
                            <Text style={styles.profileEmail}>{user.email}</Text>
                            <TouchableOpacity>
                                <Text style={styles.editProfileText}>Edit Profile</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.menuContainer}>
                        {
                            menuItems?.map(item => (
                                <TouchableOpacity key={item.id} onPress={item.onPress} style={styles.menuItem}>
                                    <View style={styles.menuItemLeft}>
                                        {item?.icon}
                                        <Text style={styles.menuItemTitle}>{item?.title}</Text>
                                    </View>
                                    <MaterialIcons
                                        name='chevron-right'
                                        size={24}
                                        color={AppColors.gray[400]}
                                    />
                                </TouchableOpacity>
                            ))
                        }
                    </View>

                    <View style={styles.logoutContainer}>
                        <Button
                            title='Logout'
                            style={styles.logoutButton}
                            textStyle={styles.logoutButtonText}
                            onPress={handleLogout}
                            variant='outline'
                            fullWidth
                            disabled={isLoading}
                        />
                    </View>

                </View>
            ) : (
                <View style={styles.container}>
                    <Text style={styles.title}>Welcome!</Text>
                    <Text style={styles.message}>Please log in or sign up to access your profile and enjoy all features.</Text>
                    <View style={styles.buttonContainer}>
                        <Button
                            title='Log in'
                            fullWidth
                            style={styles.loginButton}
                            textStyle={styles.buttonText}
                            onPress={() => router.push('/(tabs)/login')}
                        />
                        <Button
                            title='Sign up'
                            fullWidth
                            variant='outline'
                            style={styles.signupButton}
                            textStyle={styles.signupButtonText}
                            onPress={() => router.push('/(tabs)/signup')}
                        />
                    </View>
                </View>
            )}
        </Wrapper>
    )
}

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.background.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        paddingBottom: 16,
        backgroundColor: AppColors.background.primary
    },
    title: {
        fontFamily: "Inter-Bold",
        fontSize: 24,
        color: AppColors.text.primary,
    },
    profileCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: AppColors.background.primary,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.gray[200],
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: AppColors.gray[200],
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
    },
    profileInfo: {
        flex: 1,
    },
    profileEmail: {
        fontFamily: "Inter-SemiBold",
        fontSize: 16,
        color: AppColors.text.primary,
        marginBottom: 4,
    },
    editProfileText: {
        fontFamily: "Inter-Medium",
        fontSize: 14,
        color: AppColors.primary[500],
    },
    menuContainer: {
        marginTop: 16,
        backgroundColor: AppColors.background.primary,
        borderRadius: 8,
        // marginHorizontal: 16,
        paddingVertical: 8,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        // paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.gray[200],
    },
    menuItemLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    menuItemTitle: {
        fontFamily: "Inter-Medium",
        fontSize: 16,
        color: AppColors.text.primary,
        marginLeft: 12,
    },
    logoutContainer: {
        marginTop: 24,
        // paddingHorizontal: 16,
    },
    logoutButton: {
        backgroundColor: "transparent",
        borderColor: AppColors.error,
    },
    logoutButtonText: {
        color: AppColors.error,
    },
    message: {
        fontFamily: "Inter-Regular",
        fontSize: 16,
        color: AppColors.text.secondary,
        textAlign: "center",
        marginBottom: 24,
    },
    buttonContainer: {
        width: "100%",
        gap: 16,
    },
    loginButton: {
        backgroundColor: AppColors.primary[500],
    },
    buttonText: {
        fontFamily: "Inter-SemiBold",
        fontSize: 16,
        color: AppColors.background.primary,
    },
    signupButton: {
        borderColor: AppColors.primary[500],
        backgroundColor: "transparent",
    },
    signupButtonText: {
        fontFamily: "Inter-SemiBold",
        fontSize: 16,
        color: AppColors.primary[500],
    },
})