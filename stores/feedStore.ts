// Feed Store - Zustand store for feed state management
// Implements Ticket 011: Feed Data & Hot Ranking Algorithm
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type {
  PostWithRelations,
  FeedType,
  FeedFilter,
  FeedFilters,
  User,
  Pet,
  SpeciesType,
} from '@/types';
import type { Media } from '@/types/database';

export interface FeedPost extends PostWithRelations {
  media: Media;
  isFollowedByCurrentUser?: boolean;
}

interface FeedState {
  // State
  posts: FeedPost[];
  filters: FeedFilters;
  cursor: string | null;
  hasMore: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  error: string | null;

  // Actions
  fetchFeed: () => Promise<void>;
  refreshFeed: () => Promise<void>;
  loadMore: () => Promise<void>;
  setFilter: (filter: FeedFilter) => void;
  setFeedType: (type: FeedType) => void;
  setSpeciesFilter: (species: SpeciesType | undefined) => void;
  toggleFollowingOnly: () => void;
  toggleLike: (postId: string) => Promise<void>;
  clearError: () => void;
}

const FEED_PAGE_SIZE = 10;

// Track pending like operations to prevent spam
const likePendingMap = new Map<string, number>();
const LIKE_DEBOUNCE_MS = 500;

export const useFeedStore = create<FeedState>((set, get) => ({
  // Initial state
  posts: [],
  filters: {
    type: 'hot',
    filter: 'all',
    species: undefined,
    tag: undefined,
  },
  cursor: null,
  hasMore: true,
  isLoading: false,
  isRefreshing: false,
  isLoadingMore: false,
  error: null,

  // Fetch feed with current filters
  fetchFeed: async () => {
    const { filters, isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true, error: null });

    try {
      const result = await fetchFeedData(filters, null, FEED_PAGE_SIZE);

      set({
        posts: result.posts,
        cursor: result.cursor,
        hasMore: result.hasMore,
        isLoading: false,
      });
    } catch (err) {
      console.error('Error fetching feed:', err);
      set({
        isLoading: false,
        error: 'Failed to load feed. Please try again.',
      });
    }
  },

  // Pull-to-refresh
  refreshFeed: async () => {
    const { filters, isRefreshing } = get();
    if (isRefreshing) return;

    set({ isRefreshing: true, error: null });

    try {
      const result = await fetchFeedData(filters, null, FEED_PAGE_SIZE);

      set({
        posts: result.posts,
        cursor: result.cursor,
        hasMore: result.hasMore,
        isRefreshing: false,
      });
    } catch (err) {
      console.error('Error refreshing feed:', err);
      set({
        isRefreshing: false,
        error: 'Failed to refresh feed. Please try again.',
      });
    }
  },

  // Load more (infinite scroll)
  loadMore: async () => {
    const { filters, cursor, hasMore, isLoadingMore, isLoading } = get();
    if (isLoadingMore || isLoading || !hasMore || !cursor) return;

    set({ isLoadingMore: true });

    try {
      const result = await fetchFeedData(filters, cursor, FEED_PAGE_SIZE);

      set((state) => ({
        posts: [...state.posts, ...result.posts],
        cursor: result.cursor,
        hasMore: result.hasMore,
        isLoadingMore: false,
      }));
    } catch (err) {
      console.error('Error loading more posts:', err);
      set({ isLoadingMore: false });
    }
  },

  // Set post type filter (all/good/bad)
  setFilter: (filter: FeedFilter) => {
    set((state) => ({
      filters: { ...state.filters, filter },
      posts: [],
      cursor: null,
      hasMore: true,
    }));
    get().fetchFeed();
  },

  // Set feed type (hot/new/following)
  setFeedType: (type: FeedType) => {
    set((state) => ({
      filters: { ...state.filters, type },
      posts: [],
      cursor: null,
      hasMore: true,
    }));
    get().fetchFeed();
  },

  // Set species filter
  setSpeciesFilter: (species: SpeciesType | undefined) => {
    set((state) => ({
      filters: { ...state.filters, species },
      posts: [],
      cursor: null,
      hasMore: true,
    }));
    get().fetchFeed();
  },

  // Toggle following only (convenience method)
  toggleFollowingOnly: () => {
    const { filters } = get();
    const newType = filters.type === 'following' ? 'hot' : 'following';
    set((state) => ({
      filters: { ...state.filters, type: newType },
      posts: [],
      cursor: null,
      hasMore: true,
    }));
    get().fetchFeed();
  },

  // Toggle like on a post
  toggleLike: async (postId: string) => {
    const { posts } = get();
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    // Debounce: prevent rapid like/unlike spam
    const now = Date.now();
    const lastLikeTime = likePendingMap.get(postId);
    if (lastLikeTime && now - lastLikeTime < LIKE_DEBOUNCE_MS) {
      return; // Ignore rapid repeated taps
    }
    likePendingMap.set(postId, now);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      likePendingMap.delete(postId);
      return;
    }

    const isCurrentlyLiked = post.isLikedByCurrentUser;
    const postOwnerId = post.user_id;
    const postPetId = post.pet_id;

    // Optimistic update
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              isLikedByCurrentUser: !isCurrentlyLiked,
              like_count: p.like_count + (isCurrentlyLiked ? -1 : 1),
            }
          : p
      ),
    }));

    try {
      if (isCurrentlyLiked) {
        // Unlike: remove like and decrement counters
        await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        // Decrement total_likes_received on user and pet (fire and forget)
        await Promise.all([
          supabase.rpc('decrement_user_likes', { user_id_param: postOwnerId }),
          supabase.rpc('decrement_pet_likes', { pet_id_param: postPetId }),
        ]).catch((err) => console.error('Error decrementing like counters:', err));
      } else {
        // Like: add like and increment counters
        await supabase.from('likes').insert({
          post_id: postId,
          user_id: user.id,
        });

        // Increment total_likes_received on user and pet (fire and forget)
        await Promise.all([
          supabase.rpc('increment_user_likes', { user_id_param: postOwnerId }),
          supabase.rpc('increment_pet_likes', { pet_id_param: postPetId }),
        ]).catch((err) => console.error('Error incrementing like counters:', err));
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      // Revert optimistic update on error
      set((state) => ({
        posts: state.posts.map((p) =>
          p.id === postId
            ? {
                ...p,
                isLikedByCurrentUser: isCurrentlyLiked,
                like_count: p.like_count + (isCurrentlyLiked ? 1 : -1),
              }
            : p
        ),
      }));
    } finally {
      // Clean up pending map after a delay to allow the debounce window
      setTimeout(() => likePendingMap.delete(postId), LIKE_DEBOUNCE_MS);
    }
  },

  clearError: () => set({ error: null }),
}));

