# Ticket 003: Database Schema & Migrations

## Summary
Create all database tables, indexes, and relationships in Supabase.

## Acceptance Criteria

### Tables to Create

- [ ] **users**
  ```sql
  id: uuid (PK, references auth.users)
  display_name: text
  avatar_url: text (nullable)
  created_at: timestamptz
  pinned_post_ids: text[] (max 9, or more if premium)
  total_likes_received: integer (default 0)
  badges: jsonb
  streak: integer (default 0)
  last_post_date: timestamptz (nullable)
  is_premium: boolean (default false)
  premium_pin_slots: integer (default 9)
  ```

- [ ] **pets**
  ```sql
  id: uuid (PK)
  user_id: uuid (FK -> users)
  name: text
  species: text (enum: dog, cat, bird, rabbit, hamster, guinea_pig, fish, reptile, amphibian, horse, farm, exotic, other)
  avatar_url: text (nullable)
  created_at: timestamptz
  total_likes_received: integer (default 0)
  follower_count: integer (default 0)
  good_baby_crowns: integer (default 0)
  bad_baby_crowns: integer (default 0)
  pinned_post_ids: text[] (nullable, premium only)
  ```

- [ ] **posts**
  ```sql
  id: uuid (PK)
  user_id: uuid (FK -> users)
  pet_id: uuid (FK -> pets)
  media_type: text (enum: image, video)
  media_url: text
  thumbnail_url: text (nullable)
  video_duration: integer (nullable, seconds)
  type: text (enum: good, bad)
  tags: text[] (max 5)
  like_count: integer (default 0)
  created_at: timestamptz
  expires_at: timestamptz (created_at + 72 hours)
  is_pinned: boolean (default false)
  is_winner: boolean (default false)
  current_champion: boolean (default false)
  hot_score: float (default 0)
  ```

- [ ] **likes**
  ```sql
  id: uuid (PK)
  post_id: uuid (FK -> posts)
  user_id: uuid (FK -> users)
  created_at: timestamptz
  UNIQUE(post_id, user_id)
  ```

- [ ] **follows**
  ```sql
  id: uuid (PK)
  pet_id: uuid (FK -> pets)
  user_id: uuid (FK -> users)
  created_at: timestamptz
  UNIQUE(pet_id, user_id)
  ```

- [ ] **tag_suggestions**
  ```sql
  id: uuid (PK)
  user_id: uuid (FK -> users)
  suggested_tag: text
  status: text (enum: pending, approved, rejected)
  created_at: timestamptz
  reviewed_at: timestamptz (nullable)
  ```

- [ ] **curated_tags**
  ```sql
  id: uuid (PK)
  tag: text (unique)
  category: text
  created_at: timestamptz
  ```

### Indexes
- [ ] posts(created_at DESC)
- [ ] posts(expires_at) for cleanup queries
- [ ] posts(hot_score DESC) for feed
- [ ] posts(pet_id, created_at DESC)
- [ ] posts(type, hot_score DESC) for filtered feeds
- [ ] likes(post_id)
- [ ] likes(user_id)
- [ ] follows(pet_id)
- [ ] follows(user_id)

### Row Level Security
- [ ] Enable RLS on all tables
- [ ] Create basic policies (will be refined per-feature)

## Technical Notes
- Use Supabase migrations for version control
- Generate TypeScript types from schema using `supabase gen types`

## Dependencies
- Ticket 002: Supabase Setup

## Estimated Scope
Large
