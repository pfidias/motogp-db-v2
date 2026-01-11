import { getServerSession } from './server-session';

export const requireAdmin = async () => {
  const session = await getServerSession();
  if (!session || session.user.role !== 'admin') {
    // throw new Error('Unauthorized');
    return { error: 'Unauthorized' };
  }
  return { session };
};
