import { createClient } from '@supabase/supabase-js'

// Create Supabase client with explicit storage
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storageKey: 'supabase-auth-token',
      storage:
        typeof window !== 'undefined'
          ? window.localStorage
          : undefined,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
)

export type AuthUser = {
  id: string
  email: string
  aud: string
  role: string
  email_confirmed_at: string | null
  phone_confirmed_at: string | null
  confirmed_at: string | null
  last_sign_in_at: string | null
  app_metadata: Record<string, any>
  user_metadata: Record<string, any>
  identities: any[]
  created_at: string
  updated_at: string
}
