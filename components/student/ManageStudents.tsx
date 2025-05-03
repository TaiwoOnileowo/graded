import { Button } from "../ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
const ManageStudents = ({ courseId }: { courseId: string }) => {
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
        </div>
  )
}

export default ManageStudents