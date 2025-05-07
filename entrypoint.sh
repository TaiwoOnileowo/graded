#!/bin/bash
# docker/entrypoint.sh

# Install dependencies
cd /app
npm install

# Start the sandbox API server
node index.js