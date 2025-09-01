import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types for our database schema
export interface Profile {
  id: string
  username?: string
  display_name?: string
  discord_id?: string
  discord_username?: string
  avatar_url?: string
  role: 'admin' | 'manager' | 'member'
  permissions: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: '未着手' | '進行中' | 'レビュー待ち' | '完了'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignee_id?: string
  reporter_id?: string
  reviewer_id?: string
  due_date?: string
  estimated_hours?: number
  actual_hours?: number
  tags?: string[]
  discord_thread_id?: string
  created_at: string
  updated_at: string
  // Relations
  assignee?: Profile
  reporter?: Profile
  reviewer?: Profile
}

export interface TaskComment {
  id: string
  task_id: string
  author_id?: string
  content: string
  is_internal: boolean
  discord_message_id?: string
  created_at: string
  updated_at: string
  // Relations
  author?: Profile
}

export interface TaskHistory {
  id: string
  task_id: string
  changed_by?: string
  field_name: string
  old_value?: string
  new_value?: string
  created_at: string
  // Relations
  changed_by_profile?: Profile
}