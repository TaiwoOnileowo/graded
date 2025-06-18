import {
  ArrowLeft,
  BookOpen,
  Calendar,
  FileText,
  MoreHorizontal,
  Plus,
  Users,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Assignment, Submission } from "@prisma/client/edge";

interface StudentData {
  enrollmentId: string;
  studentId: string;
  status: string;
  enrolledAt: Date;
  level: number;
  major: string;
  matricNumber: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface CourseData {
  id: string;
  name: string;
  code: string;
  description?: string;
  assignments: (Assignment & { submissions: Submission[] })[];
  enrollments: any[];
  studentList: StudentData[];
}

export default function LecturerCoursePage({ course }: { course: CourseData }) {
  return (
    <div className="space-y-6 h-full flex-1">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/courses">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{course.name}</h2>
          <p className="text-sm text-muted-foreground">{course.code}</p>
        </div>
      </div>

      <div className="grid gap-4 ">
        <Card>
          <CardHeader>
            <CardTitle>Course Overview</CardTitle>
            <CardDescription>
              Details and statistics about this course
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Description</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {course.description}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Assignments</span>
                  </div>
                  <p className="mt-1 text-2xl font-bold">
                    {course.assignments.length}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Students</span>
                  </div>
                  <p className="mt-1 text-2xl font-bold">
                    {course?.studentList?.length || 0}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Submissions</span>
                  </div>
                  <p className="mt-1 text-2xl font-bold">
                    {course.assignments.reduce(
                      (total, assignment) =>
                        total + (assignment?.submissions?.length || 0),
                      0
                    )}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href={`/courses/${course.id}/assignments/new`}>
                <Plus className="mr-2 h-4 w-4" />
                Create Assignment
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="assignments">
        <TabsList>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>
        <TabsContent value="assignments" className="mt-4 space-y-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Course Assignments</h3>
            <Button asChild>
              <Link href={`/courses/${course.id}/assignments/new`}>
                <Plus className="mr-2 h-4 w-4" />
                New Assignment
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            {course.assignments && course.assignments.length > 0 ? (
              course.assignments.map(
                (
                  assignment: Assignment & {
                    submissions: Submission[];
                  }
                ) => (
                  <Card key={assignment.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{assignment.title}</CardTitle>
                          <CardDescription>
                            Due:{" "}
                            {assignment.deadline?.toDateString() ||
                              "No deadline set"}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild></DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/courses/${course.id}/assignments/${assignment.id}/submissions`}
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                View Submissions
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {assignment.questionText}
                      </p>
                      <div className="mt-4 flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {assignment?.submissions?.length || 0} submissions
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {assignment.deadline?.toDateString() ||
                              "No deadline set"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    {/* <CardFooter className="border-t bg-muted/50 p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        asChild
                      >
                        <Link
                          href={`/courses/${course.id}/assignments/${assignment.id}`}
                        >
                          View Assignment
                        </Link>
                      </Button>
                    </CardFooter> */}
                  </Card>
                )
              )
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <BookOpen className="h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No assignments yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Create your first assignment to get started
                </p>
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700" asChild>
                  <Link href={`/courses/${course.id}/assignments/new`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Assignment
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="students" className="mt-4 space-y-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Enrolled Students</h3>
            <div className="text-sm text-muted-foreground">
              Total: {course?.studentList?.length || 0} students
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Matric Number
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Level
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Major
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Enrolled
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {course.studentList && course.studentList.length > 0 ? (
                      course.studentList.map((student: StudentData) => (
                        <tr
                          key={student.studentId}
                          className="border-b hover:bg-muted/25"
                        >
                          <td className="px-4 py-3 text-sm font-medium">
                            {student.user.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {student.user.email}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {student.matricNumber}
                          </td>
                          <td className="px-4 py-3 text-sm">{student.level}</td>
                          <td className="px-4 py-3 text-sm">{student.major}</td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                student.status === "ENROLLED"
                                  ? "bg-green-100 text-green-700"
                                  : student.status === "COMPLETED"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {student.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {new Date(student.enrolledAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/courses/${course.id}/students/${student.studentId}/submissions`}
                                  >
                                    <FileText className="mr-2 h-4 w-4" />
                                    View Submissions
                                  </Link>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-4 py-8 text-center text-sm text-muted-foreground"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Users className="h-8 w-8 text-muted-foreground" />
                            <span>No students enrolled in this course yet</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
