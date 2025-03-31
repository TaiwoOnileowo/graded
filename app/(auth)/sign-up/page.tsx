import { BookOpen, School } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
export default function SignUpRoleSelectionPage() {
  return (
    <>
      <div className="w-full max-w-3xl">
        <div className="mb-8 space-y-2 text-center">
          <h1 className="text-3xl font-bold">Join Graded</h1>
          <p className="mx-auto max-w-md text-muted-foreground">
            Choose how you want to use Graded by selecting your role below
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="overflow-hidden transition-all hover:border-blue-600 hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <School className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Lecturer</CardTitle>
              <CardDescription>
                Create and manage courses, assignments, and grade student
                submissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 h-4 w-4 rounded-full bg-blue-600" />
                  <span className="flex-1">
                    Create and manage multiple courses
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 h-4 w-4 rounded-full bg-blue-600" />
                  <span className="flex-1">
                    Design assignments and set deadlines
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 h-4 w-4 rounded-full bg-blue-600" />
                  <span className="flex-1">
                    Grade student submissions and provide feedback
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 h-4 w-4 rounded-full bg-blue-600" />
                  <span className="flex-1">
                    Track student progress and performance
                  </span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href="/sign-up/lecturer">Sign up as Lecturer</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden transition-all hover:border-blue-600 hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Student</CardTitle>
              <CardDescription>
                Enroll in courses, complete assignments, and track your academic
                progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 h-4 w-4 rounded-full bg-blue-600" />
                  <span className="flex-1">
                    Browse and enroll in available courses
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 h-4 w-4 rounded-full bg-blue-600" />
                  <span className="flex-1">Access and submit assignments</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 h-4 w-4 rounded-full bg-blue-600" />
                  <span className="flex-1">
                    Receive grades and feedback from lecturers
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 h-4 w-4 rounded-full bg-blue-600" />
                  <span className="flex-1">
                    Track your progress across all enrolled courses
                  </span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href="/sign-up/student">Sign up as Student</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm">
          Already have an account?{" "}
          <Link href="//sign-in" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </>
  );
}
