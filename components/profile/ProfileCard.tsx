"use client"
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { 
  CalendarDays, 
  Mail, 
  MapPin, 
  Briefcase, 
  Github, 
  Twitter, 
  Linkedin, 
  GraduationCap, 
  Hash,
  BookOpen,
  Building2,
  LogOut
} from "lucide-react";
import { Button } from "../ui/button";
import { signOut } from "@/auth";

// Updated interface to match the getUserDetails response
interface ProfileDetails {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "LECTURER" | "ADMIN";
  createdAt: Date;
  updatedAt: Date;
  image?: string;
  location?: string;
  // Student-specific fields
  studentDetails?: {
    id: string;
    level: number;
    major: string;
    matricNumber: string;
  };
  // Lecturer-specific fields
  lecturerDetails?: {
    id: string;
    bio?: string;
    department: string;
    title?: string;
  };
  // Optional social links
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

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "STUDENT":
        return "bg-blue-100 text-blue-800";
      case "LECTURER":
        return "bg-green-100 text-green-800";
      case "ADMIN":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle logout (placeholder function)
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div 
      className="w-full md:max-w-md rounded-2xl shadow-xl bg-white overflow-hidden mx-auto transition-all duration-300 hover:shadow-2xl"
      style={{ transform: isHovered ? "translateY(-8px)" : "translateY(0)" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with gradient background */}
      <div 
        className="h-28 w-full relative"
        style={{ 
          background: generateGradient(personDetails.name || "User"),
        }}
      >
        
      </div>
      
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
          
          {/* Role Badge */}
          <div className="flex justify-center mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(personDetails.role)}`}>
              {personDetails.role}
            </span>
          </div>
          
          {/* Role-specific subtitle */}
          {personDetails.role === "STUDENT" && personDetails.studentDetails && (
            <p className="text-gray-600 font-medium mb-1">
              {personDetails.studentDetails.major} Student
            </p>
          )}
          
          {personDetails.role === "LECTURER" && personDetails.lecturerDetails && (
            <p className="text-gray-600 font-medium mb-1 capitalize">
              {personDetails.lecturerDetails.title || "Lecturer"} • {personDetails.lecturerDetails.department}
            </p>
          )}
          
          {/* Bio for lecturer */}
          {personDetails.role === "LECTURER" && personDetails.lecturerDetails?.bio && (
            <p className="text-gray-500 text-sm mt-3 px-4">{personDetails.lecturerDetails.bio}</p>
          )}
        </div>
        
        {/* Info Items - Common Fields */}
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
          
          {/* Role-specific fields */}
          {personDetails.role === "STUDENT" && personDetails.studentDetails && (
            <>
              <div className="flex items-center text-gray-600">
                <Hash className="h-4 w-4 mr-2" />
                <span>Matric Number: {personDetails.studentDetails.matricNumber}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <GraduationCap className="h-4 w-4 mr-2" />
                <span>Level {personDetails.studentDetails.level}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>Major: {personDetails.studentDetails.major}</span>
              </div>
            </>
          )}
          
          {personDetails.role === "LECTURER" && personDetails.lecturerDetails && (
            <>
              <div className="flex items-center text-gray-600">
                <Building2 className="h-4 w-4 mr-2" />
                <span>Department: {personDetails.lecturerDetails.department}</span>
              </div>
              {personDetails.lecturerDetails.title && (
                <div className="flex items-center text-gray-600">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <span className="capitalize">Title: {personDetails.lecturerDetails.title}</span>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Social Links */}
        {personDetails.socialLinks && (
          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center space-x-4">
            {personDetails.socialLinks.github && (
              <a 
                href={personDetails.socialLinks.github}
                className="text-gray-500 hover:text-gray-800 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
              >
                <Github className="h-5 w-5" />
              </a>
            )}
            {personDetails.socialLinks.twitter && (
              <a 
                href={personDetails.socialLinks.twitter}
                className="text-gray-500 hover:text-blue-500 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter Profile"
              >
                <Twitter className="h-5 w-5" />
              </a>
            )}
            {personDetails.socialLinks.linkedin && (
              <a 
                href={personDetails.socialLinks.linkedin}
                className="text-gray-500 hover:text-blue-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            )}
          </div>
        )}
        
        {/* Full Logout Button at Bottom */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="cusor-pointer w-full py-2 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;