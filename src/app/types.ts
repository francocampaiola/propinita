export interface IResponse<T> {
  data?: T
  errorMessage?: string | string[]
  successMessage?: string
}

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
      oauth_mercadopago: {
        Row: {
          access_token: string | null
          created_at: string
          expires_in: number | null
          fk_user: number | null
          id: number
          mp_user_id: number | null
          refresh_token: string | null
          scope: string | null
          token_type: string | null
          updated_at: string | null
        }
        Insert: {
          access_token?: string | null
          created_at?: string
          expires_in?: number | null
          fk_user?: number | null
          id?: number
          mp_user_id?: number | null
          refresh_token?: string | null
          scope?: string | null
          token_type?: string | null
          updated_at?: string | null
        }
        Update: {
          access_token?: string | null
          created_at?: string
          expires_in?: number | null
          fk_user?: number | null
          id?: number
          mp_user_id?: number | null
          refresh_token?: string | null
          scope?: string | null
          token_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "oauth_mercadopago_fk_user_fkey"
            columns: ["fk_user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number | null
          created_at: string
          fk_user: number | null
          id: number
          status: Database["public"]["Enums"]["transaction_status"] | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          fk_user?: number | null
          id?: number
          status?: Database["public"]["Enums"]["transaction_status"] | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          fk_user?: number | null
          id?: number
          status?: Database["public"]["Enums"]["transaction_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_fk_user_fkey"
            columns: ["fk_user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string
          fk_user: number | null
          id: number
          theme: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          fk_user?: number | null
          id?: number
          theme?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          fk_user?: number | null
          id?: number
          theme?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_fk_user_fkey"
            columns: ["fk_user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          birthdate: string | null
          civil_state: string | null
          created_at: string
          email: string | null
          first_name: string | null
          fk_user: string | null
          id: number
          last_name: string | null
          nationality: string | null
          password: string | null
          phone: string | null
          status: Database["public"]["Enums"]["user_status"] | null
          user_signup_status:
            | Database["public"]["Enums"]["signup_status"]
            | null
        }
        Insert: {
          birthdate?: string | null
          civil_state?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          fk_user?: string | null
          id?: number
          last_name?: string | null
          nationality?: string | null
          password?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          user_signup_status?:
            | Database["public"]["Enums"]["signup_status"]
            | null
        }
        Update: {
          birthdate?: string | null
          civil_state?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          fk_user?: string | null
          id?: number
          last_name?: string | null
          nationality?: string | null
          password?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          user_signup_status?:
            | Database["public"]["Enums"]["signup_status"]
            | null
        }
        Relationships: []
      }
      wallets: {
        Row: {
          balance: number | null
          created_at: string
          fk_user: number | null
          id: number
          updated_at: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string
          fk_user?: number | null
          id?: number
          updated_at?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string
          fk_user?: number | null
          id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallets_fk_user_fkey"
            columns: ["fk_user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      signup_status:
        | "user_type"
        | "user_personal_data"
        | "user_bank_data"
        | "user_summary"
      transaction_status: "pending" | "completed" | "failed"
      user_status: "active" | "inactive" | "blocked"
      user_type: "user" | "provider"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
