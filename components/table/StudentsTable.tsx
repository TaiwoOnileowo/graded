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
          filteredStudents.map((student: any) => (
            <TableRow key={student.studentId || student.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={student.user?.image || student.image}
                      alt={student.user?.name || student.name}
                    />
                    <AvatarFallback>
                      {student.user?.name?.charAt(0).toUpperCase() || student.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{student.user?.name || student?.name}</span>
                </div>
              </TableCell>
              <TableCell>{student.matricNumber || 'nill'}</TableCell>
              <TableCell>{student.level || 'nill'}</TableCell>
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