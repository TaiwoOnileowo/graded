import { auth } from "@/auth";
import CodeEditor from "@/components/editor/CodeEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAssignmentDetails } from "@/lib/actions/assignment.action";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Assignment {
  id: string;
  title: string;
  description?: string;
  marks: number;
  deadline?: Date;
  codeTemplate?: string;
  hint?: string;
  questionText?: string;
  course: { id: string; name: string };
  rubrics: Array<{
    id: string;
    title: string;
    description?: string;
    maxPoints: number;
  }>;
  testCases: Array<{
    id: string;
    input: string;
    expectedOutput: string;
    description?: string;
  }>;
}

// SEO Metadata function
export async function generateMetadata({ params }: { params: any }) {
  const { assignmentId } = await params;
  const session = await auth();
  const studentId = session?.user.student?.id;

  const result = await getAssignmentDetails(assignmentId, studentId!);

  if (!result.success || !result.data) {
    return {
      title: "Assignment Not Found | Course Management",
      description: "The requested assignment is not available.",
    };
  }

  const assignment: Assignment = result.data;
  const { title, course, marks, deadline } = assignment;

  return {
    title: `${title} - ${course.name} Assignment | Course Management`,
    description: `Complete your assignment: ${title} for the course ${course.name}. Total Marks: ${marks}. Deadline: ${new Date(deadline!).toLocaleString()}.`,
  };
}

const Page = async ({ params }: { params: Promise<{ assignmentId: string }> }) => {
  const session = await auth();
  const studentId = session?.user.student?.id;
  const { assignmentId } = await params;
  const result = await getAssignmentDetails(assignmentId, studentId!);

  if (!result.success || !result.data) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-red-600">{result.error}</h2>
      </div>
    );
  }

  const assignment: Assignment = result.data;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href={`/courses/${assignment.course.id}`}
          className="text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="text-2xl font-bold">
          {assignment.title} - {assignment.course.name}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Instructions and Details */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                {assignment.description || "No description provided."}
              </p>
              {assignment.questionText && (
                <div className="mt-4">
                  <h3 className="font-semibold">Problem Statement:</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {assignment.questionText}
                  </p>
                </div>
              )}
              <div className="mt-4">
                <p>
                  <span className="font-semibold">Total Marks:</span>{" "}
                  {assignment.marks}
                </p>
                {assignment.deadline && (
                  <p>
                    <span className="font-semibold">Deadline:</span>{" "}
                    {new Date(assignment.deadline).toLocaleString()}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {assignment.hint && (
            <Card>
              <CardHeader>
                <CardTitle>Hint</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{assignment.hint}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Rubric</CardTitle>
            </CardHeader>
            <CardContent>
              {assignment.rubrics.length > 0 ? (
                <ul className="space-y-2">
                  {assignment.rubrics.map((rubric) => (
                    <li key={rubric.id} className="border-b pb-2">
                      <p className="font-semibold">
                        {rubric.title} ({rubric.maxPoints} points)
                      </p>
                      <p className="text-gray-600 text-sm">
                        {rubric.description || "No description"}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No rubric provided.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sample Test Cases</CardTitle>
            </CardHeader>
            <CardContent>
              {assignment.testCases.length > 0 ? (
                <ul className="space-y-4">
                  {assignment.testCases.map((testCase) => (
                    <li key={testCase.id} className="border-b pb-2">
                      <p className="font-semibold">
                        {testCase.description || `Test Case ${testCase.id}`}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Input:</span>{" "}
                        {testCase.input}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Expected Output:</span>{" "}
                        {testCase.expectedOutput}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No test cases provided.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel: Code Editor */}
        <div className="lg:col-span-2">
          <CodeEditor initialCode={assignment.codeTemplate || ""} />
        </div>
      </div>
    </div>
  );
};

export default Page;
