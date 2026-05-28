<div align="center">

# 🏠 HostelHub

### *The Campus Marketplace — Buy, Sell & Request within your Hostel*

<!-- Replace with actual logo -->
![HostelHub Logo](https://via.placeholder.com/200x80?text=HostelHub)

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-black?style=for-the-badge&logo=socket.io)](https://socket.io)
[![React Query](https://img.shields.io/badge/React_Query-5.x-FF4154?style=for-the-badge&logo=reactquery)](https://tanstack.com/query)

**[🚀 Live Demo](#)** • **[📱 Frontend](#)** • **[🔧 API Docs](#api-endpoints)** • **[📖 Setup Guide](../../hostelhub/SETUP.md)**

</div>

---

## 🎯 Problem & Solution

**Problem:** Hostel students accumulate items they no longer need — textbooks, electronics, clothes — while other students need the same items. There's no easy way to buy/sell within the campus, leading to waste and unnecessary spending on new items.

**Solution:** HostelHub is a campus-exclusive peer-to-peer marketplace where students can:
- 📦 **List** items they want to sell from their hostel room
- 🔍 **Browse** listings filtered by hostel, category, and price
- 💬 **Chat** directly with sellers in real-time
- 📋 **Post requests** for items they need (Buyer Polls)
- 🔔 **Get notified** when someone replies to their listing or request

---

## 🖼️ Screenshots

<!-- Replace with actual screenshots -->

| Homepage | Product Listing | Product Detail |
|----------|----------------|----------------|
| ![Home](https://via.placeholder.com/300x180?text=Homepage) | ![Products](https://via.placeholder.com/300x180?text=Products) | ![Detail](https://via.placeholder.com/300x180?text=Product+Detail) |

| Real-time Chat | Buyer Polls | Admin Dashboard |
|---------------|------------|-----------------|
| ![Chat](https://via.placeholder.com/300x180?text=Chat) | ![Polls](https://via.placeholder.com/300x180?text=Polls) | ![Admin](https://via.placeholder.com/300x180?text=Admin) |

| Notifications | Wishlist | Mobile View |
|--------------|---------|-------------|
| ![Notifs](https://via.placeholder.com/300x180?text=Notifications) | ![Wishlist](https://via.placeholder.com/300x180?text=Wishlist) | ![Mobile](https://via.placeholder.com/300x180?text=Mobile) |

---

## ✨ Features

### Core Marketplace
- [x] 🏠 Homepage with hero banner, trending products, category tiles
- [x] 📦 Product listings with search, filter by category/hostel/condition/price
- [x] 🖼️ Product detail page with image gallery (zoom, thumbnails)
- [x] 👤 Seller profile page with all listings
- [x] ❤️ Wishlist (saved to localStorage, persists across sessions)
- [x] 🕐 Recently Viewed products (last 8 items)

### Real-time Communication
- [x] 💬 Real-time chat with Socket.io (buyer ↔ seller)
- [x] 📋 Chat list with unread message badges
- [x] 🟢 Online/offline user status indicators
- [x] ⬇️ Auto-scroll to latest messages

### Buyer Polls (Requests)
- [x] 📢 Post item requests with category, max price, and description
- [x] 💬 Sellers can reply to polls
- [x] 🔍 Filter polls by category and status (open/closed)
- [x] ✅ Poll author can close requests

### Notifications
- [x] 🔔 Bell icon with unread count badge in Navbar
- [x] 📥 Notification dropdown (last 6, mark-all-read)
- [x] 📄 Full notifications page with filters
- [x] 🔔 Real-time notifications via Socket.io

### Admin Dashboard
- [x] 📊 Stats overview (users, products, chats, revenue)
- [x] 📈 Charts: bar, line, and pie (Recharts)
- [x] 👥 User management table
- [x] 📦 Product moderation
- [x] 📋 Reports page
- [x] 🔒 Admin-only access guard

### UI & UX
- [x] 🌙 Dark / Light mode toggle (persists in localStorage)
- [x] 📱 Fully responsive — desktop + mobile
- [x] ⬇️ Mobile bottom navigation bar
- [x] ✨ Glassmorphism card design
- [x] 🎭 Page transition animations (Framer Motion)
- [x] 💀 Skeleton loading states
- [x] 🍞 Toast notifications (Sonner)

### Backend & Database
- [x] 🌱 Full database seed script (`npm run seed`)
- [x] 🗑️ Database clear script (`npm run seed:clear`)
- [x] 🏨 38 hostels pre-seeded (KP-1 to KP-25, QC-1 to QC-13)

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| Next.js 14 (App Router) | Framework, routing, SSR |
| TypeScript | Type safety |
| Tailwind CSS | Styling, dark mode, glassmorphism |
| React Query v5 | Server state, caching, polling |
| Socket.io Client | Real-time chat & notifications |
| Framer Motion | Page transitions & animations |
| Recharts | Admin dashboard charts |
| Sonner | Toast notifications |

### Backend
| Technology | Purpose |
|-----------|---------|
| Express.js | REST API server |
| TypeScript | Type safety |
| MongoDB + Mongoose | Database & ODM |
| Socket.io | Real-time WebSocket server |
| JWT | Authentication tokens |
| Cloudinary | Image uploads & CDN |
| bcryptjs | Password hashing |

---

## 🚀 Quick Start

### Prerequisites
- Node.js v20+
- MongoDB (local) or MongoDB Atlas account
- npm v10+

### Frontend Setup
```bash
cd frontend2hb/hostel-market
npm install
npm run dev
# → http://localhost:3000
```

### Backend Setup
```bash
cd hostelhub/server
npm install
# Create .env file (see SETUP.md for all variables)
npm run dev
# → http://localhost:5000
```

### Seed the Database
```bash
cd hostelhub/server
npm run seed          # seed all data
npm run seed:hostels  # seed hostels only
npm run seed:clear    # clear all data
```

> 📖 See the full [SETUP.md](../../hostelhub/SETUP.md) for environment variables, API docs, and deployment guide.

---

## 📁 Project Structure

```
frontend2hb/hostel-market/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── page.tsx          # Homepage
│   │   ├── products/         # Product listing
│   │   ├── product/[id]/     # Product detail
│   │   ├── seller/[id]/      # Seller profile
│   │   ├── chats/            # Chat list + chat window
│   │   ├── polls/            # Buyer polls
│   │   ├── wishlist/         # Saved items
│   │   ├── notifications/    # Notification centre
│   │   ├── admin/            # Admin dashboard
│   │   └── api/              # Next.js API routes (mock backend)
│   ├── components/           # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── BottomNav.tsx
│   │   ├── NotificationDropdown.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ImageGallery.tsx
│   │   ├── WishlistButton.tsx
│   │   ├── admin/            # Admin-specific components
│   │   ├── chat/             # Chat components
│   │   └── ui/               # Generic UI (Skeleton, etc.)
│   ├── providers/            # React context providers
│   │   ├── ThemeProvider.tsx
│   │   ├── SocketProvider.tsx
│   │   ├── QueryProvider.tsx
│   │   └── ToastProvider.tsx
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Mock data & API helpers
│   └── types/                # TypeScript interfaces
├── next.config.js
├── tailwind.config.ts
└── README.md
```

---

## 🌐 API Endpoints

See full API reference in [SETUP.md](../../hostelhub/SETUP.md).

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/send-otp` | Send OTP to mobile |
| POST | `/auth/verify-otp` | Verify OTP, receive JWT |
| GET | `/products` | List products with filters |
| POST | `/products` | Create new listing |
| GET | `/chats` | Get my conversations |
| POST | `/polls` | Create item request |
| GET | `/notifications` | Get my notifications |

---

## 📦 Packaging for Delivery

### Create ZIP (exclude node_modules and build files)

**On Windows (PowerShell):**
```powershell
# From frontend root
cd C:\Users\KIIT0001\Downloads\frontend2hb\hostel-market
tar -czf HostelHub-frontend.tar.gz --exclude="node_modules" --exclude=".next" .

# From backend root
cd C:\Users\KIIT0001\Downloads\hostelhub\server
tar -czf HostelHub-backend.tar.gz --exclude="node_modules" --exclude="dist" .
```

**On Linux/Mac:**
```bash
# Frontend
zip -r HostelHub-frontend.zip . -x "node_modules/*" ".next/*" ".git/*"

# Backend
zip -r HostelHub-backend.zip . -x "node_modules/*" "dist/*" ".git/*"
```

**Full project (both together):**
```powershell
cd C:\Users\KIIT0001\Downloads
tar -czf HostelHub.tar.gz --exclude="*/node_modules" --exclude="*/.next" --exclude="*/dist" frontend2hb hostelhub
```

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

1. Fork the project
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

Please make sure to:
- Follow the existing code style (TypeScript strict mode)
- Add dark mode support to any new UI components (`dark:` Tailwind variants)
- Not break existing features or imports
- Test on both mobile and desktop viewports

---

## 👩‍💻 Author

**Eshana Singh**
- Email: eshanasingh03@gmail.com
- Project: HostelHub Campus Marketplace

---

## 📄 License

This project is for academic/portfolio use.

---

<div align="center">
Made with ❤️ for hostel students everywhere
</div>
