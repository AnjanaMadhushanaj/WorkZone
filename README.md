<div align="center">

# WorkZone

</div>

<div align="center">


**A web-based platform designed to help students find trusted part-time jobs while continuing their studies—without brokers or middlemen.**

</div>

---

## 👥 Group Information

| Role | Name | Student ID |
| :--- | :--- | :--- |
| **DevOps Engineer** | **Anjana Madhushan** | `ITBIN-2313-0040` |
| **Frontend Developer** | **Nimantha Vikum Kodikara** | `ITBIN-2313-0052` |
| **Backend Developer** | **Avishka Devananda** | `ITBIN-2313-0021` |

---

## 📖 Project Description

Many students currently struggle to find part-time jobs, often relying on WhatsApp groups where **brokers** reduce earnings and create trust issues.

**WorkZone** was developed to solve this problem by connecting **students and companies directly**, ensuring fair pay, transparency, and trust.

### Key Objectives
* ✅ **Centralized Platform:** A dedicated hub for student jobs.
* ✅ **Direct Interaction:** No intermediaries between students and companies.
* ✅ **Fair & Transparent:** Students receive their full earnings.
* ✅ **Secure System:** A safe environment for all users.

---

## 🌐 Live Deployment

**Live URL:** https://work-zone-orcin.vercel.app/

## Discord

**Discord Link:** https://discordapp.com/channels/1452031123772407992/1462883918498889810

> The application is deployed and accessible via the link above.

---

## ✨ Main Features

* 🔐 **Secure Authentication:** Robust login systems for both Students and Companies.
* 📋 **Job Management:** Easy job posting and management for companies.
* 🎓 **Student Applications:** Seamless job application process for students.
* 📱 **Responsive UI:** Modern, mobile-friendly design built with **Tailwind CSS**.
* 🚫 **Broker-Free:** Direct connections ensuring maximum earnings for students.

---

## 🛠️ Technologies Used

* **Frontend:** HTML5, CSS3, JavaScript, Tailwind CSS
* **Backend:** Node.js, Express.js, MongoDB
* **DevOps:** GitHub Actions, Shell Scripting, Vercel/Render
* **Tools:** Git, VS Code, Postman

---

## 🌳 Branching Strategy

We implemented the following branching strategy to ensure code quality:

* `main` - **Production Branch**: Auto-deployed to live server.
* `develop` - **Integration Branch**: All features are merged here first.
* `feature/*` - **Feature Branches**: Individual branches for each developer.

> **Workflow:** Feature -> Develop (Testing) -> Main (Production)

---

## 👷 Individual Contributions

### **Anjana Madhushan** (DevOps Engineer)
* Initialized the repository and configured `.gitignore`.
* Implemented **GitHub Actions** for CI/CD pipelines (`ci/cd.yml`, `main.yml`).
* Managed deployment configurations on **Render/Vercel**.
* Wrote shell scripts for automation and managed environment variables.
* Resolved merge conflicts during the integration phase.

### **Nimantha Vikum Kodikara** (Frontend Developer)
* Designed the responsive UI using **Tailwind CSS**.
* Developed the Student and Company dashboard layouts.
* Implemented frontend validation for Login/Register forms.
* Integrated Frontend with Backend APIs using Axios.
* Improved mobile responsiveness and UX.

### **Avishka Devananda** (Backend Developer)
* Designed the Backend architecture and Database schema.
* Implemented Authentication APIs (Login/Register/Google Auth).
* Created Job Management and User Profile APIs.
* Configured MongoDB database connections.
* Handled API security and error handling.

---

## Setup Instructions

### Prerequisites
* **Node.js** (v18 or higher)
* **Git** installed

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/AnjanaMadhushanaj/WorkZone.git](https://github.com/AnjanaMadhushanaj/WorkZone.git)
    cd workzone
    ```

2.  **Install Dependencies**
    ```bash
    # Install Backend
    cd backend
    npm install

    # Install Frontend
    cd ../frontend
    npm install
    ```

3.  **Run the Application**
    ```bash
    # Run Backend (Port 5000)
    npm run dev

    # Run Frontend (Port 5173/3000)
    npm run dev
    ```

### 🔄 Deployment Process (CI/CD)
Our project uses **GitHub Actions** for automation:
1.  **CI Pipeline:** Triggers on pull requests to `develop` or `main`. It installs dependencies, builds the project, and runs tests.
2.  **Deployment:** Triggers **only** when changes are merged into `main`. It automatically deploys the latest code to the production server.

### ⚠️ Challenges Faced
* **CORS Errors:** We faced issues connecting Frontend to Backend due to CORS policies, resolved by configuring the `cors` package in Express.
* **Merge Conflicts:** Encountered conflicts in `package.json` when merging branches, resolved by manual code review.

---

## 🐳 Docker Containerisation

### Prerequisites
* **Docker** (v20.10 or later)
* **Docker Compose** (v2.0 or later; included with Docker Desktop)

### Project Structure (Docker files)

| File | Purpose |
| :--- | :--- |
| `Dockerfile` | Root-level build definition for the backend API (standalone use) |
| `frontend/Dockerfile` | Multi-stage build definition for the React frontend (served via Nginx) |
| `backend/Dockerfile` | Build definition for the Node.js Express API |
| `docker-compose.yml` | Service orchestration for the full MERN application stack |
| `.dockerignore` | Excludes unnecessary files (like `node_modules`) from the Docker build context |

### Building and Running

**Build and start** the entire application stack in detached (background) mode:
```bash
docker compose up -d --build
```

Once running, the applications will be available at:
* **Frontend:** http://localhost:8080
* **Backend API:** http://localhost:5000

**Stop the application** (preserves data):
```bash
docker compose stop
```

**Stop and remove** all containers, networks, and data (including the database volume):
```bash
docker compose down -v
```

### Environment Variables

These variables are explicitly managed within the `docker-compose.yml` file for secure configuration:

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | Internal port the Express server listens on |
| `MONGO_URI` | `mongodb://mongodb:27017/workzone` | Connection string for the isolated MongoDB container |
| `VITE_API_URL` | `http://localhost:5000` | The backend API URL injected into the frontend during the build phase |

### Docker Architecture Highlights

* **Base Images:** `node:20-alpine` and `nginx:alpine` — extremely lightweight Alpine Linux images to minimize storage footprint and reduce the attack surface.
* **Multi-stage Builds:** Separates build-time dependencies from the runtime environment in the frontend, significantly reducing the final image size (down to ~93.7 MB).
* **Non-root User:** The backend application runs as an unprivileged user (`node`), adhering to the security principle of least privilege.
* **Custom Networking:** All three containers (Frontend, Backend, Database) communicate securely over an isolated, custom internal bridge network (`network`).
* **Named Volume (`mongodb_data`):** Persists the MongoDB database records, ensuring data is not lost across container restarts.

---

###  Build Status
[![Build and Deploy to Vercel](https://github.com/AnjanaMadhushanaj/WorkZone/actions/workflows/cd-frontend.yml/badge.svg?branch=main)](https://github.com/AnjanaMadhushanaj/WorkZone/actions)
[![Deploy Backend to Render](https://github.com/AnjanaMadhushanaj/WorkZone/actions/workflows/cd-backend.yml/badge.svg?branch=main)](https://github.com/AnjanaMadhushanaj/WorkZone/actions)

<div align="center">
  <p>Built for Systems Administration & Maintenance Assignment (2026)</p>
</div>
