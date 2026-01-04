import Image from 'next/image';
import { getServerSession } from '@/lib/server-session';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import logo from '@/app/assets/images/Logo.png';

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();
  const user = session?.user;

  if (user?.emailVerified) redirect('/');

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(to_right,rgba(0,0,0,0.6),rgba(0,0,0,0.1),rgba(0,0,0,0.6)),url('/images/racetrack.jpeg')] bg-cover bg-fixed bg-center bg-no-repeat px-6 py-12">
      <section className="flex flex-5 items-center justify-center gap-x-6 text-black">
        <Image src={logo} alt="MotoGP DB Logo" width={150} height={150} />
        <p className="font-motogp text-5xl font-bold text-white text-shadow-lg">
          MotoGP{' '}
          <span className="text-amber-500 text-shadow-black/40 text-shadow-lg">
            Database
          </span>
        </p>
      </section>
      <div className="flex flex-4 flex-col pr-6">{children}</div>
    </div>
  );
}
