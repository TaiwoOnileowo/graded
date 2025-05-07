import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="max-w-xl space-y-6">
        <h1 className="text-4xl font-bold sm:text-5xl">Welcome to GRADED</h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          A simple platform for managing courses, assignments, and academic progress.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/sign-up" passHref>
            <Button className="w-full sm:w-auto">Sign Up</Button>
          </Link>
          <Link href="/sign-in" passHref>
            <Button variant="outline" className="w-full sm:w-auto">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
