import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

const AllStudents = ({ students }: any) => {
  return (
    <div className="space-y-6 px-4 md:px-8 lg:px-12 w-full mx-auto">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Students</h2>
          <p className="text-muted-foreground">
            Manage your students and their progress
          </p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {students?.length > 0 ? (
          students.map((student: any) => (
            <div
              key={student.studentId}
              className="min-w-[300px] p-4 border rounded-xl shadow-sm bg-white flex items-center gap-4 shrink-0"
            >
              <Avatar className="w-16 h-16">
                <AvatarImage src={student.user?.image} alt={student.user?.name} />
                <AvatarFallback className="text-lg font-bold">
                  {student.user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <h3 className="text-lg font-semibold">{student.user?.name || "Unnamed Student"}</h3>
                <p className="text-sm text-muted-foreground">Matric No: {student.matricNumber}</p>
                <p className="text-sm text-muted-foreground">Level: {student.level}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">No students enrolled yet.</p>
        )}
      </div>
    </div>
  )
}

export default AllStudents
