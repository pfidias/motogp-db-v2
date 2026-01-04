"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
// import { signOut, useSession } from "next-auth/react";
import GuestUserImage from "@/app/assets/images/guest-user.png";
import DefaultUserImage from "@/app/assets/images/man-default.svg";
import { useRouter } from "next/navigation";
import { type User } from "@/lib/auth";
import { toast } from "react-hot-toast";

type Props = {
  user: User;
};

const NavBarRight = ({ user }: Props) => {
  const router = useRouter();

  const [showMenu, setShowMenu] = useState(false);

  const avatar_ref = useRef<HTMLDivElement>(null);
  const dropdown_ref = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();

    if (error) {
      toast.error(error.message || "Error signing out");
    } else {
      router.push("/sign-in");
      router.refresh();
      toast.success("See you again soon!");
    }
  };

  // const { data: session } = useSession();

  // Close dropdown when clicked outside
  // https://bytegrad.com/app/professional-react-and-nextjs/rmtdev-close-popover-on-click-outside-use-ref
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        e.target instanceof HTMLElement &&
        !avatar_ref.current?.contains(e.target) &&
        !dropdown_ref.current?.contains(e.target)
      ) {
        setShowMenu(false);
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <section className="relative flex items-center justify-evenly gap-x-4 text-sm text-white">
      {/* {!user && <Link href="/login">Login</Link>} */}
      <div className="cursor-pointer">About</div>
      {user.role === "admin" && <Link href="/admin">Admin</Link>}
      {/* {user &&  (*/}
      <div
        ref={avatar_ref}
        className="h-12.5 w-12.5 cursor-pointer overflow-hidden rounded-full ring-2 ring-orange-500"
      >
        <Image
          onClick={() => setShowMenu((prev) => !prev)}
          src={
              user.image ? user.image : DefaultUserImage
          }
          width={50}
          height={50}
          alt="user avatar"
        />
      </div>
      {/*)} */}
      <section
        ref={dropdown_ref}
        className={`absolute right-0 top-15 z-10 flex h-auto w-auto flex-col items-center justify-center gap-y-5 rounded-md bg-white px-5 py-5 text-xs text-black shadow-md ${
          showMenu ? "" : "hidden"
        }`}
      >
        <div className="text-nowrap text-center">
          {user.name.length! > 40 ? `${user.name.slice(0, 57)}...` : user.name}
        </div>
        <div className="text-center">
          {`${user.role[0].toUpperCase()}${user.role.slice(1)}`}
        </div>
        <Link
          className="hover:text-blue-700"
          href="/dashboard"
          onClick={() => setShowMenu(false)}
        >
          Dashboard
        </Link>
        <div
          className="cursor-pointer hover:text-blue-700"
          onClick={() => {
            // setShowMenu(false);
            // router.replace(`/favorites/${session?.user.id}`);
            // router.refresh();
          }}
        >
          Favorites
        </div>
        <div
          onClick={() => handleSignOut()}
          className="cursor-pointer hover:text-blue-700"
        >
          Sign out
        </div>
      </section>
    </section>
  );
};

export default NavBarRight;
