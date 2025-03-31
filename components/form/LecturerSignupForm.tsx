"use client";
import { CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LecturerSignupCredentials,
  signupUser,
} from "@/lib/actions/user.action";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Form validation schema
const lecturerFormSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    title: z.string().min(1, "Please select a title"),
    department: z.string().min(2, "Department must be at least 2 characters"),
    specialization: z
      .string()
      .min(2, "Specialization must be at least 2 characters"),
    bio: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type LecturerFormValues = z.infer<typeof lecturerFormSchema>;
const LecturerSignupForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const form = useForm<LecturerFormValues>({
    resolver: zodResolver(lecturerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      title: "",
      department: "",
      specialization: "",
      bio: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: LecturerFormValues) => {
    setIsSubmitting(true);

    try {
      const credentials: LecturerSignupCredentials = {
        email: values.email,
        password: values.password,
        name: values.name,
        title: values.title,
        department: values.department,
        specialization: values.specialization,
        bio: values.bio || "",
        role: "LECTURER",
      };

      const result = await signupUser(credentials);

      if (result.success) {
        toast.success("Account created");
        router.push("/");
      } else {
        toast.error("Error creating account");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Error creating account");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="name">Full Name</FormLabel>
                <FormControl>
                  <Input id="name" placeholder="Dr. Jane Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jane.smith@university.edu"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="title">Title</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger id="title" className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="dr">Dr.</SelectItem>
                      <SelectItem value="prof">Prof.</SelectItem>
                      <SelectItem value="assoc">Assoc. Prof.</SelectItem>
                      <SelectItem value="asst">Asst. Prof.</SelectItem>
                      <SelectItem value="mr">Mr.</SelectItem>
                      <SelectItem value="ms">Ms.</SelectItem>
                      <SelectItem value="mrs">Mrs.</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="department">Department</FormLabel>
                  <FormControl>
                    <Input
                      id="department"
                      placeholder="Computer Science"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="specialization"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="specialization">Specialization</FormLabel>
                <FormControl>
                  <Input
                    id="specialization"
                    placeholder="Artificial Intelligence"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="bio">Brief Bio</FormLabel>
                <FormControl>
                  <Textarea
                    id="bio"
                    placeholder="Share your academic background, research interests, and teaching experience"
                    className="min-h-[100px] resize-y"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="password">Password</FormLabel>
                <FormControl>
                  <Input id="password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="confirmPassword">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <Input id="confirmPassword" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className="flex flex-col mt-4 space-y-4">
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Create Lecturer Account"}
          </Button>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Form>
  );
};
export default LecturerSignupForm;
