# Albaly Insights

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-24.0-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

Production-ready dashboard application built with **Next.js 16.1.6**, **React 19**, **TypeScript**, **Tailwind CSS 4**, and **PostgreSQL (Docker/K8s)**. Designed with a strict **Clean Architecture** approach separating UI from Business Logic.

---

## ✨ Features Implemented

### 1. Infrastructure & Backend
- **Dockerized PostgreSQL**: `docker-compose.yml` for simplified detailed local development.
- **Advanced Kubernetes Setup**: Production-ready infrastructure:
  - **PersistentVolumeClaim (PVC)**: Prevents data loss even if Pods are deleted.
  - **Secrets & ConfigMaps**: Manages credentials and system settings securely.
- **Clean Architecture**: Strict separation of concerns (Layered: UI -> Page -> Service -> Prisma).
- **Real Data Seeding**: `prisma/seed.ts` generates realistic mock data for Users, Sales, Funnel, and Inventory.
- **Standardized API**: Uses `ApiResponse` wrapper for consistent Success/Error JSON responses.

### 2. UI & UX (Clean Enterprise)
- **Dashboard Layout**: Responsive Sidebar and TopNav with breadcrumbs.
- **Overview Page**: KPI Cards with trend indicators and Monthly Sales Bar charts.
- **Insights Page**: Conversion Funnel and Top Products comparison.

### 3. Shopping Cart & Role-Based Access Control (RBAC)
- **Product Store**: Browse products with real-time stock tracking.
- **Shopping Cart**: Quantity management and order confirmation system.
- **Access Control**: Role separation enforced via Middleware:
  - **Admin**: Full system management (Dashboard, Insights, Config).
  - **Viewer**: Store access and purchasing only.

---

## 📂 Project Structure

```bash
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth routes (Login)
│   ├── (dashboard)/        # Protected dashboard routes
│   └── api/                # API Routes (Controllers)
├── components/             # Reusable UI components
│   ├── overview/           # Dashboard-specific widgets
│   └── insights/           # Analytics charts
├── services/               # Business Logic & DB calls
├── lib/                    # Utilities (Auth, Formaters)
└── middleware.ts           # Route protection logic
prisma/
├── schema.prisma           # Database Schema
└── seed.ts                 # Data seeding script
```

---

## 🚀 Command Cheat Sheet

| Action | Command | Description |
| :--- | :--- | :--- |
| **Start DB** | `docker-compose up -d` | Spins up PostgreSQL container for local dev |
| **Stop DB** | `docker-compose down` | Stops and removes containers |
| **Prisma Studio** | `npx prisma studio` | Opens GUI to manage data (Default Port 5555) |
| **Generate Client** | `npx prisma generate` | Re-generates Prisma Client after schema changes |
| **Push Schema** | `npx prisma db push` | Syncs schema changes to the Database |
| **Seed Data** | `npx prisma db seed` | Populates DB with initial mock data |
| **Run Dev** | `npm run dev` | Starts Next.js dev server on port 3000 |

---

## 🛠️ Prerequisites

- **Node.js** (v18+)
- **Docker Desktop** (Kubernetes must be enabled in Settings for K8s testing)

---

## 🏁 Getting Started

### 🐳 Option 1: Docker Environment (Standard Local Dev)
*Recommended for local development via VS Code, running the App locally (Port 3000).*

1. **Start Database:**
   ```bash
   docker-compose up -d
   ```

2. **Setup Environment:**
   ```bash
   cp .env.example .env
   # Ensure DB port is set to 5435
   ```

3. **Setup DB & Data:**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

4. **Run Application:**
   ```bash
   npm run dev
   ```

**Access:**
- **App:** [http://localhost:3000](http://localhost:3000)

---

### ☸️ Option 2: Kubernetes Environment (Experimental/Testing)
*For testing the full-stack system on a local Kubernetes Cluster.*

1. **Build Local Image:**
   ```bash
   docker build -t albaly-app:local .
   ```

2. **Apply Manifests:**
   ```bash
   kubectl apply -f k8s-postgres.yaml
   kubectl apply -f k8s-app.yaml
   ```

3. **Database Tunnel (For Setup & Studio):**
   *Open a new terminal and keep running:*
   ```bash
   kubectl port-forward svc/postgres-service 5435:5435
   ```

4. **Setup Database (Via Tunnel):**
   ```bash
   # Windows
   set DATABASE_URL=postgresql://albaly_user:albaly_password@localhost:5435/albaly_insights
   
   npx prisma generate && npx prisma db push && npx prisma db seed
   ```

5. **Application Tunnel:**
   *Open a new terminal and keep running:*
   ```bash
   kubectl port-forward svc/albaly-app-service 7777:80
   ```

**Access:**
- **App (K8s):** [http://localhost:7777](http://localhost:7777)

---

## 🔐 Credentials (Seed Data)

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@albaly.com` | `password123` | Dashboard, Insights, Product Management |
| **Viewer** | `viewer@albaly.com` | `password123` | Store & Shopping Cart only |

---

## 🏗️ Architecture Note

This project follows **Clean Architecture** principles:
- **Server Components** (`page.tsx`) act as **Controllers**.
- Controllers call **Services** (`src/services/*`) to handle business logic via **Prisma**.
- All configuration is securely managed via **Kubernetes Secrets** and **ConfigMaps**.
