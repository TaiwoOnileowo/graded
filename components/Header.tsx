import { auth } from "@/auth";
import logo from "@/public/logo.svg";
import Image from "next/image";
import Link from "next/link";

const Header = async () => {
  const session = await auth();
  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link href={"/"}>
          <Image src={logo} alt="Graded" width={120} height={40} />
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex">
            <ul className="flex items-center gap-6">
              <li>
                <Link href="/" className="text-sm font-medium text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  Courses
                </Link>
              </li>
            </ul>
          </nav>
          <Link href={`/profile/${session?.user?.id}`}>
            <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-white text-sm font-medium cursor-pointer">
              {session?.user?.name[0]}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};
export default Header;
