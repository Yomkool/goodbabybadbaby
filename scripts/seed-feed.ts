/**
 * Seed script for testing hot score ranking
 *
 * Run with: npx ts-node scripts/seed-feed.ts
 * Or add to package.json: "seed:feed": "ts-node scripts/seed-feed.ts"
 *
 * Prerequisites:
 * - You need at least one user and one pet in the database
 * - Run the 003_hot_ranking.sql migration first
 */

import { createClient } from '@supabase/supabase-js';

// Use your Supabase credentials
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Sample media URLs (placeholder images)
const SAMPLE_IMAGES = [
  'https://placedog.net/500/500?random=1',
  'https://placedog.net/500/500?random=2',
  'https://placedog.net/500/500?random=3',
  'https://placekitten.com/500/500',
  'https://placedog.net/500/500?random=4',
  'https://placedog.net/500/500?random=5',
];

interface SeedPost {
  hoursAgo: number;
  likeCount: number;
  type: 'good' | 'bad';
  description: string;
}

// Test cases to demonstrate hot score ranking
const SEED_POSTS: SeedPost[] = [
  // Recent posts with varying likes
  { hoursAgo: 1, likeCount: 50, type: 'good', description: 'Very recent, moderate likes' },
  { hoursAgo: 1, likeCount: 10, type: 'bad', description: 'Very recent, few likes' },
  { hoursAgo: 2, likeCount: 100, type: 'good', description: 'Recent, many likes' },

  // Medium age posts
  { hoursAgo: 6, likeCount: 200, type: 'good', description: '6 hours, lots of likes' },
  { hoursAgo: 12, likeCount: 150, type: 'bad', description: '12 hours, good likes' },
  { hoursAgo: 18, likeCount: 300, type: 'good', description: '18 hours, viral post' },

  // Older posts (should rank lower even with high likes)
  { hoursAgo: 24, likeCount: 500, type: 'bad', description: '1 day old, very popular' },
  { hoursAgo: 48, likeCount: 1000, type: 'good', description: '2 days old, extremely popular' },
  { hoursAgo: 72, likeCount: 50, type: 'bad', description: '3 days old, few likes' },

  // Edge cases
  { hoursAgo: 0.5, likeCount: 5, type: 'good', description: 'Brand new, barely any likes' },
  { hoursAgo: 168, likeCount: 2000, type: 'good', description: '1 week old, massive likes' },

  // More variety
  { hoursAgo: 3, likeCount: 75, type: 'bad', description: '3 hours, decent engagement' },
  { hoursAgo: 8, likeCount: 120, type: 'good', description: '8 hours, solid performance' },
  { hoursAgo: 36, likeCount: 400, type: 'bad', description: '1.5 days, very good' },
  { hoursAgo: 4, likeCount: 25, type: 'good', description: '4 hours, low engagement' },
];

function calculateExpectedHotScore(likeCount: number, hoursAgo: number): number {
  return likeCount / Math.pow(hoursAgo + 2, 1.5);
}

async function seedFeed() {
  console.log('🌱 Starting feed seed...\n');

  // Get existing user and pet
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('id')
    .limit(1);

  if (userError || !users?.length) {
    console.error('❌ No users found. Create a user first by signing up in the app.');
    process.exit(1);
  }

  const userId = users[0].id;
  console.log(`👤 Using user: ${userId}`);

  const { data: pets, error: petError } = await supabase
    .from('pets')
    .select('id, name')
    .eq('user_id', userId)
    .limit(1);

  if (petError || !pets?.length) {
    console.error('❌ No pets found. Add a pet first in the app.');
    process.exit(1);
  }

  const pet = pets[0];
  console.log(`🐾 Using pet: ${pet.name} (${pet.id})\n`);

  // Create media and posts
  const results: Array<{ description: string; likeCount: number; hoursAgo: number; expectedScore: number; actualScore: number }> = [];

  for (let i = 0; i < SEED_POSTS.length; i++) {
    const seedPost = SEED_POSTS[i];
    const imageUrl = SAMPLE_IMAGES[i % SAMPLE_IMAGES.length];

    // Calculate timestamps
    const createdAt = new Date(Date.now() - seedPost.hoursAgo * 60 * 60 * 1000);
    const expiresAt = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from creation

    // Create media record
    const { data: media, error: mediaError } = await supabase
      .from('media')
      .insert({
        user_id: userId,
        type: 'image',
        status: 'ready',
        original_url: imageUrl,
        cdn_url: imageUrl,
      })
      .select()
      .single();

    if (mediaError) {
      console.error(`❌ Failed to create media: ${mediaError.message}`);
      continue;
    }

    // Create post
    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        pet_id: pet.id,
        media_id: media.id,
        type: seedPost.type,
        tags: ['seeded', seedPost.type === 'good' ? 'goodbaby' : 'badbaby'],
        like_count: seedPost.likeCount,
        created_at: createdAt.toISOString(),
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (postError) {
      console.error(`❌ Failed to create post: ${postError.message}`);
      continue;
    }

    const expectedScore = calculateExpectedHotScore(seedPost.likeCount, seedPost.hoursAgo);

    results.push({
      description: seedPost.description,
      likeCount: seedPost.likeCount,
      hoursAgo: seedPost.hoursAgo,
      expectedScore,
      actualScore: post.hot_score,
    });

    console.log(`✅ Created: "${seedPost.description}"`);
  }

  // Sort by expected score to show ranking
  results.sort((a, b) => b.expectedScore - a.expectedScore);

  console.log('\n📊 Expected Hot Score Ranking:\n');
  console.log('Rank | Likes | Age (hrs) | Hot Score | Description');
  console.log('-----|-------|-----------|-----------|------------');

  results.forEach((r, i) => {
    console.log(
      `${String(i + 1).padStart(4)} | ${String(r.likeCount).padStart(5)} | ${String(r.hoursAgo).padStart(9)} | ${r.expectedScore.toFixed(2).padStart(9)} | ${r.description}`
    );
  });

  console.log('\n✨ Seed complete! Open the app and check the "Hot" feed tab.');
  console.log('Posts should appear in the order shown above (highest score first).\n');
}

// Run the seed
seedFeed().catch(console.error);
