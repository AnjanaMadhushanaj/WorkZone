# WorkZone Frontend - Multi-stage Dockerfile
# Stage 1: Build the React/Vite application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files first (layer caching)
COPY package.json package-lock.json ./

# Install all dependencies (dev included for build tools)
RUN npm ci

# Copy source code
COPY . .

# Build the production bundle
# VITE_API_URL can be overridden at build time via --build-arg
ARG VITE_API_URL=http://localhost:5000
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: Serve the built app with Nginx
FROM nginx:stable-alpine

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
