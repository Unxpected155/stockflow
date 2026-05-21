"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { toast } from "sonner";
import { Loader2, MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { forgotPassword } from "@/features/auth/actions";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/features/auth/schemas/auth";

export function ForgotPasswordForm() {
  const [sentTo, setSentTo] = React.useState<string | null>(null);
  const form = useForm<ForgotPasswordInput>({
    resolver: standardSchemaResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordInput) {
    const result = await forgotPassword(values);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setSentTo(values.email);
  }

  if (sentTo) {
    return (
      <div className="grid gap-3 text-center">
        <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-success/10 text-success">
          <MailCheck className="size-5" aria-hidden="true" />
        </div>
        <p className="text-sm text-foreground">
          We sent a reset link to <span className="font-medium">{sentTo}</span>.
        </p>
        <p className="text-xs text-muted-foreground">
          The link expires in 1 hour. If you don&apos;t see it, check your spam folder.
        </p>
      </div>
    );
  }

  const pending = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" />}
          Send reset link
        </Button>
      </form>
    </Form>
  );
}
