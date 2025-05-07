import React from 'react'
import { Student } from '../lecturer/AllStudents'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
  } from "@/components/ui/table"
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const StudentsTable = ({ filteredStudents }: { filteredStudents: Student }) => {
  return (
    <div className="rounded-md border overflow-hidden">
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
  </div>
  )
}

export default StudentsTable