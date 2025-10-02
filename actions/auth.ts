"use server";

import { cookies } from "next/headers";
import {
  SignInSchema,
  SignUpSchema,
  type SignInValues,
  type SignUpValues,
} from "@/types";
import { createClient } from "@supabase/supabase-js";
import { setSession } from '@/lib/auth/session';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function getJwtSecret() {
  return new TextEncoder().encode(process.env.AUTH_SECRET ?? "dev-secret");
}

async function setSessionCookie(accessToken: string) {
  // Create our own session cookie from Supabase user info
  try {
    const { data } = await supabase.auth.getUser(accessToken);
    if (data?.user?.id) {
      await setSession({ id: data.user.id, email: data.user.email ?? undefined });
    }
  } catch (_) {
    // fallback: do nothing; middleware will treat as guest
  }
}

export async function signUpAction(values: SignUpValues) {
  const parsed = SignUpSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten() };
  }

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        fullName: parsed.data.fullName,
      },
    },
  });

  if (error) {
    return {
      ok: false,
      error: { formErrors: [error.message], fieldErrors: {} },
    };
  }

  if (data.session?.access_token) {
    await setSessionCookie(data.session.access_token);
  }

  return {
    ok: true,
    user: {
      id: data.user?.id ?? "",
      fullName: parsed.data.fullName,
      email: parsed.data.email,
    },
  };
}

export async function signInAction(values: SignInValues) {
  const parsed = SignInSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten() };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !data.session?.access_token) {
    return {
      ok: false,
      error: { formErrors: ["Invalid email or password"], fieldErrors: {} },
    };
  }

  await setSessionCookie(data.session.access_token);

  return {
    ok: true,
    user: {
      id: data.user?.id ?? "",
      fullName: data.user?.user_metadata?.fullName ?? "",
      email: data.user?.email ?? "",
    },
  };
}

export async function signOutAction() {
  const cookieStore = cookies();
  (await cookieStore).set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return { ok: true };
}
