# 🏨 Hotel Booking System

A full-stack hotel booking application with integrated payment processing, user authentication, and admin management capabilities.

## 🚀 Overview

This is a modern hotel booking system built with the MERN stack (MongoDB, Express.js, React, Node.js) that allows users to browse available rooms, make reservations, and process payments online. Administrators can manage rooms, view bookings, and track revenue through an intuitive dashboard.

### ✨ Key Features

- **User Authentication** - Secure registration and login with JWT tokens
- **Room Browsing** - View available hotel rooms with images, descriptions, and pricing
- **Real-time Booking** - Check room availability and make instant reservations
- **Payment Integration** - Razorpay payment gateway for secure online transactions
- **Admin Dashboard** - Manage rooms, view all bookings, and monitor occupancy
- **Booking Management** - Users can view their booking history and status
- **Image Uploads** - Admin can upload room images with automatic file handling
- **Responsive Design** - Mobile-friendly interface built with React and Tailwind CSS

---

## 🛠️ Tech Stack

### Frontend

- **React** - UI library for building interactive interfaces
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Material-UI** - React component library
- **Axios** - HTTP client for API requests

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Razorpay** - Payment gateway integration
- **Multer** - File upload handling
- **bcryptjs** - Password hashing

---

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** account (MongoDB Atlas recommended)
- **Razorpay** account for payment processing (test credentials for development)

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd hotel-booking-system
```

### 2. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Variables

Create `.env` files in both `server/` and `client/` directories:

#### Server (.env)

```env
# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/hotel-booking

# Authentication
JWT_SECRET=your_jwt_secret_key_here

# Payment Gateway
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

# Server Configuration
PORT=5000
NODE_ENV=development
```

#### Client (.env)

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Razorpay (public key only)
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 4. Configure MongoDB

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string and replace `<username>` and `<password>`
4. Add your IP address to the whitelist (or allow access from anywhere for development)

### 5. Configure Razorpay

1. Sign up at [Razorpay](https://razorpay.com/)
2. Get your test API keys from the dashboard
3. Add keys to your `.env` files
4. See [docs/razorpay-integration.md](docs/razorpay-integration.md) for detailed setup

---

## 🚀 Running the Application

### Development Mode

Run both frontend and backend concurrently:

```bash
# Terminal 1 - Start backend server
cd server
npm run dev

# Terminal 2 - Start frontend development server
cd client
npm run dev
```

The application will be available at:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

### Production Build

```bash
# Build frontend for production
cd client
npm run build

# Start backend in production mode
cd ../server
npm start
```

---

## 📁 Project Structure

```
hotel-booking-system/
├── client/                    # React frontend
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── assets/          # Images, fonts, etc.
│   │   ├── components/      # Reusable React components
│   │   │   ├── AdminRoute.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/         # React Context API
│   │   │   └── AuthContext.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── AddRoom.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Booking.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MyBookings.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Rooms.jsx
│   │   ├── services/        # API service layer
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                   # Node.js backend
│   ├── controllers/         # Request handlers
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── paymentController.js
│   │   └── roomController.js
│   ├── middleware/          # Custom middleware
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/              # Mongoose schemas
│   │   ├── Booking.js
│   │   ├── Room.js
│   │   └── User.js
│   ├── routes/              # API routes
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── roomRoutes.js
│   ├── uploads/             # Uploaded room images
│   ├── utils/               # Utility functions
│   │   └── upload.js
│   ├── server.js            # Entry point
│   └── package.json
│
├── docs/                     # Documentation
│   ├── deployment-guide.md
│   ├── razorpay-integration.md
│   └── vercel-setup.md
│
├── .gitignore
├── vercel.json              # Vercel deployment config
├── package.json             # Root package.json
└── README.md
```

---

## 🌐 Deployment

This application can be deployed as a monorepo or with separate deployments for frontend and backend.

### Option 1: Monorepo Deployment (Vercel)

See [docs/vercel-setup.md](docs/vercel-setup.md) for detailed Vercel deployment instructions.

Quick steps:

1. Push code to GitHub
2. Import project to Vercel
3. Configure environment variables
4. Deploy

### Option 2: Separate Deployments

**Frontend** (Vercel/Netlify):

- Deploy the `client/` folder
- Set `VITE_API_URL` to your backend URL

**Backend** (Render/Railway/Heroku):

- Deploy the `server/` folder
- Configure environment variables
- Update CORS settings

See [docs/deployment-guide.md](docs/deployment-guide.md) for comprehensive deployment options.

---

## 🔐 Security Notes

- Never commit `.env` files to version control
- Use strong JWT secrets in production
- Enable MongoDB network access restrictions
- Use HTTPS in production
- Implement rate limiting for API endpoints
- Validate and sanitize all user inputs

---

## 📸 Screenshots

_(Add screenshots of your application here)_

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [cj_ License]

---

## 👤 Author

**Your Name**

- GitHub:[Himanshu kumar] https://github.com/cjhimanshu
- LinkedIn: [Himanshu kumar] www.linkedin.com/in/himanshu-kumar-02ab40249


---

## 🙏 Acknowledgments

- [Razorpay](https://razorpay.com/) for payment processing
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for database hosting
- [Unsplash](https://unsplash.com/) for placeholder images

---

**Made with ❤️ using the MERN Stack**
