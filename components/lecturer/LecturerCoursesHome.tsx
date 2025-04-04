import Link from "next/link";
import {
  BookOpen,
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Trash,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Courses</h2>
          <p className="text-muted-foreground">
            Manage your courses and assignments
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" asChild>
          <Link href="/courses/new">
            <Plus className="mr-2 h-4 w-4" />
            Create New Course
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search courses..."
            className="w-full bg-background pl-8"
          />
        </div>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Courses</TabsTrigger>
          <TabsTrigger value="draft">Draft Courses</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="draft" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {draftCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CourseCard({ course }: { course: any }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{course.name}</CardTitle>
            <CardDescription>{course.code}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/courses/${course.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Course
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete Course
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {course.description}
        </p>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span>{course.assignments} assignments</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{course.students} students</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 p-3">
        <Button variant="ghost" size="sm" className="w-full" asChild>
          <Link href={`/courses/${course.id}`}>View Course</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

const activeCourses = [
  {
    id: "1",
    name: "Data Structures and Algorithms",
    code: "CS301",
    description:
      "Advanced concepts in data structures and algorithm design. Learn about arrays, linked lists, trees, graphs, and various algorithms for searching and sorting.",
    assignments: 5,
    students: 42,
  },+
  {
    id: "2",
    name: "Database Systems",
    code: "CS405",
    description:
      "Fundamentals of database design and SQL programming. Learn about relational databases, normalization, and database management systems.",
    assignments: 3,
    students: 38,
  },
  {
    id: "3",
    name: "Web Development",
    code: "CS210",
    description:
      "Introduction to web development technologies including HTML, CSS, JavaScript, and modern frameworks.",
    assignments: 4,
    students: 25,
  },
];

const draftCourses = [
  {
    id: "4",
    name: "Programming Fundamentals",
    code: "CS101",
    description:
      "Introduction to programming concepts using Python. Covers variables, control structures, functions, and basic data structures.",
    assignments: 0,
    students: 0,
  },
];
