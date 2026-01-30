// Auth Store - Zustand store for authentication state management
import { create } from 'zustand';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { User, Pet } from '@/types';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  // State
  status: AuthStatus;
  session: Session | null;
  supabaseUser: SupabaseUser | null;
  user: User | null;
  pets: Pet[];
  hasPets: boolean;
  hasCompletedOnboarding: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  clearError: () => void;
  refreshPets: () => Promise<void>;
  addPet: (pet: Pet) => void;
  skipOnboarding: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  status: 'loading',
  session: null,
  supabaseUser: null,
  user: null,
  pets: [],
  hasPets: false,
  hasCompletedOnboarding: false,
  isLoading: true,
  error: null,

  // Initialize auth state and set up listener
  initialize: async () => {
    try {
      // Get initial session
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting session:', error);
        set({ status: 'unauthenticated', isLoading: false });
        return;
      }

      if (session?.user) {
        // Fetch user profile and pets
        const [userResult, petsResult] = await Promise.all([
          supabase.from('users').select('*').eq('id', session.user.id).single(),
          supabase.from('pets').select('*').eq('user_id', session.user.id),
        ]);

        const pets = petsResult.data || [];
        const hasPets = pets.length > 0;

        set({
          status: 'authenticated',
          session,
          supabaseUser: session.user,
          user: userResult.data,
          pets,
          hasPets,
          hasCompletedOnboarding: hasPets, // If they have pets, they've completed onboarding
          isLoading: false,
        });
      } else {
        set({ status: 'unauthenticated', isLoading: false, hasCompletedOnboarding: false });
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event);

        if (event === 'SIGNED_IN' && session?.user) {
          // Fetch user profile and pets
          const [userResult, petsResult] = await Promise.all([
            supabase.from('users').select('*').eq('id', session.user.id).single(),
            supabase.from('pets').select('*').eq('user_id', session.user.id),
          ]);

          const pets = petsResult.data || [];
          const hasPets = pets.length > 0;

          set({
            status: 'authenticated',
            session,
            supabaseUser: session.user,
            user: userResult.data,
            pets,
            hasPets,
            hasCompletedOnboarding: hasPets,
            isLoading: false,
          });
        } else if (event === 'SIGNED_OUT') {
          set({
            status: 'unauthenticated',
            session: null,
            supabaseUser: null,
            user: null,
            pets: [],
            hasPets: false,
            hasCompletedOnboarding: false,
            isLoading: false,
          });
        } else if (event === 'TOKEN_REFRESHED' && session) {
          set({ session });
        } else if (event === 'USER_UPDATED' && session?.user) {
          // Refetch user profile
          const { data: userProfile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          set({ supabaseUser: session.user, user: userProfile });
        }
      });
    } catch (err) {
      console.error('Error initializing auth:', err);
      set({ status: 'unauthenticated', isLoading: false });
    }
  },

  // Sign in with email and password
  signInWithEmail: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        const friendlyError = getFriendlyAuthError(error.message);
        set({ isLoading: false, error: friendlyError });
        return { error: friendlyError };
      }

      // User profile will be set by the auth state change listener
      set({ isLoading: false });
      return { error: null };
    } catch (err) {
      const errorMessage = 'An unexpected error occurred. Please try again.';
      set({ isLoading: false, error: errorMessage });
      return { error: errorMessage };
    }
  },

  // Sign up with email, password, and display name
  signUpWithEmail: async (email: string, password: string, displayName: string) => {
    set({ isLoading: true, error: null });

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            display_name: displayName.trim(),
          },
        },
      });

      if (error) {
        const friendlyError = getFriendlyAuthError(error.message);
        set({ isLoading: false, error: friendlyError });
        return { error: friendlyError };
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        set({ isLoading: false });
        return { error: 'Please check your email to confirm your account.' };
      }

      set({ isLoading: false });
      return { error: null };
    } catch (err) {
      const errorMessage = 'An unexpected error occurred. Please try again.';
      set({ isLoading: false, error: errorMessage });
      return { error: errorMessage };
    }
  },

  // Sign out
  signOut: async () => {
    set({ isLoading: true });

    try {
      await supabase.auth.signOut();
      set({
        status: 'unauthenticated',
        session: null,
        supabaseUser: null,
        user: null,
        pets: [],
        hasPets: false,
        hasCompletedOnboarding: false,
        isLoading: false,
      });
    } catch (err) {
      console.error('Error signing out:', err);
      set({ isLoading: false });
    }
  },

  // Reset password
  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null });

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: 'goodbabybadbaby://reset-password',
      });

      if (error) {
        const friendlyError = getFriendlyAuthError(error.message);
        set({ isLoading: false, error: friendlyError });
        return { error: friendlyError };
      }

      set({ isLoading: false });
      return { error: null };
    } catch (err) {
      const errorMessage = 'An unexpected error occurred. Please try again.';
      set({ isLoading: false, error: errorMessage });
      return { error: errorMessage };
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Refresh pets list
  refreshPets: async () => {
    const { supabaseUser } = get();
    if (!supabaseUser) return;

    const { data: pets } = await supabase
      .from('pets')
      .select('*')
      .eq('user_id', supabaseUser.id);

    const petsList = pets || [];
    set({ pets: petsList, hasPets: petsList.length > 0 });
  },

  // Add a pet to the local state (called after creating a pet)
  addPet: (pet: Pet) => {
    const { pets } = get();
    set({ pets: [...pets, pet], hasPets: true, hasCompletedOnboarding: true });
  },

  // Skip onboarding (user chose not to add a pet now)
  skipOnboarding: () => {
    set({ hasCompletedOnboarding: true });
  },
}));

// Helper function to convert Supabase errors to user-friendly messages
function getFriendlyAuthError(message: string): string {
  const errorMap: Record<string, string> = {
    'Invalid login credentials': 'Invalid email or password. Please try again.',
    'Email not confirmed': 'Please verify your email address before signing in.',
    'User already registered': 'An account with this email already exists.',
    'Password should be at least 6 characters':
      'Password must be at least 6 characters long.',
    'Unable to validate email address: invalid format': 'Please enter a valid email address.',
    'Signup requires a valid password': 'Please enter a valid password.',
    'Email rate limit exceeded': 'Too many attempts. Please try again later.',
    'For security purposes, you can only request this once every 60 seconds':
      'Please wait a moment before requesting another password reset.',
  };

  // Check for partial matches
  for (const [key, value] of Object.entries(errorMap)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  return message || 'An error occurred. Please try again.';
}
