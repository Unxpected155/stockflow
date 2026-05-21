"use server";

import { env } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { mapAuthError } from "@/features/auth/utils/auth-errors";

export type OAuthResult = { ok: true; url: string } | { ok: false; error: string };

export async function signInWithGoogle(): Promise<OAuthResult> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error || !data?.url) {
    return { ok: false, error: mapAuthError(error) };
  }

  return { ok: true, url: data.url };
}
