import { getEnrolledStudents } from "@/lib/actions/course.action";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ManageStudents = async ({ courseId }: { courseId: string }) => {
  const enrolledStudents = await getEnrolledStudents(courseId);

  return (
    <div className="space-y-6 px-4 md:px-8 min-w-full mx-auto">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/courses/${courseId}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">Manage Students</h2>
      </div>

      <div>
        {enrolledStudents.length === 0 ? (
          <div className="flex items-center justify-center w-full">
            <p className="text-lg text-muted-foreground text-center">
              No students have enrolled in this course
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {enrolledStudents.map((student: any) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 border rounded-md"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={student.image} alt={student.name} />
                    <AvatarFallback>
                      {student.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {student.email}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageStudents;
