import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ✅ Validate environment variables (browser + server safe)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn(
    "⚠️ Supabase env vars missing — Supabase client will be null. " +
      "Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set."
  );
}

/**
 * Helper to safely access Supabase client.
 */
function getClient(): SupabaseClient {
  if (!supabase) {
    throw new Error("❌ Supabase client not initialized. Missing env vars.");
  }
  return supabase;
}

/**
 * Sign in a user with email and password using Supabase Auth.
 */
export async function signIn(email: string, password: string) {
  const supabase = getClient();
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({ email, password });
    console.log("Supabase sign-in response user:", user);

    if (error) {
      console.error("Supabase sign-in error:", error.message ?? error);
      throw error;
    }

    return user;
  } catch (err) {
    console.error("Unexpected sign-in error:", err);
    throw err;
  }
}

/**
 * Sign up a new user with email and password using Supabase Auth.
 */
export async function signUp(email: string, password: string) {
  const supabase = getClient();
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({ email, password });

    if (error) {
      console.error("Supabase sign-up error:", error.message ?? error);
      throw error;
    }

    return user;
  } catch (err) {
    console.error("Unexpected sign-up error:", err);
    throw err;
  }
}
