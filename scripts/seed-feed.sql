-- Seed script for testing hot score ranking
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
--
-- BEFORE RUNNING:
-- 1. Replace 'YOUR_USER_ID' with your actual user ID
-- 2. Replace 'YOUR_PET_ID' with your actual pet ID
-- 3. Run the 003_hot_ranking.sql migration first (if not already done)
--
-- To find your IDs, run:
--   SELECT id FROM users LIMIT 1;
--   SELECT id FROM pets LIMIT 1;

-- Set your IDs here:
DO $$
DECLARE
    v_user_id UUID := '6012319f-7e96-4ae2-bf02-a9a7af125a7e';  -- Replace this!
    v_pet_id UUID := '3ad64663-186b-404d-b5a7-6576d2fafee8';    -- Replace this!
    v_media_id UUID;
    v_hours_ago NUMERIC;
    v_like_count INTEGER;
    v_post_type TEXT;
    v_created_at TIMESTAMPTZ;
    v_expires_at TIMESTAMPTZ;
BEGIN
    -- Check if IDs are set
    IF v_user_id::TEXT = 'YOUR_USER_ID' THEN
        RAISE EXCEPTION 'Please replace YOUR_USER_ID with your actual user ID';
    END IF;

    -- Array of test posts: (hours_ago, like_count, type)
    -- Each creates a post with different age and engagement to test hot score
    FOR i IN 1..15 LOOP
        -- Generate varied test data
        CASE i
            WHEN 1 THEN v_hours_ago := 1; v_like_count := 50; v_post_type := 'good';
            WHEN 2 THEN v_hours_ago := 1; v_like_count := 10; v_post_type := 'bad';
            WHEN 3 THEN v_hours_ago := 2; v_like_count := 100; v_post_type := 'good';
            WHEN 4 THEN v_hours_ago := 6; v_like_count := 200; v_post_type := 'good';
            WHEN 5 THEN v_hours_ago := 12; v_like_count := 150; v_post_type := 'bad';
            WHEN 6 THEN v_hours_ago := 18; v_like_count := 300; v_post_type := 'good';
            WHEN 7 THEN v_hours_ago := 24; v_like_count := 500; v_post_type := 'bad';
            WHEN 8 THEN v_hours_ago := 48; v_like_count := 1000; v_post_type := 'good';
            WHEN 9 THEN v_hours_ago := 72; v_like_count := 50; v_post_type := 'bad';
            WHEN 10 THEN v_hours_ago := 0.5; v_like_count := 5; v_post_type := 'good';
            WHEN 11 THEN v_hours_ago := 168; v_like_count := 2000; v_post_type := 'good';
            WHEN 12 THEN v_hours_ago := 3; v_like_count := 75; v_post_type := 'bad';
            WHEN 13 THEN v_hours_ago := 8; v_like_count := 120; v_post_type := 'good';
            WHEN 14 THEN v_hours_ago := 36; v_like_count := 400; v_post_type := 'bad';
            WHEN 15 THEN v_hours_ago := 4; v_like_count := 25; v_post_type := 'good';
        END CASE;

        v_created_at := NOW() - (v_hours_ago || ' hours')::INTERVAL;
        v_expires_at := v_created_at + INTERVAL '7 days';

        -- Create media record
        INSERT INTO media (user_id, type, status, original_url, cdn_url)
        VALUES (
            v_user_id,
            'image',
            'ready',
            'https://placedog.net/500/500?random=' || i,
            'https://placedog.net/500/500?random=' || i
        )
        RETURNING id INTO v_media_id;

        -- Create post (hot_score calculated by trigger)
        INSERT INTO posts (user_id, pet_id, media_id, type, tags, like_count, created_at, expires_at)
        VALUES (
            v_user_id,
            v_pet_id,
            v_media_id,
            v_post_type::post_type,
            ARRAY['seeded', CASE WHEN v_post_type = 'good' THEN 'goodbaby' ELSE 'badbaby' END],
            v_like_count,
            v_created_at,
            v_expires_at
        );

        RAISE NOTICE 'Created post %: % likes, % hours ago', i, v_like_count, v_hours_ago;
    END LOOP;
END $$;

-- Show the results ranked by hot score
SELECT
    ROW_NUMBER() OVER (ORDER BY hot_score DESC) as rank,
    like_count as likes,
    ROUND(EXTRACT(EPOCH FROM (NOW() - created_at)) / 3600, 1) as hours_ago,
    ROUND(hot_score::NUMERIC, 2) as hot_score,
    type,
    created_at
FROM posts
WHERE tags @> ARRAY['seeded']
ORDER BY hot_score DESC;

-- Expected ranking explanation:
-- Posts are ranked by: likes / (hours + 2)^1.5
-- So a post with 100 likes from 2 hours ago scores: 100 / (2+2)^1.5 = 100/8 = 12.5
-- A post with 500 likes from 24 hours ago scores: 500 / (24+2)^1.5 = 500/132.6 = 3.77
-- The newer post wins despite fewer likes!
