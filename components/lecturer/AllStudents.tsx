"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import StudentsTable from "../table/StudentsTable"

export type Student = {
  studentId: string
  matricNumber: string
  level: string
  user: {
    name: string
    image?: string
  }
}

const AllStudents = ({ students }: { students: Student[] }) => {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredStudents = students.filter((student) =>
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

      {/* <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Matric Number</TableHead>
              <TableHead>Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow key={student.studentId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={student.user?.image}
                          alt={student.user?.name}
                        />
                        <AvatarFallback>
                          {student.user?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{student.user?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{student.matricNumber}</TableCell>
                  <TableCell>{student.level}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div> */}
      <StudentsTable filteredStudents={filteredStudents}/>
    </div>
  )
}

export default AllStudents
