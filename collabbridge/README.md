# CollabBridge — Full-Stack Influencer Marketing Platform

CollabBridge is a modern, full-stack MERN application connecting leading brands and high-performing digital creators for verified marketing partnerships.

---

## 1. Technology Stack

- **Frontend:** React.js (v18) initialized with Vite, Vanilla CSS3 (Custom Design System with indigo/purple accents, responsive layouts, glassmorphism headers, and card components)
- **Programming Language:** JavaScript only (ES6+)
- **Routing:** React Router v6
- **Icons:** Lucide React
- **API Requests:** Axios with automatic JWT Authorization header injection
- **Backend:** Node.js & Express.js REST API
- **Database:** MongoDB Community Server / MongoDB Atlas via Mongoose ODM
- **Database GUI:** MongoDB Compass
- **Authentication:** JSON Web Tokens (JWT) & bcrypt password hashing
- **Security:** Protected routes, role-based authorization (`brand` vs `influencer`), and duplicate-action prevention indexes

---

## 2. Project Architecture & Folder Structure

```
collabbridge/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI (Navbar, Footer, Sidebar, StatCard, Cards, Modals, Badges)
│   │   ├── context/            # AuthContext (JWT session, user role, login, register, logout)
│   │   ├── layouts/            # MainLayout (Public) & DashboardLayout (Protected)
│   │   ├── pages/              # Landing, Auth, Dashboards, Directory, Marketplace, Details, Settings
│   │   ├── services/           # api.js (Axios instance with base URL & interceptors)
│   │   ├── styles/             # index.css (Design System), dashboard.css, marketplace.css
│   │   ├── App.jsx             # React Router routing configuration
│   │   └── main.jsx            # React root mount
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                     # Express.js REST API Backend
│   ├── config/                 # db.js (Mongoose connection & diagnostics)
│   ├── controllers/            # auth, influencer, campaign, application, review controllers
│   ├── middleware/             # auth.js (protect, authorize, optionalAuth) & error.js (centralized errors)
│   ├── models/                 # User, InfluencerProfile, Campaign, Application, Review
│   ├── routes/                 # Express route definitions
│   ├── utils/
│   │   ├── seed.js             # Realistic fictional demo data seeder
│   │   └── verifyAll.js        # Automated end-to-end integration test suite
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Express application entry point
├── .gitignore
└── README.md
```

---

## 3. MongoDB & MongoDB Compass Setup

### Understanding MongoDB vs MongoDB Compass
> **Important Distinction:** **MongoDB** is the actual database server that stores data on disk. **MongoDB Compass** is a graphical user interface (GUI) desktop application used to visually browse, query, and inspect databases and collections. Compass is **not** the database itself—MongoDB Community Server (or MongoDB Atlas) must be running for Compass to connect.

### Connecting with MongoDB Compass:
1. Ensure MongoDB is running locally:
   - On macOS: `brew services start mongodb/brew/mongodb-community`
   - On Windows: Start the `MongoDB Server` service via Windows Services or run `mongod.exe`.
   - On Linux: `sudo systemctl start mongod`
2. Open **MongoDB Compass**.
3. In the connection window, enter the connection URI:
   ```
   mongodb://127.0.0.1:27017/collabbridge
   ```
4. Click **Connect**.
5. You will see the `collabbridge` database with its 5 collections:
   - `users`: Registered brand and creator accounts with bcrypt hashed passwords.
   - `influencerprofiles`: Creator metrics (niche, location, followerCount, engagementRate, price, socialLinks).
   - `campaigns`: Marketing briefs posted by brands with budgets, deadlines, and statuses.
   - `applications`: Collaboration pitches submitted by creators with status tracking (`pending`, `accepted`, `rejected`, `completed`).
   - `reviews`: Authentic 1–5 star reviews and comments submitted by brands exclusively after completed collaborations.

*(Alternatively, to use **MongoDB Atlas**, obtain your cluster connection string and paste it into `server/.env` as `MONGODB_URI`.)*

---

## 4. Environment Variables

### Backend (`server/.env`):
Create a file named `.env` in `collabbridge/server/`:
```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/collabbridge
JWT_SECRET=collabbridge_super_secure_jwt_secret_key_2026_dev
CLIENT_URL=http://localhost:5173
```
*(Note: Port 5001 is used by default to prevent port conflicts with macOS ControlCenter / AirPlay Receiver on port 5000.)*

### Frontend (`client/.env`):
Create a file named `.env` in `collabbridge/client/`:
```env
VITE_API_URL=http://localhost:5001/api
```

---

## 5. Quick Start Instructions

### Step 1: Install Dependencies
Open your terminal and install packages for both backend and frontend:

```bash
# Install backend dependencies
cd collabbridge/server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Step 2: Seed Demo Data (Optional but Recommended)
Populate realistic fictional brands, creators, campaigns, applications, and reviews:

```bash
cd collabbridge/server
npm run seed
```

### Step 3: Start the Backend Server
```bash
cd collabbridge/server
npm start
```
The server will run on `http://localhost:5001`. You can test the health endpoint at `http://localhost:5001/api/health`.

### Step 4: Start the Frontend App
In a separate terminal window:
```bash
cd collabbridge/client
npm run dev
```
The web application will open at `http://localhost:5173`.

---

## 6. Demo Accounts & Credentials

All demo accounts are pre-configured with the password: **`Password123!`**

