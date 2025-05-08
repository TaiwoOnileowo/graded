"use client";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import StudentsTable from "../table/StudentsTable";
import { useState } from "react";
import { Input } from "../ui/input";

const ManageStudents = ({
  students,
  courseId,
  courseName,
  courseCode,
}: {
  students: any;
  courseId: string;
  courseName: string;
  courseCode: string;
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = students.filter((student: any) =>
    student?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 px-4 md:px-8 min-w-full mx-auto">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/courses/${courseId}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-4">
          Manage Students for{" "}
          <span className="p-2 rounded-lg bg-gray-200 text-[0.9rem] font-normal">
            {courseName} - {courseCode}
          </span>
        </h2>
      </div>

      <Input
        type="text"
        placeholder="Search students..."
        className="w-full md:w-64"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div>
        {filteredStudents.length === 0 ? (
          <div className="flex items-center justify-center w-full">
            <p className="text-lg text-muted-foreground text-center">
              No students have enrolled in this course
            </p>
          </div>
        ) : (
          <StudentsTable filteredStudents={filteredStudents} />
        )}
      </div>
    </div>
  );
};

export default ManageStudents;
