'use server';

import { getServerSession } from '@/lib/server-session';
import { User } from '@/app/models/user';
import { Account } from '@/app/models/account';
import { revalidatePath } from 'next/cache';

export async function updateUserRole(userId: string, newRole: string) {
  const session = await getServerSession();
  const user = session?.user;

  if (user?.role !== 'admin') return { error: 'Unauthorized' };

  try {
    await User.updateOne({ _id: userId }, { role: newRole });
    revalidatePath('/admin/users');

    return { success: 'User role updated successfully' };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: 'Unknown error updating user role' };
    }
  }
}

export async function deleteUser(userId: string) {
  const session = await getServerSession();
  const user = session?.user;

  if (user?.role !== 'admin') return { error: 'Unauthorized' };

  try {
    await User.deleteOne({ _id: userId });
    await Account.deleteMany({ userId: userId });
    revalidatePath('/admin/users');

    return { success: 'User deleted successfully' };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: 'Unknown error deleting user' };
    }
  }
}
