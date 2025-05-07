import { checkDockerStatus, startContainer } from "@/utils/docker";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Check if Docker is running
    const dockerStatus = await checkDockerStatus();

    if (!dockerStatus.running) {
      return NextResponse.json(dockerStatus, { status: 503 });
    }

    // Start the container
    const result = await startContainer();
    console.log("Container start result:", result);
    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(
      { success: true, message: "Container started successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error starting Docker container:", error);
    return NextResponse.json(
      { error: "Failed to start Docker container" },
      { status: 500 }
    );
  }
}
