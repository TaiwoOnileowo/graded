"use client";

import { ArrowLeft, Code, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RubricItem } from "@/types";
import { criteriaTemplates } from "@/lib/data";
import { toast } from "react-toastify";
import { createAssignment } from "@/lib/actions/assignment.action";

interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  description: string;
}

export default function LecturerNewAssignmentPage({
  courseId,
}: {
  courseId: string;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedCriteria, setSelectedCriteria] = useState<RubricItem[]>([
    criteriaTemplates[0],
    criteriaTemplates[1],
    criteriaTemplates[2],
  ]);

  const [testCases, setTestCases] = useState<TestCase[]>([]);

  const addCriterion = (criterionId: string) => {
    const template = criteriaTemplates.find((c) => c.id === criterionId);
    if (template && !selectedCriteria.some((c) => c.id === criterionId)) {
      setSelectedCriteria([...selectedCriteria, template]);
    }
  };

  const removeCriterion = (index: number) => {
    setSelectedCriteria(selectedCriteria.filter((_, i) => i !== index));
  };

  const addTestCase = () => {
    const newId =
      testCases.length > 0 ? Math.max(...testCases.map((tc) => tc.id)) + 1 : 1;
    setTestCases([
      ...testCases,
      { id: newId, input: "", expectedOutput: "", description: "" },
    ]);
  };

  const removeTestCase = (id: number) => {
    setTestCases(testCases.filter((tc) => tc.id !== id));
  };

  const updateTestCase = (id: number, field: keyof TestCase, value: string) => {
    setTestCases(
      testCases.map((tc) => (tc.id === id ? { ...tc, [field]: value } : tc))
    );
  };

  const updateCriterion = (
    index: number,
    field: keyof RubricItem,
    value: string | number
  ) => {
    setSelectedCriteria(
      selectedCriteria.map((criterion, i) =>
        i === index ? { ...criterion, [field]: value } : criterion
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Submitting assignment data...", courseId);
    const formData = new FormData(e.target as HTMLFormElement);
    formData.append("courseId", courseId);
    formData.append("rubricItems", JSON.stringify(selectedCriteria));
    formData.append("testCases", JSON.stringify(testCases));
    const result = await createAssignment(formData);

    setIsSubmitting(false);

    if (result.success) {
      toast.success("Assignment created successfully");
      router.push(`/courses/${courseId}`);
    } else {
      toast.error(result.error || "Failed to create assignment");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
                    name="title"
                    placeholder="Enter assignment title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="questionText">Question Text</Label>
                  <Textarea
                    id="questionText"
                    name="questionText"
                    placeholder="Describe the programming problem in detail"
                    className="min-h-[120px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marks">Total Marks</Label>
                  <Input
                    id="marks"
                    name="marks"
                    type="number"
                    placeholder="e.g. 100"
                    required
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input id="deadline" name="deadline" type="datetime-local" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" name="startDate" type="datetime-local" />
                  <p className="text-sm text-muted-foreground">
                    If not set, assignment will start immediately when published
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                  <Input
                    id="timeLimit"
                    name="timeLimit"
                    type="number"
                    placeholder="e.g. 60"
                    min="1"
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    Leave empty for no time limit
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Automated Testing</CardTitle>
                  <CardDescription>
                    Configure automated tests for this assignment
                  </CardDescription>
                </div>
                <Button type="button" size="sm" onClick={addTestCase}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Test Case
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <Accordion type="multiple" className="w-full">
                  {testCases.map((testCase) => (
                    <AccordionItem
                      key={testCase.id}
                      value={`test-case-${testCase.id}`}
                    >
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Code className="h-4 w-4" />
                          <span>
                            {testCase.description || `Test Case ${testCase.id}`}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <div className="space-y-2">
                            <Label
                              htmlFor={`test-case-${testCase.id}-description`}
                            >
                              Description
                            </Label>
                            <Input
                              id={`test-case-${testCase.id}-description`}
                              value={testCase.description}
                              onChange={(e) =>
                                updateTestCase(
                                  testCase.id,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="e.g. Test factorial of 5"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`test-case-${testCase.id}-input`}>
                              Input
                            </Label>
                            <Textarea
                              id={`test-case-${testCase.id}-input`}
                              value={testCase.input}
                              onChange={(e) =>
                                updateTestCase(
                                  testCase.id,
                                  "input",
                                  e.target.value
                                )
                              }
                              placeholder="Input values for the test case"
                              className="font-mono text-sm"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor={`test-case-${testCase.id}-expected`}
                            >
                              Expected Output
                            </Label>
                            <Textarea
                              id={`test-case-${testCase.id}-expected`}
                              value={testCase.expectedOutput}
                              onChange={(e) =>
                                updateTestCase(
                                  testCase.id,
                                  "expectedOutput",
                                  e.target.value
                                )
                              }
                              placeholder="Expected output for the test case"
                              className="font-mono text-sm"
                              required
                            />
                          </div>

                          <div className="flex justify-end">
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeTestCase(testCase.id)}
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Remove Test Case
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {testCases.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    No test cases added yet. Click "Add Test Case" to create
                    one.
                  </div>
                )}
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
                <div className="flex items-center gap-2">
                  <Select onValueChange={addCriterion}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Add criterion" />
                    </SelectTrigger>
                    <SelectContent>
                      {criteriaTemplates.map((criterion) => (
                        <SelectItem
                          key={criterion.id}
                          value={criterion.id}
                          disabled={selectedCriteria.some(
                            (c) => c.id === criterion.id
                          )}
                        >
                          {criterion.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedCriteria.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No criteria added yet. Select criteria from the dropdown
                    above.
                  </div>
                ) : (
                  selectedCriteria.map((criterion, index) => (
                    <div key={criterion.id} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-4 flex-1">
                          <div className="space-y-2">
                            <Label htmlFor={`criterion-${index}-title`}>
                              Criterion Title
                            </Label>
                            <Input
                              id={`criterion-${index}-title`}
                              value={criterion.title}
                              onChange={(e) =>
                                updateCriterion(index, "title", e.target.value)
                              }
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`criterion-${index}-description`}>
                              Description
                            </Label>
                            <Textarea
                              id={`criterion-${index}-description`}
                              value={criterion.description}
                              onChange={(e) =>
                                updateCriterion(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              className="min-h-[80px]"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`criterion-${index}-points`}>
                              Maximum Points
                            </Label>
                            <Input
                              id={`criterion-${index}-points`}
                              type="number"
                              value={criterion.maxPoints}
                              onChange={(e) =>
                                updateCriterion(
                                  index,
                                  "maxPoints",
                                  Number(e.target.value)
                                )
                              }
                              required
                              min="0"
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => removeCriterion(index)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete criterion</span>
                        </Button>
                      </div>
                    </div>                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href={`/courses/${courseId}`}>Cancel</Link>
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Assignment"}
          </Button>
        </div>
      </div>
    </form>
  );
}
