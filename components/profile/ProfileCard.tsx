import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface ProfileDetails {
    name: string;
    email: string;
    createdAt?: Date;
    image?: string
}
const ProfileCard = ({ personDetails} : { personDetails: ProfileDetails }) => {
  return (
    <div className="w-full md:min-w-2xl rounded-2xl shadow-lg bg-white overflow-hidden mx-auto">
      <div className="grid space-y-4">
        <Avatar className="w-32 h-32 mx-auto">
          <AvatarImage src={personDetails.image} alt={personDetails.name} />
          <AvatarFallback className="text-lg font-bold">
            {personDetails.name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-2xl">{personDetails.name}</h2>
        <span className="text-sm">{personDetails.email}</span>
      </div>
    </div>
  )
}

export default ProfileCard