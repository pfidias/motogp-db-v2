'use client';

import { useContext } from 'react';
import { AuthContext } from '@/app/contexts/auth-context';

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      'useAuthContext must be used within an AuthContextProvider',
    );
  }
  return context;
}
