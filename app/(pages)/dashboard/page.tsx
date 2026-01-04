import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserAvatar } from "@/components/user-avatar";
import { User } from "@/lib/auth";
import { getServerSession } from "@/lib/server-session";
import { format } from "date-fns";
import { CalendarDaysIcon, MailIcon, ShieldIcon, UserIcon } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import UpdateProfileBtn from "./update-profile-btn";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) redirect("/sign-in");
  if (!user.emailVerified) redirect("/verify-email");

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-foreground">
            Welcome back! Here&apos;s your account overview.
          </p>
        </div>
        <ProfileInformation user={user} />
      </div>
    </main>
  );
}

interface ProfileInformationProps {
  user: User;
}

function ProfileInformation({ user }: ProfileInformationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <UserIcon className="size-5" />
          Profile Information
          </div>
        </CardTitle>
        <CardDescription>
          Your account details and current status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex flex-col items-center gap-3">
            <UserAvatar
              name={user.name}
              image={user.image}
              className="size-32 sm:size-24 border-2"
            />
            {user.role && (
              <Badge>
                <ShieldIcon className="size-3" />
                {user.role}
              </Badge>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-2xl font-semibold">{user.name}</h3>
              <p className="text-muted-foreground">{user.email}</p>
            </div>

            <div className="space-y-2">
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <CalendarDaysIcon className="size-4" />
                Member Since
              </div>
              <p className="font-medium">
                {format(user.createdAt, "MMMM d, yyyy")}
              </p>
            </div>
          </div>

          <UpdateProfileBtn />
        </div>

      </CardContent>
    </Card>
  );
}