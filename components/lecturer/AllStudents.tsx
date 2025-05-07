"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

const AllStudents = ({ students }: any) => {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredStudents = students?.filter((student: any) =>
    student?.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 px-4 md:px-8 lg:px-12 w-full mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Students</h2>
          <p className="text-muted-foreground">
            Manage your students and their progress
          </p>
        </div>
        <Input
          type="text"
          placeholder="Search students..."
          className="w-full md:w-64"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex flex-col divide-y border rounded-md overflow-hidden bg-white">
        {filteredStudents?.length > 0 ? (
          filteredStudents.map((student: any) => (
            <div
              key={student.studentId}
              className="flex items-center gap-4 p-4 hover:bg-muted transition-colors"
            >
              <Avatar className="w-12 h-12">
                <AvatarImage src={student.user?.image} alt={student.user?.name} />
                <AvatarFallback className="text-lg font-bold">
                  {student.user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <h3 className="text-base font-semibold">
                  {student.user?.name || "Unnamed Student"}
                </h3>
                <p className="text-sm text-muted-foreground">Matric No: {student.matricNumber}</p>
                <p className="text-sm text-muted-foreground">Level: {student.level}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-muted-foreground">No students enrolled yet.</p>
        )}
      </div>
    </div>
  )
}

export default AllStudents
