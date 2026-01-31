// Database types for Good Baby Bad Baby
// Re-exports from auto-generated types with convenience aliases
// Regenerate with: npm run db:types

import type { Database } from './database.generated';

// Re-export the Database type from generated file (includes RPC functions)
export type { Database, Json } from './database.generated';

// Convenience type aliases for enums
export type SpeciesType = Database['public']['Enums']['species_type'];
export type MediaType = Database['public']['Enums']['media_type'];
export type PostType = Database['public']['Enums']['post_type'];
export type MediaStatus = Database['public']['Enums']['media_status'];
export type SuggestionStatus = 'pending' | 'approved' | 'rejected'; // Not in DB enum yet

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// Convenience type aliases for table rows
export type User = Tables<'users'>;
export type Pet = Tables<'pets'>;
export type Media = Tables<'media'>;
export type Post = Tables<'posts'>;
export type Like = Tables<'likes'>;
export type Follow = Tables<'follows'>;
export type TagSuggestion = Tables<'tag_suggestions'>;
export type CuratedTag = Tables<'curated_tags'>;
