# Project README

## Hotel Booking System

A comprehensive hotel booking application built with the MERN stack, featuring real-time bookings, payment processing with Razorpay, and administrative capabilities.

### Live Demo
🌐 [Live Application](https://hotel-booking-system-eight-self.vercel.app)

### Features

✨ **User Features**
- User authentication with JWT
- Email OTP verification
- Browse and filter rooms by category
- Real-time booking management
- Online payment with Razorpay (or cash at hotel)
- Booking history
- User profile management

⚙️ **Admin Features**
- Add/edit/delete rooms
- Upload room images
- View all bookings
- Revenue statistics
- Manage users

### Tech Stack

```
Frontend: React, Vite, Tailwind CSS, Axios, React Router
Backend: Node.js, Express, MongoDB, Mongoose, JWT
Payments: Razorpay
Email: Resend API
Hosting: Vercel (Frontend), Render (Backend)
```

### Project Structure

```
hotel-booking-system/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Global state
│   │   └── services/    # API calls
│   └── package.json
├── server/              # Express backend
│   ├── controllers/     # Business logic
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Helper functions
│   └── package.json
├── docs/                # Documentation
└── scripts/             # Utility scripts
```

### Quick Start

#### Prerequisites
- Node.js 16+
- MongoDB Atlas account
- Razorpay account (for payments)

#### Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/cjhimanshu/hotel-booking-system
   cd hotel-booking-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd server && npm install
   cd ../client && npm install
   ```

3. **Set up environment variables**
   ```bash
   cp server/.env.example server/.env
   # Edit server/.env with your credentials
   ```

4. **Start development**
   ```bash
   # Terminal 1: Backend
   cd server && npm run dev

   # Terminal 2: Frontend
   cd client && npm run dev
   ```

### API Endpoints

**Base URL**: `http://localhost:5000/api`

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user

#### Rooms
- `GET /rooms` - Get all rooms
- `POST /rooms` - Create room (Admin)
- `DELETE /rooms/:id` - Delete room (Admin)

#### Bookings
- `GET /bookings` - Get user bookings
- `POST /bookings` - Create booking
- `PUT /bookings/:id` - Update booking
- `DELETE /bookings/:id` - Cancel booking

#### Payments
- `POST /payments/create-order` - Create Razorpay order
- `POST /payments/verify` - Verify payment

See [API Documentation](./docs/API_DOCUMENTATION.md) for more details.

### Documentation

📚 **Available Guides**
- [Getting Started](./docs/GETTING_STARTED.md) - Development setup
- [API Documentation](./docs/API_DOCUMENTATION.md) - Endpoint reference
- [Database Schema](./docs/DATABASE_SCHEMA.md) - Data models
- [Code Style Guide](./CODE_STYLE_GUIDE.md) - Coding standards
- [Security Guide](./docs/SECURITY_GUIDE.md) - Best practices
- [Deployment Guide](./docs/deployment-guide.md) - Production setup
- [Troubleshooting](./docs/TROUBLESHOOTING.md) - Common issues

### Deployment

**Frontend**: Deployed on Vercel
**Backend**: Deployed on Render

See [Deployment Guide](./docs/deployment-guide.md) for detailed instructions.

### Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### License

MIT License - see LICENSE file for details.

### Support

For issues or questions:
1. Check [Troubleshooting Guide](./docs/TROUBLESHOOTING.md)
2. Open an issue on GitHub
3. Contact the maintainer

### Author

**Himanshu Kumar**
- GitHub: [@cjhimanshu](https://github.com/cjhimanshu)

---

Made with ❤️ to learn real-world booking systems.
