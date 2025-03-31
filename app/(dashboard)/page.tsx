"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="container py-8 md:py-12">
          <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <p className="text-muted-foreground">
                Welcome back! Here are your enrolled courses and
                recommendations.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href="/courses">Browse All Courses</Link>
              </Button>
            </div>
          </div>
          <Tabs defaultValue="enrolled" className="mt-6">
            <TabsList>
              <TabsTrigger value="enrolled">Enrolled Courses</TabsTrigger>
              <TabsTrigger value="suggested">Suggested Courses</TabsTrigger>
            </TabsList>
            <TabsContent value="enrolled" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {enrolledCourses.map((course) => (
                  <Link href={`/courses/${course.id}`} key={course.id}>
                    <Card className="h-full overflow-hidden transition-all hover:border-blue-600 hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle>{course.name}</CardTitle>
                        <CardDescription className="line-clamp-1">
                          {course.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <BookOpen className="h-4 w-4" />
                          <span>{course.assignments} assignments</span>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t bg-muted/50 px-4 py-3">
                        <div className="text-sm">
                          Lecturer: {course.lecturer}
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="suggested" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {suggestedCourses.map((course) => (
                  <Card
                    key={course.id}
                    className="h-full overflow-hidden transition-all hover:border-blue-600 hover:shadow-md"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle>{course.name}</CardTitle>
                      <CardDescription className="line-clamp-1">
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        <span>{course.assignments} assignments</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between border-t bg-muted/50 px-4 py-3">
                      <div className="text-sm">Lecturer: {course.lecturer}</div>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                      >
                        Enroll
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
}

const enrolledCourses = [
  {
    id: "1",
    name: "Introduction to Computer Science",
    description: "Learn the fundamentals of computer science and programming",
    lecturer: "Dr. Jane Smith",
    assignments: 5,
  },
  {
    id: "2",
    name: "Data Structures and Algorithms",
    description: "Advanced concepts in data structures and algorithm design",
    lecturer: "Prof. John Doe",
    assignments: 8,
  },
  {
    id: "3",
    name: "Web Development Fundamentals",
    description:
      "Introduction to HTML, CSS, and JavaScript for web development",
    lecturer: "Dr. Emily Johnson",
    assignments: 6,
  },
];

const suggestedCourses = [
  {
    id: "4",
    name: "Machine Learning Basics",
    description: "Introduction to machine learning concepts and applications",
    lecturer: "Dr. Michael Chen",
    assignments: 7,
  },
  {
    id: "5",
    name: "Database Systems",
    description: "Fundamentals of database design and SQL programming",
    lecturer: "Prof. Sarah Williams",
    assignments: 4,
  },
  {
    id: "6",
    name: "Mobile App Development",
    description: "Learn to build cross-platform mobile applications",
    lecturer: "Dr. Robert Garcia",
    assignments: 6,
  },
];
