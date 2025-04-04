import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { notFound } from "next/navigation";
import { auth } from "@/auth";
import CreateCourse from "@/components/form/CreateCourse";

export default async function NewCoursePage() {
  const session = await auth();
  const role = session?.user?.role;
  const isStudent = role === "STUDENT";
  if (isStudent) {
    return notFound();
  }
  const lecturerId = session?.user.lecturer?.id || "";
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/courses">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">Create New Course</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
          <CardDescription>
            Enter the details for your new course
          </CardDescription>
        </CardHeader>
        <CreateCourse id={lecturerId} />
      </Card>
    </div>
  );
}
