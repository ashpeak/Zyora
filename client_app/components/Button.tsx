import { ActivityIndicator, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'
import React from 'react'
import { AppColors } from '@/constants/theme'

interface ButtonProps {
    title: string;
    onPress?: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    fullWidth?: boolean;
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

const Button = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    fullWidth = false,
    loading = false,
    style,
    textStyle,
}: ButtonProps) => {

    const buttonStyles = [
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
    ];

    const textStyles = [
        styles.text,
        styles[`${variant}Text` as keyof typeof styles],
        textStyle
    ];

    return (
        <TouchableOpacity
            style={buttonStyles}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}>

            {loading ? (
                <ActivityIndicator
                    color={
                        variant === 'primary'
                            ? AppColors.background.primary
                            : AppColors.primary[500]
                    }
                />
            ) : <Text style={textStyles}>{title}</Text>}

        </TouchableOpacity>
    )
}

export default Button

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },

    text: {
        fontWeight: "600",
    },
    fullWidth: {
        width: "100%",
    },
    disabled: {
        opacity: 0.5,
    },
    // Variants
    primary: {
        backgroundColor: AppColors.primary[500],
    },
    secondary: {
        backgroundColor: AppColors.accent[500],
    },
    outline: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: AppColors.primary[500],
    },
    ghost: {
        backgroundColor: "transparent",
    },
    // Text styles for variants
    primaryText: {
        color: AppColors.background.primary,
    },
    secondaryText: {
        color: AppColors.background.primary,
    },
    outlineText: {
        color: AppColors.primary[500],
    },
    ghostText: {
        color: AppColors.primary[500],
    },
    // Sizes
    small: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    medium: {
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    large: {
        paddingVertical: 16,
        paddingHorizontal: 32,
    },
})