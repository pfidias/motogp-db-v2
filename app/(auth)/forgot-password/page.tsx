import type { Metadata } from "next";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password",
};

export default function ForgotPasswordPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <div className="space-y-6 w-full">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Forgot password</h1>
          <p className="text-foreground">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
