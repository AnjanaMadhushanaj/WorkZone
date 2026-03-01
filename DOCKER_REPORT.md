# WorkZone – Dockerization Report

> **Prepared:** 2026-03-01  
> **Project:** WorkZone – Online Job Portal  
> **Repository:** [AnjanaMadhushanaj/WorkZone](https://github.com/AnjanaMadhushanaj/WorkZone)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture Summary](#2-architecture-summary)
3. [Technology Stack](#3-technology-stack)
4. [Dockerization Strategy](#4-dockerization-strategy)
5. [Docker Files Created](#5-docker-files-created)
   - 5.1 [Backend Dockerfile](#51-backend-dockerfile)
   - 5.2 [Frontend Dockerfile](#52-frontend-dockerfile-multi-stage)
   - 5.3 [Nginx Configuration](#53-nginx-configuration)
   - 5.4 [Docker Compose](#54-docker-compose)
   - 5.5 [.dockerignore Files](#55-dockerignore-files)
   - 5.6 [Environment Variables](#56-environment-variables)
6. [Service Breakdown](#6-service-breakdown)
   - 6.1 [MongoDB](#61-mongodb)
   - 6.2 [Backend API](#62-backend-api)
   - 6.3 [Frontend](#63-frontend)
7. [Environment Variables Reference](#7-environment-variables-reference)
8. [Networking & Port Mapping](#8-networking--port-mapping)
9. [Volume Management](#9-volume-management)
10. [Health Checks](#10-health-checks)
11. [Security Considerations](#11-security-considerations)
12. [CI/CD Integration](#12-cicd-integration)
13. [How to Run](#13-how-to-run)
14. [Common Commands](#14-common-commands)
15. [Troubleshooting](#15-troubleshooting)

---

## 1. Project Overview

**WorkZone** is a full-stack web application that functions as an online job portal, connecting students/job-seekers with companies. It supports:

- **Student** accounts: browse jobs, apply, manage profile
- **Company** accounts: post jobs, review applications, manage company dashboard
- **Authentication**: Manual (email + password) and Google OAuth 2.0
- **Admin panel**: Manage users and content

The project is structured as a monorepo with two sub-applications:

```
WorkZone/
├── backend/     # Node.js / Express REST API
├── frontend/    # React 19 + Vite SPA
├── .github/     # GitHub Actions CI/CD workflows
└── ...
```

---

## 2. Architecture Summary

```
┌─────────────────────────────────────────────────────┐
│                    Docker Network                   │
│                   (workzone-net)                    │
│                                                     │
│  ┌──────────────┐   REST API   ┌─────────────────┐  │
│  │   Frontend   │ ──────────► │    Backend      │  │
│  │  (Nginx:80)  │             │ (Node.js:5000)  │  │
│  └──────────────┘             └────────┬────────┘  │
│        │                               │            │
│  Port 80                          Port 5000         │
│  (Host)                           (Host)            │
│                               ┌───────▼─────────┐  │
│                               │    MongoDB      │  │
│                               │   (Mongo:27017) │  │
│                               └─────────────────┘  │
│                                    Port 27017        │
│                                    (Host)            │
└─────────────────────────────────────────────────────┘
```

**Data Flow:**
1. User opens the browser → hits `localhost:80` → Nginx serves the React SPA
2. The SPA makes API calls to `localhost:5000` (backend)
3. Backend processes requests, queries MongoDB on `mongo:27017` (internal Docker DNS)
4. MongoDB persists data in a named Docker volume (`mongo_data`)

---

## 3. Technology Stack

| Layer      | Technology             | Version | Docker Base Image        |
|------------|------------------------|---------|--------------------------|
| Frontend   | React + Vite           | 19 / 7  | `node:20-alpine` → `nginx:stable-alpine` |
| Backend    | Node.js + Express      | 20 / 5  | `node:20-alpine`         |
| Database   | MongoDB                | 7       | `mongo:7`                |
| Auth       | JWT + Google OAuth 2.0 | —       | —                        |
| Styling    | TailwindCSS 4          | 4.1.x   | —                        |
| ORM        | Mongoose               | 9.1.x   | —                        |

### Frontend Dependencies (key)
| Package              | Version   | Purpose                         |
|----------------------|-----------|---------------------------------|
| `react`              | ^19.2.0   | UI framework                    |
| `react-router-dom`   | ^7.13.0   | Client-side routing             |
| `axios`              | ^1.13.2   | HTTP client for API calls       |
| `@react-oauth/google`| ^0.13.4   | Google OAuth integration        |
| `tailwindcss`        | ^4.1.18   | Utility-first CSS               |
| `lucide-react`       | ^0.562.0  | Icon library                    |
| `jwt-decode`         | ^4.0.0    | Decode JWT on the client        |
| `vite`               | ^7.2.4    | Build tool / dev server         |

### Backend Dependencies (key)
| Package       | Version  | Purpose                        |
|---------------|----------|--------------------------------|
| `express`     | ^5.2.1   | Web framework                  |
| `mongoose`    | ^9.1.5   | MongoDB ODM                    |
| `dotenv`      | ^17.2.3  | Environment variable loading   |
| `cors`        | ^2.8.5   | Cross-Origin Resource Sharing  |
| `jwt-simple`  | ^0.5.6   | JWT signing/verification       |
| `bcryptjs`    | (via mongoose) | Password hashing          |
| `nodemon`     | ^3.1.11  | Hot-reload for development     |

---

## 4. Dockerization Strategy

### Why Docker?

| Problem without Docker           | Solution with Docker                       |
|-----------------------------------|--------------------------------------------|
| "Works on my machine" syndrome    | Identical environment everywhere           |
| Manual Node.js / MongoDB setup    | One command: `docker compose up`           |
| Port conflicts on developer machines | Isolated network namespaces            |
| Deployment inconsistency          | Same image runs locally and in production  |
| Data loss on container restart    | Named volumes persist MongoDB data         |

### Design Decisions

1. **Multi-stage build for the frontend**: The Vite build toolchain (dozens of `devDependencies`) is discarded after the build step. Only the compiled static assets (`dist/`) are copied into a minimal Nginx image (~25 MB), dramatically reducing the final image size.

2. **Alpine-based images** for both backend and frontend build stage reduce image sizes (Node Alpine ~180 MB vs. ~900 MB for `node:20`).

3. **`npm ci` instead of `npm install`** in Dockerfiles ensures deterministic installs from the exact versions in `package-lock.json`.

4. **`--omit=dev` flag** in the backend install step excludes `devDependencies` (e.g., `nodemon`) from the production image.

5. **Named volume** (`mongo_data`) for MongoDB data persistence across container restarts.

6. **Docker health check** on MongoDB ensures the backend only starts after the database is ready, avoiding connection-refused errors at startup.

7. **Separate `workzone-net` bridge network** isolates the application from other containers on the host.

8. **`VITE_API_URL` build argument** allows the frontend Docker image to be built with different backend URLs without changing source code.

---

## 5. Docker Files Created

### 5.1 Backend Dockerfile

**File:** `backend/Dockerfile`

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 5000

CMD ["node", "index.js"]
```

**Key points:**
- Uses `node:20-alpine` for a minimal, secure base image
- Copies only `package.json` and `package-lock.json` first (Docker layer cache: dependency layers are only rebuilt when package files change)
- `npm ci --omit=dev` installs exact, reproducible, production-only dependencies
- `nodemon` (development hot-reloader) is excluded from the production image
- Starts the server with `node index.js` (the `start` script)

---

### 5.2 Frontend Dockerfile (Multi-stage)

**File:** `frontend/Dockerfile`

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL=http://localhost:5000
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: Serve
FROM nginx:stable-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Key points:**
- **Stage 1 (builder)**: Full Node.js environment + Vite build tools. Produces `dist/`.
- **Stage 2 (server)**: Only the lightweight Nginx image. The multi-megabyte `node_modules` directory never ends up in the final image.
- `VITE_API_URL` is injected at build time via a Docker build argument, allowing the backend URL to be configured without changing source code.
- Final image size: ~35 MB (vs. ~700 MB if served from Node.js directly)

---

### 5.3 Nginx Configuration

**File:** `frontend/nginx.conf`

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # SPA fallback — client-side routes return index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets for 1 year
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https: http:;";
}
```

**Key points:**
- The `try_files $uri $uri/ /index.html` directive is **critical** for React Router: without it, refreshing a page on `/login` or `/jobs` would return a 404 from Nginx.
- Static assets (JS bundles, CSS, images) are cached aggressively with `Cache-Control: public, immutable` because Vite appends content-hash fingerprints to filenames.
- Three security headers are added as a baseline best practice: `X-Frame-Options` (clickjacking), `X-Content-Type-Options` (MIME-sniffing), and `Content-Security-Policy` (XSS via strict resource origins).

---

### 5.4 Docker Compose

**File:** `docker-compose.yml`

```yaml
services:
  mongo:
    image: mongo:7
    container_name: workzone-mongo
    restart: unless-stopped
    environment:
      MONGO_INITDB_DATABASE: workzone
    volumes:
      - mongo_data:/data/db
    ports:
      - "27017:27017"
    networks:
      - workzone-net
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: workzone-backend
    restart: unless-stopped
    env_file:
      - .env.docker
    environment:
      PORT: 5000
      MONGO_URI: mongodb://mongo:27017/workzone
      NODE_ENV: production
    ports:
      - "5000:5000"
    depends_on:
      mongo:
        condition: service_healthy
    networks:
      - workzone-net

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        VITE_API_URL: http://localhost:5000
    container_name: workzone-frontend
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - workzone-net

volumes:
  mongo_data:

networks:
  workzone-net:
    driver: bridge
```

**Key points:**
- **`depends_on` with `service_healthy`** on the backend ensures MongoDB is fully initialized before the API server connects.
- **`restart: unless-stopped`** keeps services running through host reboots and crash recovery.
- **`env_file: .env.docker`** loads sensitive secrets from a file that is not committed to Git (only the `.env.docker` example file with placeholder values is committed).
- **`MONGO_URI: mongodb://mongo:27017/workzone`** uses Docker's internal DNS — the hostname `mongo` resolves automatically within the `workzone-net` bridge network.

---

### 5.5 .dockerignore Files

`.dockerignore` files prevent unnecessary or sensitive files from being copied into Docker build contexts, reducing image size and preventing secret leakage.

**`backend/.dockerignore`**
```
node_modules
npm-debug.log
.env
*.log
.git
.gitignore
README.md
*.md
test-*.sh
```

**`frontend/.dockerignore`**
```
node_modules
npm-debug.log
dist
.env
.git
.gitignore
*.md
```

**Why this matters:**
- `node_modules/` can be 200–400 MB. Including it in the build context slows down every `docker build` and may cause dependency version mismatches between the host and container OS.
- `.env` files contain secrets and must never be included in an image.
- `dist/` in the frontend context would be overwritten by the build step anyway.

---

### 5.6 Environment Variables

**File:** `.env.docker` (example – commit with placeholder values)

```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb://mongo:27017/workzone
JWT_SECRET=change-this-to-a-secure-random-secret
GOOGLE_CLIENT_ID=your-google-client-id-here
FRONTEND_URL=http://localhost
```

Copy and fill in real values before running:
```bash
cp .env.docker .env.docker.local
# Edit .env.docker.local with your real secrets
# Then reference it in docker-compose.yml: env_file: .env.docker.local
```

---

## 6. Service Breakdown

### 6.1 MongoDB

| Property        | Value                          |
|-----------------|--------------------------------|
| Image           | `mongo:7`                      |
| Container name  | `workzone-mongo`               |
| Internal host   | `mongo`                        |
| Port (internal) | `27017`                        |
| Port (host)     | `27017`                        |
| Data volume     | `mongo_data:/data/db`          |
| Health check    | `mongosh --eval "db.adminCommand('ping')"` |

MongoDB 7 is used as the latest stable release. The named volume `mongo_data` ensures database contents survive container removal and recreation.

**Connection string (inside Docker network):**
```
mongodb://mongo:27017/workzone
```

### 6.2 Backend API

| Property        | Value                          |
|-----------------|--------------------------------|
| Build context   | `./backend`                    |
| Base image      | `node:20-alpine`               |
| Container name  | `workzone-backend`             |
| Port (internal) | `5000`                         |
| Port (host)     | `5000`                         |
| Start command   | `node index.js`                |
| Depends on      | `mongo` (health check pass)    |

**API Endpoints (as implemented):**

| Method | Path                    | Description                   | Auth Required |
|--------|-------------------------|-------------------------------|---------------|
| GET    | `/`                     | Health check / welcome        | No            |
| POST   | `/api/auth/register`    | Manual user registration      | No            |
| POST   | `/api/auth/signup`      | Legacy registration endpoint  | No            |
| POST   | `/api/auth/login`       | Email + password login        | No            |
| POST   | `/api/auth/google`      | Google OAuth login/register   | No            |
| GET    | `/api/auth/user`        | Get current authenticated user| Yes (JWT)     |

**User roles:**
- `student` – requires `identityCardNumber`
- `company` – requires `company` name and `companyRegistration` number

### 6.3 Frontend

| Property        | Value                                |
|-----------------|--------------------------------------|
| Build context   | `./frontend`                         |
| Builder image   | `node:20-alpine`                     |
| Final image     | `nginx:stable-alpine`                |
| Container name  | `workzone-frontend`                  |
| Port (internal) | `80`                                 |
| Port (host)     | `80`                                 |
| Build output    | `/app/dist` → `/usr/share/nginx/html`|

**Frontend Pages / Routes:**

| Route               | Component              | Description               |
|---------------------|------------------------|---------------------------|
| `/`                 | `Home.jsx`             | Landing page              |
| `/login`            | `Login.jsx`            | Login form + Google OAuth |
| `/register`         | `Registration.jsx`     | New user registration     |
| `/profile-completion` | `ProfileCompletion.jsx` | Post-registration setup |
| `/company-dashboard`| `CompanyDashboard.jsx` | Company management panel  |
| `/jobs/:id`         | `JobDetails.jsx`       | Job listing detail view   |
| `/about`            | `About.jsx`            | About page                |
| `/contact`          | `Contact.jsx`          | Contact form              |
| `/feedback`         | `Feedback.jsx`         | User feedback             |
| `/terms`            | `Terms.jsx`            | Terms of service          |

**Frontend Architecture:**
- **`AuthContext`** – React context providing authentication state globally
- **`axios.js`** – Centralized Axios instance pointing to `VITE_API_URL`
- **`authService.js`** – Service layer wrapping auth API calls
- **`Navbar.jsx`** – Shared navigation component

---

## 7. Environment Variables Reference

| Variable            | Required | Default (Docker)                       | Description                              |
|---------------------|----------|----------------------------------------|------------------------------------------|
| `PORT`              | No       | `5000`                                 | Backend HTTP port                        |
| `NODE_ENV`          | No       | `production`                           | Node environment                         |
| `MONGO_URI`         | **Yes**  | `mongodb://mongo:27017/workzone`       | MongoDB connection string                |
| `JWT_SECRET`        | **Yes**  | *(must be set)*                        | Secret used to sign JWT tokens           |
| `GOOGLE_CLIENT_ID`  | No       | *(needed for Google OAuth)*            | Google OAuth 2.0 client ID              |
| `FRONTEND_URL`      | No       | `http://localhost`                     | Allowed CORS origin                      |
| `VITE_API_URL`      | No       | `http://localhost:5000`                | Frontend build-time backend URL (ARG)    |

> ⚠️ **Security note:** `JWT_SECRET` must be a cryptographically random string of at least 32 characters in production. Never use the default placeholder value.

Generate a secure secret:
```bash
openssl rand -hex 32
```

---

## 8. Networking & Port Mapping

```
Host Machine            Docker Network (workzone-net)
─────────────           ──────────────────────────────────────
localhost:80    ──►     workzone-frontend:80
localhost:5000  ──►     workzone-backend:5000
localhost:27017 ──►     workzone-mongo:27017

Internal (container-to-container, not exposed to host):
workzone-backend  ──►  mongo:27017   (via Docker DNS)
```

**Port conflicts to check before running:**
- Port `80`: typically used by Apache/Nginx on Linux. Stop any local web server first.
- Port `5000`: used by some development servers (e.g., macOS AirPlay Receiver on macOS 12+). Disable or change if needed.
- Port `27017`: used by local MongoDB if installed. Stop local MongoDB before running Docker.

---

## 9. Volume Management

| Volume Name   | Mount Point (container) | Purpose                    |
|---------------|-------------------------|----------------------------|
| `mongo_data`  | `/data/db`              | MongoDB database files     |

**Useful volume commands:**
```bash
# List volumes
docker volume ls

# Inspect the MongoDB volume
docker volume inspect workzone_mongo_data

# Remove all volumes (⚠️ deletes all data!)
docker compose down -v
```

---

## 10. Health Checks

The MongoDB service includes a Docker health check:

```yaml
healthcheck:
  test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
  interval: 10s
  timeout: 5s
  retries: 5
```

This causes Docker to:
1. Wait until the `mongosh` ping command succeeds before marking the container `healthy`
2. The backend service's `depends_on: mongo: condition: service_healthy` prevents the Node.js API from starting until this check passes — eliminating "MongoDB not ready" connection errors on first boot.

---

## 11. Security Considerations

| Area               | Risk                                 | Mitigation                                       |
|--------------------|--------------------------------------|--------------------------------------------------|
| JWT Secret         | Weak or leaked secret                | Use `openssl rand -hex 32`, store in `.env`      |
| MongoDB            | No authentication in Docker setup    | Add `MONGO_INITDB_ROOT_USERNAME/PASSWORD` for production |
| Nginx headers      | Clickjacking, MIME-sniff, XSS        | Added `X-Frame-Options`, `X-Content-Type-Options`, `Content-Security-Policy` |
| `.env` files       | Secrets in source control            | `.gitignore` excludes `.env`; only example committed |
| Image size         | Large attack surface                 | Alpine base images; multi-stage build            |
| Container privileges | Root processes inside container    | Node Alpine runs as root by default; consider adding `USER node` for hardened deployments |
| CORS               | Open cross-origin access             | `FRONTEND_URL` env var scopes allowed origins    |

### Recommended Production Hardening

1. **Add MongoDB authentication:**
   ```yaml
   environment:
     MONGO_INITDB_ROOT_USERNAME: workzone_admin
     MONGO_INITDB_ROOT_PASSWORD: <strong-password>
   ```
   Update `MONGO_URI` accordingly: `mongodb://workzone_admin:<password>@mongo:27017/workzone?authSource=admin`

2. **Run Node.js as non-root user** – add to `backend/Dockerfile`:
   ```dockerfile
   USER node
   ```

3. **Add HTTPS** – place an Nginx reverse proxy or Traefik in front of the frontend container with Let's Encrypt TLS.

4. **Use Docker secrets** instead of environment variables for sensitive values in Swarm mode.

---

## 12. CI/CD Integration

The project already has three GitHub Actions workflows:

| Workflow File         | Trigger              | Action                          |
|-----------------------|----------------------|---------------------------------|
| `ci.yml`              | PRs & pushes to `develop` | Install + build (frontend & backend) |
| `cd-backend.yml`      | Push to `main`/`develop` | Deploy to Render via webhook  |
| `cd-frontend.yml`     | Push to `main`/`develop` | Build + deploy to Vercel       |

### Adding Docker Build to CI (optional enhancement)

To add Docker image building and pushing to Docker Hub in CI, add a job like:

```yaml
docker-build:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    - name: Log in to Docker Hub
      uses: docker/login-action@v3
      with:
        username: ${{ secrets.DOCKERHUB_USERNAME }}
        password: ${{ secrets.DOCKERHUB_TOKEN }}
    - name: Build and push backend image
      uses: docker/build-push-action@v5
      with:
        context: ./backend
        push: true
        tags: your-username/workzone-backend:latest
    - name: Build and push frontend image
      uses: docker/build-push-action@v5
      with:
        context: ./frontend
        push: true
        tags: your-username/workzone-frontend:latest
        build-args: VITE_API_URL=https://your-backend-domain.com
```

---

## 13. How to Run

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (v24+) or Docker Engine + Docker Compose plugin
- Git

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/AnjanaMadhushanaj/WorkZone.git
cd WorkZone

# 2. Set up environment variables
cp .env.docker .env.docker.local
#    Edit .env.docker.local and fill in:
#    - JWT_SECRET (generate with: openssl rand -hex 32)
#    - GOOGLE_CLIENT_ID (from Google Cloud Console, optional)

# 3. (Optional) If using .env.docker.local, update docker-compose.yml:
#    Change `env_file: .env.docker` to `env_file: .env.docker.local`

# 4. Build and start all services
docker compose up --build

# 5. Open the app
#    Frontend → http://localhost
#    Backend API → http://localhost:5000
#    MongoDB → localhost:27017
```

### Run in detached (background) mode

```bash
docker compose up --build -d
docker compose logs -f   # Stream logs
```

---

## 14. Common Commands

```bash
# Start all services (rebuild images if changed)
docker compose up --build

# Start in background
docker compose up -d

# Stop all services
docker compose down

# Stop and remove volumes (⚠️ deletes database data)
docker compose down -v

# View logs for all services
docker compose logs -f

# View logs for a specific service
docker compose logs -f backend

# Rebuild a specific service without cache
docker compose build --no-cache backend

# Open a shell inside the backend container
docker exec -it workzone-backend sh

# Open MongoDB shell
docker exec -it workzone-mongo mongosh workzone

# Check running containers
docker compose ps

# Check container resource usage
docker stats
```

---

## 15. Troubleshooting

### Backend fails to connect to MongoDB

**Symptom:** `MongoNetworkError: connect ECONNREFUSED`

**Cause:** Backend started before MongoDB was ready.

**Fix:** The `healthcheck` + `depends_on: condition: service_healthy` in `docker-compose.yml` handles this. If the issue persists, increase the MongoDB health check `retries` count.

---

### Port 80 already in use

**Symptom:** `Error starting userland proxy: listen tcp 0.0.0.0:80: bind: address already in use`

**Fix:** Stop the service using port 80, or change the frontend port mapping in `docker-compose.yml`:
```yaml
ports:
  - "8080:80"   # Access at http://localhost:8080 instead
```

---

### Google OAuth does not work

**Symptom:** Google Sign-In button throws an error.

**Cause:** `GOOGLE_CLIENT_ID` not set, or the origin `http://localhost` is not added to the authorized JavaScript origins in Google Cloud Console.

**Fix:**
1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Edit your OAuth 2.0 Client ID
3. Add `http://localhost` to **Authorized JavaScript origins**
4. Set `GOOGLE_CLIENT_ID` in `.env.docker`

---

### Frontend API calls fail (CORS / network error)

**Symptom:** API calls from the browser return a CORS error or network error.

**Cause:** The `VITE_API_URL` build argument was not set correctly when building the frontend image.

**Fix:** Rebuild the frontend image with the correct backend URL:
```bash
docker compose build --build-arg VITE_API_URL=http://localhost:5000 frontend
docker compose up frontend
```

---

### Changes to source code not reflected

**Cause:** Docker uses cached image layers.

**Fix:** Force a rebuild:
```bash
docker compose build --no-cache
docker compose up
```

---

*End of WorkZone Dockerization Report*
