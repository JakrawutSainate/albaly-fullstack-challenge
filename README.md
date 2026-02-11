# Albaly Insights

Production-ready dashboard application built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **PostgreSQL (Docker)**. Designed with a strict Clean Architecture approach separating UI from Business Logic.

## ✨ Features Implemented

### 1. Infrastructure & Backend
- **Dockerized PostgreSQL**: `docker-compose.yml` for easy database setup.
- **Clean Architecture**: Strict separation of concerns (Layered: UI -> Page (Controller) -> Service -> Repository/Prisma).
- **Real Data Seeding**: `prisma/seed.ts` generates realistic data for:
    - **Users**: Admin & Viewer roles with hashed passwords.
    - **Sales**: 50+ transactions over the last 3 months.
    - **Funnel**: 4 weeks of conversion data (Access -> Cart -> Purchase).
    - **Inventory & Activity Logs**: Snapshots and user action logs.
- **Middleware Protection**: Protected `/overview` and `/insights` routes via `src/middleware.ts`.
- **Standardized API**: `ApiResponse` wrapper for consistent success/error JSON responses.

### 2. UI & UX (Clean Enterprise)
- **Dashboard Layout**: Responsive Sidebar and TopNav with breadcrumbs.
- **Overview Page**:
    - **KPI Cards**: Real-time sales, customers, and inventory stats with trend indicators.
    - **Activity Feed**: Live list of recent system actions fetched from DB.
    - **Monthly Performance**: Bar chart visualization of sales data.
- **Insights Page**:
    - **Conversion Funnel**: Step-by-step funnel visualization.
    - **Regional Performance**: Progress bars for regional sales.
    - **Top Products**: Comparison of best-selling items.
- **Modern Styling**: Tailwind CSS with a refined Slate/Indigo palette and specialized components (Glassmorphism touches).

---

## 🚀 Command Cheat Sheet

| Action | Command | Description |
| :--- | :--- | :--- |
| **Start DB** | `docker-compose up -d` | Spins up PostgreSQL container in background |
| **Stop DB** | `docker-compose down` | Stops and removes containers |
| **Install** | `npm install` | Installs Node dependencies |
| **Push Schema** | `npx prisma db push` | Syncs schema with database (non-destructive if possible) |
| **Seed Data** | `npx prisma db seed` | Populates DB with users, sales, and logs |
| **Run Dev** | `npm run dev` | Starts Next.js dev server on port 3000 |
| **Lint** | `npm run lint` | Runs ESLint check |

---

## 🛠️ Prerequisites

- **Node.js** (v18+)
- **Docker** & **Docker Compose**

## 🏁 Getting Started

### 1. Start Database
Spin up the PostgreSQL container:
```bash
docker-compose up -d
```

### 2. Environment Setup
Rename `.env.example` to `.env` (or create one) and ensure the `DATABASE_URL` matches the Docker config:
```env
# Default credentials from docker-compose.yml
DATABASE_URL="postgresql://albaly_user:albaly_password@localhost:5432/albaly_insights?schema=public"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Setup Database & Seed Data
Push the schema to the database and run the seed script to generate **User**, **Sales**, **Funnel**, and **Activity** data.
```bash
npx prisma db push
npx prisma db seed
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔐 Credentials

The seed script creates two users for testing:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@albaly.com` | `password123` |
| **Viewer** | `viewer@albaly.com` | `password123` |

## 🏗️ Architecture Note

This project follows **Clean Architecture** principles inside Next.js:
- **Server Components** (`page.tsx`) act as Controllers, fetching data via **Services**.
- **Services** (`src/services/*`) handle all DB interactions and business logic.
- **Components** (`src/components/*`) are purely presentational and receive data via props.
- **API Routes** (`src/app/api/*`) use a standardized `ApiResponse` wrapper for consistent error handling.
