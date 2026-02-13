# Albaly Insights

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-24.0-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

Production-ready dashboard application built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS 4**, and **PostgreSQL (Docker)**. Designed with a strict Clean Architecture approach separating UI from Business Logic.

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

### 3. Shopping Cart & E-commerce
- **Product Store**: Browse products with real-time stock tracking.
- **Shopping Cart System**:
    - Add products to cart with quantity management.
    - Beautiful cart modal with gradient design and hover effects.
    - Live cart count badge in navigation.
    - Batch purchase functionality.
- **Product Management** (Admin only):
    - Edit product details (name, price, stock, category).
    - Real-time inventory updates.
- **Toast Notifications**: User feedback for cart actions and purchases.

### 4. Role-Based Access Control
- **Admin Role**: Full access to dashboard, insights, and product management.
- **Viewer Role**: Access to product store and shopping features only.
- **Route Protection**: Middleware-enforced role separation.

---

## 📂 Project Structure

```bash
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth routes (Login)
│   ├── (dashboard)/        # Protected dashboard routes (Admin only)
│   ├── (shop)/             # Store routes (All users)
│   └── api/                # API Routes (Controllers)
├── components/             # Reusable UI components
│   ├── overview/           # Dashboard-specific widgets
│   ├── insights/           # Analytics charts
│   ├── store/              # Product cards and store UI
│   ├── products/           # Product management components
│   └── ui/                 # Shared UI components (Toast, etc.)
├── contexts/               # React Context providers (Cart, Toast)
├── services/               # Business Logic & DB calls
├── lib/                    # Utilities (Auth, Formatters, Cart Modal)
├── types/                  # Centralized TypeScript interfaces
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
Duplicate the example environment file:
```bash
cp .env.example .env
```
Ensure the `DATABASE_URL` in `.env` matches your Docker configuration:
```env
DATABASE_URL="postgresql://albaly_user:albaly_password@localhost:5432/albaly_insights?schema=public"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Setup Database & Seed Data
Push the schema to the database and populate it with realistic mock data:
```bash
npx prisma db push
npx prisma db seed
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔐 Credentials

The seed script creates two users for testing:

| Role | Email | Password | Access |
|---|---|---|---|
| **Admin** | `admin@albaly.com` | `password123` | Dashboard, Insights, Store, Product Management |
| **Viewer** | `viewer@albaly.com` | `password123` | Store only (Shopping Cart) |

---

## 🏗️ Architecture Note

This project follows **Clean Architecture** principles inside Next.js:
- **Server Components** (`page.tsx`) act as Controllers, fetching data via **Services**.
- **Services** (`src/services/*`) handle all DB interactions and business logic.
- **Components** (`src/components/*`) are purely presentational and receive data via props.
- **API Routes** (`src/app/api/*`) use a standardized `ApiResponse` wrapper for consistent error handling.
