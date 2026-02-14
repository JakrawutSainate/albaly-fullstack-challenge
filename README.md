# Albaly Insights

Production-ready dashboard application built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS 4**, and **PostgreSQL (Docker)**. Designed with a strict Clean Architecture approach separating UI from Business Logic.

---

## ✨ Features Implemented

### 1. Infrastructure & Backend
- **Dockerized PostgreSQL**: `docker-compose.yml` for easy database setup.
- **Clean Architecture**: Strict separation of concerns (Layered: `UI` -> `Page (Controller)` -> `Service` -> `Repository/Prisma`).
- **Real Data Seeding**: `prisma/seed.ts` generates realistic data for Users, Sales, Funnel, and Inventory.
- **Middleware Protection**: Protected `/overview` and `/insights` routes via `src/middleware.ts`.
- **Standardized API**: `ApiResponse` wrapper for consistent success/error JSON responses.

### 2. UI & UX (Clean Enterprise)
- **Dashboard Layout**: Responsive Sidebar and TopNav with breadcrumbs.
- **Overview Page**: KPI Cards with trend indicators, Activity Feed, and Monthly Performance bar charts.
- **Insights Page**: Conversion Funnel, Regional Performance, and Top Products comparison.
- **Modern Styling**: Tailwind CSS 4 with a refined Slate/Indigo palette.

### 3. Shopping Cart & Role-Based Access
- **Product Store**: Browse products with real-time stock tracking.
- **Shopping Cart System**: Quantity management, gradient design modal, and batch purchase.
- **RBAC**: Middleware-enforced separation for Admin and Viewer roles.

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
| **Start DB** | `docker-compose up -d` | Spins up PostgreSQL container in background |
| **Stop DB** | `docker-compose down` | Stops and removes containers |
| **Install** | `npm install` | Installs Node dependencies |
| **Generate Client** | `npx prisma generate` | Generates Prisma Client after schema changes |
| **Push Schema** | `npx prisma db push` | Syncs schema with database |
| **Seed Data** | `npx prisma db seed` | Populates DB with users, sales, and logs |
| **Prisma Studio** | `npx prisma studio` | Opens GUI to view/edit database data (Port 5555) |
| **Run Dev** | `npm run dev` | Starts Next.js dev server on port 3000 |

---

## 🛠️ Prerequisites

- **Node.js** (v18+)
- **Docker Desktop** (with Kubernetes enabled for K8s testing)

---

## 🏁 Getting Started

### 🐳 Option 1: Docker Environment (Standard Local Dev)
*เหมาะสำหรับการพัฒนาผ่าน VS Code โดยใช้ Docker รันเฉพาะ Database และรันแอปผ่านเครื่อง Local (Port 3000)*

1. **Start Database:**
   ```bash
   docker-compose up -d
   ```

2. **Environment Setup:**
   ```bash
   cp .env.example .env
   # Ensure DATABASE_URL points to localhost:5432
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
- **Prisma Studio:** run `npx prisma studio` -> [http://localhost:5555](http://localhost:5555)

---

### ☸️ Option 2: Kubernetes Environment (Experimental/Testing)
*สำหรับทดลองรันระบบทั้งหมดบน Kubernetes Cluster*

1. **Apply Manifests:**
   ```bash
   kubectl apply -f k8s-postgres.yaml
   kubectl apply -f k8s-app.yaml
   ```

2. **Database Tunnel (For Setup & Studio):**
   *เปิด Terminal ใหม่รันค้างไว้:*
   ```bash
   kubectl port-forward svc/postgres-service 5435:5432
   ```

3. **Setup Database (Via Tunnel):**
   Based on your OS, set the `DATABASE_URL` before running commands:
   ```bash
   # Windows
   set DATABASE_URL=postgresql://albaly_user:albaly_password@localhost:5435/albaly_insights

   # Mac/Linux
   export DATABASE_URL="postgresql://albaly_user:albaly_password@localhost:5435/albaly_insights"

   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

4. **Application Tunnel:**
   *เปิด Terminal ใหม่รันค้างไว้:*
   ```bash
   kubectl port-forward svc/albaly-app-service 7777:80
   ```

**Access:**
- **App (K8s):** [http://localhost:7777](http://localhost:7777)
- **Prisma Studio:** `npx prisma studio` (runs via the tunnel on port 5435 if environment variable is set as above)

---

## 🔐 Credentials (Seed Data)

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@albaly.com` | `password123` | Dashboard, Insights, Store, Management |
| **Viewer** | `viewer@albaly.com` | `password123` | Store only (Shopping Cart) |

---

## 🏗️ Architecture Note

This project follows **Clean Architecture** principles. Server Components act as Controllers, delegating Business Logic to Services, which interact with the DB via Prisma.
