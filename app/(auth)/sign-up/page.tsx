import type { Metadata } from "next";
import { SignUpForm } from "./sign-up-form";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function SignUp() {
  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <SignUpForm />
    </main>
  );
}
