# Hotel Booking System

Hotel booking web app built using the MERN stack. I built it to learn how real-world booking systems work, from user login and room management to actual payment processing with Razorpay.

The app is fully deployed and working. You can create an account, browse rooms, book one with real payment (test mode), and also manage everything from an admin panel.

Live demo: https://hotel-booking-system-eight-self.vercel.app

---

## What it does

- Register / Login with JWT authentication
- Email OTP verification before checkout (using Resend API)
- Browse hotel rooms with filters by category
- Book a room with check-in / check-out dates
- Pay online via Razorpay or choose pay at hotel
- View your booking history
- Admin can add/delete rooms, upload images, and see all bookings with revenue stats

---

## Tech Stack

**Frontend** — React, Vite, Tailwind CSS, React Router, Axios

**Backend** — Node.js, Express.js, MongoDB Atlas, Mongoose, JWT, Multer

**Other** — Razorpay (payments), Resend (email OTP), Fast2SMS (SMS OTP), Vercel (frontend), Render (backend)

---

## Why I chose these technologies

I used React because I wanted to learn component-based UI properly. For the backend I went with Express since it's straightforward and doesn't hide too much. MongoDB made sense for this project because booking and room data doesn't need strict relational structure. I chose Razorpay over Stripe because it supports Indian payments natively and has a good test mode.

The hardest part was getting the Razorpay webhook flow right — the payment popup is non-blocking so you can't use a simple try/catch around `rzp.open()`. I had to handle success, failure, and dismiss separately.

---

## Running locally

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Git](https://git-scm.com/)

### 1. Clone the repo

```bash
git clone https://github.com/cjhimanshu/hotel-booking-system
cd hotel-booking-system
```

### 2. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 3. Set up environment variables

Create `server/.env` (copy from `server/.env.example`):

```
PORT=5000
MONGO_URI=<your_mongodb_atlas_connection_string>
JWT_SECRET=<make_up_any_long_random_string>
RAZORPAY_KEY_ID=<from_razorpay_dashboard>
RAZORPAY_KEY_SECRET=<from_razorpay_dashboard>
FRONTEND_URL=http://localhost:5173
RESEND_API_KEY=<from_resend.com_dashboard>
FAST2SMS_API_KEY=<from_fast2sms.com_dashboard>
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start the app

```bash
npm run dev
```

Frontend runs at http://localhost:5173, backend at http://localhost:5000

---

## Deployment

Frontend is on Vercel, backend is on Render. I initially tried deploying both on Vercel as a monorepo but ran into cold start issues with serverless functions, so split them. Render free tier does sleep after inactivity but wakes up in about 30–50 seconds on first request.

---

## Project structure

```
hotel-booking-system/
├── client/               # React frontend
│   └── src/
│       ├── components/   # Navbar, ProtectedRoute, AdminRoute
│       ├── context/      # AuthContext
│       ├── pages/        # Rooms, Booking, Login, Register, AdminDashboard etc.
│       └── services/     # Axios API config
│
├── server/               # Express backend
│   ├── controllers/      # Auth, Booking, Payment, Room, Verification
│   ├── middleware/       # JWT auth, error handler
│   ├── models/           # User, Room, Booking schemas
│   ├── routes/           # All API routes
│   └── server.js
│
└── docs/                 # Extra setup notes
```

---

## About

Built by **Himanshu Kumar**.

- GitHub: [github.com/cjhimanshu](https://github.com/cjhimanshu)
- LinkedIn: [linkedin.com/in/himanshu-kumar-02ab40249](https://www.linkedin.com/in/himanshu-kumar-02ab40249)

Feel free to use this as reference for your own projects. If you find a bug or want to suggest something, open an issue.
