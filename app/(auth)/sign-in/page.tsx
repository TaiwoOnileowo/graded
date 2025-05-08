import type { Metadata } from "next";
import SigninForm from "@/components/form/SigninForm";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";

// SEO Metadata
export const metadata: Metadata = {
  title: "Sign In | GRADED",
  description:
    "Access your GRADED account to manage and submit programming assignments, track progress, and collaborate with lecturers and peers.",
};

export default function SignInPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <Suspense
        fallback={
          <div className="flex h-96 items-center justify-center">
            Loading...
          </div>
        }
      >
        <SigninForm />
      </Suspense>
    </Card>
  );
}
