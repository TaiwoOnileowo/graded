import { auth } from "@/auth";
import ProfileCard from "@/components/profile/ProfileCard";
import { getUserDetails } from "@/lib/actions/user.action";

const page = async ({ params } : any) => {
    const { id } = params; 

    const profileData = await getUserDetails(id);

  return (
    <ProfileCard personDetails={profileData}/>
  )
}

export default page