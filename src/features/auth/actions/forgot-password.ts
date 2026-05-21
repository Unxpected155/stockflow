"use server";

import { env } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { mapAuthError } from "@/features/auth/utils/auth-errors";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/features/auth/schemas/auth";

export type ForgotPasswordResult = { ok: true } | { ok: false; error: string };

export async function forgotPassword(
  input: ForgotPasswordInput,
): Promise<ForgotPasswordResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${env.NEXT_PUBLIC_APP_URL}/reset-password`,
  });

  if (error) {
    return { ok: false, error: mapAuthError(error) };
  }

  return { ok: true };
}
