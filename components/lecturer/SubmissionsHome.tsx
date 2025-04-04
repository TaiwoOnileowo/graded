import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Clock,
  Download,
  FileText,
  Search,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LecturerSubmissionsPage({
  courseId,
  assignmentId,
}: {
  courseId: string;
  assignmentId: string;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/courses/${courseId}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Assignment Submissions
          </h2>
          <p className="text-sm text-muted-foreground">
            Assignment 1: Linked Lists Implementation
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38/42</div>
            <p className="text-xs text-muted-foreground">
              4 students haven't submitted yet
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Graded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">30/38</div>
            <p className="text-xs text-muted-foreground">
              8 submissions awaiting grading
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78.5%</div>
            <p className="text-xs text-muted-foreground">
              Based on 30 graded submissions
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search submissions by student name..."
            className="w-full bg-background pl-8"
          />
        </div>
        {/* <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Grades
        </Button> */}
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Submissions</TabsTrigger>
          <TabsTrigger value="graded">Graded</TabsTrigger>
          <TabsTrigger value="ungraded">Ungraded</TabsTrigger>
          <TabsTrigger value="missing">Missing</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Student
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Submission Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Score
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="border-b">
                      <td className="px-4 py-3 text-sm">
                        <div className="font-medium">
                          {submission.studentName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {submission.matricNumber}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {submission.submissionDate}
                        {submission.status !== "Missing" && (
                          <div className="text-xs text-muted-foreground">
                            {submission.onTime ? "On time" : "Late"}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center">
                          {submission.status === "Graded" ? (
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                          ) : submission.status === "Ungraded" ? (
                            <Clock className="mr-2 h-4 w-4 text-amber-500" />
                          ) : (
                            <X className="mr-2 h-4 w-4 text-red-500" />
                          )}
                          {submission.status}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {submission.status === "Graded" ? (
                          <div className="font-medium">
                            {submission.score}/{submission.totalScore}
                          </div>
                        ) : (
                          <div className="text-muted-foreground">-</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {submission.status !== "Missing" ? (
                          <Button variant="ghost" size="sm" asChild>
                            <Link
                              href={`/courses/${courseId}/assignments/${assignmentId}/submissions/${submission.id}`}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              {submission.status === "Graded"
                                ? "Review"
                                : "Grade"}
                            </Link>
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" disabled>
                            <FileText className="mr-2 h-4 w-4" />
                            No Submission
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="graded" className="mt-4">
          {/* Similar table but filtered for graded submissions */}
        </TabsContent>
        <TabsContent value="ungraded" className="mt-4">
          {/* Similar table but filtered for ungraded submissions */}
        </TabsContent>
        <TabsContent value="missing" className="mt-4">
          {/* Similar table but filtered for missing submissions */}
        </TabsContent>
      </Tabs>
    </div>
  );
}

const submissions = [
  {
    id: "sub1",
    studentName: "Alex Johnson",
    matricNumber: "23CG034136",
    submissionDate: "March 14, 2025, 2:30 PM",
    onTime: true,
    status: "Graded",
    score: 85,
    totalScore: 100,
  },
  {
    id: "sub2",
    studentName: "Maria Garcia",
    matricNumber: "23CG034136",
    submissionDate: "March 14, 2025, 11:45 AM",
    onTime: true,
    status: "Graded",
    score: 92,
    totalScore: 100,
  },
  {
    id: "sub3",
    studentName: "James Wilson",
    matricNumber: "23CG034136",
    submissionDate: "March 15, 2025, 11:55 PM",
    onTime: true,
    status: "Graded",
    score: 78,
    totalScore: 100,
  },
  {
    id: "sub4",
    studentName: "Sarah Ahmed",
    matricNumber: "23CG034136",
    submissionDate: "March 16, 2025, 10:15 AM",
    onTime: false,
    status: "Ungraded",
    score: null,
    totalScore: 100,
  },
  {
    id: "sub5",
    studentName: "David Lee",
    matricNumber: "23CG034136",
    submissionDate: "March 14, 2025, 9:20 AM",
    onTime: true,
    status: "Ungraded",
    score: null,
    totalScore: 100,
  },
  {
    id: "sub6",
    studentName: "Emily Johnson",
    matricNumber: "23CG034136",
    submissionDate: null,
    onTime: null,
    status: "Missing",
    score: null,
    totalScore: 100,
  },
  {
    id: "sub7",
    studentName: "Michael Brown",
    matricNumber: "23CG034136",
    submissionDate: "March 13, 2025, 3:45 PM",
    onTime: true,
    status: "Graded",
    score: 88,
    totalScore: 100,
  },
  {
    id: "sub8",
    studentName: "Sophia Martinez",
    matricNumber: "23CG034136",
    submissionDate: null,
    onTime: null,
    status: "Missing",
    score: null,
    totalScore: 100,
  },
];
