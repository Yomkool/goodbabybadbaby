// Application-level types for Good Baby Bad Baby
// These extend and complement the auto-generated database types

import type {
  User as DbUser,
  Pet as DbPet,
  Post as DbPost,
  Like as DbLike,
  Follow as DbFollow,
  TagSuggestion as DbTagSuggestion,
  CuratedTag as DbCuratedTag,
  SpeciesType,
  MediaType,
  PostType,
  SuggestionStatus,
} from './database';

// Re-export enum types for convenience
export type { SpeciesType, MediaType, PostType, SuggestionStatus };

// Re-export database types with aliases
export type User = DbUser;
export type Pet = DbPet;
export type Post = DbPost;
export type Like = DbLike;
export type Follow = DbFollow;
export type TagSuggestion = DbTagSuggestion;
export type CuratedTag = DbCuratedTag;

// ============================================================================
// Badge Types
// ============================================================================

export type BadgeType =
  | 'first_post'
  | 'first_win'
  | 'streak_7'
  | 'streak_30'
  | 'streak_100'
  | 'likes_100'
  | 'likes_1000'
  | 'likes_10000'
  | 'crowns_5'
  | 'crowns_25'
  | 'crowns_100'
  | 'early_adopter'
  | 'premium_member';

export interface Badge {
  type: BadgeType;
  earnedAt: string;
  metadata?: Record<string, unknown>;
}

export interface UserBadges {
  [key: string]: Badge;
}

// ============================================================================
// Extended Types (with relations)
// ============================================================================

export interface UserWithPets extends User {
  pets: Pet[];
}

export interface PetWithUser extends Pet {
  user: User;
}

export interface PostWithRelations extends Post {
  user: User;
  pet: Pet;
  isLikedByCurrentUser?: boolean;
}

export interface PetWithPosts extends Pet {
  posts: Post[];
  user: User;
}

// ============================================================================
// Feed Types
// ============================================================================

export type FeedType = 'hot' | 'new' | 'following';
export type FeedFilter = 'all' | 'good' | 'bad';

export interface FeedFilters {
  type: FeedType;
  filter: FeedFilter;
  species?: SpeciesType;
  tag?: string;
}

export interface FeedState {
  posts: PostWithRelations[];
  filters: FeedFilters;
  hasMore: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
}

// ============================================================================
// Leaderboard Types
// ============================================================================

export type LeaderboardCategory = 'good' | 'bad';
export type LeaderboardPeriod = 'daily' | 'weekly' | 'allTime';

export interface LeaderboardEntry {
  rank: number;
  pet: Pet;
  user: User;
  score: number;
  isCurrentChampion: boolean;
}

export interface LeaderboardState {
  category: LeaderboardCategory;
  period: LeaderboardPeriod;
  entries: LeaderboardEntry[];
  isLoading: boolean;
}

// ============================================================================
// Upload Types
// ============================================================================

export interface MediaUpload {
  uri: string;
  type: MediaType;
  width: number;
  height: number;
  duration?: number; // seconds, for video
  thumbnailUri?: string; // for video
}

export interface PostDraft {
  media: MediaUpload;
  petId: string;
  type: PostType;
  tags: string[];
}

// ============================================================================
// Auth Types
// ============================================================================

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  status: AuthStatus;
  user: User | null;
  sessionId: string | null;
}

// ============================================================================
// Notification Types
// ============================================================================

export type NotificationType =
  | 'like'
  | 'follow'
  | 'crown_won'
  | 'crown_lost'
  | 'streak_reminder'
  | 'new_badge';

export interface PushNotificationPayload {
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, string>;
}

// ============================================================================
// Premium Types
// ============================================================================

export interface PremiumFeatures {
  extraPinSlots: number;
  petPinnedPosts: boolean;
  noAds: boolean;
  prioritySupport: boolean;
}

export const FREE_TIER: PremiumFeatures = {
  extraPinSlots: 0,
  petPinnedPosts: false,
  noAds: false,
  prioritySupport: false,
};

export const PREMIUM_TIER: PremiumFeatures = {
  extraPinSlots: 6, // 9 base + 6 = 15 total
  petPinnedPosts: true,
  noAds: true,
  prioritySupport: true,
};
