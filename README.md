# FarmOS - Inventory Management System

A production-ready, AI-driven inventory management system built with Next.js 14+, Tailwind CSS, and Supabase.

## 🚀 Quick Start

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Database Setup (Supabase)**
   - Create a new project in [Supabase](https://supabase.com).
   - Go to the SQL Editor.
   - Run the contents of `database/schema.sql` to create tables and views.

3. **Configure Environment**
   - Copy `.env.local.example` to `.env.local`.
   - Add your Supabase URL and Anon Key.

4. **Seed Initial Data**
   - Start the app: `npm run dev`
   - Visit: [http://localhost:3000/seed](http://localhost:3000/seed)
   - Click "Start Seeding Process" to import the legacy spreadsheet data.

5. **Run Development Server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## 🛠 Features

- **Real-time Dashboard**: Live stock levels, low stock alerts, and expiry notifications.
- **Product Management**: Create and track products with variants (e.g., 50kg bags).
- **Batch Tracking**: Full traceability of stock batches with expiry dates.
- **Usage Logging**: Record usage against specific batches (FIFO support).
- **Server Actions**: Secure, efficient data mutations.

## 📦 Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable UI components (Forms, Tables, Stats).
- `lib/`: Utilities and Supabase clients.
- `types/`: TypeScript definitions matching the database schema.
