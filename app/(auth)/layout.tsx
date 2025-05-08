import Link from "next/link";
import logo from "@/public/logo.svg";
import Image from "next/image";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <Link href="/home" className="mb-8 flex items-center gap-2">
        <Image src={logo} alt="Logo" width={200} height={40} />
      </Link>
      {children}
    </div>
  );
};
export default Layout;
