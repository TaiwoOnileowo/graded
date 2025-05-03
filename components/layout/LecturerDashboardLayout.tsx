"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import logo from "@/public/logo.svg";
import Image from "next/image";
import { ILecturer } from "@/types";
import { signOut } from "next-auth/react";

export default function LecturerDashboardLayout({
  lecturerDetails,
  children,
}: {
  lecturerDetails: ILecturer | undefined;
  children: ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navLinkClass = (path: string) =>
    `text-sm font-medium transition-colors ${
      isActive(path)
        ? "text-primary"
        : "text-muted-foreground hover:text-primary"
    }`;

  const sideMenuClass = (path: string) =>
    `flex items-center gap-2 rounded-md px-2.5 py-2 text-sm font-medium transition-colors ${
      isActive(path)
        ? "bg-muted text-primary"
        : "hover:bg-muted hover:text-primary"
    }`;

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen overflow-hidden w-full">
        <Sidebar>
          <SidebarHeader className="border-b p-4">
            <Link href={"/"}>
              <Image src={logo} alt="Graded" width={120} height={40} />
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/" className={sideMenuClass("/")}>
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Overview</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Courses</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/courses" className={sideMenuClass("/courses")}>
                        <BookOpen className="h-4 w-4" />
                        <span>All Courses</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/courses/new" className={sideMenuClass("/courses/new")}>
                        <BookOpen className="h-4 w-4" />
                        <span>Create Course</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Students</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/students" className={sideMenuClass("/students")}>
                        <Users className="h-4 w-4" />
                        <span>Manage Students</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">JS</span>
                </div>
                {lecturerDetails && (
                  <div>
                    <p className="text-sm font-medium">
                      <span className="capitalize">{lecturerDetails.title}</span>{" "}
                      {lecturerDetails.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {lecturerDetails.department}
                    </p>
                  </div>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger />
            <div className="w-full flex-1">
              <nav className="flex items-center gap-4">
                <Link href="/" className={navLinkClass("/")}>
                  Home
                </Link>
                <Link href="/courses" className={navLinkClass("/courses")}>
                  Courses
                </Link>
                <Link href="/students" className={navLinkClass("/students")}>
                  Students
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </header>
          <main className="flex-1 flex overflow-y-auto bg-muted/40 p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
