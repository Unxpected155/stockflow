import type { AuthError } from "@supabase/supabase-js";

const MESSAGES: Record<string, string> = {
  invalid_credentials: "Email or password is incorrect",
  email_not_confirmed: "Please confirm your email — check your inbox",
  user_already_registered: "An account with this email already exists",
  weak_password: "Password must be at least 8 characters",
  same_password: "New password must be different from the previous one",
  over_email_send_rate_limit: "Too many attempts — try again in a few minutes",
  over_request_rate_limit: "Too many attempts — try again in a few minutes",
};

const FALLBACK = "Something went wrong. Try again.";

export function mapAuthError(error: AuthError | null | undefined): string {
  if (!error) return FALLBACK;
  if (error.code && MESSAGES[error.code]) return MESSAGES[error.code];
  return error.message || FALLBACK;
}
