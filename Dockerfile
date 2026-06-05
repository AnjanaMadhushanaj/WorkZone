# WorkZone Backend API - Root Dockerfile
# For the full multi-container stack, use: docker compose up -d --build
# This Dockerfile builds the backend API service independently.

# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package files for layer caching
COPY backend/package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Stage 2: Production runtime
FROM node:20-alpine AS runner
WORKDIR /app

# Set environment variable
ENV NODE_ENV=production

# Copy node_modules from deps stage
COPY --from=deps --chown=node:node /app/node_modules ./node_modules

# Copy backend application source code
COPY --chown=node:node backend/ .

# Expose the API port
EXPOSE 5000

# Run as non-root user for security
USER node

# Start the application
CMD ["node", "index.js"]
