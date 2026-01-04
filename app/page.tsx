import Image from "next/image";
import { getServerSession } from "@/lib/server-session";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) redirect("/sign-in");
  if (user && !user.emailVerified) redirect("/verify-email");

  return (
    <div className="flex flex-1 items-center justify-center font-sans">
      This is home.
    </div>
  );
}
