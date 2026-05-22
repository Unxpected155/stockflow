import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardKicker } from "@/features/auth/components/card-kicker";
import { SignupForm } from "@/features/auth/components/signup-form";

export const metadata = {
  title: "Create account",
};

export default function SignupPage() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="text-center">
        <CardKicker label="/signup" />
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>Start managing inventory in minutes.</CardDescription>
      </CardHeader>
      <CardContent>
        <SignupForm />
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
