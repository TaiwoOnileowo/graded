import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface ProfileDetails {
    name: string;
    email: string;
    createdAt: Date;
    image?: string
}
const ProfileCard = ({ studentDetails} : {studentDetails: ProfileDetails }) => {
  return (
    <div className="w-full md:min-w-2xl rounded-2xl shadow-lg bg-white overflow-hidden mx-auto">
      <div className="grid space-y-4">
        <Avatar className="w-32 h-32 mx-auto">
          <AvatarImage src={studentDetails.image} alt={studentDetails.name} />
          <AvatarFallback className="text-lg font-bold">
            {studentDetails.name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-2xl">{studentDetails.name}</h2>
        <span className="text-sm">{studentDetails.email}</span>
      </div>
    </div>
  )
}

export default ProfileCard