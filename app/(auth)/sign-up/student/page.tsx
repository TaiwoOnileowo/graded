import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import StudentSignupForm from "@/components/form/StudentSignupForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

// SEO metadata
export const metadata: Metadata = {
  title: "Student Sign Up | GRADED",
  description:
    "Create your student account on GRADED to enroll in programming courses, submit assignments, and track your performance with instant grading.",
};

export default function StudentSignUpPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center">
          <Link href="/sign-up" className="mr-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <CardTitle className="text-2xl font-bold">Student Sign Up</CardTitle>
        </div>
        <CardDescription>
          Create your student account to enroll in courses
        </CardDescription>
      </CardHeader>
      <StudentSignupForm />
    </Card>
  );
}
