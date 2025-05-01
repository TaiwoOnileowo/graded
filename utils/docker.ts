import { exec } from "child_process";
import util from "util";

const execPromise = util.promisify(exec);

// Check if Docker is running
export const checkDockerStatus = async () => {
  try {
    await execPromise("docker info");
    return { running: true };
  } catch (error) {
    return {
      running: false,
      error:
        "Docker is not running. Please start Docker Desktop and try again.",
    };
  }
};

// Check if our container is running
export const checkContainerStatus = async () => {
  try {
    const { stdout } = await execPromise(
      'docker ps --filter "name=code-executor" --format "{{.Names}}"'
    );

    console.log("Container status:", stdout);
    return {
      running: stdout.trim().includes("code-executor"),
    };
  } catch (error: any) {
    return { running: false, error: error.message };
  }
};

// Start the container
export const startContainer = async () => {
  try {
    // Check if container exists but is stopped
    const { stdout: stoppedContainers } = await execPromise(
      'docker ps -a --filter "name=code-executor" --format "{{.Names}}"'
    );

    if (stoppedContainers.includes("code-executor")) {
      // Start existing container
      await execPromise("docker start code-executor");
    } else {
      // Create and start new container
      await execPromise(
        "docker run -d --name code-executor -p 3001:3001 " +
          "--security-opt=no-new-privileges --cpus=0.5 --memory=512m code-executor"
      );
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Stop the container
export const stopContainer = async () => {
  try {
    await execPromise("docker stop code-executor");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
