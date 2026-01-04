'use client';

import { useState } from 'react';
import { type UserType } from '@/app/models/user';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UserAvatar } from '@/components/user-avatar';
import { updateUserRole, deleteUser } from '@/app/actions/users';
import { toast } from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

type Props = {
  users: UserType[];
  currentUser: UserType | undefined;
};

const UserTable = ({ users, currentUser }: Props) => {
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);

  const handleUpdateUserRole = async (value: string) => {
    const [newRole, userId] = value.split('-');
    const { success, error } = await updateUserRole(userId, newRole);
    if (success) {
      toast.success(success);
    }
    if (error) {
      toast.error(error);
    }
  };

  const handleDeleteUser = async (user: UserType) => {
    {
      const { success, error } = await deleteUser(user._id!.toString());
      if (success) {
        toast.success(success);
      }
      if (error) {
        toast.error(error);
      }
      setUserIdToDelete(null);
    }
  };

  return (
    <div className="text-background flex flex-col">
      <h1 className="mb-6 text-xl font-bold">User Management</h1>
      <Table>
        <TableCaption>
          <div className="flex items-center justify-center gap-x-2">
            <div className="size-2 rounded-full bg-amber-600"></div>
            <span className="text-xs">Current user</span>
          </div>
        </TableCaption>
        <TableHeader className="bg-blue-800">
          <TableRow className="hover:bg-blue-800">
            <TableHead className="border border-gray-300 px-4 py-2"></TableHead>
            <TableHead className="border border-gray-300 px-4 py-2">
              Name
            </TableHead>
            <TableHead className="border border-gray-300 px-4 py-2">
              Email
            </TableHead>
            <TableHead className="border border-gray-300 px-4 py-2">
              Role
            </TableHead>
            <TableHead className="border border-gray-300 px-4 py-2">
              Verified
            </TableHead>
            <TableHead className="border border-gray-300 px-4 py-2"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user._id!.toString()}
              className="font-mono text-xs odd:bg-gray-50 even:bg-white hover:bg-gray-100"
            >
              <TableCell className="w-18 border border-gray-300 px-4 py-2">
                <UserAvatar
                  name={user.name}
                  image={user.image}
                  className="size-24 border border-slate-400 sm:size-10"
                />
              </TableCell>
              <TableCell className="border border-gray-300 px-4 py-2">
                <div className="flex items-center gap-x-2">
                  <p>{user.name}</p>
                  {currentUser?.email === user.email && (
                    <div className="bg-primary size-2 rounded-full"></div>
                  )}
                </div>
              </TableCell>
              <TableCell className="border border-gray-300 px-4 py-2">
                {user.email}
              </TableCell>
              <TableCell className="border border-gray-300 px-4 py-2">
                <RadioGroup
                  defaultValue={`${user.role}-${user._id}`}
                  className="flex gap-2"
                  onValueChange={(value) => handleUpdateUserRole(value)}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem
                      className="border-slate-400/50"
                      value={`basic-${user._id}`}
                      id="r1"
                      disabled={currentUser?.email === user.email}
                    />
                    <Label className="text-xs" htmlFor="r1">
                      basic
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem
                      className="border-slate-400/50"
                      value={`premium-${user._id}`}
                      id="r2"
                      disabled={currentUser?.email === user.email}
                    />
                    <Label className="text-xs" htmlFor="r2">
                      premium
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem
                      className="border-slate-400/50"
                      value={`admin-${user._id}`}
                      id="r3"
                      disabled={currentUser?.email === user.email}
                    />
                    <Label className="text-xs" htmlFor="r3">
                      admin
                    </Label>
                  </div>
                </RadioGroup>
              </TableCell>
              <TableCell className="border border-gray-300 px-4 py-2">
                {user.emailVerified ? 'Yes' : 'No'}
              </TableCell>
              <TableCell className="border border-gray-300 px-4 py-2">
                <div className="relative flex justify-center">
                  {currentUser?.email !== user.email &&
                    user.role !== 'admin' && (
                      <Trash2
                        className="stroke-destructive size-4 opacity-40 hover:cursor-pointer hover:opacity-100"
                        onClick={() => setUserIdToDelete(user._id!.toString())}
                      />
                    )}
                  {userIdToDelete === user._id!.toString() && (
                    <div className="absolute top-1/2 right-full flex -translate-y-1/2 items-center gap-x-2 rounded-md bg-white px-4 py-2 shadow-md">
                      <p className="text-xs">Confirm delete?</p>
                      <button
                        className="text-destructive text-xs underline"
                        onClick={() => handleDeleteUser(user)}
                      >
                        Yes
                      </button>
                      <button
                        className="text-xs underline"
                        onClick={() => setUserIdToDelete(null)}
                      >
                        No
                      </button>
                    </div>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
