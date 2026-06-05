# Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Production run
FROM node:20-alpine AS runner
WORKDIR /app

# Set environment variable
ENV NODE_ENV=production

# Copy node_modules
COPY --from=deps --chown=node:node /app/node_modules ./node_modules

# Copy the rest of the application
COPY --chown=node:node . .

# Expose the backend port
EXPOSE 5000

# Run
USER node

# Start the application
CMD ["node", "index.js"]