"use client";

import {
  Award,
  Calendar,
  Clock,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import {
  getStudentSubmissions,
  getStudentSubmissionStats,
} from "@/lib/actions/student-submission.action";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Student {
  id: string;
  name: string;
  email: string;
  matricNumber: string;
  level: number;
  major: string;
}

interface Course {
  id: string;
  name: string;
  code: string;
}

interface StudentSubmissionsViewProps {
  studentId: string;
  courseId: string;
  student: Student;
  course: Course;
}

export default function StudentSubmissionsView({
  studentId,
  courseId,
  student,
  course,
}: StudentSubmissionsViewProps) {
  const {
    data: submissionsData,
    isLoading: isLoadingSubmissions,
    error: submissionsError,
  } = useQuery({
    queryKey: ["studentSubmissions", studentId, courseId, 1, 10],
    queryFn: () => getStudentSubmissions(studentId, courseId, 1, 10),
  });

  const {
    data: statsData,
    isLoading: isLoadingStats,
    error: statsError,
  } = useQuery({
    queryKey: ["studentSubmissionStats", studentId, courseId],
    queryFn: () => getStudentSubmissionStats(studentId, courseId),
  });

  if (isLoadingSubmissions || isLoadingStats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (submissionsError || statsError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {submissionsError?.message ||
            statsError?.message ||
            "Failed to load submissions data"}
        </AlertDescription>
      </Alert>
    );
  }

  const submissions = submissionsData?.submissions || [];
  const stats = statsData || {
    averageScore: 0,
    totalSubmissions: 0,
    gradedSubmissions: 0,
    lateSubmissions: 0,
  };

  return (
    <div className="space-y-6">
      {/* Student Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Student Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-lg font-semibold">{student.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Matric Number
              </p>
              <p className="text-lg font-semibold">{student.matricNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Level</p>
              <p className="text-lg font-semibold">{student.level}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Major</p>
              <p className="text-lg font-semibold">{student.major}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.averageScore.toFixed(1)}%
            </div>
            <Progress value={stats.averageScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Submissions
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.gradedSubmissions} graded, {stats.lateSubmissions} late
            </p>
          </CardContent>
        </Card>
      </div>

      <SubmissionsList submissions={submissions} />
    </div>
  );
}

function SubmissionsList({ submissions }: { submissions: any[] }) {
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusIcon = (status: string, isLate: boolean) => {
    if (isLate) return <AlertTriangle className="h-4 w-4 text-red-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No submissions found</h3>
          <p className="text-sm text-muted-foreground text-center">
            This student hasn't made any submissions in this course yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => {
        const scorePercentage = (submission.score / submission.maxScore) * 100;

        return (
          <Card key={submission.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">
                    {submission.assignmentTitle}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Submitted: {submission.submittedAt.toLocaleDateString()} at{" "}
                    {submission.submittedAt.toLocaleTimeString()}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(submission.status, submission.isLate)}
                  <Badge
                    variant={submission.isLate ? "destructive" : "default"}
                  >
                    {submission.isLate ? "Late" : submission.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Score
                  </p>
                  <p
                    className={`text-2xl font-bold ${getScoreColor(
                      scorePercentage
                    )}`}
                  >
                    {submission.score}/{submission.maxScore}
                  </p>
                  <p className={`text-sm ${getScoreColor(scorePercentage)}`}>
                    {scorePercentage.toFixed(1)}%
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Time Spent
                  </p>
                  <p className="text-2xl font-bold">
                    {formatDuration(submission.timeSpent)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Deadline
                  </p>
                  <p className="text-lg font-semibold">
                    {submission.deadline.toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {submission.deadline.toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {submission.feedback && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Feedback
                  </p>
                  <p className="text-sm bg-muted p-3 rounded-md">
                    {submission.feedback}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
