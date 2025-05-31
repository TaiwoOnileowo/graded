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

export default function StudentCoursePage({ course }: { course: any }) {
  const completedAssignments = course.assignments.filter(
    (assignment: any) => assignment.completed === true
  );
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
                  Lecturer: {course.lecturer.name}
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
                      (acc: number, curr: any) => acc + curr.marks,
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
                  {completedAssignments.length}/{course.assignments.length}{" "}
                  assignments completed
                </span>
              </div>
              <Progress
                value={
                  (completedAssignments.length / course.assignments.length) *
                  100
                }
                className="mt-2 h-2"
              />
            </div>
          </div>

          <div className="mt-8">
            <h3 className="mb-4 text-xl font-semibold">Assignments</h3>
            {course.assignments.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">
                  No assignments yet
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Check back later for new assignments
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {course.assignments.map((assignment: any) => (
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
                        <span>
                          {new Date(assignment.deadline).toLocaleDateString()}
                        </span>
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
                      <Link
                        href={
                          assignment.completed
                            ? `/courses/${course.id}/assignments/${assignment.id}/submission`
                            : `/courses/${course.id}/assignments/${assignment.id}/editor`
                        }
                      >
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
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
