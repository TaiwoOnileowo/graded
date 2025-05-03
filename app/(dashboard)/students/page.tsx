import { auth } from "@/auth"
import AllStudents from "@/components/lecturer/AllStudents"
import { getEnrolledStudentsByLecturer } from "@/lib/actions/course.action"

const page = async () => {
    const session = await auth();
    
    const lecturerStudents = await getEnrolledStudentsByLecturer(session?.user?.lecturer?.id!)
  return (
      <AllStudents students={lecturerStudents} />
  )
}

export default page