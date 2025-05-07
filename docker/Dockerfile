FROM node:18-bullseye-slim

 
   # Update package lists
   RUN apt-get update

   # Install essential packages and languages for code execution
   RUN apt-get install -y --fix-missing \
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

   # Copy necessary files
   COPY --chown=coderunner:coderunner ./lib/executor.js /app/lib/executor.js
   COPY --chown=coderunner:coderunner ./package.json /app/package.json
   COPY --chown=coderunner:coderunner ./tsconfig.json /app/tsconfig.json
   COPY --chown=coderunner:coderunner ./prisma/schema.prisma /app/prisma/schema.prisma

   # Install dependencies and TypeScript
   RUN npm install --only=production --ignore-scripts && \
       npm install -D typescript

   # Generate Prisma client
   RUN npx prisma generate --no-engine

   # Compile TypeScript to JavaScript
   RUN npx tsc

   # Switch to non-root user
   USER coderunner

   # Expose port
   EXPOSE 3001

   # Start with the compiled JavaScript file
   CMD ["node", "/app/lib/executor.js"]