import Header from "../Header";

const StudentDashboardLayout = ({
    children,
    }: {
    children: React.ReactNode;
}) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};
export default StudentDashboardLayout;
