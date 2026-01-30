// API Request/Response types for Good Baby Bad Baby
// Types for Supabase queries and edge functions

import type {
  User,
  Pet,
  Post,
  PostWithRelations,
  LeaderboardEntry,
  CuratedTag,
  FeedFilter,
  FeedType,
  PostType,
  SpeciesType,
  MediaType,
  LeaderboardCategory,
  LeaderboardPeriod,
} from './models';

// ============================================================================
// Generic API Types
// ============================================================================

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

export interface PaginatedResponse<T> {
  data: T[];
  hasMore: boolean;
  nextCursor?: string;
  total?: number;
}

export interface PaginationParams {
  limit?: number;
  cursor?: string;
  offset?: number;
}

// ============================================================================
// Auth API Types
// ============================================================================

export interface SignUpRequest {
  email: string;
  password: string;
  displayName: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInWithOAuthRequest {
  provider: 'google' | 'apple';
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// ============================================================================
// User API Types
// ============================================================================

export interface UpdateUserRequest {
  displayName?: string;
  avatarUrl?: string;
}

export interface GetUserResponse {
  user: User;
  pets: Pet[];
  stats: UserStats;
}

export interface UserStats {
  totalPosts: number;
  totalLikesReceived: number;
  totalCrowns: number;
  currentStreak: number;
  longestStreak: number;
}

// ============================================================================
// Pet API Types
// ============================================================================

export interface CreatePetRequest {
  name: string;
  species: SpeciesType;
  avatarUrl?: string;
}

export interface UpdatePetRequest {
  name?: string;
  species?: SpeciesType;
  avatarUrl?: string;
  pinnedPostIds?: string[];
}

export interface GetPetResponse {
  pet: Pet;
  user: User;
  recentPosts: Post[];
  stats: PetStats;
  isFollowing: boolean;
}

export interface PetStats {
  totalPosts: number;
  totalLikesReceived: number;
  goodBabyCrowns: number;
  badBabyCrowns: number;
  followerCount: number;
}

// ============================================================================
// Post API Types
// ============================================================================

export interface CreatePostRequest {
  petId: string;
  mediaType: MediaType;
  mediaUrl: string;
  thumbnailUrl?: string;
  videoDuration?: number;
  type: PostType;
  tags: string[];
}

export interface UpdatePostRequest {
  isPinned?: boolean;
  tags?: string[];
}

export interface GetPostResponse {
  post: PostWithRelations;
  isLiked: boolean;
  relatedPosts: Post[];
}

// ============================================================================
// Feed API Types
// ============================================================================

export interface GetFeedRequest extends PaginationParams {
  type: FeedType;
  filter?: FeedFilter;
  species?: SpeciesType;
  tag?: string;
}

export interface GetFeedResponse extends PaginatedResponse<PostWithRelations> {
  // Posts include isLikedByCurrentUser flag
}

export interface GetUserFeedRequest extends PaginationParams {
  userId: string;
  includePinned?: boolean;
}

export interface GetPetFeedRequest extends PaginationParams {
  petId: string;
  includePinned?: boolean;
}

export interface GetFollowingFeedRequest extends PaginationParams {
  // Uses authenticated user's follows
}

// ============================================================================
// Like API Types
// ============================================================================

export interface LikePostRequest {
  postId: string;
}

export interface UnlikePostRequest {
  postId: string;
}

export interface GetLikesRequest extends PaginationParams {
  postId: string;
}

export interface GetLikesResponse extends PaginatedResponse<User> {
  // Users who liked the post
}

// ============================================================================
// Follow API Types
// ============================================================================

export interface FollowPetRequest {
  petId: string;
}

export interface UnfollowPetRequest {
  petId: string;
}

export interface GetFollowersRequest extends PaginationParams {
  petId: string;
}

export interface GetFollowersResponse extends PaginatedResponse<User> {
  // Users following the pet
}

export interface GetFollowingRequest extends PaginationParams {
  userId: string;
}

export interface GetFollowingResponse extends PaginatedResponse<Pet> {
  // Pets the user is following
}

// ============================================================================
// Leaderboard API Types
// ============================================================================

export interface GetLeaderboardRequest {
  category: LeaderboardCategory;
  period: LeaderboardPeriod;
  limit?: number;
}

export interface GetLeaderboardResponse {
  entries: LeaderboardEntry[];
  currentChampion: LeaderboardEntry | null;
  userRank?: LeaderboardEntry; // If authenticated, user's pet rank
}

// ============================================================================
// Tags API Types
// ============================================================================

export interface GetTagsRequest {
  search?: string;
  category?: string;
  limit?: number;
}

export interface GetTagsResponse {
  tags: CuratedTag[];
}

export interface SuggestTagRequest {
  tag: string;
}

// ============================================================================
// Search API Types
// ============================================================================

export interface SearchRequest extends PaginationParams {
  query: string;
  type?: 'all' | 'pets' | 'tags' | 'users';
}

export interface SearchResponse {
  pets: Pet[];
  tags: CuratedTag[];
  users: User[];
}

// ============================================================================
// Media Upload API Types
// ============================================================================

export interface GetUploadUrlRequest {
  fileName: string;
  contentType: string;
  folder: 'posts' | 'avatars' | 'pet-avatars';
}

export interface GetUploadUrlResponse {
  uploadUrl: string;
  publicUrl: string;
  expiresAt: string;
}

export interface ProcessVideoRequest {
  videoUrl: string;
  generateThumbnail: boolean;
}

export interface ProcessVideoResponse {
  thumbnailUrl: string;
  duration: number;
  width: number;
  height: number;
}

// ============================================================================
// Report API Types
// ============================================================================

export type ReportReason =
  | 'spam'
  | 'inappropriate'
  | 'harassment'
  | 'violence'
  | 'copyright'
  | 'other';

export interface ReportPostRequest {
  postId: string;
  reason: ReportReason;
  details?: string;
}

export interface ReportUserRequest {
  userId: string;
  reason: ReportReason;
  details?: string;
}

// ============================================================================
// Notification API Types
// ============================================================================

export interface RegisterPushTokenRequest {
  token: string;
  platform: 'ios' | 'android';
}

export interface UpdateNotificationSettingsRequest {
  likes?: boolean;
  follows?: boolean;
  crowns?: boolean;
  streakReminders?: boolean;
  marketing?: boolean;
}

// ============================================================================
// Premium API Types
// ============================================================================

export interface GetSubscriptionStatusResponse {
  isPremium: boolean;
  expiresAt?: string;
  productId?: string;
}

export interface VerifyPurchaseRequest {
  receipt: string;
  platform: 'ios' | 'android';
  productId: string;
}
