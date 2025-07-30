import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.https://rlupihuiukrjskvxypdc.supabase.coNEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsdXBpaHVpdWtyanNrdnh5cGRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDY3NDAsImV4cCI6MjA2Nzk4Mjc0MH0.rPpJNba5TAm553bpaEMor0hmhrj8wnDv8siUV7h7IOY;

export const supabase = createClient(supabaseUrl, supabaseKey);