# Ticket 042: Row Level Security Policies

## Summary
Implement comprehensive Row Level Security (RLS) policies for all tables.

## Acceptance Criteria

### Users Table
- [ ] SELECT: Anyone can read public fields (display_name, avatar)
- [ ] SELECT: Only self can read private fields (email, settings)
- [ ] UPDATE: Only self can update own record
- [ ] DELETE: Only self (via account deletion)

### Pets Table
- [ ] SELECT: Anyone can read all pets
- [ ] INSERT: Authenticated users can create pets for themselves
- [ ] UPDATE: Only owner can update their pets
- [ ] DELETE: Only owner can delete their pets

### Posts Table
- [ ] SELECT: Anyone can read non-expired posts
- [ ] SELECT: Owners can read their own expired posts
- [ ] INSERT: Authenticated users can create posts
- [ ] UPDATE: Only owner can update (pin/unpin)
- [ ] DELETE: Handled by cron (no user delete)

### Likes Table
- [ ] SELECT: Anyone can read likes
- [ ] INSERT: Authenticated users can like (not own posts - optional)
- [ ] DELETE: Only creator can unlike

### Follows Table
- [ ] SELECT: Users can see their own follows
- [ ] SELECT: Pet owners can see their follower counts
- [ ] INSERT: Authenticated users can follow
- [ ] DELETE: Only follower can unfollow

### Tag Suggestions Table
- [ ] SELECT: Only creator can see own suggestions
- [ ] INSERT: Authenticated users can suggest
- [ ] UPDATE: Admin only

### Reports Table
- [ ] SELECT: Admin only
- [ ] INSERT: Authenticated users can report
- [ ] UPDATE: Admin only

## Technical Notes
- Enable RLS on all tables: `ALTER TABLE x ENABLE ROW LEVEL SECURITY`
- Test policies thoroughly
- Consider service role bypass for cron jobs

## Dependencies
- Ticket 003: Database Schema

## Estimated Scope
Medium
