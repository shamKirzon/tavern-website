# 🍻 Tav — Restobar Management System

> A full-stack reservation and order management system built for **Tavern Asia Resto Bar**, Parañaque City. Designed to modernize operations by moving from walk-in to a reservation-only model, with QR-based verification and real-time order tracking.

---

## 📦 Repositories

| System | Stack | Description |
|---|---|---|
| `tavern-mobile` | React Native + Expo + TypeScript | Customer-facing mobile app |
| `tavern-web` | Node.js + PostgreSQL + Supabase | Admin, cashier, and security web dashboard |

---

## 🌐 Web Dashboard — `tavern-web`

The web application is used by the **admin**, **cashier**, and **security** staff to manage the full day-to-day operation of the restobar.

---

### Features

#### 🛡️ Admin
- **Manage Reservations** — View reservation history and full reservation lists; control available schedules shown to customers on the mobile app
- **Approve / Decline Payments** — Review customer-submitted deposit screenshots and manually confirm or reject each reservation
- **Manage Employees** — Create, read, update, and delete employee records; assign roles (admin, cashier, security) and manage shift schedules
- **Track Orders** — Monitor all active and past orders placed by customers in real time
- **Reports & Analytics** — View daily, monthly, and yearly graphs of reservations and sales; export PDF and Excel reports for orders, reservations, and sales

#### 🔒 Security
- **PIN Authentication** — Log in to the security station using a personal PIN
- **QR Code Scanner** — Scan and validate customer QR codes at the entrance; displays instant success or failure feedback
- **Logout** — Securely end the active PIN session

#### 🧾 Cashier
- **PIN Authentication** — Log in to the cashier station using a personal PIN
- **QR Code Scanner** — Scan order QR codes at the counter to update order status (Pending, Cancelled, Done) in real time
- **Add Additional Orders** — Append new items to an existing customer order; total bill updates automatically
- **Logout** — Securely end the active PIN session

---

### Tech Stack

| Tool | Purpose |
|---|---|
| Node.js | Server runtime |
| PostgreSQL | Primary relational database |
| Supabase | Backend services (auth, realtime, storage) |
| TypeScript | Type-safe codebase |
| Figma | UI/UX design and prototyping |
| VS Code | Development environment |
| Postman | API testing |

---

### Getting Started

```bash
# Clone the repo
git clone https://github.com/your-org/tavern-web.git
cd tavern-web

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to access the dashboard.

---

### Environment Variables

Create a `.env` file in the root directory:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_postgresql_connection_string
```

> Never commit your `.env` file. A `.env.example` is provided as reference.

---

## 🔐 Security

- QR codes are encrypted using **AES-256-CBC** to prevent forgery and duplication
- PIN-based authentication is required for all staff roles (security and cashier)
- All `.env` files are gitignored — sensitive credentials are never hardcoded in source

---

## 🗂️ System Overview

```
Customer (Mobile App)
  └── Register / Verify Email
  └── Make Reservation → Upload Payment Proof
  └── Place Order → Receive QR Code

Admin (Web Dashboard)
  └── Approve / Decline Reservations
  └── Manage Employees & Schedules
  └── View Reports & Analytics

Security (Web Dashboard)
  └── Scan QR at Entrance → Verify Customer

Cashier (Web Dashboard)
  └── Scan QR at Counter → Update Order Status
  └── Add Additional Orders
```

---

## 👥 Team

| Name | Role |
|---|---|
| Blanco, Paulyn Anne | Developer |
| Midorikawa, Yuji | Developer |
| Suyat, Shammy Kierson | Developer |
| Torres, Dannah Joyce | Developer |
| Tucker, Keiameere Ayesa | Developer |

**Course Adviser:** Prof. Alexander B. Pahayahay

---

## 📄 License

This project was developed as an academic requirement. All rights reserved by the authors and Tavern Asia Resto Bar.
