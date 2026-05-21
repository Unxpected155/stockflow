"use server";

import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { mapAuthError } from "@/features/auth/utils/auth-errors";
import { loginSchema, type LoginInput } from "@/features/auth/schemas/auth";

export type SignInResult =
  | { ok: true; redirectTo: "/dashboard" | "/onboarding" }
  | { ok: false; error: string };

export async function signIn(input: LoginInput): Promise<SignInResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { ok: false, error: mapAuthError(error) };
  }

  const user = await getCurrentUser();
  return {
    ok: true,
    redirectTo: user?.membership ? "/dashboard" : "/onboarding",
  };
}
