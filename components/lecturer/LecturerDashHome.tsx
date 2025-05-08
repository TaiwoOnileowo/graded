import Link from "next/link";
import {
  BookOpen,
  Clock,
  FileText,
  GraduationCap,
  Plus,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getEnrolledStudentsByLecturer } from "@/lib/actions/course.action";

interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  isPublished: boolean;
  lecturer: string;
  assignments: number;
  updatedAt: Date;
  createdAt: Date;
}


export default async function LecturerDashboard({ courses, name, title, userId }: { courses: Course[]; name: string; title: string; userId: string; }) {
  const recentCourses = courses
    .slice()
    .reverse()
    .slice(0, 4);
   // Only 4 most recent
  const lecturerStudents = await getEnrolledStudentsByLecturer(userId)
  return (
      <div className="w-full px-4 md:px-6 lg:px-8 space-y-6 py-4"> 
   
        <div className="flex flex-col w-full justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
            Welcome back, <span className="capitalize">{title}. {name}</span> Here's an overview of your teaching
              activities.
            </p>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/courses/new">
              <Plus className="mr-2 h-4 w-4" />
              Create New Course
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
              <CardTitle className="text-sm font-medium">
                Active Courses
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{courses.length}</div>
              <p className="text-xs text-muted-foreground">
                2 published, 2 drafts
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{lecturerStudents.length}</div>
              <p className="text-xs text-muted-foreground">+12 from last week</p>
            </CardContent>
          </Card>
          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Submissions
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">Awaiting grading</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Upcoming Deadlines
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">In the next 7 days</p>
            </CardContent>
          </Card> */}
        </div>

        <div className="flex items-start gap-5 md:grid-cols-2 lg:grid-cols-8">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>
                Recent student submissions across your courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSubmissions.map((submission) => (
                  <div key={submission.id} className="flex items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                      <GraduationCap className="h-5 w-5 text-blue-700" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {submission.studentName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {submission.assignmentTitle}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {submission.timeAgo}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Submissions
              </Button>
            </CardFooter>
          </Card>
          <Card className="lg:col-span-5">
            <CardHeader>
              <CardTitle>Your Courses</CardTitle>
              <CardDescription>
                Quick access to your recent courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCourses.map((course) => (
                  <div key={course.id} className="flex items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                      <BookOpen className="h-5 w-5 text-blue-700" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {course.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {course.code} • {course.assignments} assignments
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/courses/${course.id}`}>View</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/courses">View All Courses</Link>
              </Button>
            </CardFooter>
          </Card>

        </div>
    </div>
  );
}

const recentSubmissions = [
  {
    id: "1",
    studentName: "Alex Johnson",
    assignmentTitle: "Data Structures Assignment 2",
    timeAgo: "2 hours ago",
  },
  {
    id: "2",
    studentName: "Maria Garcia",
    assignmentTitle: "Algorithm Analysis Quiz",
    timeAgo: "4 hours ago",
  },
  {
    id: "3",
    studentName: "James Wilson",
    assignmentTitle: "Database Design Project",
    timeAgo: "Yesterday",
  },
  {
    id: "4",
    studentName: "Sarah Ahmed",
    assignmentTitle: "Web Development Assignment 1",
    timeAgo: "Yesterday",
  },
  {
    id: "5",
    studentName: "David Lee",
    assignmentTitle: "Programming Fundamentals Quiz",
    timeAgo: "2 days ago",
  },
];