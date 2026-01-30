// Navigation types for Expo Router
// Defines route parameters for type-safe navigation

import type { PostType, LeaderboardCategory, LeaderboardPeriod, SpeciesType } from './models';

// ============================================================================
// Route Parameter Types
// ============================================================================

export interface RootStackParamList {
  '(tabs)': undefined;
  '(auth)': undefined;
  modal: undefined;
  '+not-found': undefined;
}

export interface AuthStackParamList {
  login: undefined;
  signup: undefined;
  'forgot-password': undefined;
}

export interface TabParamList {
  index: undefined; // Feed
  search: undefined;
  create: undefined;
  leaderboard: undefined;
  profile: undefined;
}

// ============================================================================
// Screen-specific Params
// ============================================================================

export interface PostDetailParams {
  postId: string;
}

export interface PetProfileParams {
  petId: string;
}

export interface UserProfileParams {
  userId: string;
}

export interface CreatePostParams {
  petId?: string; // Pre-select a pet
  type?: PostType; // Pre-select good/bad
}

export interface AddPetParams {
  fromPostCreation?: boolean; // Return to post creation after adding
}

export interface LeaderboardParams {
  category?: LeaderboardCategory;
  period?: LeaderboardPeriod;
}

export interface TagFeedParams {
  tag: string;
}

export interface SpeciesFeedParams {
  species: SpeciesType;
}

export interface FollowersListParams {
  petId: string;
}

export interface FollowingListParams {
  userId: string;
}

export interface EditProfileParams {
  section?: 'avatar' | 'displayName' | 'pets';
}

export interface EditPetParams {
  petId: string;
}

export interface SettingsParams {
  section?: 'account' | 'notifications' | 'privacy' | 'premium';
}

// ============================================================================
// Deep Link Types
// ============================================================================

export type DeepLinkPath =
  | `/post/${string}`
  | `/pet/${string}`
  | `/user/${string}`
  | `/tag/${string}`
  | '/leaderboard'
  | '/premium';

export interface DeepLinkParams {
  path: DeepLinkPath;
  params?: Record<string, string>;
}

// ============================================================================
// Navigation Helpers
// ============================================================================

// Type-safe href builder for Expo Router
export type AppRoutes =
  | '/'
  | '/search'
  | '/create'
  | '/leaderboard'
  | '/profile'
  | '/login'
  | '/signup'
  | '/settings'
  | `/post/${string}`
  | `/pet/${string}`
  | `/user/${string}`
  | `/tag/${string}`;

// Modal routes
export type ModalRoutes =
  | '/modal'
  | '/add-pet'
  | '/edit-profile'
  | `/edit-pet/${string}`
  | '/report'
  | '/share';
