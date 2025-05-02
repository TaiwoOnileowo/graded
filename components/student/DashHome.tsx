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
import type { IEnrolledCourse } from "@/types";
import { BookOpen, GraduationCap, Search, PlusCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
const EmptyCoursesState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-blue-100 p-6 mb-6">
        <GraduationCap className="h-12 w-12 text-blue-600" />
      </div>
      <h3 className="text-2xl font-bold mb-2">No courses enrolled yet</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        You haven't enrolled in any courses yet. Browse our catalog to find
        courses that match your interests and academic goals.
      </p>
      <Button asChild className="bg-blue-600 hover:bg-blue-700">
        <Link href="/courses">
          <Search className="mr-2 h-4 w-4" />
          Browse Courses
        </Link>
      </Button>
    </div>
  );
};

const DashHome = ({
  enrolledCourses,
}: {
  enrolledCourses: IEnrolledCourse[] | undefined;
}) => {
  const hasEnrolledCourses = enrolledCourses && enrolledCourses.length > 0;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="container py-8 md:py-12">
          <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <p className="text-muted-foreground">
                {hasEnrolledCourses
                  ? "Welcome back! Here are your enrolled courses and recommendations."
                  : "Welcome! Get started by enrolling in your first course."}
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
            </TabsList>
            <TabsContent value="enrolled" className="mt-6">
              {hasEnrolledCourses ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {enrolledCourses.map((course) => (
                    <Link href={`/courses/${course.id}`} key={course.id}>
                      <Card className="h-full overflow-hidden transition-all hover:border-blue-600 hover:shadow-md">
                        <CardHeader className="pb-2">
                          <CardTitle>
                            {course.code} - {course.name}
                          </CardTitle>
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
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <EmptyCoursesState />
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
};

export default DashHome;
