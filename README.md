# 🌺 POPPYPINK — Full-Stack Next.js E-Commerce

Premium women's sandals store with Admin Panel, Clerk Auth, MongoDB orders, and order tracking.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in keys
cp .env.local.example .env.local

# 3. Run development server
npm run dev
# → http://localhost:3000
```

---

## ⚙️ Environment Setup

Edit `.env.local` with your real credentials:

### 1. Clerk (Authentication)
- Go to: https://dashboard.clerk.com
- Create app → get `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY`

### 2. MongoDB (Database)
- Go to: https://cloud.mongodb.com → free M0 cluster
- Create database user → copy connection string → replace `MONGODB_URI`

### 3. Admin Access (choose one method)

**Method A — Email-based (easiest):**
Add your email to `.env.local`:
```
ADMIN_EMAILS=youremail@gmail.com
```

**Method B — Clerk publicMetadata (production recommended):**
1. Go to Clerk Dashboard → Users → click your user
2. Edit `publicMetadata`: `{"role": "admin"}`
3. That user now has admin access everywhere

### 4. Web3Forms (Order Email Notifications)
- Go to: https://web3forms.com → create access key → `NEXT_PUBLIC_WEB3FORMS_KEY`

---

## 📁 Project Structure

```
poppypink-nextjs/
├── middleware.js                    ← Clerk route protection
├── .env.local.example               ← Copy to .env.local
│
└── src/
    ├── pages/
    │   ├── index.js                 ← Home / Shop
    │   ├── cart.js                  ← Cart page
    │   ├── track.js                 ← Order tracking (public)
    │   ├── admin/
    │   │   └── index.js             ← Admin dashboard (protected)
    │   ├── sign-in/index.js         ← Clerk sign-in
    │   ├── sign-up/index.js         ← Clerk sign-up
    │   └── api/
    │       ├── orders/
    │       │   ├── index.js         ← GET all / POST new order
    │       │   └── [id].js          ← GET one / PATCH status (admin)
    │       └── track/
    │           └── [orderId].js     ← GET order tracking (public)
    │
    ├── components/
    │   ├── Navbar.js                ← Updated: Clerk avatar + admin link
    │   ├── Hero.js                  ← Split layout hero
    │   ├── ProductModal.js          ← Updated: saves to MongoDB + sends email
    │   └── admin/
    │       └── AdminDashboard.js    ← Dark neon admin panel UI
    │
    ├── lib/
    │   ├── mongodb.js               ← DB connection singleton
    │   └── adminCheck.js            ← isAdmin() helper
    │
    └── models/
        └── Order.js                 ← Mongoose Order schema
```

---

## 🔐 How Authentication Works

1. Clerk middleware (`middleware.js`) protects `/admin` routes
2. `getServerSideProps` in `/admin` does a full server-side admin check
3. Navbar shows user avatar when signed in
4. User dropdown shows admin panel link for admin users only

---

## 📋 Admin Panel — `/admin`

Access: Sign in with an admin email → go to `/admin`

Features:
- 📊 Live stats (total orders, processing, shipped, delivered, revenue)
- 🔍 Search + filter by status
- 📝 Update order status with dropdown (Processing → Delivered)
- 💬 Add admin notes per order
- 🔄 Real-time refresh
- Dark neon themed UI

---

## 📦 Order Flow

1. Customer clicks "Buy Now" on product
2. Fills delivery form
3. `POST /api/orders` saves to MongoDB → returns `orderId` (e.g. `PP-A3K9X`)
4. Web3Forms sends email to admin
5. Customer sees Order ID on success screen
6. Customer can track at `/track` → enters `PP-A3K9X`
7. Admin goes to `/admin` → changes status → customer sees update

---

## 🌐 Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Shop homepage |
| `/cart` | Public | Cart |
| `/track` | Public | Order tracking |
| `/sign-in` | Public | Clerk sign in |
| `/sign-up` | Public | Clerk sign up |
| `/admin` | Admin only | Order management |
| `GET /api/orders` | Admin only | Fetch all orders |
| `POST /api/orders` | Public | Create order |
| `PATCH /api/orders/:id` | Admin only | Update order status |
| `GET /api/track/:orderId` | Public | Track order by ID |
