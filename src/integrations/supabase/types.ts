export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      group_members: {
        Row: {
          emergency_contact: string | null
          group_id: string
          id: string
          joined_at: string
          last_seen: string | null
          nickname: string | null
          role: Database["public"]["Enums"]["group_member_role"]
          status: Database["public"]["Enums"]["group_member_status"]
          user_id: string
        }
        Insert: {
          emergency_contact?: string | null
          group_id: string
          id?: string
          joined_at?: string
          last_seen?: string | null
          nickname?: string | null
          role?: Database["public"]["Enums"]["group_member_role"]
          status?: Database["public"]["Enums"]["group_member_status"]
          user_id: string
        }
        Update: {
          emergency_contact?: string | null
          group_id?: string
          id?: string
          joined_at?: string
          last_seen?: string | null
          nickname?: string | null
          role?: Database["public"]["Enums"]["group_member_role"]
          status?: Database["public"]["Enums"]["group_member_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          avatar_url: string | null
          created_at: string
          created_by: string
          emoji: string | null
          id: string
          invite_code: string
          member_count: number
          name: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          created_by: string
          emoji?: string | null
          id?: string
          invite_code: string
          member_count?: number
          name: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          created_by?: string
          emoji?: string | null
          id?: string
          invite_code?: string
          member_count?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      session_confirmations: {
        Row: {
          confirmed_at: string
          dietary_notes: string | null
          emergency_contact: string
          has_eaten: boolean
          id: string
          last_meal_hours_ago: number | null
          personal_budget: number | null
          session_id: string
          special_notes: string | null
          transport_method: string
          user_id: string
        }
        Insert: {
          confirmed_at?: string
          dietary_notes?: string | null
          emergency_contact: string
          has_eaten: boolean
          id?: string
          last_meal_hours_ago?: number | null
          personal_budget?: number | null
          session_id: string
          special_notes?: string | null
          transport_method: string
          user_id: string
        }
        Update: {
          confirmed_at?: string
          dietary_notes?: string | null
          emergency_contact?: string
          has_eaten?: boolean
          id?: string
          last_meal_hours_ago?: number | null
          personal_budget?: number | null
          session_id?: string
          special_notes?: string | null
          transport_method?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_confirmations_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_invitations: {
        Row: {
          id: string
          invited_at: string
          responded_at: string | null
          session_id: string
          status: Database["public"]["Enums"]["invitation_status"]
          user_id: string
        }
        Insert: {
          id?: string
          invited_at?: string
          responded_at?: string | null
          session_id: string
          status?: Database["public"]["Enums"]["invitation_status"]
          user_id: string
        }
        Update: {
          id?: string
          invited_at?: string
          responded_at?: string | null
          session_id?: string
          status?: Database["public"]["Enums"]["invitation_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_invitations_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          actual_start_time: string | null
          budget_type: Database["public"]["Enums"]["budget_type"]
          cover_photo_url: string | null
          created_at: string
          description: string | null
          end_time: string | null
          group_id: string
          host_id: string
          id: string
          planned_start_time: string
          primary_venue: string | null
          session_date: string
          status: Database["public"]["Enums"]["session_status"]
          title: string
          transport_type: Database["public"]["Enums"]["transport_type"]
          updated_at: string
          video_visibility: Database["public"]["Enums"]["video_visibility"]
        }
        Insert: {
          actual_start_time?: string | null
          budget_type?: Database["public"]["Enums"]["budget_type"]
          cover_photo_url?: string | null
          created_at?: string
          description?: string | null
          end_time?: string | null
          group_id: string
          host_id: string
          id?: string
          planned_start_time: string
          primary_venue?: string | null
          session_date: string
          status?: Database["public"]["Enums"]["session_status"]
          title: string
          transport_type?: Database["public"]["Enums"]["transport_type"]
          updated_at?: string
          video_visibility?: Database["public"]["Enums"]["video_visibility"]
        }
        Update: {
          actual_start_time?: string | null
          budget_type?: Database["public"]["Enums"]["budget_type"]
          cover_photo_url?: string | null
          created_at?: string
          description?: string | null
          end_time?: string | null
          group_id?: string
          host_id?: string
          id?: string
          planned_start_time?: string
          primary_venue?: string | null
          session_date?: string
          status?: Database["public"]["Enums"]["session_status"]
          title?: string
          transport_type?: Database["public"]["Enums"]["transport_type"]
          updated_at?: string
          video_visibility?: Database["public"]["Enums"]["video_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "sessions_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_invite_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      budget_type: "individual" | "shared"
      group_member_role: "admin" | "member"
      group_member_status: "active" | "inactive"
      invitation_status: "pending" | "accepted" | "declined"
      session_status: "planning" | "active" | "completed"
      transport_type: "designated_driver" | "rideshare"
      video_visibility: "immediate" | "recap_only"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      budget_type: ["individual", "shared"],
      group_member_role: ["admin", "member"],
      group_member_status: ["active", "inactive"],
      invitation_status: ["pending", "accepted", "declined"],
      session_status: ["planning", "active", "completed"],
      transport_type: ["designated_driver", "rideshare"],
      video_visibility: ["immediate", "recap_only"],
    },
  },
} as const
