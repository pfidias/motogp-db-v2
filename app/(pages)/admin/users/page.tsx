import { User, type UserType } from '@/app/models/user';
import { getServerSession } from '@/lib/server-session';
import UserTable from './user-table';
import { redirect } from 'next/navigation';

const AdminUsersPage = async () => {
  const session = await getServerSession();
  const currentUser = session?.user;

  if (currentUser?.role !== 'admin') redirect('/'); // eventually show a "not authorized" page

  // sort by role: admin, basic, premium
  const users = await User.find<UserType>({}).then((res) =>
    res
      .sort((a, b) => a.role.localeCompare(b.role))
      .map((user) => JSON.parse(JSON.stringify(user)) as UserType),
  );

  return <UserTable users={users} currentUser={currentUser} />;
};

export default AdminUsersPage;
