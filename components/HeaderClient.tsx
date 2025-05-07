"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.svg";
import { usePathname } from "next/navigation";

const NavLinks = () => {
  const pathname = usePathname();
  const links = [
    { href: "/", label: "Home" },
    { href: "/courses", label: "Courses" },
  ];

  return (
    <nav className="hidden md:flex">
      <ul className="flex items-center gap-6">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

const HeaderClient = ({ session }: { session: any }) => {
  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link href="/">
          <Image src={logo} alt="Graded" width={120} height={40} />
        </Link>
        <div className="flex items-center gap-4">
          <NavLinks />
          <Link href="/profile/">
            <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-white text-sm font-medium cursor-pointer">
              {session?.user?.name[0]}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default HeaderClient;
