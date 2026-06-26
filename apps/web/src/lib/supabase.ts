import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://hatcikiekxvqmxtnzzos.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhdGNpa2lla3h2cW14dG56em9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NTI2NzMsImV4cCI6MjA5MTMyODY3M30.eSVrHrsCmxam5JVgM7JZtmeXxfm5wA8SBQohYn6kA5c"

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Missing Supabase environment variables. Data will not load from Supabase."
  )
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const getSupabaseClient = () => supabase
