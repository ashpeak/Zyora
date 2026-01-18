import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AppColors } from '@/constants/theme';
import { useRouter } from 'expo-router';

interface Props {
    title?: string;
}

const TitleHeader = ({ title = "" }: Props) => {
    const router = useRouter();

    return <Text style={styles.title}>{title}</Text>
}

export default TitleHeader

const styles = StyleSheet.create({
    title: {
        fontFamily: "Inter-Bold",
        fontSize: 16,
        color: AppColors.text.primary,
        marginLeft: 8,
    }
})