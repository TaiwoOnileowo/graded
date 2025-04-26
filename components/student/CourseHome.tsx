import { ArrowLeft, BookOpen, Calendar, Trophy } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";

export default function StudentCoursePage({ courseId }: { courseId: string }) {
  const course = courses.find((c) => c.id === courseId) || courses[0];

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="container py-8 md:py-12">
          <div className="mb-8">
            <Link
              href="/courses"
              className="mb-6 flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Link>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  {course.name}
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Lecturer: {course.lecturer}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex items-center gap-1 rounded-lg border bg-card px-3 py-1 text-sm">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <span>{course.assignments.length} Assignments</span>
                </div>
                <div className="flex items-center gap-1 rounded-lg border bg-card px-3 py-1 text-sm">
                  <Trophy className="h-4 w-4 text-blue-600" />
                  <span>
                    Total:{" "}
                    {course.assignments.reduce(
                      (acc, curr) => acc + curr.marks,
                      0
                    )}{" "}
                    marks
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-4 max-w-3xl">{course.description}</p>
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Course Progress</span>
                <span className="text-sm font-medium">
                  {course.completedAssignments}/{course.assignments.length}{" "}
                  assignments completed
                </span>
              </div>
              <Progress
                value={
                  (course.completedAssignments / course.assignments.length) *
                  100
                }
                className="mt-2 h-2"
              />
            </div>
          </div>

          <div className="mt-8">
            <h3 className="mb-4 text-xl font-semibold">Assignments</h3>
            <div className="grid gap-4">
              {course.assignments.map((assignment) => (
                <Card
                  key={assignment.id}
                  className="overflow-hidden transition-all hover:border-blue-600 hover:shadow-md"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{assignment.title}</CardTitle>
                        <CardDescription className="mt-1 line-clamp-2">
                          {assignment.description}
                        </CardDescription>
                      </div>
                      <div className="flex h-8 items-center rounded-full bg-blue-100 px-3 text-sm font-medium text-blue-800">
                        {assignment.marks} marks
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Deadline: {assignment.deadline}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between border-t bg-muted/50 px-4 py-3">
                    {assignment.completed ? (
                      <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                        <div className="h-2 w-2 rounded-full bg-green-600"></div>
                        Completed
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm font-medium text-amber-600">
                        <div className="h-2 w-2 rounded-full bg-amber-600"></div>
                        Pending
                      </div>
                    )}
                    <Link href={assignment.completed ? `/courses/${courseId}/assignments/${assignment.id}/submission` : `/courses/${courseId}/assignments/${assignment.id}/editor`}>
                      <Button
                        size="sm"
                        className="bg-blue-600 cursor-pointer hover:bg-blue-700"
                        >
                        {assignment.completed
                          ? "View Submission"
                          : "Start Assignment"}
                      </Button>
                        </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

const courses = [
  {
    id: "1",
    name: "Introduction to Computer Science",
    description:
      "Learn the fundamentals of computer science and programming. This course covers basic programming concepts, algorithms, and problem-solving techniques. You'll gain hands-on experience with Python programming and develop a strong foundation for more advanced computer science topics.",
    lecturer: "Dr. Jane Smith",
    completedAssignments: 2,
    assignments: [
      {
        id: "a1",
        title: "Programming Basics",
        description:
          "Complete a set of basic programming exercises using Python. Implement simple algorithms and data structures.",
        marks: 20,
        deadline: "March 25, 2025",
        completed: true,
      },
      {
        id: "a2",
        title: "Algorithm Analysis",
        description:
          "Analyze the time and space complexity of given algorithms. Write a report explaining your analysis.",
        marks: 15,
        deadline: "April 5, 2025",
        completed: true,
      },
      {
        id: "a3",
        title: "Data Structures Implementation",
        description:
          "Implement a linked list, stack, and queue in Python. Write test cases to verify your implementation.",
        marks: 25,
        deadline: "April 15, 2025",
        completed: false,
      },
      {
        id: "a4",
        title: "Recursion Problems",
        description:
          "Solve a set of problems using recursion. Implement and analyze recursive algorithms.",
        marks: 20,
        deadline: "April 30, 2025",
        completed: false,
      },
      {
        id: "a5",
        title: "Final Project",
        description:
          "Develop a small application that demonstrates your understanding of the course concepts. Present your project to the class.",
        marks: 30,
        deadline: "May 15, 2025",
        completed: false,
      },
    ],
  },
  {
    id: "2",
    name: "Data Structures and Algorithms",
    description:
      "Advanced concepts in data structures and algorithm design. Learn about arrays, linked lists, trees, graphs, and various algorithms for searching and sorting.",
    lecturer: "Prof. John Doe",
    completedAssignments: 3,
    assignments: [
      {
        id: "b1",
        title: "Advanced Data Structures",
        description:
          "Implement advanced data structures like AVL trees, hash tables, and priority queues.",
        marks: 25,
        deadline: "March 20, 2025",
        completed: true,
      },
      {
        id: "b2",
        title: "Sorting Algorithms",
        description:
          "Implement and analyze various sorting algorithms including quicksort, mergesort, and heapsort.",
        marks: 20,
        deadline: "April 1, 2025",
        completed: true,
      },
      {
        id: "b3",
        title: "Graph Algorithms",
        description:
          "Implement graph traversal algorithms (BFS, DFS) and shortest path algorithms (Dijkstra's, Bellman-Ford).",
        marks: 30,
        deadline: "April 15, 2025",
        completed: true,
      },
      {
        id: "b4",
        title: "Dynamic Programming",
        description:
          "Solve problems using dynamic programming techniques. Analyze the time and space complexity of your solutions.",
        marks: 25,
        deadline: "April 30, 2025",
        completed: false,
      },
      {
        id: "b5",
        title: "Algorithm Design Project",
        description:
          "Design and implement an efficient algorithm to solve a real-world problem. Write a report explaining your approach.",
        marks: 30,
        deadline: "May 10, 2025",
        completed: false,
      },
      {
        id: "b6",
        title: "Advanced Algorithm Analysis",
        description:
          "Analyze the time and space complexity of complex algorithms. Compare different approaches to solving the same problem.",
        marks: 20,
        deadline: "May 20, 2025",
        completed: false,
      },
      {
        id: "b7",
        title: "Competitive Programming Challenge",
        description:
          "Participate in a competitive programming challenge. Solve a set of algorithmic problems within a time limit.",
        marks: 25,
        deadline: "May 25, 2025",
        completed: false,
      },
      {
        id: "b8",
        title: "Final Exam",
        description:
          "Comprehensive exam covering all topics discussed in the course.",
        marks: 50,
        deadline: "June 5, 2025",
        completed: false,
      },
    ],
  },
];
