import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Product } from "@/types";

interface CartItem {
    product: Product;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addItem: (product: Product, quantity?: number) => void;
    updateItemQuantity: (productId: number, quantity: number) => void;
    removeItem: (productId: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist((set, get) => ({
        items: [],
        addItem: (product, quantity = 1) => {
            const existingItem = get().items.find(item => item.product.id === product.id);
            if (existingItem) {
                set({
                    items: get().items.map(item =>
                        item.product.id === product.id
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    ),
                });
            } else {
                set({ items: [...get().items, { product, quantity }] });
            }
        },
        updateItemQuantity: (productId, quantity) => {
            if (quantity <= 0) {
                get().removeItem(productId);
                return;
            }
            set({
                items: get().items.map(item =>
                    item.product.id === productId
                        ? { ...item, quantity }
                        : item
                ),
            });
        },
        removeItem: (productId) => {
            set({
                items: get().items.filter(item => item.product.id !== productId),
            });
        },
        clearCart: () => {
            set({ items: [] });
        },
        getTotalItems: () => {
            return get().items.reduce((total, item) => total + item.quantity, 0);
        },
        getTotalPrice: () => {
            return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0);
        },
    }), {
        name: "cart-storage",
        storage: createJSONStorage(() => AsyncStorage),
    })
);