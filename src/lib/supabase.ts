import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_KEY } from "astro:env/server"

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY,
    {
        auth: {
          flowType: "pkce",
        },
      },
  );

export interface FormSubmission {
  id: string
  form_id: string
  data: Record<string, any>
  created_at: string
  email: string
}

export interface Form {
  id: string
  user_id: string
  name: string
  fields: string[]
  created_at: string
  notify_email?: string
}
