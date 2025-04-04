import Link from "next/link";
import { ArrowLeft, Plus, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export default function LecturerNewAssignmentPage({ courseId }: { courseId: string }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/courses/${courseId}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">
          Create New Assignment
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Details</CardTitle>
              <CardDescription>
                Enter the basic details for your new assignment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Assignment Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Assignment 1: Linked Lists Implementation"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Assignment Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of the assignment"
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="marks">Total Marks</Label>
                <Input id="marks" type="number" placeholder="e.g. 100" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input id="deadline" type="datetime-local" />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="published" />
                <Label htmlFor="published">
                  Publish assignment immediately
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Programming Question</CardTitle>
              <CardDescription>
                Define the programming question and expected solution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="questionText">Question Text</Label>
                <Textarea
                  id="questionText"
                  placeholder="Describe the programming problem in detail"
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="codeTemplate">Code Template (Optional)</Label>
                <Textarea
                  id="codeTemplate"
                  placeholder="Provide a starting code template for students"
                  className="min-h-[120px] font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedSolution">Expected Solution</Label>
                <Textarea
                  id="expectedSolution"
                  placeholder="Provide the expected solution for automated grading"
                  className="min-h-[120px] font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hint">Hint (Optional)</Label>
                <Textarea
                  id="hint"
                  placeholder="Provide a hint to guide students"
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Grading Rubric</CardTitle>
                <CardDescription>
                  Define criteria for grading this assignment
                </CardDescription>
              </div>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Criterion
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((index) => (
                <div key={index} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-4 flex-1">
                      <div className="space-y-2">
                        <Label htmlFor={`criterion-${index}-title`}>
                          Criterion Title
                        </Label>
                        <Input
                          id={`criterion-${index}-title`}
                          placeholder={`e.g. Code Correctness`}
                          defaultValue={
                            index === 1
                              ? "Code Correctness"
                              : index === 2
                              ? "Code Efficiency"
                              : "Documentation"
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`criterion-${index}-description`}>
                          Description
                        </Label>
                        <Textarea
                          id={`criterion-${index}-description`}
                          placeholder="Describe what you're evaluating"
                          className="min-h-[80px]"
                          defaultValue={
                            index === 1
                              ? "The code correctly implements all required functionality and passes all test cases."
                              : index === 2
                              ? "The solution uses efficient algorithms and data structures with optimal time and space complexity."
                              : "Code is well-documented with appropriate comments explaining the approach and implementation details."
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`criterion-${index}-points`}>
                          Maximum Points
                        </Label>
                        <Input
                          id={`criterion-${index}-points`}
                          type="number"
                          placeholder="e.g. 10"
                          defaultValue={
                            index === 1 ? "50" : index === 2 ? "30" : "20"
                          }
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete criterion</span>
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Automated Testing</CardTitle>
              <CardDescription>
                Configure automated tests for this assignment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="testCases">Test Cases</Label>
                <Textarea
                  id="testCases"
                  placeholder="Define test cases for automated grading"
                  className="min-h-[120px] font-mono text-sm"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="enableAutomatedGrading" defaultChecked />
                <Label htmlFor="enableAutomatedGrading">
                  Enable automated grading
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href={`/courses/${courseId}`}>Cancel</Link>
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Create Assignment
        </Button>
      </div>
    </div>
  );
}
