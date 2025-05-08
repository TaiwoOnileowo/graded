import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import LecturerSignupForm from "@/components/form/LecturerSignupForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// SEO metadata
export const metadata: Metadata = {
  title: "Lecturer Sign Up | GRADED",
  description:
    "Create your lecturer account on GRADED to manage programming courses, assignments, and track student performance with automated grading.",
};

export default function LecturerSignUpPage() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="space-y-1">
        <div className="flex items-center">
          <Link href="/sign-up" className="mr-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <CardTitle className="text-2xl font-bold">Lecturer Sign Up</CardTitle>
        </div>
        <CardDescription>
          Create your lecturer account to manage courses and assignments
        </CardDescription>
      </CardHeader>
      <LecturerSignupForm />
    </Card>
  );
}
