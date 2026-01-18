import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { AppColors } from '@/constants/theme';

interface RatingProps {
    rating: number;
    count?: number;
    size?: number;
    showCount?: boolean;
}

const Rating = ({
    rating,
    count,
    size = 16,
    showCount = true }: RatingProps) => {

    const roundedRating = Math.round(4.5 * 2) / 2;

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= Math.floor(roundedRating); i++) {
            stars.push(
                <Feather
                    name='star'
                    key={`star-${i}`}
                    size={size}
                    color={AppColors.accent[500]}
                    fill={AppColors.accent[500]}
                />
            );
        }

        if(Math.ceil(roundedRating) > Math.floor(roundedRating)) {
            stars.push(
                <FontAwesome5
                    name='star-half'
                    key={`star-half`}
                    size={size-2}
                    color={AppColors.accent[500]}
                    style={styles.halfStarContainer}
                />
            );
        }
        return stars;
    }
    return (
        <View style={styles.container}>
            <View style={styles.starsContainer}>{renderStars()}</View>
            {showCount && count !== undefined && <Text style={styles.count}>({count})</Text>}
        </View>
    )
}

export default Rating

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
    },
    starsContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    count: {
        marginLeft: 4,
        fontSize: 14,
        color: AppColors.text.secondary,
    },
    halfStarContainer: {
        position: "relative",
    },
    halfStarBackground: {
        position: "absolute",
    },
    halfStarOverlay: {
        position: "absolute",
        width: "50%",
        overflow: "hidden",
    },
    halfStarForeground: {
        position: "absolute",
    },
})