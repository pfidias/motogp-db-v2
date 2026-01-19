'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/app/hooks/auth-context';

const UpdateProfileBtn = () => {
  const authData = useAuthContext();
  const providerId = authData?.account?.providerId;

  if (providerId !== 'credential') {
    return null;
  }

  return (
    <Button asChild>
      <Link href="/update-profile">Update Profile</Link>
    </Button>
  );
};

export default UpdateProfileBtn;
