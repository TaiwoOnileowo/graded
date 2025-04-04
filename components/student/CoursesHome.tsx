import { BookOpen, Search } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function CoursesHome() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="container py-8 md:py-12">
          <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">All Courses</h2>
              <p className="text-muted-foreground">
                Browse and search through all available courses.
              </p>
            </div>
          </div>
          <div className="mt-6 flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="Search courses..."
              className="h-10"
            />
            <Button
              type="submit"
              size="icon"
              className="h-10 w-10 bg-blue-600 cursor-pointer hover:bg-blue-700"
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allCourses.map((course) => (
              <Card
                key={course.id}
                className="h-full overflow-hidden transition-all hover:border-blue-600 hover:shadow-md"
              >
                <CardHeader className="pb-2">
                  <CardTitle>{course.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.assignments} assignments</span>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t bg-muted/50 px-4 py-3">
                  <div className="text-sm">Lecturer: {course.lecturer}</div>
                  {course.enrolled ? (
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/courses/${course.id}`}>View Course</Link>
                    </Button>
                  ) : (
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Enroll
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

const allCourses = [
  {
    id: "1",
    name: "Introduction to Computer Science",
    description:
      "Learn the fundamentals of computer science and programming. This course covers basic programming concepts, algorithms, and problem-solving techniques.",
    lecturer: "Dr. Jane Smith",
    assignments: 5,
    enrolled: true,
  },
  {
    id: "2",
    name: "Data Structures and Algorithms",
    description:
      "Advanced concepts in data structures and algorithm design. Learn about arrays, linked lists, trees, graphs, and various algorithms for searching and sorting.",
    lecturer: "Prof. John Doe",
    assignments: 8,
    enrolled: true,
  },
  {
    id: "3",
    name: "Web Development Fundamentals",
    description:
      "Introduction to HTML, CSS, and JavaScript for web development. Build responsive websites and learn about modern web development practices.",
    lecturer: "Dr. Emily Johnson",
    assignments: 6,
    enrolled: true,
  },
  {
    id: "4",
    name: "Machine Learning Basics",
    description:
      "Introduction to machine learning concepts and applications. Learn about supervised and unsupervised learning, neural networks, and practical applications.",
    lecturer: "Dr. Michael Chen",
    assignments: 7,
    enrolled: false,
  },
  {
    id: "5",
    name: "Database Systems",
    description:
      "Fundamentals of database design and SQL programming. Learn about relational databases, normalization, and database management systems.",
    lecturer: "Prof. Sarah Williams",
    assignments: 4,
    enrolled: false,
  },
  {
    id: "6",
    name: "Mobile App Development",
    description:
      "Learn to build cross-platform mobile applications. This course covers React Native and other frameworks for building mobile apps.",
    lecturer: "Dr. Robert Garcia",
    assignments: 6,
    enrolled: false,
  },
  {
    id: "7",
    name: "Cybersecurity Fundamentals",
    description:
      "Introduction to cybersecurity principles and practices. Learn about common threats, encryption, network security, and ethical hacking.",
    lecturer: "Prof. David Wilson",
    assignments: 5,
    enrolled: false,
  },
  {
    id: "8",
    name: "Artificial Intelligence",
    description:
      "Explore the principles and applications of artificial intelligence. Learn about search algorithms, knowledge representation, and AI ethics.",
    lecturer: "Dr. Lisa Brown",
    assignments: 7,
    enrolled: false,
  },
  {
    id: "9",
    name: "Cloud Computing",
    description:
      "Introduction to cloud computing concepts and services. Learn about AWS, Azure, and Google Cloud platforms and their applications.",
    lecturer: "Prof. James Taylor",
    assignments: 4,
    enrolled: false,
  },
];
