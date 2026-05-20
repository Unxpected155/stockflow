import { redirect } from "next/navigation";

import type { CurrentUser } from "@/types/database";

import { getCurrentUser } from "./get-current-user";

/**
 * Guard: requires an authenticated session.
 *
 * Redirects to `/login` if no session. Returns the resolved user otherwise.
 *
 * Use in Server Components and Server Actions inside protected routes when
 * an organization membership is NOT required (e.g., the onboarding flow
 * itself).
 *
 * See: Projects/StockFlow/Auth-Flow.md
 */
export async function requireAuth(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}
