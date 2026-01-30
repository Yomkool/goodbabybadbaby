-- Migration: Initial Database Schema for Good Baby Bad Baby
-- Ticket: 003-database-schema

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

CREATE TYPE species_type AS ENUM (
  'dog', 'cat', 'bird', 'rabbit', 'hamster', 'guinea_pig',
  'fish', 'reptile', 'amphibian', 'horse', 'farm', 'exotic', 'other'
);

CREATE TYPE media_type AS ENUM ('image', 'video');

CREATE TYPE post_type AS ENUM ('good', 'bad');

CREATE TYPE suggestion_status AS ENUM ('pending', 'approved', 'rejected');

-- ============================================================================
-- TABLES
-- ============================================================================

-- Users table (references auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  pinned_post_ids TEXT[] DEFAULT '{}',
  total_likes_received INTEGER NOT NULL DEFAULT 0,
  badges JSONB DEFAULT '{}',
  streak INTEGER NOT NULL DEFAULT 0,
  last_post_date TIMESTAMPTZ,
  is_premium BOOLEAN NOT NULL DEFAULT FALSE,
  premium_pin_slots INTEGER NOT NULL DEFAULT 9,

  CONSTRAINT pinned_posts_limit CHECK (
    array_length(pinned_post_ids, 1) IS NULL
    OR array_length(pinned_post_ids, 1) <= premium_pin_slots
  )
);

-- Pets table
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species species_type NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_likes_received INTEGER NOT NULL DEFAULT 0,
  follower_count INTEGER NOT NULL DEFAULT 0,
  good_baby_crowns INTEGER NOT NULL DEFAULT 0,
  bad_baby_crowns INTEGER NOT NULL DEFAULT 0,
  pinned_post_ids TEXT[]
);

-- Posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  media_type media_type NOT NULL,
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  video_duration INTEGER,
  type post_type NOT NULL,
  tags TEXT[] DEFAULT '{}',
  like_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '72 hours'),
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  is_winner BOOLEAN NOT NULL DEFAULT FALSE,
  current_champion BOOLEAN NOT NULL DEFAULT FALSE,
  hot_score FLOAT NOT NULL DEFAULT 0,

  CONSTRAINT tags_limit CHECK (
    array_length(tags, 1) IS NULL
    OR array_length(tags, 1) <= 5
  ),
  CONSTRAINT video_duration_positive CHECK (
    video_duration IS NULL OR video_duration > 0
  )
);

-- Likes table
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT unique_like UNIQUE (post_id, user_id)
);

-- Follows table
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT unique_follow UNIQUE (pet_id, user_id)
);

-- Tag suggestions table
CREATE TABLE tag_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  suggested_tag TEXT NOT NULL,
  status suggestion_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- Curated tags table
CREATE TABLE curated_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Posts indexes
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_expires_at ON posts(expires_at);
CREATE INDEX idx_posts_hot_score ON posts(hot_score DESC);
CREATE INDEX idx_posts_pet_created ON posts(pet_id, created_at DESC);
CREATE INDEX idx_posts_type_hot_score ON posts(type, hot_score DESC);

-- Likes indexes
CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);

-- Follows indexes
CREATE INDEX idx_follows_pet_id ON follows(pet_id);
CREATE INDEX idx_follows_user_id ON follows(user_id);

-- Additional useful indexes
CREATE INDEX idx_pets_user_id ON pets(user_id);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_tag_suggestions_status ON tag_suggestions(status);
CREATE INDEX idx_curated_tags_category ON curated_tags(category);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE tag_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE curated_tags ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES: USERS
-- ============================================================================

-- Anyone can view user profiles
CREATE POLICY "Users are viewable by everyone"
  ON users FOR SELECT
  USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- RLS POLICIES: PETS
-- ============================================================================

-- Anyone can view pets
CREATE POLICY "Pets are viewable by everyone"
  ON pets FOR SELECT
  USING (true);

-- Users can create pets for themselves
CREATE POLICY "Users can create own pets"
  ON pets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own pets
CREATE POLICY "Users can update own pets"
  ON pets FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own pets
CREATE POLICY "Users can delete own pets"
  ON pets FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES: POSTS
-- ============================================================================

-- Anyone can view posts
CREATE POLICY "Posts are viewable by everyone"
  ON posts FOR SELECT
  USING (true);

-- Users can create posts for their own pets
CREATE POLICY "Users can create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own posts
CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES: LIKES
-- ============================================================================

-- Anyone can view likes
CREATE POLICY "Likes are viewable by everyone"
  ON likes FOR SELECT
  USING (true);

-- Authenticated users can like posts
CREATE POLICY "Authenticated users can like"
  ON likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can remove their own likes
CREATE POLICY "Users can remove own likes"
  ON likes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES: FOLLOWS
-- ============================================================================

-- Anyone can view follows
CREATE POLICY "Follows are viewable by everyone"
  ON follows FOR SELECT
  USING (true);

-- Authenticated users can follow pets
CREATE POLICY "Authenticated users can follow"
  ON follows FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can unfollow
CREATE POLICY "Users can unfollow"
  ON follows FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES: TAG SUGGESTIONS
-- ============================================================================

-- Users can view their own suggestions
CREATE POLICY "Users can view own suggestions"
  ON tag_suggestions FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can suggest tags
CREATE POLICY "Authenticated users can suggest tags"
  ON tag_suggestions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES: CURATED TAGS
-- ============================================================================

-- Anyone can view curated tags
CREATE POLICY "Curated tags are viewable by everyone"
  ON curated_tags FOR SELECT
  USING (true);

-- Note: Only admins should be able to modify curated_tags
-- This would be done via service role key or a separate admin policy

-- ============================================================================
-- TRIGGERS FOR COUNTER MAINTENANCE
-- ============================================================================

-- Function to update like counts
CREATE OR REPLACE FUNCTION update_like_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment post like count
    UPDATE posts SET like_count = like_count + 1 WHERE id = NEW.post_id;

    -- Increment user's total likes received
    UPDATE users SET total_likes_received = total_likes_received + 1
    WHERE id = (SELECT user_id FROM posts WHERE id = NEW.post_id);

    -- Increment pet's total likes received
    UPDATE pets SET total_likes_received = total_likes_received + 1
    WHERE id = (SELECT pet_id FROM posts WHERE id = NEW.post_id);

    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement post like count
    UPDATE posts SET like_count = like_count - 1 WHERE id = OLD.post_id;

    -- Decrement user's total likes received
    UPDATE users SET total_likes_received = total_likes_received - 1
    WHERE id = (SELECT user_id FROM posts WHERE id = OLD.post_id);

    -- Decrement pet's total likes received
    UPDATE pets SET total_likes_received = total_likes_received - 1
    WHERE id = (SELECT pet_id FROM posts WHERE id = OLD.post_id);

    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_like_change
  AFTER INSERT OR DELETE ON likes
  FOR EACH ROW EXECUTE FUNCTION update_like_counts();

-- Function to update follower counts
CREATE OR REPLACE FUNCTION update_follower_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE pets SET follower_count = follower_count + 1 WHERE id = NEW.pet_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE pets SET follower_count = follower_count - 1 WHERE id = OLD.pet_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_follow_change
  AFTER INSERT OR DELETE ON follows
  FOR EACH ROW EXECUTE FUNCTION update_follower_counts();

-- ============================================================================
-- FUNCTION: Create user profile on signup
-- ============================================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile when a new auth user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
