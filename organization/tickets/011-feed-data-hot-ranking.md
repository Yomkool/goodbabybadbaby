# Ticket 011: Feed Data & Hot Ranking Algorithm

## Summary
Implement the data layer for the feed including the hot ranking algorithm and filtering.

## Status: COMPLETE ✅

## Acceptance Criteria

### Feed Store (Zustand)
- [x] Create feed store with:
  - [x] `posts` - array of posts
  - [x] `filter` - current filter (all/good/bad)
  - [x] `speciesFilter` - optional species filter
  - [x] `showFollowingOnly` - boolean (via `feedType === 'following'` and `toggleFollowingOnly()`)
  - [x] `isLoading` - loading state
  - [x] `hasMore` - pagination flag
  - [x] `fetchPosts()` - initial fetch (`fetchFeed()`)
  - [x] `fetchMorePosts()` - pagination (`loadMore()`)
  - [x] `refreshPosts()` - pull-to-refresh (`refreshFeed()`)
  - [x] `setFilter()` - change filter
  - [x] `toggleFollowingOnly()` - convenience method added

### Hot Ranking Query
- [x] Implement hot score calculation:
  ```
  score = (likes × followed_boost) / (hours_since_post + 2)^1.5
  ```
  Where `followed_boost` = 1.5 if user follows pet, else 1.0
- [x] Create Supabase function or view for ranked feed (`supabase/migrations/003_hot_ranking.sql`)
- [x] Filter out expired posts (expires_at > now)
- [x] Support pagination (cursor-based)

### Filter Queries
- [x] All posts: ordered by hot_score DESC
- [x] Good Babies only: WHERE type = 'good'
- [x] Bad Babies only: WHERE type = 'bad'
- [x] Species filter: WHERE pet.species = X (via pre-fetched pet IDs)
- [x] Following only: JOIN with follows table

### Data Fetching
- [x] Fetch 10-20 posts per page (10 per page)
- [x] Include related data (pet name, user info)
- [x] Handle empty states gracefully

## Implementation Details

### Files Modified/Created
- `stores/feedStore.ts` - Updated with:
  - `toggleFollowingOnly()` action
  - `isFollowedByCurrentUser` field on FeedPost
  - Fixed species filter (pre-fetch pet IDs with matching species)
  - Added `expires_at` filter to exclude expired posts
  - `calculateHotScore()` and `calculatePersonalizedHotScore()` helper functions
  - Documented SQL for Supabase functions

- `supabase/migrations/003_hot_ranking.sql` - Created with:
  - `calculate_hot_score()` - Base score calculation
  - `update_post_hot_score()` - Trigger function
  - `posts_hot_score_trigger` - Auto-update on insert/like_count change
  - `recalculate_all_hot_scores()` - For cron job time decay
  - `get_personalized_feed()` - RPC function with followed boost

### Hot Score Algorithm
```
score = likes / (hours_since_post + 2)^1.5
```
- The `+2` prevents brand new posts from having infinite scores
- The `^1.5` exponent provides moderate time decay
- Followed boost of 1.5x applied for personalized ranking

### Pagination Strategy
- Cursor-based pagination using `hot_score` (for hot feed) or `created_at` (for new/following)
- Fetches `limit + 1` to determine if more posts exist
- Handles edge cases (no follows, no matching species)

## Technical Notes
- Species filter requires pre-fetching pet IDs because Supabase doesn't support filtering on joined table fields
- Following feed returns empty immediately if user follows no pets
- SQL migration should be run via Supabase dashboard or CLI
- Cron job for hot score recalculation should be set up (Ticket 032)

## Dependencies
- Ticket 003: Database Schema ✅
- Ticket 010: Feed UI ✅

## Estimated Scope
Large
