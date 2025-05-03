import { getEnrolledStudents } from "@/lib/actions/course.action";
import { Button } from "../ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
const ManageStudents = async ({ courseId }: { courseId: string }) => {
    const enrolledStudents = await getEnrolledStudents(courseId);
    console.log(enrolledStudents)
    return (    
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/courses/${courseId}`}>
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                    </Link>
                </Button>
                <h2 className="text-2xl font-bold tracking-tight">
                    Manage Students
                </h2>
            </div>
            <div className="grid">
                {enrolledStudents.length === 0 ? (
                    <div className="flex items-center justify-center w-full">
                        <p className="text-lg text-muted-foreground text-center">
                            No students has enrolled in this course
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-2">
                        {/* {enrolledStudents.map((student)) => (
                        <div className="flex items-center justify-between p-4 border rounded-md" key={id}>
                        </div>
                    )} */}
                    </div>
                )}
            </div>
        </div>
  )
}

export default ManageStudents