### Brand Accounts:
| Brand Name | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Aura Audio Co.** | `brand@auraaudio.com` | `Password123!` | `brand` |
| **Lumina Skin Lab** | `contact@luminaskin.com` | `Password123!` | `brand` |

### Creator Accounts:
| Creator Name | Email | Password | Niche & Location |
| :--- | :--- | :--- | :--- |
| **Marcus Chen** | `marcus@techcreator.io` | `Password123!` | Technology • San Francisco, CA |
| **Sophia Rodriguez** | `sophia@stylejourney.com` | `Password123!` | Fashion • New York, NY |
| **Devon Miller** | `devon@peakfitness.fit` | `Password123!` | Fitness • Austin, TX |
| **Elena Rostova** | `elena@wanderlustvisuals.com` | `Password123!` | Travel • Seattle, WA |
| **Kai Tanaka** | `kai@gamereviewspro.com` | `Password123!` | Gaming • Los Angeles, CA |

*(You can also register your own brand or creator account from the registration page!)*

---

## 7. Key Features Implemented

1. **Role-Based Authentication & Session Persistence:**
   - User roles: `brand` and `influencer`.
   - Passwords securely hashed with bcrypt (salt rounds = 10).
   - JWT tokens signed with expiration and stored in localStorage.
   - Dedicated role-guarded layouts preventing unauthorized access.

2. **Landing Page:**
   - Hero: *"Where Brands Meet Influence"*.
   - Feature showcases for discovery, campaigns, and tracking.
   - 4-step *How It Works* interactive section.
   - Clear value propositions for brands and creators with functional CTAs.

3. **Brand Dashboard:**
   - Real-time database metrics: Total Campaigns, Active Campaigns, Inbound Applications, Accepted Collaborations.
   - Quick action to post new campaigns or discover creators.
   - Direct collaboration status workflow: Accept, Reject, Mark Completed, and Leave Review.

4. **Influencer Dashboard:**
   - Profile strength progress bar with marketplace readiness tips.
   - Real-time statistics: Total Applications, Under Review, Active Collaborations, Completed Campaigns, Available Opportunities.
   - Quick links to browse marketplace and edit profile.

5. **Creator Directory & Profile Pages:**
   - Multi-criteria real-time search: Name, Niche category, Location, Follower range, Engagement rate minimum, Collab rate maximum.
   - Sorting by audience size, rate, and rating.
   - Profile detail page showcasing full bio, social links, metrics, and verified brand reviews with star scores.

6. **Campaign Marketplace & Management:**
   - Brands can create briefs as **Draft** or **Published**.
   - Search briefs by title or keyword, filter by category or budget range.
   - Creators submit tailored pitches and proposed fees.
   - Duplicate applications blocked at application and database index level.

7. **Collaboration Lifecycle & Verified Reviews:**
   - Stage 1: Creator applies (`pending`).
   - Stage 2: Brand accepts proposal (`accepted`).
   - Stage 3: Content delivered & brand marks complete (`completed`).
   - Stage 4: Brand unlocks review submission (1–5 stars + written feedback).
   - Creator profile dynamically calculates real average rating from stored reviews.

---

## 8. Verification & Automated Testing

CollabBridge includes a built-in end-to-end integration test suite (`collabbridge/server/utils/verifyAll.js`).
To run the automated verification:

```bash
cd collabbridge/server
node utils/verifyAll.js
```

### Verification Results:
```
======================================================
🧪 RUNNING COMPLETE COLLABBRIDGE VERIFICATION SUITE
======================================================

✅ PASS: GET /api/health returns database connected and healthy status
✅ PASS: POST /api/auth/register registers brand account with role=brand
✅ PASS: POST /api/auth/register registers influencer and initializes InfluencerProfile
✅ PASS: POST /api/auth/login authenticates with valid credentials
✅ PASS: PUT /api/influencers/profile updates influencer metrics and social links
✅ PASS: GET /api/influencers filters by niche and minimum followers
✅ PASS: POST /api/campaigns creates a new campaign (as Brand)
✅ PASS: GET /api/campaigns marketplace lists the published campaign
✅ PASS: POST /api/applications submits collaboration proposal
✅ PASS: Duplicate application to same campaign is rejected with 400
✅ PASS: Unauthorized user cannot change application status (rejected with 403)
✅ PASS: PATCH /api/applications/:id/status Brand owner accepts application
✅ PASS: PATCH /api/applications/:id/status Brand owner marks collaboration completed
✅ PASS: POST /api/reviews Brand submits 5-star review for completed collaboration
✅ PASS: Duplicate review for same collaboration is rejected with 400
✅ PASS: GET /api/influencers/:id profile reflects updated rating and reviews
✅ PASS: GET /api/campaigns/stats/brand calculates real DB statistics
✅ PASS: GET /api/applications/stats/influencer calculates real DB statistics

======================================================
TEST SUMMARY: 18 PASSED, 0 FAILED
======================================================
```

---

## 9. Known Limitations & Software Notes
- **Local MongoDB Server:** Ensure MongoDB Community Server is started before launching the backend (`brew services start mongodb/brew/mongodb-community`).
- **Port Selection:** On macOS, the default port 5000 is reserved by the macOS AirPlay Receiver (`ControlCenter`). The backend is pre-configured to run on port 5001 with an automatic retry handler if port 5000 is occupied.
