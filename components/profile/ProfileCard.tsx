import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface ProfileDetails {
    name: string;
    email: string;
    createdAt?: Date;
    image?: string
}
const ProfileCard = ({ personDetails} : { personDetails: ProfileDetails }) => {
  return (
    <div className="w-full md:max-w-[25rem] h-auto text-center rounded-2xl shadow-lg bg-white overflow-hidden mx-auto">
      <div className="grid space-y-3 p-4 justify-center items-center">
        <Avatar className="w-40 h-40 mx-auto">
          <AvatarImage src={personDetails.image} alt={personDetails.name} />
          <AvatarFallback className="text-8xl font-bold">
            {personDetails.name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">{personDetails.name}</h2>
          <span className="text-sm">{personDetails.email}</span>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard