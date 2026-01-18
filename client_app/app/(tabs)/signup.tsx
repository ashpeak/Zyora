import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { AppColors } from '@/constants/theme'
import Wrapper from '@/components/wrapper'
import { Foundation } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useAuthStore } from '@/store/authStore'
import TextInput from '@/components/TextInput'
import Button from '@/components/Button'

const SignUpScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmError, setConfirmError] = useState("");

    const router = useRouter();
    const { signup, isLoading, error } = useAuthStore();

    const validateForm = () => {
        let isValid = true;
        
        if (!email.trim()) {
            setEmailError("Please enter an email address.");
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError("Invalid email address.");
            isValid = false;
        } else {
            setEmailError("");
        }

        // Password validation
        if (!password) {
            setPasswordError("Please enter a password.");
            isValid = false;
        } else if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters.");
            isValid = false;
        } else {
            setPasswordError("");
        }

        // Confirm password validation
        if (confirmPassword !== password) {
            setConfirmError("Passwords do not match.");
            isValid = false;
        } else {
            setConfirmError("");
        }

        return isValid;
    }

    const handleSignUp = async () => {
        if(validateForm()) {
            await signup(email, password);
            router.push('/(tabs)/profile');
            setEmail("");
            setPassword("");
            setConfirmPassword("");
        }
    }

    return (
        <Wrapper>
            <KeyboardAvoidingView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <Foundation
                                name='shopping-cart'
                                size={40}
                                color={AppColors.primary[500]}
                            />
                        </View>

                        <Text style={styles.title}>Zyora</Text>
                        <Text style={styles.subtitle}>Create an account to get started!</Text>

                    </View>

                    <View style={styles.form}>
                        {error && <Text style={styles.errorText}>{error}</Text>}
                        <TextInput
                            label='Email'
                            placeholder='Enter your email'
                            value={email}
                            onChangeText={setEmail}
                            keyboardType='email-address'
                            autoCapitalize='none'
                            error={emailError}
                        />
                        <TextInput
                            label='Password'
                            placeholder='Enter your password'
                            value={password}
                            onChangeText={setPassword}
                            autoCapitalize='none'
                            error={passwordError}
                            secureTextEntry
                        />
                        <TextInput
                            label='Password'
                            placeholder='Confirm your password'
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            autoCapitalize='none'
                            error={confirmError}
                            secureTextEntry
                        />

                        <Button
                            title='Sign Up'
                            fullWidth
                            style={styles.button}
                            loading={isLoading}
                            onPress={handleSignUp}
                        />
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </Wrapper>
    )
}

export default SignUpScreen

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollContainer: {
        flexGrow: 1,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        alignItems: "center",
        marginBottom: 40,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: AppColors.primary[50],
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    title: {
        fontFamily: "Inter-Bold",
        fontSize: 28,
        color: AppColors.text.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontFamily: "Inter-Regular",
        fontSize: 16,
        color: AppColors.text.secondary,
    },
    form: {
        width: "100%",
    },
    button: {
        marginTop: 16,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 24,
    },
    footerText: {
        fontFamily: "Inter-Regular",
        fontSize: 14,
        color: AppColors.text.secondary,
    },
    link: {
        fontFamily: "Inter-SemiBold",
        fontSize: 14,
        color: AppColors.primary[500],
        marginLeft: 4,
    },
    errorText: {
        color: AppColors.error,
        fontFamily: "Inter-Regular",
        fontSize: 14,
        marginBottom: 16,
        textAlign: "center",
    },
})