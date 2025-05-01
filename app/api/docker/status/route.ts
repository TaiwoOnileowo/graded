import { checkContainerStatus, checkDockerStatus } from "@/utils/docker";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Check if Docker is running
    const dockerStatus = await checkDockerStatus();

    if (!dockerStatus.running) {
      return NextResponse.json(dockerStatus, { status: 503 });
    }

    // Check container status
    const containerStatus = await checkContainerStatus();
    console.log("Container status:", containerStatus);
    return NextResponse.json({
      docker: dockerStatus,
      container: containerStatus,
    });
  } catch (error) {
    console.error("Error checking Docker status:", error);
    return NextResponse.json(
      { error: "Failed to check Docker status" },
      { status: 500 }
    );
  }
}
