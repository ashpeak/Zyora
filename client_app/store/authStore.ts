import { supabase } from "@/lib/supabase";
import { create } from "zustand";

export interface User {
    id: string;
    email: string | null;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    // Auth actions
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkSession: () => Promise<void>;
};


export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: false,
    error: null,

    // Login with email and password
    login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;

            if (data && data.user) {
                set({ user: { id: data.user.id, email: data.user.email || null } });
            }

        } catch (error) {
            set({ error: 'Login failed. Please try again.' });
        } finally {
            set({ isLoading: false });
        }
    },

    // Signup with email and password
    signup: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });
            if (error) throw error;

            if (data && data.user) {
                set({ user: { id: data.user.id, email: data.user.email || null } });
            }

        } catch (error) {
            set({ error: 'Signup failed. Please try again.' });
        } finally {
            set({ isLoading: false });
        }
    },
    // Logout
    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            set({ user: null });
        } catch (error) {
            set({ error: 'Logout failed. Please try again.' });
        } finally {
            set({ isLoading: false });
        }
    },
    // Check current session
    checkSession: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase.auth.getSession();
            if (error) throw error;

            if (data && data.session && data.session.user) {
                set({ user: { id: data.session.user.id, email: data.session.user.email || null } });
            } else {
                set({ user: null });
            }
        } catch (error) {
            set({ user: null, error: 'Failed to retrieve session.' });
        } finally {
            set({ isLoading: false });
        }
    },
}));