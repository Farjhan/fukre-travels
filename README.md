# 🏍️ Fukre Travels — Northeast India Road Trip Platform

> **Explore Northeast India on Wheels** — Curated bike & car road trips through Arunachal Pradesh, Meghalaya, Assam & Mizoram.

---

## 📁 Project Structure

```
fukre-travels/
├── backend/                  # Node.js + Express API
│   ├── models/
│   │   ├── User.js           # User schema (auth)
│   │   ├── Trip.js           # Trip schema
│   │   ├── Booking.js        # Booking schema
│   │   └── Blog.js           # Blog post schema
│   ├── routes/
│   │   ├── auth.js           # Login, register, profile
│   │   ├── trips.js          # CRUD for trips
│   │   ├── bookings.js       # Create/manage bookings
│   │   ├── blog.js           # Blog posts
│   │   └── admin.js          # Admin dashboard data
│   ├── middleware/
│   │   └── auth.js           # JWT protect + adminOnly
│   ├── server.js             # Express app entry point
│   ├── seed.js               # Database seeder (6 trips + blogs)
│   ├── .env.example          # Environment variable template
│   └── package.json
│
├── frontend/                 # React.js + Tailwind CSS
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Auth state (login/logout)
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Responsive navigation
│   │   │   ├── Footer.jsx          # Site footer
│   │   │   ├── TripCard.jsx        # Trip listing card
│   │   │   └── LoadingSpinner.jsx  # Loading state
│   │   ├── pages/
│   │   │   ├── HomePage.jsx        # Hero + destinations + trips
│   │   │   ├── TripsPage.jsx       # All trips + filters
│   │   │   ├── TripDetailPage.jsx  # Full trip detail + itinerary
│   │   │   ├── BookingPage.jsx     # Booking form + payment
│   │   │   ├── LoginPage.jsx       # Login + Register
│   │   │   ├── RegisterPage.jsx    # Register (re-export)
│   │   │   ├── DashboardPage.jsx   # User's bookings
│   │   │   ├── AdminPage.jsx       # Admin panel
│   │   │   ├── BlogPage.jsx        # Blog listing
│   │   │   └── BlogDetailPage.jsx  # Blog article view
│   │   ├── App.jsx                 # Routes + auth guards
│   │   ├── index.js                # React entry point
│   │   └── index.css               # Tailwind + custom styles
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── package.json              # Root scripts
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ — [nodejs.org](https://nodejs.org)
- **MongoDB** — [Install locally](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas) (free)
- **npm** v9+

---

### Step 1 — Clone & Install

```bash
# Clone or unzip the project
cd fukre-travels

# Install all dependencies (backend + frontend)
npm run install:all
```

Or manually:
```bash
cd backend && npm install
cd ../frontend && npm install
```

---

### Step 2 — Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/fukre-travels
JWT_SECRET=your_super_secret_jwt_key_here_change_this
CLIENT_URL=http://localhost:3000

# Optional: Razorpay (for real payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

**MongoDB Atlas** (free cloud DB):
1. Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/fukre-travels`
4. Replace `MONGO_URI` in `.env`

---

### Step 3 — Seed the Database

```bash
cd backend
npm run seed
```

This creates:
- ✅ **Admin user**: `admin@fukretravel.com` / `admin123`
- ✅ **6 Northeast India trips** with full itineraries
- ✅ **3 blog posts** with real travel tips

---

