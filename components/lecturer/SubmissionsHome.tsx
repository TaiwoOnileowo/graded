"use client";

import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import {
  useGetSubmissions,
  useGetSubmissionStats,
} from "@/app/hooks/reactQueryHooks";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LecturerSubmissionsPage({
  courseId,
  assignmentId,
}: {
  courseId: string;
  assignmentId: string;
}) {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const {
    data: submissionsData,
    isLoading: isLoadingSubmissions,
    error: submissionsError,
  } = useGetSubmissions(assignmentId, page, 10, activeSearch);

  const {
    data: stats,
    isLoading: isLoadingStats,
    error: statsError,
  } = useGetSubmissionStats(assignmentId);

  const handleSearch = () => {
    setActiveSearch(searchQuery);
    setPage(1); // Reset to first page when searching
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const filteredSubmissions = submissionsData?.submissions.filter(
    (submission) => {
      if (activeTab === "all") return true;
      if (activeTab === "graded") return submission.status === "Graded";
      if (activeTab === "missing") return submission.status === "Missing";
      return true;
    }
  );

  if (submissionsError || statsError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {submissionsError?.message ||
            statsError?.message ||
            "An error occurred"}
        </AlertDescription>
      </Alert>
    );
  }

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
        {isLoadingStats ? (
          <>
            <Card>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="mt-2 h-4 w-32" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="mt-2 h-4 w-32" />
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Submissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalSubmissions}/{stats?.totalStudents}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.totalStudents != null &&
                  stats?.totalSubmissions != null
                    ? `${stats.totalStudents - stats.totalSubmissions} students`
                    : "0 students"}{" "}
                  haven't submitted yet
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.averageScore.toFixed(1)}/{stats?.totalScore}
                </div>
                <p className="text-xs text-muted-foreground">
                  Based on {stats?.gradedCount} graded submissions
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search submissions by student name..."
            className="w-full bg-background pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Submissions</TabsTrigger>
          <TabsTrigger value="graded">Graded</TabsTrigger>
          <TabsTrigger value="missing">Missing</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardContent className="p-0">
              {isLoadingSubmissions ? (
                <div className="p-4 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
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
                      {filteredSubmissions?.map((submission) => (
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
                                  Review
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

                  {/* Pagination */}
                  {submissionsData && submissionsData.totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t">
                      <div className="text-sm text-muted-foreground">
                        Showing page {page} of {submissionsData.totalPages}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setPage((p) =>
                              Math.min(submissionsData.totalPages, p + 1)
                            )
                          }
                          disabled={page === submissionsData.totalPages}
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
