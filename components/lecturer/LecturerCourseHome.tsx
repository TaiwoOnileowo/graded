import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Edit,
  FileText,
  MoreHorizontal,
  Plus,
  Users,
} from "lucide-react";

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

export default function LecturerCoursePage({ courseId }: { courseId: string }) {
  const course = courses.find((c) => c.id === courseId) || courses[0];

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

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-5">
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
                    {course.assignments}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Students</span>
                  </div>
                  <p className="mt-1 text-2xl font-bold">{course.students}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Submissions</span>
                  </div>
                  <p className="mt-1 text-2xl font-bold">
                    {course.submissions}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href={`/courses/${course.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Course
              </Link>
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href={`/courses/${course.id}/assignments/new`}>
                <Plus className="mr-2 h-4 w-4" />
                Create Assignment
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href={`/courses/${course.id}/students`}>
                <Users className="mr-2 h-4 w-4" />
                Manage Students
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href={`/courses/${course.id}/assignments`}>
                <BookOpen className="mr-2 h-4 w-4" />
                View Assignments
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href={`/courses/${course.id}/submissions`}>
                <FileText className="mr-2 h-4 w-4" />
                Review Submissions
              </Link>
            </Button>
          </CardContent>
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
            {course.assignmentList && course.assignmentList.length > 0 ? (
              course.assignmentList.map((assignment) => (
                <Card key={assignment.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{assignment.title}</CardTitle>
                        <CardDescription>
                          Due: {assignment.deadline}
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
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/courses/${course.id}/assignments/${assignment.id}/edit`}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Assignment
                            </Link>
                          </DropdownMenuItem>
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
                      {assignment.description}
                    </p>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{assignment.submissions} submissions</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{assignment.deadline}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-muted/50 p-3">
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
                  </CardFooter>
                </Card>
              ))
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
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Students
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Matric Number
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Level
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Submissions
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {course.studentList &&
                    course.studentList.map((student) => (
                      <tr key={student.id} className="border-b">
                        <td className="px-4 py-3 text-sm">{student.name}</td>
                        <td className="px-4 py-3 text-sm">
                          {student.matricNumber}
                        </td>
                        <td className="px-4 py-3 text-sm">{student.level}</td>
                        <td className="px-4 py-3 text-sm">
                          {student.submissions}/{course.assignments}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/students/${student.id}`}>View</Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const courses = [
  {
    id: "1",
    name: "Data Structures and Algorithms",
    code: "CS301",
    description:
      "Advanced concepts in data structures and algorithm design. Learn about arrays, linked lists, trees, graphs, and various algorithms for searching and sorting.",
    assignments: 5,
    students: 42,
    submissions: 156,
    assignmentList: [
      {
        id: "a1",
        title: "Assignment 1: Linked Lists Implementation",
        description:
          "Implement a doubly linked list with insertion, deletion, and traversal operations.",
        deadline: "March 15, 2025",
        submissions: 38,
      },
      {
        id: "a2",
        title: "Assignment 2: Sorting Algorithms",
        description:
          "Implement and analyze the performance of quicksort, mergesort, and heapsort algorithms.",
        deadline: "April 2, 2025",
        submissions: 35,
      },
      {
        id: "a3",
        title: "Assignment 3: Graph Algorithms",
        description:
          "Implement breadth-first search and depth-first search algorithms for graph traversal.",
        deadline: "April 20, 2025",
        submissions: 40,
      },
      {
        id: "a4",
        title: "Assignment 4: Dynamic Programming",
        description:
          "Solve the knapsack problem and longest common subsequence problem using dynamic programming.",
        deadline: "May 5, 2025",
        submissions: 37,
      },
      {
        id: "a5",
        title: "Assignment 5: Advanced Data Structures",
        description:
          "Implement an AVL tree and a hash table with collision resolution.",
        deadline: "May 25, 2025",
        submissions: 6,
      },
    ],
    studentList: [
      {
        id: "s1",
        name: "Alex Johnson",
        matricNumber: "23CG034136",
        level: 300,
        submissions: 5,
      },
      {
        id: "s2",
        name: "Maria Garcia",
        matricNumber: "23CG034136",
        level: 300,
        submissions: 4,
      },
      {
        id: "s3",
        name: "James Wilson",
        matricNumber: "23CG034136",
        level: 300,
        submissions: 5,
      },
      {
        id: "s4",
        name: "Sarah Ahmed",
        matricNumber: "23CG034136",
        level: 300,
        submissions: 3,
      },
      {
        id: "s5",
        name: "David Lee",
        matricNumber: "23CG034136",
        level: 300,
        submissions: 5,
      },
    ],
  },
];
