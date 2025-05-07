import { auth } from "@/auth";
import ProfileCard from "@/components/profile/ProfileCard";
import { getUserDetails } from "@/lib/actions/user.action";

const page = async () => {
  const session = await auth()
  const profileData = await getUserDetails(session?.user?.id!);

  return (
    <ProfileCard personDetails={profileData}/>
  )
}

export default page