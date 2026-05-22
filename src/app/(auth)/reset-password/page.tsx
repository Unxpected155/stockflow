import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardKicker } from "@/features/auth/components/card-kicker";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const metadata = {
  title: "Reset password",
};

export default function ResetPasswordPage() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="text-center">
        <CardKicker label="/new password" />
        <CardTitle className="text-2xl">Set a new password</CardTitle>
        <CardDescription>
          Choose a strong password you haven&apos;t used before.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm />
      </CardContent>
    </Card>
  );
}
