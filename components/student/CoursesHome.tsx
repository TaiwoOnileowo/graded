"use client";

import { useEffect, useState } from "react";
import { BookOpen, Search, Loader2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { ICourse } from "@/types";
import { enrollStudent } from "@/lib/actions/course.action";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CoursesHome({
  courses: initialCourses,
  studentId,
}: {
  courses: ICourse[];
  studentId: string;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ICourse[]>(initialCourses);
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(
    null
  );
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [coursePassword, setCoursePassword] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults(initialCourses);
    } else {
      const filtered = initialCourses.filter((course) =>
        [course.name, course.code, course.description]
          .filter(Boolean)
          .some((field) =>
            field!.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
      setSearchResults(filtered);
    }
  }, [searchQuery, initialCourses]);

  const handleEnrollClick = (course: ICourse) => {
    setSelectedCourse(course);
    setShowPasswordDialog(true);
  };

  const handleEnroll = async () => {
    if (!selectedCourse) return;

    setEnrollingCourseId(selectedCourse.id);
    setShowPasswordDialog(false);

    try {
      await enrollStudent(selectedCourse.id, studentId, coursePassword);

      const updateEnrollment = (courses: ICourse[]) =>
        courses.map((course) =>
          course.id === selectedCourse.id
            ? { ...course, enrolled: true }
            : course
        );

      setSearchResults((prev) => updateEnrollment(prev));
      setCoursePassword(""); // Reset password
      toast.success("Successfully enrolled in course!");
    } catch (error: any) {
      toast.error(
        error.message || "Failed to enroll in course. Please try again."
      );
    } finally {
      setEnrollingCourseId(null);
      setSelectedCourse(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="container py-8 md:py-12">
          <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">All Courses</h2>
              <p className="text-muted-foreground">
                Browse and search through all available courses.
              </p>
            </div>
          </div>

          <div className="mt-6 flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="Search courses..."
              className="h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              size="icon"
              className="h-10 w-10 bg-blue-600 cursor-pointer hover:bg-blue-700"
              onClick={() => {
                // Optional: force re-filter (not necessary with useEffect)
                setSearchQuery((q) => q.trim());
              }}
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </div>

          {searchResults.length === 0 ? (
            <div className="mt-8 text-center">
              <h3 className="text-lg font-medium">No courses found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or browse all available courses.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((course) => (
                <Card
                  key={course.id}
                  className="cursor-pointer h-full overflow-hidden transition-all hover:border-blue-600 hover:shadow-md"
                >
                  <CardHeader className="pb-2">
                    <CardTitle>
                      {course.code} - {course.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
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
                    {course.enrolled ? (
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/courses/${course.id}`}>View Course</Link>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleEnrollClick(course)}
                        disabled={enrollingCourseId === course.id}
                      >
                        {enrollingCourseId === course.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enrolling...
                          </>
                        ) : (
                          "Enroll"
                        )}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Course Password</DialogTitle>
            <DialogDescription>
              Please enter the password for {selectedCourse?.code} -{" "}
              {selectedCourse?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="password"
              placeholder="Enter course password"
              value={coursePassword}
              onChange={(e) => setCoursePassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleEnroll();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPasswordDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleEnroll}
              disabled={!coursePassword.trim()}
            >
              Enroll
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