// Helper function to fetch feed data
async function fetchFeedData(
  filters: FeedFilters,
  cursor: string | null,
  limit: number
): Promise<{ posts: FeedPost[]; cursor: string | null; hasMore: boolean }> {
  const { data: { user } } = await supabase.auth.getUser();

  // Get user's followed pets for following filter and hot score boost
  let followedPetIds: string[] = [];
  // Get user's liked posts to exclude from hot feed (show fresh content)
  let likedPostIds: string[] = [];

  if (user) {
    // Fetch follows and likes in parallel
    const [followsResult, likesResult] = await Promise.all([
      supabase.from('follows').select('pet_id').eq('user_id', user.id),
      // Only fetch liked posts for hot feed (to exclude them)
      filters.type === 'hot'
        ? supabase.from('likes').select('post_id').eq('user_id', user.id)
        : Promise.resolve({ data: null }),
    ]);

    followedPetIds = followsResult.data?.map((f) => f.pet_id) || [];
    likedPostIds = likesResult.data?.map((l) => l.post_id) || [];
  }

  // For following feed with no follows, return empty immediately
  if (filters.type === 'following' && followedPetIds.length === 0) {
    return { posts: [], cursor: null, hasMore: false };
  }

  // If species filter is set, get pet IDs with that species first
  // (Supabase doesn't support filtering on joined table fields directly)
  let speciesFilteredPetIds: string[] | null = null;
  if (filters.species) {
    const { data: petsWithSpecies } = await supabase
      .from('pets')
      .select('id')
      .eq('species', filters.species);
    speciesFilteredPetIds = petsWithSpecies?.map((p) => p.id) || [];

    // No pets with this species, return empty
    if (speciesFilteredPetIds.length === 0) {
      return { posts: [], cursor: null, hasMore: false };
    }
  }

  // Build the query
  let query = supabase
    .from('posts')
    .select(`
      *,
      user:users!posts_user_id_fkey(*),
      pet:pets!posts_pet_id_fkey(*),
      media:media!posts_media_id_fkey(*)
    `)
    .gt('expires_at', new Date().toISOString()) // Filter out expired posts
    .limit(limit + 1); // Fetch one extra to check if there are more

  // For hot feed, exclude posts the user has already liked (show fresh content)
  if (filters.type === 'hot' && likedPostIds.length > 0) {
    // Supabase uses PostgREST's "not in" syntax
    query = query.not('id', 'in', `(${likedPostIds.join(',')})`);
  }

  // Apply post type filter (good/bad)
  if (filters.filter !== 'all') {
    query = query.eq('type', filters.filter);
  }

  // Apply species filter (using pre-fetched pet IDs)
  if (speciesFilteredPetIds) {
    query = query.in('pet_id', speciesFilteredPetIds);
  }

  // Apply following filter
  if (filters.type === 'following') {
    query = query.in('pet_id', followedPetIds);
  }

  // Apply ordering based on feed type
  switch (filters.type) {
    case 'hot':
      query = query.order('hot_score', { ascending: false });
      break;
    case 'new':
    case 'following':
      query = query.order('created_at', { ascending: false });
      break;
  }

  // Apply cursor-based pagination
  if (cursor) {
    if (filters.type === 'hot') {
      query = query.lt('hot_score', parseFloat(cursor));
    } else {
      query = query.lt('created_at', cursor);
    }
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  // Check if there are more posts
  const hasMore = data && data.length > limit;
  const posts = data?.slice(0, limit) || [];

  // Get the cursor for the next page
  let nextCursor: string | null = null;
  if (posts.length > 0) {
    const lastPost = posts[posts.length - 1];
    nextCursor = filters.type === 'hot'
      ? lastPost.hot_score.toString()
      : lastPost.created_at;
  }

  // For hot feed, we already excluded liked posts, so isLikedByCurrentUser is always false
  // For new/following feeds, we need to check which posts are liked
  let likedPostIdSet: Set<string>;
  if (filters.type === 'hot') {
    // Hot feed excludes liked posts, so none of these are liked
    likedPostIdSet = new Set();
  } else {
    // For new/following, fetch likes for the returned posts
    if (user && posts.length > 0) {
      const { data: likes } = await supabase
        .from('likes')
        .select('post_id')
        .eq('user_id', user.id)
        .in('post_id', posts.map((p) => p.id));
      likedPostIdSet = new Set(likes?.map((l) => l.post_id) || []);
    } else {
      likedPostIdSet = new Set();
    }
  }

  // Create set for quick follow lookup
  const followedPetIdSet = new Set(followedPetIds);

  // Transform posts with relations, like status, and follow status
  const transformedPosts: FeedPost[] = posts.map((post) => ({
    ...post,
    user: post.user as User,
    pet: post.pet as Pet,
    media: post.media as Media,
    isLikedByCurrentUser: likedPostIdSet.has(post.id),
    isFollowedByCurrentUser: followedPetIdSet.has(post.pet_id),
  }));

  return {
    posts: transformedPosts,
    cursor: nextCursor,
    hasMore,
  };
}

/**
 * Hot Score Calculation
 * ====================
 * Formula: score = (likes × followed_boost) / (hours_since_post + 2)^1.5
 * Where followed_boost = 1.5 if user follows pet, else 1.0
 *
 * This should be implemented as a Supabase function for production use.
 * The function below calculates the base score (without user-specific boost).
 *
 * SQL for Supabase (to be run in Supabase SQL editor):
 *
 * -- Function to calculate hot score (base, without user-specific boost)
 * CREATE OR REPLACE FUNCTION calculate_hot_score(
 *   p_like_count INTEGER,
 *   p_created_at TIMESTAMPTZ
 * ) RETURNS NUMERIC AS $$
 * DECLARE
 *   hours_since_post NUMERIC;
 * BEGIN
 *   hours_since_post := EXTRACT(EPOCH FROM (NOW() - p_created_at)) / 3600;
 *   RETURN p_like_count / POWER(hours_since_post + 2, 1.5);
 * END;
 * $$ LANGUAGE plpgsql IMMUTABLE;
 *
 * -- Trigger to update hot_score on post insert/update
 * CREATE OR REPLACE FUNCTION update_post_hot_score()
 * RETURNS TRIGGER AS $$
 * BEGIN
 *   NEW.hot_score := calculate_hot_score(NEW.like_count, NEW.created_at);
 *   RETURN NEW;
 * END;
 * $$ LANGUAGE plpgsql;
 *
 * CREATE TRIGGER posts_hot_score_trigger
 *   BEFORE INSERT OR UPDATE OF like_count ON posts
 *   FOR EACH ROW
 *   EXECUTE FUNCTION update_post_hot_score();
 *
 * -- Periodic update for time decay (run via cron job - see Ticket 032)
 * -- UPDATE posts SET hot_score = calculate_hot_score(like_count, created_at);
 */
export function calculateHotScore(likeCount: number, createdAt: Date | string): number {
  const createdDate = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
  const hoursSincePost = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60);
  return likeCount / Math.pow(hoursSincePost + 2, 1.5);
}

/**
 * Calculate hot score with followed boost for personalized ranking
 */
export function calculatePersonalizedHotScore(
  likeCount: number,
  createdAt: Date | string,
  isFollowed: boolean
): number {
  const baseScore = calculateHotScore(likeCount, createdAt);
  const followedBoost = isFollowed ? 1.5 : 1.0;
  return baseScore * followedBoost;
}
