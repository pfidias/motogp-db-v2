import type { Metadata } from "next";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignIn() {
  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <SignInForm />
    </main>
  );
}
