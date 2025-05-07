import { auth } from "@/auth";
import HeaderClient from "./HeaderClient";

const Header = async () => {
  const session = await auth();
  return <HeaderClient session={session} />;
};

export default Header;
