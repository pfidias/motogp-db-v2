import Image from "next/image";
import Link from "next/link";
import logo from "@/app/assets/images/Logo.png";
// import title from '@/app/assets/images/title.png';

import NavBarRight from "./NavBarRight";
import NavBarSub from "./NavBarSub";
import { type User } from "@/lib/auth";

type Props = {
  user: User;
};

const NavBar = ({ user }: Props) => {
  return (
    <section>
      <div className="shrink-0 flex h-25 w-full items-center justify-center bg-gray-950 px-16">
        <div className="flex w-full items-center justify-between">
          <section className="flex items-center gap-x-6 text-4xl font-semibold text-white">
            <Link href="/">
              <Image src={logo} width={80} alt="logo" priority={true} />
            </Link>
            <p className="font-motogp tracking-wide">
              MotoGP <span className="text-db-orange">Database</span>
            </p>
            {/* <Image src={title} width={400} alt="title" priority={true} /> */}
          </section>
          <NavBarRight user={user} />
        </div>
      </div>
      <NavBarSub />
    </section>
  );
};

export default NavBar;
