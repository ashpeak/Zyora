import { useProductStore } from '@/store/productStore';
import { Product } from '../types';
import { API_URL } from '@/config';


const getProducts = async (): Promise<Product[]> => {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data: Product[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw new Error('Failed to fetch products');
    }
};

// Get Single Product by ID

const getProductById = async (id: number): Promise<Product> => {
    try {
        const response = await fetch(`${API_URL}/products/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data: Product = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching product with id ${id}:`, error);
        throw new Error('Failed to fetch product');
    }
};

// Get all categories

const getCategories = async (): Promise<string[]> => {
    try {
        const response = await fetch(`${API_URL}/products/categories`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data: string[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw new Error('Failed to fetch categories');
    }
};

const getProductsByCategory = async (category: string): Promise<Product[]> => {
    try {
        const res = await fetch(`${API_URL}/products/category/${category}`);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return await res.json();
    } catch (error) {
        console.error(`Error fetching products for category ${category}:`, error);
        throw new Error('Failed to fetch products by category');
    }
};


const searchProductsAPI = async (query: string): Promise<Product[]> => {
    try {
        const res = await fetch(`${API_URL}/products`);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        const allProducts: Product[] = await res.json();
        const searchTerm = query.toLowerCase().trim();

        const filteredProducts = allProducts.filter((product: Product) =>
            product.title.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );
        return filteredProducts;
    } catch (error) {
        throw error;
    }
};

export { getProducts, getCategories, getProductById, getProductsByCategory, searchProductsAPI };