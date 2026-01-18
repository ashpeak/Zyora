import { getCategories, getProducts, getProductsByCategory, searchProductsAPI } from "@/lib/api";
import { Product } from "@/types";
import { create } from "zustand";


interface ProductState {
    products: Product[];
    filteredProducts: Product[];
    categories: string[];
    loading: boolean;
    error: string | null;
    selectedCategory: string;

    // Actions
    fetchProducts: () => Promise<void>;
    fetchCategories: () => Promise<void>;
    setCategory: (category: string | null) => Promise<void>;
    searchProducts: (query: string) => void;
    sortProducts: (sortBy: 'price-asc' | 'price-desc' | 'rating') => void;
    searchProductsRealTime: (query: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) =>
({
    products: [],
    categories: [],
    loading: false,
    error: null,
    filteredProducts: [],
    selectedCategory: 'All',

    fetchProducts: async () => {
        try {
            set({ loading: true, error: null });
            const products = await getProducts();
            set({
                products,
                filteredProducts: products,
                loading: false
            });
        } catch (error) {
            set({ error: (error as Error).message });
        } finally {
            set({ loading: false });
        }
    },
    fetchCategories: async () => {
        try {
            set({ loading: true, error: null });
            const categories = await getCategories();
            set({ categories: categories, loading: false });
        } catch (error) {
            set({ error: (error as Error).message });
        } finally {
            set({ loading: false });
        }
    },

    setCategory: async (category: string | null) => {
        try {
            set({ selectedCategory: category || 'All', loading: true, error: null });
            if (category && category !== 'All') {
                const product = await getProductsByCategory(category);
                set({ filteredProducts: product });
            } else {
                // Reset to all products when 'All' is selected
                set({ filteredProducts: get().products });
            }
        } finally {
            set({ loading: false });
        }
    },

    searchProducts: (query: string) => {
        const searchTerm = query.toLowerCase().trim();
        const { products, selectedCategory } = get();

        let filteredProducts = products;

        // If a category is selected, filter by category first
        if (selectedCategory && selectedCategory !== 'All') {
            filteredProducts = filteredProducts.filter(
                (product) => product.category === selectedCategory
            );
        }

        // Then filter by search term
        if (searchTerm) {
            filteredProducts = filteredProducts.filter(
                (product) =>
                    product.title.toLowerCase().includes(searchTerm) ||
                    product.description.toLowerCase().includes(searchTerm) ||
                    product.category.toLowerCase().includes(searchTerm)
            );
        }

        set({ filteredProducts });
    },

    sortProducts: (sortBy: 'price-asc' | 'price-desc' | 'rating') => {
        const { filteredProducts } = get();
        let sortedProducts = [...filteredProducts];

        switch (sortBy) {
            case 'price-asc':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                sortedProducts.sort((a, b) => b.rating.rate - a.rating.rate);
                break;
        }

        set({ filteredProducts: sortedProducts });
    },

    searchProductsRealTime: async (query: string) => {
        try {
            set({ loading: true, error: null });

            // if (!query.trim()) {
            //     set({ filteredProducts: get().products });
            //     return;
            // }

            if (query?.length >= 3) {
                const searchProducts = await searchProductsAPI(query);
                set({ filteredProducts: searchProducts });
            } else {
                set({ filteredProducts: [], loading: false });
            }

        } catch (error) {
            set({ error: (error as Error).message });
        } finally {
            set({ loading: false });
        }
    },

})
);