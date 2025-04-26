# Dockerfile for the code execution environment
# docker/Dockerfile

FROM node:18-slim

# Install essential packages and languages for code execution
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    python3-pip \
    openjdk-11-jdk \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Set up a non-root user for better security
RUN groupadd -r coderunner && useradd -m -r -g coderunner coderunner
USER coderunner

# Create working directory
WORKDIR /app

# Create directories for code execution
RUN mkdir -p /app/submissions

# Copy startup script
COPY --chown=coderunner:coderunner ./docker/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]