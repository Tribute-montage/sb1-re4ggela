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
      assets: {
        Row: {
          id: string
          type: 'music' | 'cover' | 'scenery' | 'verse'
          name: string
          url: string
          thumbnail_url: string | null
          duration: number | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: 'music' | 'cover' | 'scenery' | 'verse'
          name: string
          url: string
          thumbnail_url?: string | null
          duration?: number | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: 'music' | 'cover' | 'scenery' | 'verse'
          name?: string
          url?: string
          thumbnail_url?: string | null
          duration?: number | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          client_id: string
          funeral_home: string
          order_number: string
          video_type: '6min-basic' | '6min-scenery' | '9min-basic' | '9min-scenery'
          subject_name: string
          date_of_birth: string | null
          date_of_death: string | null
          requested_delivery_date: string
          special_notes: string | null
          status: 'pending' | 'in-progress' | 'review' | 'completed'
          background_music_id: string | null
          cover_image_id: string | null
          scenery_id: string | null
          closing_verse_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          funeral_home: string
          order_number: string
          video_type: '6min-basic' | '6min-scenery' | '9min-basic' | '9min-scenery'
          subject_name: string
          date_of_birth?: string | null
          date_of_death?: string | null
          requested_delivery_date: string
          special_notes?: string | null
          status?: 'pending' | 'in-progress' | 'review' | 'completed'
          background_music_id?: string | null
          cover_image_id?: string | null
          scenery_id?: string | null
          closing_verse_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          funeral_home?: string
          order_number?: string
          video_type?: '6min-basic' | '6min-scenery' | '9min-basic' | '9min-scenery'
          subject_name?: string
          date_of_birth?: string | null
          date_of_death?: string | null
          requested_delivery_date?: string
          special_notes?: string | null
          status?: 'pending' | 'in-progress' | 'review' | 'completed'
          background_music_id?: string | null
          cover_image_id?: string | null
          scenery_id?: string | null
          closing_verse_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}