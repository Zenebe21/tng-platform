import { createClient } from '@supabase/supabase-js';

// እነዚህ ቁልፎች በኋላ ላይ በVercel Dashboard ውስጥ ሚስጥራዊነታቸው ተጠብቆ ይገባሉ
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("የSupabase አካባቢ ቁልፎች (Environment Variables) አልተገኙም!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
