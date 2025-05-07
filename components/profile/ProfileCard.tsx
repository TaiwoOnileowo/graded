"use client"
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CalendarDays, Mail, MapPin, Briefcase, Github, Twitter, Linkedin } from "lucide-react";

interface ProfileDetails {
  name: string;
  email: string;
  role: string;
  matricNumber?: string;
  createdAt?: Date;
  image?: string;
  location?: string;
  bio?: string;
  socialLinks?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}

const ProfileCard = ({ personDetails }: { personDetails: ProfileDetails }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Format date if available
  const formattedDate = personDetails.createdAt 
    ? new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }).format(new Date(personDetails.createdAt))
    : null;
    
  // Generate gradient based on name (for consistent but unique colors)
  const generateGradient = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const hue1 = hash % 360;
    const hue2 = (hash * 13) % 360;
    
    return `linear-gradient(135deg, hsl(${hue1}, 80%, 60%), hsl(${hue2}, 80%, 55%))`;
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  return (
    <div 
      className="w-full md:max-w-md h-auto rounded-2xl shadow-xl bg-white overflow-hidden mx-auto transition-all duration-300 hover:shadow-2xl"
      style={{ transform: isHovered ? "translateY(-8px)" : "translateY(0)" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with gradient background */}
      <div 
        className="h-32 w-full relative"
        style={{ 
          background: generateGradient(personDetails.name || "User"),
        }}
      />
      
      {/* Profile Content */}
      <div className="px-6 py-5 pb-8">
        {/* Avatar - positioned to overlap the header */}
        <div className="relative -mt-16 mb-4 flex justify-center">
          <Avatar className="w-32 h-32 border-4 border-white shadow-md">
            <AvatarImage src={personDetails.image} alt={personDetails.name} />
            <AvatarFallback 
              className="text-4xl font-bold"
              style={{ 
                background: generateGradient(personDetails.name || "User"),
                color: "white"
              }}
            >
              {getInitials(personDetails.name)}
            </AvatarFallback>
          </Avatar>
        </div>
        
        {/* Profile Details */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight mb-1">{personDetails.name}</h2>
          {personDetails.role && (
            <p className="text-gray-600 font-medium mb-2 capitalize">{personDetails.role}</p>
          )}
          {personDetails.bio && (
            <p className="text-gray-500 text-sm mt-3 px-4">{personDetails.matricNumber}</p>
          )}
        </div>
        
        {/* Info Items */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center text-gray-600">
            <Mail className="h-4 w-4 mr-2" />
            <span>{personDetails.email}</span>
          </div>
          
          {personDetails.location && (
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{personDetails.location}</span>
            </div>
          )}
          
          {formattedDate && (
            <div className="flex items-center text-gray-600">
              <CalendarDays className="h-4 w-4 mr-2" />
              <span>Joined {formattedDate}</span>
            </div>
          )}
        </div>
        
        {/* Social Links */}
        {personDetails.socialLinks && (
          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center space-x-4">
            {personDetails.socialLinks.github && (
              <a 
                href={personDetails.socialLinks.github}
                className="text-gray-500 hover:text-gray-800 transition-colors"
                aria-label="GitHub Profile"
              >
                <Github className="h-5 w-5" />
              </a>
            )}
            {personDetails.socialLinks.twitter && (
              <a 
                href={personDetails.socialLinks.twitter}
                className="text-gray-500 hover:text-blue-500 transition-colors"
                aria-label="Twitter Profile"
              >
                <Twitter className="h-5 w-5" />
              </a>
            )}
            {personDetails.socialLinks.linkedin && (
              <a 
                href={personDetails.socialLinks.linkedin}
                className="text-gray-500 hover:text-blue-700 transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;