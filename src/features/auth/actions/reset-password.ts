"use server";

import { createClient } from "@/lib/supabase/server";
import { mapAuthError } from "@/features/auth/utils/auth-errors";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/features/auth/schemas/auth";

export type ResetPasswordResult = { ok: true } | { ok: false; error: string };

export async function resetPassword(
  input: ResetPasswordInput,
): Promise<ResetPasswordResult> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });

  if (error) {
    return { ok: false, error: mapAuthError(error) };
  }

  return { ok: true };
}
