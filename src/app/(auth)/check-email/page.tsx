import Link from "next/link";
import { MailCheck } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardKicker } from "@/features/auth/components/card-kicker";

export const metadata = {
  title: "Check your email",
};

type SearchParams = Promise<{ email?: string }>;

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { email } = await searchParams;

  return (
    <Card className="shadow-sm">
      <CardHeader className="items-center text-center">
        <CardKicker label="/verify" />
        <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-success/10 text-success">
          <MailCheck className="size-5" aria-hidden="true" />
        </div>
        <CardTitle className="text-2xl">Check your inbox</CardTitle>
        <CardDescription>
          {email ? (
            <>
              We sent a confirmation link to{" "}
              <span className="font-medium text-foreground">{email}</span>.
            </>
          ) : (
            <>We sent you a confirmation link to verify your email.</>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center text-sm text-muted-foreground">
        Click the link in the email to finish creating your account. The link expires in 24 hours.
      </CardContent>
      <CardFooter className="justify-center">
        <Link
          href="/login"
          className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Back to sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
