"use client";

import CodeEditor from "@/components/ui/code-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Check,
  Clock,
  FileText,
  MessageSquare,
  X,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import { updateSubmissionFeedback } from "@/lib/actions/submission-review.action";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

interface SubmissionData {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  student: {
    id: string;
    name: string;
    email: string;
    matricNumber: string;
  };
  submittedAt: Date;
  status: string;
  score: number;
  maxScore: number;
  isLate: boolean;
  deadline: Date;
  timeSpent: number;
  code: string;
  testResults: TestResult[];
  automatedFeedback: string;
  lecturerFeedback: string;
  generalFeedback: string;
}

export default function SubmissionReviewContent({
  submission,
  courseId,
  assignmentId,
}: {
  submission: SubmissionData;
  courseId: string;
  assignmentId: string;
}) {
  const router = useRouter();
  const [lecturerFeedback, setLecturerFeedback] = useState(
    submission.lecturerFeedback || ""
  );
  const [generalFeedback, setGeneralFeedback] = useState(
    submission.generalFeedback || ""
  );
  const [score, setScore] = useState(submission.score);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passedTests = submission.testResults.filter(
    (test) => test.passed
  ).length;
  const totalTests = submission.testResults.length;
  const testPassRate = Math.round((passedTests / totalTests) * 100);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleSaveFeedback = async () => {
    setIsSaving(true);
    setError(null);

    try {
      await updateSubmissionFeedback(submission.id, {
        lecturerFeedback,
        generalFeedback,
        score,
      });

      toast.success("Feedback saved successfully");
      router.refresh(); // Refresh the page to show updated data
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save feedback";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link
              href={`/courses/${courseId}/assignments/${assignmentId}/submissions`}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {submission.assignmentTitle}
            </h1>
            <p className="text-sm text-muted-foreground">
              {submission.courseName} ({submission.courseCode}) -{" "}
              {submission.student.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={submission.isLate ? "destructive" : "default"}>
            {submission.isLate ? "Late Submission" : "On Time"}
          </Badge>
          <Badge
            variant={submission.status === "Graded" ? "default" : "secondary"}
          >
            {submission.status}
          </Badge>
        </div>
      </div>

      {/* Submission Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <input
                type="number"
                value={score}
                onChange={(e) =>
                  setScore(
                    Math.min(
                      submission.maxScore,
                      Math.max(0, Number.parseInt(e.target.value) || 0)
                    )
                  )
                }
                className="text-2xl font-bold w-16 bg-transparent border-b border-gray-300 focus:border-primary focus:outline-none"
              />
              <span className="text-2xl font-bold">
                / {submission.maxScore}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {Math.round((score / submission.maxScore) * 100)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tests Passed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {passedTests}/{totalTests}
            </div>
            <p className="text-sm text-muted-foreground">
              {testPassRate}% pass rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Submission Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {submission.submittedAt.toLocaleDateString()}
            </div>
            <p className="text-sm text-muted-foreground">
              {submission.submittedAt.toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDuration(submission.timeSpent)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="code">
        <TabsList>
          <TabsTrigger value="code">
            <FileText className="h-4 w-4 mr-2" />
            Code Submission
          </TabsTrigger>
          <TabsTrigger value="tests">
            <Check className="h-4 w-4 mr-2" />
            Test Results
          </TabsTrigger>
          <TabsTrigger value="feedback">
            <MessageSquare className="h-4 w-4 mr-2" />
            Feedback
          </TabsTrigger>
        </TabsList>

        {/* Code Tab */}
        <TabsContent value="code" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Code</CardTitle>
              <CardDescription>
                Submitted on {submission.submittedAt.toLocaleDateString()} at{" "}
                {submission.submittedAt.toLocaleTimeString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 border-t">
              <div className="h-[600px]">
                <CodeEditor
                  defaultValue={submission.code}
                  language="c"
                  readOnly={true}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Test Results Tab */}
        <TabsContent value="tests" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                {passedTests} of {totalTests} tests passed ({testPassRate}%)
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {submission.testResults.map((test, index) => (
                  <div key={index} className="p-4 flex items-start gap-4">
                    {test.passed ? (
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mt-0.5" />
                    )}
                    <div>
                      <h3 className="font-medium">{test.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {test.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automated Feedback</CardTitle>
              <CardDescription>
                Generated by the automated grading system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md">
                <p className="text-sm">{submission.automatedFeedback}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lecturer Feedback</CardTitle>
              <CardDescription>
                Provide specific feedback for this student's submission
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter your feedback for this specific submission..."
                className="min-h-32"
                value={lecturerFeedback}
                onChange={(e) => setLecturerFeedback(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>General Feedback</CardTitle>
              <CardDescription>
                Provide general feedback that will be visible to all students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter general feedback about this assignment..."
                className="min-h-32"
                value={generalFeedback}
                onChange={(e) => setGeneralFeedback(e.target.value)}
              />
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button onClick={handleSaveFeedback} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Feedback"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
