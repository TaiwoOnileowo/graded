"use client";

import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createCourse } from "@/lib/actions/course.action";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
const CreateCourse = ({ id }: { id: string }) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = () => {
    if (!name || !code || !description) {
      toast.error("Please fill in all fields");
      return;
    }

    startTransition(async () => {
      try {
        await createCourse({
          name,
          code,
          description,
          lecturerId: id,
          password: password || code.toUpperCase(),
        });

        toast.success("Course created successfully!");
        router.push("/courses");
      } catch (error: any) {
        toast.error(error.message || "Something went wrong");
      }
    });
  };

  return (
    <>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Course Name</Label>
          <Input
            id="name"
            placeholder="e.g. Introduction to Computer Science"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">Course Code</Label>
          <Input
            id="code"
            placeholder="e.g. CSC101"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Course Description</Label>
          <Textarea
            id="description"
            placeholder="Provide a detailed description of the course content and objectives"
            className="min-h-[120px] min-w-[520px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Course Password (Optional)</Label>
          <Input
            id="password"
            placeholder="Leave empty to use course code as password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-sm text-gray-500">
            If left empty, the course code in uppercase will be used as the
            password
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/courses">Cancel</Link>
        </Button>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          disabled={isPending}
          onClick={handleSubmit}
        >
          {isPending ? "Creating..." : "Create Course"}
        </Button>
      </CardFooter>
    </>
  );
};

export default CreateCourse;
