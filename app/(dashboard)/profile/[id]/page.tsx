import { auth } from "@/auth";
import ProfileCard from "@/components/profile/ProfileCard";

const page = async ({ params } : any) => {
    const { id } = params; 
    // Get session
    const session = await auth()

    // Detect role
    const role = session?.user?.role;
    const isStudent = role === "STUDENT";

    // Gettoing the profile data
    let profilePerson;
    if (isStudent) {
        profilePerson = session?.user;
    } else {
        profilePerson = session?.user;
    }

    const profileData = {
        name: profilePerson?.name,
        email: profilePerson?.email,
        image: profilePerson?.image
    }

  return (
    <ProfileCard personDetails={profileData}/>
  )
}

export default page