import { auth } from "@/auth";
import ProfileCard from "@/components/profile/ProfileCard";
import { getUserDetails } from "@/lib/actions/user.action";
import type { Metadata } from "next";

// SEO metadata generation
export async function generateMetadata(): Promise<Metadata> {
  const session = await auth();
  const user = session?.user;

  return {
    title: `${user?.name}'s Profile | Smart Dashboard`,
    description: `View and manage the profile details of ${user?.name}, including personal info and account settings.`,
  };
}

const page = async () => {
  const session = await auth();
  const profileData = await getUserDetails(session?.user?.id!);

  return <ProfileCard personDetails={profileData as any} />;
};

export default page;
