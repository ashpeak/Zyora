import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppColors } from '@/constants/theme';

const Wrapper = ({ children, customStyle }: { children: React.ReactNode, customStyle?: StyleProp<ViewStyle> }) => {
    const insets = useSafeAreaInsets();
    return (
        <View style={[styles.container, { paddingTop: insets.top + 16 }, customStyle]}>
            {children}
        </View>
    )
}

export default Wrapper;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.background.primary,
        paddingHorizontal: 20,
        paddingBottom: 10,
    }
})