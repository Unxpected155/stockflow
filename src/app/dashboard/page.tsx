import { Construction } from "lucide-react";

import { requireOrg } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signOut } from "@/features/auth/actions";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  await requireOrg();

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="items-center text-center">
          <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <Construction className="size-5" aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl">Dashboard placeholder</CardTitle>
          <CardDescription>
            You have an organization — the real dashboard, sidebar, and KPI cards arrive in the next phase.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          This stub exists so the post-login redirect lands somewhere readable.
        </CardContent>
        <CardFooter className="justify-center">
          <form action={signOut}>
            <Button type="submit" variant="outline" size="sm">
              Sign out
            </Button>
          </form>
        </CardFooter>
      </Card>
    </main>
  );
}
