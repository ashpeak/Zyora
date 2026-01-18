import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Product } from "@/types";

interface FavoritesState {
    favoriteItems: Product[];
    addFavorite: (product: Product) => void;
    removeFavorite: (productId: number) => void;
    toggleFavorite: (product: Product) => void;
    isFavorite: (productId: number) => boolean;
    resetFavorite: () => void;
}

export const useFavouriteStore = create<FavoritesState>()(
    persist((set, get) => ({
        favoriteItems: [],
        addFavorite: (product: Product) => {
            if (!get().isFavorite(product.id)) {
                set({ favoriteItems: [...get().favoriteItems, product] });
            }
        },
        removeFavorite: (productId: number) => {
            set({
                favoriteItems: get().favoriteItems.filter(item => item.id !== productId),
            });
        },
        resetFavorite: () => {
            set({ favoriteItems: [] });
        },
        toggleFavorite: (product: Product) => {
            if (get().isFavorite(product.id)) {
                get().removeFavorite(product.id);
            } else {
                get().addFavorite(product);
            }
        },
        isFavorite: (productId: number) => {
            return get().favoriteItems.some(item => item.id === productId);
        },

    }), {
        name: "favourite-store",
        storage: createJSONStorage(() => AsyncStorage),
    })
)