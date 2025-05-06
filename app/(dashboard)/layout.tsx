import { auth } from "@/auth";
import LecturerDashboardLayout from "@/components/layout/LecturerDashboardLayout";
import StudentDashboardLayout from "@/components/layout/StudentDashboardLayout";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  const role = session?.user?.role;
  const isStudent = role === "STUDENT";
  const userId = session?.user.id;
  let lecturerDetails;
  if (!isStudent) {
    lecturerDetails = {
      id: session?.user.id,
      name: session?.user.name || "Unknown",
      title: session?.user.lecturer?.title || "",
      department: session?.user.lecturer?.department || "",
    };
  }
  return (
    <>
      {isStudent ? (
        <StudentDashboardLayout>{children}</StudentDashboardLayout>
      ) : (
        <LecturerDashboardLayout lecturerDetails={lecturerDetails}>
          {children}
        </LecturerDashboardLayout>
      )}
    </>
  );
};
export default Layout;
