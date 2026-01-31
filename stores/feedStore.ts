// Feed Store - Zustand store for feed state management
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
  toggleLike: (postId: string) => Promise<void>;
  clearError: () => void;
}

const FEED_PAGE_SIZE = 10;

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

  // Toggle like on a post
  toggleLike: async (postId: string) => {
    const { posts } = get();
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const isCurrentlyLiked = post.isLikedByCurrentUser;

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
        // Unlike
        await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        // Like
        await supabase.from('likes').insert({
          post_id: postId,
          user_id: user.id,
        });
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

  // Build the query
  let query = supabase
    .from('posts')
    .select(`
      *,
      user:users!posts_user_id_fkey(*),
      pet:pets!posts_pet_id_fkey(*),
      media:media!posts_media_id_fkey(*)
    `)
    .limit(limit + 1); // Fetch one extra to check if there are more

  // Apply post type filter (good/bad)
  if (filters.filter !== 'all') {
    query = query.eq('type', filters.filter);
  }

  // Apply species filter
  if (filters.species) {
    query = query.eq('pet.species', filters.species);
  }

  // Apply ordering based on feed type
  switch (filters.type) {
    case 'hot':
      query = query.order('hot_score', { ascending: false });
      break;
    case 'new':
      query = query.order('created_at', { ascending: false });
      break;
    case 'following':
      // For following feed, we need to filter by followed pets
      if (user) {
        const { data: follows } = await supabase
          .from('follows')
          .select('pet_id')
          .eq('user_id', user.id);

        const followedPetIds = follows?.map((f) => f.pet_id) || [];
        if (followedPetIds.length > 0) {
          query = query.in('pet_id', followedPetIds);
        } else {
          // No followed pets, return empty
          return { posts: [], cursor: null, hasMore: false };
        }
      }
      query = query.order('created_at', { ascending: false });
      break;
  }

  // Apply cursor-based pagination
  if (cursor) {
    const cursorDate = new Date(cursor).toISOString();
    if (filters.type === 'hot') {
      query = query.lt('hot_score', parseFloat(cursor));
    } else {
      query = query.lt('created_at', cursorDate);
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

  // Check which posts the current user has liked
  let likedPostIds: Set<string> = new Set();
  if (user && posts.length > 0) {
    const { data: likes } = await supabase
      .from('likes')
      .select('post_id')
      .eq('user_id', user.id)
      .in('post_id', posts.map((p) => p.id));

    likedPostIds = new Set(likes?.map((l) => l.post_id) || []);
  }

  // Transform posts with relations and like status
  const transformedPosts: FeedPost[] = posts.map((post) => ({
    ...post,
    user: post.user as User,
    pet: post.pet as Pet,
    media: post.media as Media,
    isLikedByCurrentUser: likedPostIds.has(post.id),
  }));

  return {
    posts: transformedPosts,
    cursor: nextCursor,
    hasMore,
  };
}
