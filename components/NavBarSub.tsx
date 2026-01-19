'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { downloadPrimaryData } from '@/lib/download-primary-data';

const NavBarSub = () => {
  const pathname = usePathname();

  return pathname.startsWith('/admin') ? <AdminNavBarSub /> : <UserNavBarSub />;
};

export default NavBarSub;

const UserNavBarSub = () => {
  const [title, setTitle] = useState('Select a Season');

  return (
    <div
      className={cn(
        'to-db-orange bg-muted text-muted-foreground top-25 flex h-12 w-full items-center justify-between border-b border-white py-4 text-center',
      )}
    >
      <div className="w-1/3"></div>
      <p className="w-1/3 text-lg font-semibold">{title}</p>
      <div className="flex w-1/3 items-center justify-end gap-x-4 pr-16 text-right text-xs text-slate-900">
        <Link href="#">Graphs</Link>
        <Link href="#">Statistics</Link>
        <Link href="#">Navigation</Link>
      </div>
    </div>
  );
};

const AdminNavBarSub = () => {
  return (
    <div
      className={cn(
        'text-foreground top-25 flex h-12 w-full items-center justify-between bg-linear-to-r from-orange-500 to-orange-400 py-4 text-center',
      )}
    >
      <div className="w-1/3"></div>
      <p className="text-foreground w-1/3 text-lg font-semibold">Admin Panel</p>
      <div className="flex w-1/3 items-center justify-end gap-x-4 pr-16 text-right text-xs text-slate-900">
        <Link href="/admin/upload-image">Image</Link>
        <Link href="/admin/users">Users</Link>
        <button
          onClick={async () => {
            const result = await downloadPrimaryData();
            console.log(result);
          }}
        >
          Download
        </button>
      </div>
    </div>
  );
};
