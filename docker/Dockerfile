FROM node:18-bullseye-slim

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

# Create working directory
WORKDIR /app

# Create directories for code execution
RUN mkdir -p /app/submissions && chown -R coderunner:coderunner /app/submissions

# Copy necessary files, including Prisma schema
COPY --chown=coderunner:coderunner ./lib/executor.ts /app/executor.ts
COPY --chown=coderunner:coderunner ./package.json /app/package.json
COPY --chown=coderunner:coderunner ./prisma/schema.prisma /app/prisma/schema.prisma

# Install dependencies, skipping postinstall script
RUN npm install --only=production --ignore-scripts

# Generate Prisma client
RUN npx prisma generate --no-engine

# Switch to non-root user
USER coderunner

# Expose port
EXPOSE 3001

# Start with node
CMD ["node", "/app/executor.ts"]