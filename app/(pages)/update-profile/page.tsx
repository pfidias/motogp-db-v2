import { getServerSession } from '@/lib/server-session';
import { Account } from '@/app/models/account';
import { Account as AccountType } from 'better-auth';
import type { Metadata } from 'next';
import { EmailForm } from './email-form';
import { LogoutEverywhereButton } from './logout-everywhere-button';
import { PasswordForm } from './password-form';
import { ProfileDetailsForm } from './profile-details-form';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function UpdateProfilePage() {
  const session = await getServerSession();
  const user = session?.user;
  const account = await Account.findOne<AccountType>({ userId: user?.id });

  if (!user || !account) redirect('/sign-in');
  const providerId = account.providerId;
  if (providerId !== 'credential') redirect('/dashboard');

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Update Profile</h1>
          <p className="text-foreground">
            Update your account details, email, and password.
          </p>
        </div>
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1">
            <ProfileDetailsForm user={user} />
          </div>
          <div className="flex-1 space-y-6">
            <EmailForm currentEmail={user.email} />
            <PasswordForm />
            <LogoutEverywhereButton />
          </div>
        </div>
      </div>
    </main>
  );
}
