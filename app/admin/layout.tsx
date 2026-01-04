import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/server-session';

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) redirect('/sign-in');
  if (!user?.emailVerified) redirect('/verify-email');
  if (user.role !== 'admin') redirect('/'); // eventually show a "not authorized" page

  return (
    <div className="flex-1 flex-col bg-zinc-200 px-6 py-12">{children}</div>
  );
}
