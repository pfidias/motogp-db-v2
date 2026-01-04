"use client";

import { LoadingButton } from "@/components/loading-button";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface ResendVerificationButtonProps {
  email: string;
}

export function ResendVerificationButton({
  email,
}: ResendVerificationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function resendVerificationEmail() {
    setSuccess(null);
    setError(null);
    setIsLoading(true);

    const { error } = await authClient.sendVerificationEmail({
      email,
      callbackURL: "/",
    });

    setIsLoading(false);

    if (error) {
      toast.error(error.message || "Something went wrong");
    } else {
      toast.success("Verification email sent successfully");
    }
  }

  return (
    <div className="space-y-4">
      {success && (
        <div role="status" className="text-sm text-foreground">
          {success}
        </div>
      )}
      {error && (
        <div role="alert" className="text-sm text-destructive">
          {error}
        </div>
      )}

      <LoadingButton
        onClick={resendVerificationEmail}
        className="w-full"
        loading={isLoading}
      >
        Resend verification email
      </LoadingButton>
    </div>
  );
}
