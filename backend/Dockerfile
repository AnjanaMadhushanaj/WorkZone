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
FROM node:20-alpine AS deps
WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps --chown=node:node /app/node_modules ./node_modules

COPY --chown=node:node . .

EXPOSE 5000

USER node

CMD ["node", "index.js"]
