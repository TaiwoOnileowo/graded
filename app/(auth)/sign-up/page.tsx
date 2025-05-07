import type { Metadata } from "next";
import { BookOpen, School } from "lucide-react";
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

// SEO Metadata
export const metadata: Metadata = {
  title: "Sign Up | GRADED",
  description:
    "Choose your role to get started with GRADED. Sign up as a lecturer to manage courses or as a student to enroll in courses and submit assignments.",
};

// Dynamic role options
const roles = [
  {
    icon: <School className="h-6 w-6 text-blue-600" />,
    title: "Lecturer",
    description:
      "Create and manage courses, assignments, and grade student submissions",
    benefits: [
      "Create and manage multiple courses",
      "Design assignments and set deadlines",
      "Grade student submissions and provide feedback",
      "Track student progress and performance",
    ],
    link: "/sign-up/lecturer",
  },
  {
    icon: <BookOpen className="h-6 w-6 text-blue-600" />,
    title: "Student",
    description:
      "Enroll in courses, complete assignments, and track your academic progress",
    benefits: [
      "Browse and enroll in available courses",
      "Access and submit assignments",
      "Receive grades and feedback from lecturers",
      "Track your progress across all enrolled courses",
    ],
    link: "/sign-up/student",
  },
];

export default function SignUpRoleSelectionPage() {
  return (
    <div className="w-full max-w-3xl">
      <div className="mb-8 space-y-2 text-center">
        <h1 className="text-3xl font-bold">Join GRADED</h1>
        <p className="mx-auto max-w-md text-muted-foreground">
          Choose how you want to use GRADED by selecting your role below
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {roles.map((role) => (
          <Card
            key={role.title}
            className="overflow-hidden transition-all hover:border-blue-600 hover:shadow-md"
          >
            <CardHeader className="pb-2">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                {role.icon}
              </div>
              <CardTitle>{role.title}</CardTitle>
              <CardDescription>{role.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                {role.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start">
                    <div className="mr-2 mt-0.5 h-4 w-4 rounded-full bg-blue-600" />
                    <span className="flex-1">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href={role.link}>Sign up as {role.title}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center text-sm">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-blue-600 hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}