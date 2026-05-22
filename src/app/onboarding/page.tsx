import Link from "next/link";
import { Construction } from "lucide-react";

import { requireAuth } from "@/lib/auth";
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

export const metadata = { title: "Welcome" };

export default async function OnboardingPage() {
  await requireAuth();

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="items-center text-center">
          <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <Construction className="size-5" aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl">Welcome to StockFlow</CardTitle>
          <CardDescription>
            Your account is ready. The organization-creation flow lands in the next slice — once it&apos;s in,
            you&apos;ll land here right after signup to create your workspace.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          For now this page is a placeholder so the auth redirect doesn&apos;t 404.
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
