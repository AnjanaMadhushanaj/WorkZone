# WorkZone Backend - Dockerfile
# Node.js 20 LTS (Alpine for smaller image size)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency files first (layer caching)
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# Expose the API port
EXPOSE 5000

# Start the server
CMD ["node", "index.js"]
