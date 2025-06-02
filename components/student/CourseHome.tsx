"use client";

import { ArrowLeft, BookOpen, Calendar, Trophy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: any;
}

const SubmissionModal = ({
  isOpen,
  onClose,
  submission,
}: SubmissionModalProps) => {
  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Submission Results</h2>

        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-semibold text-blue-800">Final Score</h3>
            <p className="text-2xl font-bold text-blue-600">
              {submission.autoGrade}%
            </p>
            <p className="text-blue-600">
              Tests Passed: {submission.testsPassed}/{submission.testsTotal}
            </p>
            {submission.timeSpent && (
              <p className="text-blue-600">
                Time Spent: {formatTime(submission.timeSpent)}
              </p>
            )}
          </div>

          {submission.testResults && submission.testResults.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Test Results</h3>
              {submission.testResults.map((result: any, index: number) => (
                <div
                  key={index}
                  className={`p-3 rounded mb-2 ${
                    result.passed ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <p
                    className={`font-medium ${
                      result.passed ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {result.name}: {result.passed ? "Passed" : "Failed"}
                  </p>
                  <p className="text-sm">{result.message}</p>
                </div>
              ))}
            </div>
          )}

          {submission.rubricEvaluations &&
            submission.rubricEvaluations.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Rubric Evaluations</h3>
                {submission.rubricEvaluations.map(
                  (evaluation: any, index: number) => (
                    <div key={index} className="border-b pb-3 mb-3">
                      <p className="font-medium">Points: {evaluation.points}</p>
                      <p className="text-sm text-gray-600">
                        {evaluation.comment}
                      </p>
                    </div>
                  )
                )}
              </div>
            )}

          <div>
            <h3 className="font-semibold mb-2">Feedback</h3>
            <p className="text-gray-700">{submission.feedback}</p>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function StudentCoursePage({ course }: { course: any }) {
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const completedAssignments = course.assignments.filter(
    (assignment: any) => assignment.completed === true
  );

  const handleViewSubmission = async (assignmentId: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/api/assignments/${assignmentId}/submission`
      );
      setSelectedSubmission(response.data.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching submission:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="container py-8 md:py-12">
          <div className="mb-8">
            <Link
              href="/courses"
              className="mb-6 flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Link>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  {course.name}
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Lecturer: {course.lecturer.name}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex items-center gap-1 rounded-lg border bg-card px-3 py-1 text-sm">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <span>{course.assignments.length} Assignments</span>
                </div>
                <div className="flex items-center gap-1 rounded-lg border bg-card px-3 py-1 text-sm">
                  <Trophy className="h-4 w-4 text-blue-600" />
                  <span>
                    Total:{" "}
                    {course.assignments.reduce(
                      (acc: number, curr: any) => acc + curr.marks,
                      0
                    )}{" "}
                    marks
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-4 max-w-3xl">{course.description}</p>
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Course Progress</span>
                <span className="text-sm font-medium">
                  {completedAssignments.length}/{course.assignments.length}{" "}
                  assignments completed
                </span>
              </div>
              <Progress
                value={
                  (completedAssignments.length / course.assignments.length) *
                  100
                }
                className="mt-2 h-2"
              />
            </div>
          </div>

          <div className="mt-8">
            <h3 className="mb-4 text-xl font-semibold">Assignments</h3>
            {course.assignments.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">
                  No assignments yet
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Check back later for new assignments
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {course.assignments.map((assignment: any) => (
                  <Card
                    key={assignment.id}
                    className="overflow-hidden transition-all hover:border-blue-600 hover:shadow-md"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{assignment.title}</CardTitle>
                          <CardDescription className="mt-1 line-clamp-2">
                            {assignment.description}
                          </CardDescription>
                        </div>
                        <div className="flex h-8 items-center rounded-full bg-blue-100 px-3 text-sm font-medium text-blue-800">
                          {assignment.marks} marks
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(assignment.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between border-t bg-muted/50 px-4 py-3">
                      {assignment.completed ? (
                        <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                          <div className="h-2 w-2 rounded-full bg-green-600"></div>
                          Completed
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm font-medium text-amber-600">
                          <div className="h-2 w-2 rounded-full bg-amber-600"></div>
                          Pending
                        </div>
                      )}
                      {assignment.completed ? (
                        <Button
                          size="sm"
                          className="bg-blue-600 cursor-pointer hover:bg-blue-700"
                          onClick={() => handleViewSubmission(assignment.id)}
                          disabled={isLoading}
                        >
                          {isLoading ? "Loading..." : "View Submission"}
                        </Button>
                      ) : (
                        <Link
                          href={`/courses/${course.id}/assignments/${assignment.id}/editor`}
                        >
                          <Button
                            size="sm"
                            className="bg-blue-600 cursor-pointer hover:bg-blue-700"
                          >
                            Start Assignment
                          </Button>
                        </Link>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <SubmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        submission={selectedSubmission}
      />
    </div>
  );
}
