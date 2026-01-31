export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      curated_tags: {
        Row: {
          category: string
          created_at: string
          id: string
          tag: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          tag: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          tag?: string
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string
          id: string
          pet_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          pet_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          pet_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_with_media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          cdn_url: string | null
          created_at: string
          duration: number | null
          file_size: number | null
          height: number | null
          id: string
          mux_asset_id: string | null
          mux_playback_id: string | null
          original_url: string
          status: Database["public"]["Enums"]["media_status"]
          thumbnail_url: string | null
          type: Database["public"]["Enums"]["media_type"]
          user_id: string
          width: number | null
        }
        Insert: {
          cdn_url?: string | null
          created_at?: string
          duration?: number | null
          file_size?: number | null
          height?: number | null
          id?: string
          mux_asset_id?: string | null
          mux_playback_id?: string | null
          original_url: string
          status?: Database["public"]["Enums"]["media_status"]
          thumbnail_url?: string | null
          type: Database["public"]["Enums"]["media_type"]
          user_id: string
          width?: number | null
        }
        Update: {
          cdn_url?: string | null
          created_at?: string
          duration?: number | null
          file_size?: number | null
          height?: number | null
          id?: string
          mux_asset_id?: string | null
          mux_playback_id?: string | null
          original_url?: string
          status?: Database["public"]["Enums"]["media_status"]
          thumbnail_url?: string | null
          type?: Database["public"]["Enums"]["media_type"]
          user_id?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          avatar_url: string | null
          bad_baby_crowns: number
          created_at: string
          follower_count: number
          good_baby_crowns: number
          id: string
          name: string
          pinned_post_ids: string[] | null
          species: Database["public"]["Enums"]["species_type"]
          total_likes_received: number
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bad_baby_crowns?: number
          created_at?: string
          follower_count?: number
          good_baby_crowns?: number
          id?: string
          name: string
          pinned_post_ids?: string[] | null
          species: Database["public"]["Enums"]["species_type"]
          total_likes_received?: number
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bad_baby_crowns?: number
          created_at?: string
          follower_count?: number
          good_baby_crowns?: number
          id?: string
          name?: string
          pinned_post_ids?: string[] | null
          species?: Database["public"]["Enums"]["species_type"]
          total_likes_received?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          created_at: string
          current_champion: boolean
          expires_at: string
          hot_score: number
          id: string
          is_pinned: boolean
          is_winner: boolean
          like_count: number
          media_id: string
          pet_id: string
          tags: string[] | null
          type: Database["public"]["Enums"]["post_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          current_champion?: boolean
          expires_at?: string
          hot_score?: number
          id?: string
          is_pinned?: boolean
          is_winner?: boolean
          like_count?: number
          media_id: string
          pet_id: string
          tags?: string[] | null
          type: Database["public"]["Enums"]["post_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          current_champion?: boolean
          expires_at?: string
          hot_score?: number
          id?: string
          is_pinned?: boolean
          is_winner?: boolean
          like_count?: number
          media_id?: string
          pet_id?: string
          tags?: string[] | null
          type?: Database["public"]["Enums"]["post_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tag_suggestions: {
        Row: {
          created_at: string
          id: string
          reviewed_at: string | null
          status: Database["public"]["Enums"]["suggestion_status"]
          suggested_tag: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["suggestion_status"]
          suggested_tag: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["suggestion_status"]
          suggested_tag?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tag_suggestions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          badges: Json | null
          created_at: string
          display_name: string
          id: string
          is_premium: boolean
          last_post_date: string | null
          pinned_post_ids: string[] | null
          premium_pin_slots: number
          streak: number
          total_likes_received: number
        }
        Insert: {
          avatar_url?: string | null
          badges?: Json | null
          created_at?: string
          display_name: string
          id: string
          is_premium?: boolean
          last_post_date?: string | null
          pinned_post_ids?: string[] | null
          premium_pin_slots?: number
          streak?: number
          total_likes_received?: number
        }
        Update: {
          avatar_url?: string | null
          badges?: Json | null
          created_at?: string
          display_name?: string
          id?: string
          is_premium?: boolean
          last_post_date?: string | null
          pinned_post_ids?: string[] | null
          premium_pin_slots?: number
          streak?: number
          total_likes_received?: number
        }
        Relationships: []
      }
    }
    Views: {
      posts_with_media: {
        Row: {
          cdn_url: string | null
          created_at: string | null
          current_champion: boolean | null
          expires_at: string | null
          file_size: number | null
          hot_score: number | null
          id: string | null
          is_pinned: boolean | null
          is_winner: boolean | null
          like_count: number | null
          media_height: number | null
          media_id: string | null
          media_type: Database["public"]["Enums"]["media_type"] | null
          media_url: string | null
          media_width: number | null
          mux_playback_id: string | null
          pet_id: string | null
          tags: string[] | null
          thumbnail_url: string | null
          type: Database["public"]["Enums"]["post_type"] | null
          user_id: string | null
          video_duration: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_storage_usage: {
        Row: {
          image_bytes: number | null
          media_count: number | null
          total_bytes: number | null
          user_id: string | null
          video_bytes: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calculate_hot_score: {
        Args: { p_created_at: string; p_like_count: number }
        Returns: number
      }
      decrement_pet_likes: {
        Args: { pet_id_param: string }
        Returns: undefined
      }
      decrement_user_likes: {
        Args: { user_id_param: string }
        Returns: undefined
      }
      get_my_storage_usage: {
        Args: never
        Returns: {
          image_bytes: number
          media_count: number
          total_bytes: number
          video_bytes: number
        }[]
      }
      get_personalized_feed: {
        Args: {
          p_cursor?: number
          p_feed_type?: string
          p_filter?: string
          p_limit?: number
          p_species?: string
          p_user_id: string
        }
        Returns: {
          created_at: string
          current_champion: boolean
          expires_at: string
          hot_score: number
          id: string
          is_followed: boolean
          is_pinned: boolean
          is_winner: boolean
          like_count: number
          media_id: string
          personalized_score: number
          pet_id: string
          tags: string[]
          type: string
          user_id: string
        }[]
      }
      increment_pet_likes: {
        Args: { pet_id_param: string }
        Returns: undefined
      }
      increment_user_likes: {
        Args: { user_id_param: string }
        Returns: undefined
      }
      recalculate_all_hot_scores: { Args: never; Returns: number }
    }
    Enums: {
      media_status: "uploading" | "processing" | "ready" | "error"
      media_type: "image" | "video"
      post_type: "good" | "bad"
      species_type:
        | "dog"
        | "cat"
        | "bird"
        | "rabbit"
        | "hamster"
        | "guinea_pig"
        | "fish"
        | "reptile"
        | "amphibian"
        | "horse"
        | "farm"
        | "exotic"
        | "other"
      suggestion_status: "pending" | "approved" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      media_status: ["uploading", "processing", "ready", "error"],
      media_type: ["image", "video"],
      post_type: ["good", "bad"],
      species_type: [
        "dog",
        "cat",
        "bird",
        "rabbit",
        "hamster",
        "guinea_pig",
        "fish",
        "reptile",
        "amphibian",
        "horse",
        "farm",
        "exotic",
        "other",
      ],
      suggestion_status: ["pending", "approved", "rejected"],
    },
  },
} as const
