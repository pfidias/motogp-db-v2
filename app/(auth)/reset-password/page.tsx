import type { Metadata } from "next";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Reset password",
};

interface ResetPasswordPageProps {
  searchParams: Promise<{ token: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams;

  return (
    <main className="flex flex-1 items-center justify-center px-4">
      {token ? (
        <ResetPasswordUI token={token} />
      ) : (
        <div role="alert" className="text-foreground px-8 py-2 bg-destructive rounded-md">
          Token is missing.
        </div>
      )}
    </main>
  );
}

interface ResetPasswordUIProps {
  token: string;
}

function ResetPasswordUI({ token }: ResetPasswordUIProps) {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Reset password</h1>
        <p className="text-foreground">Enter your new password below.</p>
      </div>
      <ResetPasswordForm token={token} />
    </div>
  );
}
