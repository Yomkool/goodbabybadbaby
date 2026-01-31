-- Hot Ranking Algorithm for Good Baby Bad Baby
-- Ticket 011: Feed Data & Hot Ranking Algorithm
--
-- Formula: score = (likes × followed_boost) / (hours_since_post + 2)^1.5
-- Where followed_boost = 1.5 if user follows pet, else 1.0
--
-- This file contains the SQL functions to calculate and maintain hot_score

-- Function to calculate base hot score (without user-specific boost)
CREATE OR REPLACE FUNCTION calculate_hot_score(
  p_like_count INTEGER,
  p_created_at TIMESTAMPTZ
) RETURNS NUMERIC AS $$
DECLARE
  hours_since_post NUMERIC;
BEGIN
  hours_since_post := EXTRACT(EPOCH FROM (NOW() - p_created_at)) / 3600;
  -- Avoid division by zero, minimum denominator is 2^1.5 ≈ 2.83
  RETURN COALESCE(p_like_count, 0)::NUMERIC / POWER(GREATEST(hours_since_post, 0) + 2, 1.5);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger function to auto-update hot_score on post changes
CREATE OR REPLACE FUNCTION update_post_hot_score()
RETURNS TRIGGER AS $$
BEGIN
  NEW.hot_score := calculate_hot_score(NEW.like_count, NEW.created_at);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists, then create
DROP TRIGGER IF EXISTS posts_hot_score_trigger ON posts;

CREATE TRIGGER posts_hot_score_trigger
  BEFORE INSERT OR UPDATE OF like_count ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_post_hot_score();

-- Function to recalculate all hot scores (for time decay)
-- Should be called periodically via cron job (see Ticket 032)
CREATE OR REPLACE FUNCTION recalculate_all_hot_scores()
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE posts
  SET hot_score = calculate_hot_score(like_count, created_at)
  WHERE expires_at > NOW(); -- Only update non-expired posts

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get personalized feed with followed boost
-- This can be called via supabase.rpc('get_personalized_feed', {...})
CREATE OR REPLACE FUNCTION get_personalized_feed(
  p_user_id UUID,
  p_feed_type TEXT DEFAULT 'hot',
  p_filter TEXT DEFAULT 'all',
  p_species TEXT DEFAULT NULL,
  p_cursor NUMERIC DEFAULT NULL,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  pet_id UUID,
  media_id UUID,
  type TEXT,
  tags TEXT[],
  like_count INTEGER,
  created_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_pinned BOOLEAN,
  is_winner BOOLEAN,
  current_champion BOOLEAN,
  hot_score NUMERIC,
  personalized_score NUMERIC,
  is_followed BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  WITH user_follows AS (
    SELECT pet_id AS followed_pet_id
    FROM follows
    WHERE follows.user_id = p_user_id
  )
  SELECT
    p.id,
    p.user_id,
    p.pet_id,
    p.media_id,
    p.type::TEXT,
    p.tags,
    p.like_count,
    p.created_at,
    p.expires_at,
    p.is_pinned,
    p.is_winner,
    p.current_champion,
    p.hot_score,
    -- Personalized score with followed boost
    CASE
      WHEN uf.followed_pet_id IS NOT NULL THEN p.hot_score * 1.5
      ELSE p.hot_score
    END AS personalized_score,
    (uf.followed_pet_id IS NOT NULL) AS is_followed
  FROM posts p
  LEFT JOIN user_follows uf ON p.pet_id = uf.followed_pet_id
  LEFT JOIN pets pet ON p.pet_id = pet.id
  WHERE
    p.expires_at > NOW()
    AND (p_filter = 'all' OR p.type::TEXT = p_filter)
    AND (p_species IS NULL OR pet.species::TEXT = p_species)
    AND (p_feed_type != 'following' OR uf.followed_pet_id IS NOT NULL)
    AND (
      p_cursor IS NULL
      OR (p_feed_type = 'hot' AND p.hot_score < p_cursor)
      OR (p_feed_type != 'hot' AND EXTRACT(EPOCH FROM p.created_at) < p_cursor)
    )
  ORDER BY
    CASE WHEN p_feed_type = 'hot' THEN personalized_score ELSE NULL END DESC NULLS LAST,
    CASE WHEN p_feed_type != 'hot' THEN p.created_at ELSE NULL END DESC NULLS LAST
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- Initialize hot_score for existing posts
UPDATE posts
SET hot_score = calculate_hot_score(like_count, created_at)
WHERE hot_score IS NULL OR hot_score = 0;

-- Add comment explaining the algorithm
COMMENT ON FUNCTION calculate_hot_score IS
'Calculates hot score using formula: likes / (hours_since_post + 2)^1.5
The +2 prevents very new posts from dominating, and ^1.5 provides decay over time.';

COMMENT ON FUNCTION get_personalized_feed IS
'Returns personalized feed with 1.5x boost for posts from followed pets.
Use p_feed_type: hot, new, or following.
Use p_filter: all, good, or bad.
Use p_species: dog, cat, etc. or NULL for all.';
