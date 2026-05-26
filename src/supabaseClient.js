import { createClient } from '@supabase/supabase-client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("የ Supabase ቁልፎች አልተገኙም! እባክህ Vercel ላይ Environment Variables በትክክል መሙላትህን አረጋግጥ።");
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
