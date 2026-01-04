import type { Metadata } from 'next';
import { Geist_Mono, Poppins, Merriweather } from 'next/font/google';
import MotoGP from 'next/font/local';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import NavBar from '@/components/NavBar';
import { getServerSession } from '@/lib/server-session';
import { Account } from '@/app/models/account';
import { Account as AccountType } from 'better-auth';
import AuthContextProvider from './contexts/auth-context';

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['200', '400', '700'],
  variable: '--font-poppins',
});

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-merriweather',
});

const motogp = MotoGP({
  src: '../public/fonts/MotoGP.ttf',
  variable: '--font-motogp',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MotoGP DB Auth',
  description: 'Testing authentication with MotoGP DB',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  const user = session?.user;

  const account: AccountType = await Account.findOne<AccountType>({
    userId: user?.id,
  }).then((res) => JSON.parse(JSON.stringify(res)));

  return (
    <html lang="en">
      <AuthContextProvider user={user} account={account}>
        <body
          className={`${merriweather.variable} ${geistMono.variable} ${poppins.variable} ${motogp.variable} antialiased`}
        >
          <div className="from-background via-background-via to-background-to flex min-h-screen flex-col bg-linear-to-r">
            {user?.emailVerified && <NavBar user={user} />}
            {children}
          </div>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 6000,
              style: {
                fontSize: '11px',
              },
            }}
          />
        </body>
      </AuthContextProvider>
    </html>
  );
}
