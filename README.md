# Hotel Booking System

A production-minded hotel booking web application built with the MERN stack (MongoDB, Express, React, Node). It includes user authentication, room management, booking flows, and online payments (Razorpay). The project demonstrates a full-stack deployment workflow and common real-world features for booking platforms.

Live demo: https://hotel-booking-system-eight-self.vercel.app

---

## Features

- User registration, login and JWT-based authentication
- Email OTP verification (Resend) and optional SMS OTP (Fast2SMS)
- Browse and filter rooms by category, availability and features
- Create bookings with check-in / check-out dates and view booking history
- Pay online via Razorpay (test mode) or choose pay-at-hotel
- Admin panel: add/update/delete rooms, upload images, view bookings and revenue stats

---

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express.js, MongoDB Atlas, Mongoose
- Auth & Uploads: JWT, Multer
- Payments & Notifications: Razorpay, Resend, Fast2SMS

---

## Quick Start (development)

Prerequisites: `Node.js` (v16+), `npm` or `pnpm`, and access to a MongoDB instance.

1. Clone the repo

```bash
git clone https://github.com/cjhimanshu/hotel-booking-system.git
cd hotel-booking-system
```

2. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
cd ..
```

3. Environment variables

Copy and edit examples:

- `server/.env.example` -> `server/.env`
- `client/.env.example` -> `client/.env` (if present)

Minimum `server/.env` values:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=some_long_random_string
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=rzp_secret_xxx
FRONTEND_URL=http://localhost:5173
RESEND_API_KEY=xxx
FAST2SMS_API_KEY=xxx
```

Client example (`client/.env`):

```
VITE_API_URL=http://localhost:5000/api
```

4. Run locally (two terminals)

```bash
# terminal 1 - backend
cd server
npm run dev

# terminal 2 - frontend
cd client
npm run dev
```

Frontend: http://localhost:5173 — Backend API: http://localhost:5000/api

---

## Useful scripts

- Root (monorepo helpers): `npm run dev` (if configured)
- Server: `cd server && npm run dev`, `npm run start`
- Client: `cd client && npm run dev`, `npm run build`

Check `server/package.json` and `client/package.json` for full scripts.

---

## Deployment notes

- Frontend is deployed on Vercel; backend is deployed on Render in the current setup.
- Razorpay webhooks require a public endpoint; ensure the `RAZORPAY_KEY_*` secrets are configured in deployment environment.
- For production, set `NODE_ENV=production`, enable proper CORS origins, and secure environment secrets.

---

## Project structure

```
hotel-booking-system/
├─ client/           # React frontend
├─ server/           # Express backend (controllers, routes, models, middleware)
├─ docs/             # Documentation and guides
├─ uploads/          # Uploaded images (ignored in git)
```

---

## Contributing

Contributions and issues are welcome. Please read `CONTRIBUTING.md` for the code style and pull request process.

---

## Author

Built by Himanshu Kumar — https://github.com/cjhimanshu

---

If you'd like a shorter README variant, badges, or automatic status checks added, tell me what you'd prefer and I will update it.
