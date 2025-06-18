import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Define unprotected routes
  const unProtectedPaths = [
    /^\/home/, // home page
    /^\/sign-up/,
    /^\/sign-in/,
    /^\/reset-password/,
    /^\/forgot-password/,
  ];

  const isUnprotected = unProtectedPaths.some((path) => path.test(pathname));

  // Run authentication only for protected routes
  if (!isUnprotected && pathname) {
    const session = await auth();

    // If no session, handle unauthorized access
    if (!session) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }

      const redirectUrl = new URL("/sign-in", req.url);
      // redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Attach session to request headers for downstream use
    const res = NextResponse.next();
    res.headers.set("x-user-session", JSON.stringify(session));
    return res;
  }

  // Allow access to unprotected routes
  return NextResponse.next();
}

// Update the matcher to exclude service worker and manifest files
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
