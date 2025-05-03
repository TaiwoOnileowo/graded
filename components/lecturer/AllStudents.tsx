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
    </div>
  )
}

export default AllStudents