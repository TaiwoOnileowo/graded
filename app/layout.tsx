import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "./globals.css";
import QueryProvider from "./QueryProvider";

export const metadata: Metadata = {
  title: "GRADED | Smart Grading Platform for Programming Assignments",
  description:
    "GRADED is an intelligent platform that automates the grading of coding assignments. Ideal for lecturers and students, it simplifies evaluation with test cases, rubrics, and real-time feedback.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` antialiased`}>
        <QueryProvider>
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
