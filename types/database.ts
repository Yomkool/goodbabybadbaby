// Database types for Good Baby Bad Baby
// Generated from schema - Ticket 003
// Can be regenerated with: npx supabase gen types typescript --project-id hifdxgxkymfsarayfnfj > types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type SpeciesType =
  | 'dog'
  | 'cat'
  | 'bird'
  | 'rabbit'
  | 'hamster'
  | 'guinea_pig'
  | 'fish'
  | 'reptile'
  | 'amphibian'
  | 'horse'
  | 'farm'
  | 'exotic'
  | 'other';

export type MediaType = 'image' | 'video';

export type PostType = 'good' | 'bad';

export type SuggestionStatus = 'pending' | 'approved' | 'rejected';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          display_name: string;
          avatar_url: string | null;
          created_at: string;
          pinned_post_ids: string[];
          total_likes_received: number;
          badges: Json;
          streak: number;
          last_post_date: string | null;
          is_premium: boolean;
          premium_pin_slots: number;
        };
        Insert: {
          id: string;
          display_name: string;
          avatar_url?: string | null;
          created_at?: string;
          pinned_post_ids?: string[];
          total_likes_received?: number;
          badges?: Json;
          streak?: number;
          last_post_date?: string | null;
          is_premium?: boolean;
          premium_pin_slots?: number;
        };
        Update: {
          id?: string;
          display_name?: string;
          avatar_url?: string | null;
          created_at?: string;
          pinned_post_ids?: string[];
          total_likes_received?: number;
          badges?: Json;
          streak?: number;
          last_post_date?: string | null;
          is_premium?: boolean;
          premium_pin_slots?: number;
        };
        Relationships: [];
      };
      pets: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          species: SpeciesType;
          avatar_url: string | null;
          created_at: string;
          total_likes_received: number;
          follower_count: number;
          good_baby_crowns: number;
          bad_baby_crowns: number;
          pinned_post_ids: string[] | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          species: SpeciesType;
          avatar_url?: string | null;
          created_at?: string;
          total_likes_received?: number;
          follower_count?: number;
          good_baby_crowns?: number;
          bad_baby_crowns?: number;
          pinned_post_ids?: string[] | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          species?: SpeciesType;
          avatar_url?: string | null;
          created_at?: string;
          total_likes_received?: number;
          follower_count?: number;
          good_baby_crowns?: number;
          bad_baby_crowns?: number;
          pinned_post_ids?: string[] | null;
        };
        Relationships: [
          {
            foreignKeyName: 'pets_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          pet_id: string;
          media_type: MediaType;
          media_url: string;
          thumbnail_url: string | null;
          video_duration: number | null;
          type: PostType;
          tags: string[];
          like_count: number;
          created_at: string;
          expires_at: string;
          is_pinned: boolean;
          is_winner: boolean;
          current_champion: boolean;
          hot_score: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          pet_id: string;
          media_type: MediaType;
          media_url: string;
          thumbnail_url?: string | null;
          video_duration?: number | null;
          type: PostType;
          tags?: string[];
          like_count?: number;
          created_at?: string;
          expires_at?: string;
          is_pinned?: boolean;
          is_winner?: boolean;
          current_champion?: boolean;
          hot_score?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          pet_id?: string;
          media_type?: MediaType;
          media_url?: string;
          thumbnail_url?: string | null;
          video_duration?: number | null;
          type?: PostType;
          tags?: string[];
          like_count?: number;
          created_at?: string;
          expires_at?: string;
          is_pinned?: boolean;
          is_winner?: boolean;
          current_champion?: boolean;
          hot_score?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'posts_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'posts_pet_id_fkey';
            columns: ['pet_id'];
            referencedRelation: 'pets';
            referencedColumns: ['id'];
          }
        ];
      };
      likes: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'likes_post_id_fkey';
            columns: ['post_id'];
            referencedRelation: 'posts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'likes_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      follows: {
        Row: {
          id: string;
          pet_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          pet_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          pet_id?: string;
          user_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'follows_pet_id_fkey';
            columns: ['pet_id'];
            referencedRelation: 'pets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'follows_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      tag_suggestions: {
        Row: {
          id: string;
          user_id: string;
          suggested_tag: string;
          status: SuggestionStatus;
          created_at: string;
          reviewed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          suggested_tag: string;
          status?: SuggestionStatus;
          created_at?: string;
          reviewed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          suggested_tag?: string;
          status?: SuggestionStatus;
          created_at?: string;
          reviewed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'tag_suggestions_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      curated_tags: {
        Row: {
          id: string;
          tag: string;
          category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          tag: string;
          category: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          tag?: string;
          category?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      species_type: SpeciesType;
      media_type: MediaType;
      post_type: PostType;
      suggestion_status: SuggestionStatus;
    };
  };
}

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// Convenience type aliases
export type User = Tables<'users'>;
export type Pet = Tables<'pets'>;
export type Post = Tables<'posts'>;
export type Like = Tables<'likes'>;
export type Follow = Tables<'follows'>;
export type TagSuggestion = Tables<'tag_suggestions'>;
export type CuratedTag = Tables<'curated_tags'>;
