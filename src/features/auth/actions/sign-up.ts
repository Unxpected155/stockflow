"use server";

import { env } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { mapAuthError } from "@/features/auth/utils/auth-errors";
import { signupSchema, type SignupInput } from "@/features/auth/schemas/auth";

export type SignUpResult =
  | { ok: true; email: string }
  | { ok: false; error: string };

export async function signUp(input: SignupInput): Promise<SignUpResult> {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { email, password, fullName } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      data: fullName ? { full_name: fullName } : undefined,
    },
  });

  if (error) {
    return { ok: false, error: mapAuthError(error) };
  }

  return { ok: true, email };
}
