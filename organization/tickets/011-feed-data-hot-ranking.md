# Ticket 011: Feed Data & Hot Ranking Algorithm

## Summary
Implement the data layer for the feed including the hot ranking algorithm and filtering.

## Acceptance Criteria

### Feed Store (Zustand)
- [ ] Create feed store with:
  - `posts` - array of posts
  - `filter` - current filter (all/good/bad)
  - `speciesFilter` - optional species filter
  - `showFollowingOnly` - boolean
  - `isLoading` - loading state
  - `hasMore` - pagination flag
  - `fetchPosts()` - initial fetch
  - `fetchMorePosts()` - pagination
  - `refreshPosts()` - pull-to-refresh
  - `setFilter()` - change filter
  - `toggleFollowingOnly()`

### Hot Ranking Query
- [ ] Implement hot score calculation:
  ```
  score = (likes × followed_boost) / (hours_since_post + 2)^1.5
  ```
  Where `followed_boost` = 1.5 if user follows pet, else 1.0
- [ ] Create Supabase function or view for ranked feed
- [ ] Filter out expired posts (expires_at > now)
- [ ] Support pagination (cursor-based or offset)

### Filter Queries
- [ ] All posts: ordered by hot_score DESC
- [ ] Good Babies only: WHERE type = 'good'
- [ ] Bad Babies only: WHERE type = 'bad'
- [ ] Species filter: WHERE pet.species = X
- [ ] Following only: JOIN with follows table

### Data Fetching
- [ ] Fetch 10-20 posts per page
- [ ] Include related data (pet name, user info)
- [ ] Handle empty states gracefully

## Technical Notes
- Consider using Supabase RPC for complex ranking query
- Hot score could be pre-calculated by cron job (see Ticket 032)
- Use React Query or SWR for caching (optional)

## Dependencies
- Ticket 003: Database Schema
- Ticket 010: Feed UI

## Estimated Scope
Large
