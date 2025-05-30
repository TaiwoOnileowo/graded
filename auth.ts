import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ZodError } from "zod";
import { getUserByEmail } from "./lib/actions/user.action";
import { comparePassword } from "./utils/functions/password";

declare module "next-auth" {
  interface Session {
    user: {
      name: string | null | undefined;
      id: string;
      image: string;
      email: string;
      role: "STUDENT" | "LECTURER" | "ADMIN" | null;
      student?: {
        id: string;
      } | null;
      lecturer?: {
        id: string;
        title: string | null;
        department: string;
        bio: string | null;
      } | null;
    };
  }
  interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: "STUDENT" | "LECTURER" | "ADMIN" | null;
    student?: {
      id: string;
    } | null;
    lecturer?: {
      id: string;
      title: string | null;
      department: string;
      bio: string | null;
    } | null;
  }
}
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      id: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials: any) => {
        try {
          const user = await getUserByEmail(credentials.email);
          if (!user) {
            throw new Error("User not found");
          }
          const isMatch = await comparePassword(
            credentials.password,
            user.hashedPassword
          );
          if (!isMatch) {
            throw new Error("Invalid password");
          }
          return user;
        } catch (error) {
          console.error("Authorize error:", error);

          if (error instanceof ZodError) {
            throw new Error("Invalid input format");
          }

          throw error;
        }
      },
    }),
  ],

  debug: true,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.name = user.name;
        token.lecturer = user.lecturer;
        token.student = user.student;
      }
      token.exp = Math.floor(Date.now() / 1000) + 2592000;
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      session.user.lecturer = token.lecturer as any;
      session.user.student = token.student as any;
      session.user.role = token.role as "STUDENT" | "LECTURER" | "ADMIN";
      return session;
    },
  },

  pages: {
    error: "/auth/error",
    signIn: "/sign-in",
  },
});
