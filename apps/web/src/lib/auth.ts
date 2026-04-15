import { supabase } from "./supabase"

export const getCurrentUser = async () => {
  if (!supabase) return null
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.user || null
}

export const signOut = async () => {
  if (!supabase) return
  await supabase.auth.signOut()
}

export const signInWithEmail = async (email: string, password: string) => {
  if (!supabase) return { error: "Supabase not configured" }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { user: data.user, session: data.session, error }
}

export const signUpWithEmail = async (
  email: string,
  password: string,
  name?: string
) => {
  if (!supabase) return { error: "Supabase not configured" }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  })
  return { user: data.user, session: data.session, error }
}

export const signInWithGoogle = async () => {
  if (!supabase) return { error: "Supabase not configured" }
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  })
  return { data, error }
}

export const resetPassword = async (email: string) => {
  if (!supabase) return { error: "Supabase not configured" }
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  return { error }
}

export const onAuthStateChange = (callback: (user: unknown) => void) => {
  if (!supabase) {
    callback(null)
    return () => {}
  }
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null)
  })
  return () => subscription.unsubscribe()
}
