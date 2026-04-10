import { supabase } from "./supabase"

export const getCurrentUser = async () => {
  if (!supabase) return null
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user || null
}

export const signOut = async () => {
  if (!supabase) return
  await supabase.auth.signOut()
}

export const onAuthStateChange = (callback: (user: unknown) => void) => {
  if (!supabase) {
    callback(null)
    return () => {}
  }
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null)
  })
  return () => subscription.unsubscribe()
}
