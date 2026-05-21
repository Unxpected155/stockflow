"use client";

import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/features/auth/actions";

export function GoogleButton({ label = "Continue with Google" }: { label?: string }) {
  const [pending, startTransition] = React.useTransition();

  function onClick() {
    startTransition(async () => {
      const result = await signInWithGoogle();
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      window.location.assign(result.url);
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={onClick}
      disabled={pending}
      aria-label={label}
    >
      <GoogleMark />
      {label}
    </Button>
  );
}

function GoogleMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4"
    >
      <path
        fill="#EA4335"
        d="M12 10.2v3.92h5.46c-.24 1.4-1.66 4.1-5.46 4.1-3.28 0-5.96-2.72-5.96-6.06s2.68-6.06 5.96-6.06c1.86 0 3.12.8 3.84 1.48l2.62-2.52C16.78 3.5 14.62 2.5 12 2.5 6.86 2.5 2.7 6.66 2.7 11.8s4.16 9.3 9.3 9.3c5.36 0 8.92-3.76 8.92-9.06 0-.6-.06-1.06-.14-1.84H12z"
      />
      <path
        fill="#4285F4"
        d="M21.78 11.94c0-.74-.06-1.3-.18-1.86H12v3.4h5.62c-.12.92-.74 2.3-2.12 3.22l-.02.14 3.08 2.38.22.02c1.96-1.8 3.08-4.46 3.08-7.3z"
      />
      <path
        fill="#FBBC05"
        d="M6.84 13.84c-.18-.54-.28-1.12-.28-1.72s.1-1.18.28-1.72L6.83 10.27 3.7 7.88l-.1.04C2.96 9.16 2.6 10.54 2.6 12s.36 2.84 1 4.08l3.24-2.24z"
      />
      <path
        fill="#34A853"
        d="M12 21.5c2.7 0 4.96-.88 6.62-2.4l-3.16-2.44c-.86.6-2 1.02-3.46 1.02-2.64 0-4.88-1.74-5.68-4.14l-.12.02L3.06 16c1.64 3.24 5 5.5 8.94 5.5z"
      />
    </svg>
  );
}
