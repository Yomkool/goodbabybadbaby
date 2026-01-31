-- Migration: Add separate media table for scale
-- Run AFTER clearing posts table data

-- ============================================================================
-- NEW ENUM
-- ============================================================================

CREATE TYPE media_status AS ENUM ('uploading', 'processing', 'ready', 'error');

-- ============================================================================
-- CREATE MEDIA TABLE
-- ============================================================================

CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type media_type NOT NULL,
  status media_status NOT NULL DEFAULT 'ready',

  -- Original upload info
  original_url TEXT NOT NULL,
  file_size BIGINT,
  width INTEGER,
  height INTEGER,

  -- Video-specific fields
  duration INTEGER,                    -- seconds (for video)
  thumbnail_url TEXT,                  -- video thumbnail

  -- Mux integration (Ticket 040)
  mux_asset_id TEXT,
  mux_playback_id TEXT,

  -- CDN integration (Ticket 039)
  cdn_url TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT duration_positive CHECK (
    duration IS NULL OR duration > 0
  ),
  CONSTRAINT file_size_positive CHECK (
    file_size IS NULL OR file_size > 0
  )
);

-- ============================================================================
-- ALTER POSTS TABLE
-- ============================================================================

-- Add media_id column
ALTER TABLE posts ADD COLUMN media_id UUID REFERENCES media(id) ON DELETE CASCADE;

-- Drop old media columns (posts table should be empty)
ALTER TABLE posts DROP COLUMN media_type;
ALTER TABLE posts DROP COLUMN media_url;
ALTER TABLE posts DROP COLUMN thumbnail_url;
ALTER TABLE posts DROP COLUMN video_duration;

-- Make media_id required (after dropping old columns)
ALTER TABLE posts ALTER COLUMN media_id SET NOT NULL;

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_media_user_id ON media(user_id);
CREATE INDEX idx_media_created_at ON media(created_at DESC);
CREATE INDEX idx_media_status ON media(status) WHERE status != 'ready';
CREATE INDEX idx_posts_media_id ON posts(media_id);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Anyone can view media (needed for feed)
CREATE POLICY "Media is viewable by everyone"
  ON media FOR SELECT
  USING (true);

-- Users can upload their own media
CREATE POLICY "Users can upload own media"
  ON media FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own media
CREATE POLICY "Users can update own media"
  ON media FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own media
CREATE POLICY "Users can delete own media"
  ON media FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- HELPER VIEWS
-- ============================================================================

-- View for posts with media (convenience for querying)
-- Public access is OK since posts are already public
CREATE VIEW posts_with_media
WITH (security_invoker = true)
AS
SELECT
  p.*,
  m.type AS media_type,
  m.original_url AS media_url,
  m.thumbnail_url,
  m.duration AS video_duration,
  m.width AS media_width,
  m.height AS media_height,
  m.file_size,
  m.cdn_url,
  m.mux_playback_id
FROM posts p
JOIN media m ON p.media_id = m.id;

-- View for user storage usage (for analytics/quotas)
-- security_invoker = true means it respects RLS of underlying tables
CREATE VIEW user_storage_usage
WITH (security_invoker = true)
AS
SELECT
  user_id,
  COUNT(*) AS media_count,
  SUM(file_size) AS total_bytes,
  SUM(CASE WHEN type = 'image' THEN file_size ELSE 0 END) AS image_bytes,
  SUM(CASE WHEN type = 'video' THEN file_size ELSE 0 END) AS video_bytes
FROM media
GROUP BY user_id;

-- Restrict user_storage_usage to only show own data via RPC function
-- (Views can't have RLS directly, so we use a function for secure access)
CREATE OR REPLACE FUNCTION get_my_storage_usage()
RETURNS TABLE (
  media_count BIGINT,
  total_bytes BIGINT,
  image_bytes BIGINT,
  video_bytes BIGINT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COUNT(*)::BIGINT AS media_count,
    COALESCE(SUM(file_size), 0)::BIGINT AS total_bytes,
    COALESCE(SUM(CASE WHEN type = 'image' THEN file_size ELSE 0 END), 0)::BIGINT AS image_bytes,
    COALESCE(SUM(CASE WHEN type = 'video' THEN file_size ELSE 0 END), 0)::BIGINT AS video_bytes
  FROM media
  WHERE user_id = auth.uid();
$$;