### Step 4 — Run the Project

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Server running on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
# App running on http://localhost:3000
```

Open **http://localhost:3000** in your browser 🎉

---

## 🔑 Demo Credentials

| Role  | Email                    | Password  |
|-------|--------------------------|-----------|
| Admin | admin@fukretravel.com    | admin123  |
| User  | Register a new account   | Any       |

---

## 🌟 Features Overview

### 🏠 Homepage
- Full-screen hero slider with 3 landscapes + auto-advance
- Stats bar (500+ trips, 4 states, 2000+ riders)
- Destination cards (Arunachal, Meghalaya, Assam, Mizoram)
- Featured trips grid
- Why us section
- Testimonials
- Call-to-action

### 🗺️ Trips Page
- All trips with grid layout
- Live search by title/route
- Filters: State, Difficulty, Vehicle Type, Duration
- Clear filters button

### 📍 Trip Detail Page
- Image gallery with thumbnails
- Full route display
- Difficulty & vehicle badge
- Day-by-day accordion itinerary
- Trip highlights checklist
- Google Maps integration (or link fallback)
- Sticky booking sidebar with price

### 📅 Booking System
- Date picker for travel start
- Vehicle type selector (Bike / Car)
- Group size (1 to max)
- Emergency contact
- Special requests
- **Dummy Razorpay simulation** (animates payment flow)
- Order summary sidebar

### 👤 User Auth
- JWT-based login/register
- Protected routes (booking, dashboard)
- Persistent login (localStorage)

### 📊 User Dashboard
- Booking stats (total, confirmed, spent)
- All bookings with status badges
- Cancel pending bookings
- Link to book new trips

### 🛠️ Admin Panel
- **Overview**: Users, trips, bookings, revenue stats + recent activity
- **Trips**: List, add, edit, delete, toggle featured
- **Bookings**: Full table, update status via dropdown
- **Users**: User cards with role badges
- **Blogs**: List with publish status

### 📝 Blog
- Category filter (Travel Tips, Destination Guide, Bike Tips, etc.)
- Article cards with view counts
- Full article page with related posts
- Travel CTA on every article

---

## 🗄️ API Endpoints

### Auth
| Method | Endpoint           | Auth     | Description     |
|--------|--------------------|----------|-----------------|
| POST   | /api/auth/register | Public   | Register user   |
| POST   | /api/auth/login    | Public   | Login           |
| GET    | /api/auth/me       | User     | Get profile     |
| PUT    | /api/auth/me       | User     | Update profile  |

### Trips
| Method | Endpoint       | Auth     | Description     |
|--------|----------------|----------|-----------------|
| GET    | /api/trips     | Public   | All trips       |
| GET    | /api/trips/:id | Public   | Single trip     |
| POST   | /api/trips     | Admin    | Create trip     |
| PUT    | /api/trips/:id | Admin    | Update trip     |
| DELETE | /api/trips/:id | Admin    | Delete trip     |

### Bookings
| Method | Endpoint                    | Auth     | Description         |
|--------|-----------------------------|----------|---------------------|
| POST   | /api/bookings               | User     | Create booking      |
| GET    | /api/bookings/my-bookings   | User     | User's bookings     |
| PUT    | /api/bookings/:id/cancel    | User     | Cancel booking      |
| POST   | /api/bookings/:id/pay       | User     | Simulate payment    |
| GET    | /api/bookings/admin/all     | Admin    | All bookings        |

### Blog
| Method | Endpoint        | Auth     | Description     |
|--------|-----------------|----------|-----------------|
| GET    | /api/blog       | Public   | All posts       |
| GET    | /api/blog/:slug | Public   | Single post     |
| POST   | /api/blog       | Admin    | Create post     |
| PUT    | /api/blog/:id   | Admin    | Update post     |
| DELETE | /api/blog/:id   | Admin    | Delete post     |

### Admin
| Method | Endpoint               | Auth     | Description       |
|--------|------------------------|----------|-------------------|
| GET    | /api/admin/stats       | Admin    | Dashboard stats   |
| GET    | /api/admin/users       | Admin    | All users         |
| PUT    | /api/admin/bookings/:id| Admin    | Update booking    |

---

## 🎨 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, React Router v6           |
| Styling    | Tailwind CSS 3, Google Fonts        |
| State      | React Context API                   |
| HTTP       | Axios                               |
| Backend    | Node.js, Express 4                  |
| Database   | MongoDB + Mongoose                  |
| Auth       | JWT (jsonwebtoken) + bcryptjs       |
| Toasts     | react-hot-toast                     |
| SEO        | react-helmet-async                  |
| Icons      | lucide-react                        |
| Fonts      | Playfair Display, DM Sans, JetBrains Mono |

---

## 🛣️ Seeded Trips

| Trip | State | Duration | Price | Difficulty |
|------|-------|----------|-------|------------|
| Tawang Monastery Circuit | Arunachal Pradesh | 8 days | ₹18,500 | Hard |
| Meghalaya Living Roots Explorer | Meghalaya | 6 days | ₹12,800 | Easy |
| Kaziranga Bikers Trail | Assam | 5 days | ₹9,500 | Easy |
| Mizoram Mizo Highland Ride | Mizoram | 7 days | ₹16,200 | Moderate |
| Ziro Valley Music & Culture Trail | Arunachal Pradesh | 9 days | ₹21,000 | Moderate |
| Garo Hills & Balpakram Adventure | Meghalaya | 5 days | ₹11,000 | Hard |

---

## 🔧 Customization

### Add Razorpay Real Payments
1. Get API keys from [razorpay.com](https://razorpay.com)
2. Add to backend `.env`
3. Install: `npm install razorpay`
4. Replace the `simulatePayment` function in `BookingPage.jsx` with real Razorpay checkout

### Add Google Maps
1. Get API key from [console.cloud.google.com](https://console.cloud.google.com)
2. Add `mapEmbedUrl` to trip documents in MongoDB
3. The `TripDetailPage` will automatically render the iframe

### Add Weather API
1. Get free key from [openweathermap.org](https://openweathermap.org/api)
2. Create a `WeatherWidget` component
3. Call: `https://api.openweathermap.org/data/2.5/weather?q=Tawang,IN&appid=YOUR_KEY`

### Deploy
- **Frontend**: Vercel or Netlify — `npm run build` → deploy `build/` folder
- **Backend**: Railway, Render, or AWS EC2
- **Database**: MongoDB Atlas (free 512MB)

---

## 📱 Mobile Responsive

All pages are fully responsive:
- Mobile-first Tailwind classes
- Hamburger menu on mobile
- Touch-friendly booking form
- Optimized card grid (1 → 2 → 4 columns)

---

## 🔍 SEO Features

- `react-helmet-async` for per-page meta tags
- Keywords: "Northeast bike trips", "Arunachal road trip", etc.
- Semantic HTML structure
- Slugified URLs for trips and blogs
- Open Graph tags on homepage

---

## 📞 Support

- Email: hello@fukretravel.com
- Based in Guwahati, Assam
- Built for Northeast India's road trip community 🏍️

---

*Made with ❤️ for the riders of Northeast India*
