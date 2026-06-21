# Hotel Booking System - Complete Inventory

## Executive Summary
This document provides a complete technical inventory of the Hotel Booking System, including all APIs, data models, user roles, feature modules, and payment workflows.

---

## 1. APIS (6 Total)

### 1.1 Authentication API (`/api/auth`)
- **POST** `/api/auth/register` - User registration
  - Input: `name`, `email`, `password`, `role` (optional)
  - Output: User object
  - Access: Public

- **POST** `/api/auth/login` - User login
  - Input: `email`, `password`, `role`
  - Output: JWT token, user object
  - Access: Public

- **GET** `/api/auth/profile` - Get user profile
  - Input: JWT token (Authorization header)
  - Output: User details
  - Access: Protected (Authenticated users)

- **POST** `/api/auth/forgot-password` - Request password reset
  - Input: `email`
  - Output: Success message, reset token sent to email
  - Access: Public

- **POST** `/api/auth/reset-password/:token` - Reset password with token
  - Input: `password`, `token` (in URL)
  - Output: Success message
  - Access: Public

**Total Auth Endpoints: 5**

### 1.2 Rooms API (`/api/rooms`)
- **POST** `/api/rooms` - Create new room
  - Input: `roomNumber`, `type`, `price`, `maxGuests`, `images` (file upload)
  - Output: Room object
  - Access: Protected + Admin Role

- **GET** `/api/rooms` - Get all rooms with filters
  - Input: Query parameters (pagination, filtering)
  - Output: Array of room objects
  - Access: Public

- **GET** `/api/rooms/:id` - Get room by ID
  - Input: Room ID (URL parameter)
  - Output: Room object
  - Access: Public

- **PUT** `/api/rooms/:id/images` - Update room images
  - Input: `images` (file upload), Room ID (URL parameter)
  - Output: Updated room object
  - Access: Protected + Admin Role

- **DELETE** `/api/rooms/:id` - Delete room
  - Input: Room ID (URL parameter)
  - Output: Success message
  - Access: Protected + Admin Role

**Total Room Endpoints: 5**

### 1.3 Bookings API (`/api/bookings`)
- **POST** `/api/bookings` - Create new booking
  - Input: `room`, `checkIn`, `checkOut`, `numberOfGuests`, `paymentMethod`, `guestDetails`, `totalPrice`
  - Output: Booking object
  - Access: Protected (Authenticated users)

- **GET** `/api/bookings/user` - Get user's bookings
  - Input: JWT token (Authorization header)
  - Output: Array of user's bookings
  - Access: Protected (Authenticated users)

- **GET** `/api/bookings/all` - Get all bookings (admin view)
  - Input: JWT token (Authorization header)
  - Output: Array of all bookings
  - Access: Protected + Admin Role

- **DELETE** `/api/bookings/:id` - Cancel booking
  - Input: Booking ID (URL parameter)
  - Output: Success message
  - Access: Protected (Authenticated users - owner or admin)

**Total Booking Endpoints: 4**

### 1.4 Payment API (`/api/payment`)
- **POST** `/api/payment/create-order` - Create Razorpay order
  - Input: `amount` (number), `currency` (optional, default: INR)
  - Output: Razorpay order object (with order_id, amount, currency)
  - Access: Protected (Authenticated users)

- **POST** `/api/payment/verify` - Verify payment signature
  - Input: `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`
  - Output: `{ success: true, paymentId }`
  - Access: Protected (Authenticated users)

- **GET** `/api/payment/key` - Get Razorpay public key
  - Input: None
  - Output: `{ key: RAZORPAY_KEY_ID }`
  - Access: Public

**Total Payment Endpoints: 3**

### 1.5 Verification API (`/api/verify`)
- **GET** `/api/verify/verified-contacts` - Get verified contact details
  - Input: JWT token (Authorization header)
  - Output: `{ verifiedEmail, verifiedPhone }`
  - Access: Protected (Authenticated users)

- **POST** `/api/verify/send-email-otp` - Send OTP to email
  - Input: `email` (optional, uses user's email if not provided)
  - Output: Success message
  - Access: Protected (Authenticated users)

- **POST** `/api/verify/verify-email-otp` - Verify email OTP
  - Input: `otp` (6-digit code)
  - Output: Success message, verified email stored
  - Access: Protected (Authenticated users)

- **POST** `/api/verify/send-phone-otp` - Send OTP to phone
  - Input: `phone` (optional, uses user's phone if not provided)
  - Output: Success message
  - Access: Protected (Authenticated users)

- **POST** `/api/verify/verify-phone-otp` - Verify phone OTP
  - Input: `otp` (6-digit code)
  - Output: Success message, verified phone stored
  - Access: Protected (Authenticated users)

**Total Verification Endpoints: 5**

### 1.6 Health Check API (`/api/health`)
- **GET** `/` or `/api/health` - Health check endpoint
  - Input: None
  - Output: `{ message: 'Hotel Booking API is running' }`
  - Access: Public

**Total Health Endpoints: 1**

### **GRAND TOTAL: 23 API Endpoints**

---

## 2. COLLECTIONS/MODELS (3 Total)

### 2.1 User Model
**Collection Name:** `users`

**Schema Fields:**
| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `_id` | ObjectId | Yes | Auto | MongoDB auto-generated |
| `name` | String | Yes | - | User's full name |
| `email` | String | Yes (Unique) | - | Email address, unique constraint |
| `password` | String | Yes | - | Hashed with bcryptjs (salt: 10) |
| `role` | String (Enum) | No | "user" | Values: `"user"`, `"admin"` |
| `resetPasswordToken` | String | No | null | Token for password reset |
| `resetPasswordExpires` | Date | No | null | Expiry time for reset token |
| `verifiedEmail` | String | No | null | Email after OTP verification |
| `verifiedPhone` | String | No | null | Phone number after OTP verification |
| `emailOtp` | String | No | null | OTP sent to email |
| `emailOtpExpiry` | Date | No | null | Expiry time for email OTP |
| `phoneOtp` | String | No | null | OTP sent to phone |
| `phoneOtpExpiry` | Date | No | null | Expiry time for phone OTP |

**Indexes:** `email` (unique)

**Use Case:** User account management, authentication, contact verification

---

### 2.2 Room Model
**Collection Name:** `rooms`

**Schema Fields:**
| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `_id` | ObjectId | Yes | Auto | MongoDB auto-generated |
| `roomNumber` | String | Yes | - | Unique room identifier (e.g., "101", "A-205") |
| `type` | String | Yes | - | Room type (e.g., "Single", "Double", "Deluxe", "Suite") |
| `price` | Number | Yes | - | Price per night in INR (paise) |
| `maxGuests` | Number | Yes | - | Maximum occupancy |
| `images` | [String] | No | [] | Array of image URLs (uploaded to /uploads) |
| `isAvailable` | Boolean | No | true | Room availability status |

**Indexes:** `roomNumber` (recommended)

**Use Case:** Room inventory management, bookings validation

---

### 2.3 Booking Model
**Collection Name:** `bookings`

**Schema Fields:**
| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `_id` | ObjectId | Yes | Auto | MongoDB auto-generated |
| `user` | ObjectId (Ref: User) | Yes | - | Reference to User document |
| `room` | ObjectId (Ref: Room) | Yes | - | Reference to Room document |
| `checkIn` | Date | Yes | - | Check-in date and time |
| `checkOut` | Date | Yes | - | Check-out date and time |
| `numberOfGuests` | Number | No | 1 | Number of guests |
| `totalPrice` | Number | Yes | - | Total booking cost in INR |
| `status` | String (Enum) | No | "pending" | Values: `"pending"`, `"confirmed"`, `"cancelled"`, `"completed"` |
| `paymentStatus` | String (Enum) | No | "pending" | Values: `"pending"`, `"paid"`, `"refunded"` |
| `paymentMethod` | String (Enum) | No | "razorpay" | Values: `"credit_card"`, `"debit_card"`, `"upi"`, `"net_banking"`, `"cash"`, `"razorpay"` |
| `guestDetails` | Object | No | {} | Contains: `name`, `email`, `phone`, `specialRequests` |
| `createdAt` | Date | Yes | Auto | Timestamp, auto-generated |
| `updatedAt` | Date | Yes | Auto | Timestamp, auto-updated |

**Indexes:** `user`, `room`, composite index on `room + status + checkIn + checkOut` (for conflict detection)

**Use Case:** Booking management, payment tracking, reservation history

---

## 3. ROLES (2 Total)

### 3.1 User Role
- **Name:** `user`
- **Description:** Guest/Customer role
- **Permissions:**
  - View all rooms and their details
  - Create bookings for any available room
  - View own bookings
  - Cancel own bookings
  - Update own profile
  - Verify email and phone
  - Make payments (access payment APIs)
  - Reset password
- **Cannot:**
  - Access admin dashboard
  - Create/update/delete rooms
  - View other users' bookings
  - View all bookings

### 3.2 Admin Role
- **Name:** `admin`
- **Description:** Hotel Administrator
- **Permissions:**
  - All user permissions +
  - View all rooms
  - Create new rooms
  - Update room details and images
  - Delete rooms
  - View all bookings
  - View all users (via bookings)
  - Access admin dashboard
  - Manage room availability status
  - View booking analytics
- **Cannot:**
  - Delete user accounts (data integrity)
  - Manually modify payment records

---

## 4. MODULES/FEATURES (9 Total)

### 4.1 Authentication Module
**Purpose:** User registration, login, and session management
- **Components:**
  - User registration (public)
  - User login with role-based access (public)
  - JWT token generation and validation
  - Password reset flow (forgot password → email link → reset)
  - Role verification during login
- **Frontend Pages:** `Login.jsx`, `Register.jsx`, `ForgotPassword.jsx`, `ResetPassword.jsx`
- **Backend:** `authController.js`, `authRoutes.js`

### 4.2 Room Management Module
**Purpose:** Room inventory and availability management
- **Components:**
  - Create rooms (admin only)
  - View all rooms (public)
  - View room details (public)
  - Update room images (admin only)
  - Delete rooms (admin only)
  - Upload room images to server
- **Frontend Pages:** `Rooms.jsx`, `AddRoom.jsx`
- **Backend:** `roomController.js`, `roomRoutes.js`, `Room.js` model

### 4.3 Booking Module
**Purpose:** Room reservations and booking management
- **Components:**
  - Create bookings with date conflict detection
  - View user bookings
  - View all bookings (admin)
  - Cancel bookings
  - Guest details capture (name, email, phone, special requests)
  - Automatic date validation
  - Guest capacity validation
- **Frontend Pages:** `Booking.jsx`, `MyBookings.jsx`
- **Backend:** `bookingController.js`, `bookingRoutes.js`, `Booking.js` model

### 4.4 Payment Module (Razorpay Integration)
**Purpose:** Secure payment processing
- **Components:**
  - Create Razorpay orders
  - Verify payment signatures (HMAC-SHA256)
  - Get Razorpay public key
  - Support for multiple payment methods (cards, UPI, net banking)
  - INR currency support
- **Frontend:** Payment form integration (likely in `Booking.jsx`)
- **Backend:** `paymentController.js`, `paymentRoutes.js`
- **External Service:** Razorpay Payment Gateway

### 4.5 Email Verification Module
**Purpose:** OTP-based email verification
- **Components:**
  - Send OTP to user email
  - Verify email OTP (typically 6-digit)
  - Store verified email in user profile
  - OTP expiry management
- **Frontend:** Verification UI component (likely in profile/settings)
- **Backend:** `verificationController.js`, OTP generation and email sending
- **External Service:** Email service (SMTP)

### 4.6 Phone Verification Module
**Purpose:** OTP-based phone verification
- **Components:**
  - Send OTP to user phone
  - Verify phone OTP
  - Store verified phone in user profile
  - OTP expiry management
- **Frontend:** Verification UI component
- **Backend:** `verificationController.js`, OTP generation and SMS sending
- **External Service:** SMS service (Twilio or similar)

### 4.7 Protected Routes Module
**Purpose:** Route-level access control
- **Components:**
  - `ProtectedRoute.jsx` - Ensures user is authenticated
  - `AdminRoute.jsx` - Ensures user is admin
  - JWT token validation
  - Redirect to login if unauthorized
- **Frontend:** `components/ProtectedRoute.jsx`, `components/AdminRoute.jsx`

### 4.8 Admin Dashboard Module
**Purpose:** Admin management interface
- **Components:**
  - View all bookings
  - View all rooms
  - Create/manage rooms
  - Analytics and statistics
  - User management
- **Frontend Pages:** `AdminDashboard.jsx`
- **Backend:** All admin-specific endpoints

### 4.9 Navigation Module
**Purpose:** Application navigation and UI
- **Components:**
  - Navbar with login/logout
  - Navigation based on user role
  - Authentication status display
  - Dynamic menu for admin vs user
- **Frontend:** `Navbar.jsx`

---

## 5. PAYMENT WORKFLOWS (1 Primary Workflow)

### 5.1 Razorpay Payment Workflow

**Overview:** Complete payment processing flow using Razorpay payment gateway with HMAC-SHA256 signature verification.

**Flow Diagram:**
```
User Makes Booking
    ↓
Calculate Total Price
    ↓
Request Payment Order [POST /api/payment/create-order]
    ├─ Amount (in paise)
    ├─ Currency (INR)
    └─ Receipt ID (timestamp-based)
    ↓
Razorpay Creates Order
    ├─ order_id
    ├─ amount
    └─ currency
    ↓
Frontend Displays Razorpay Payment Modal
    ├─ Get Public Key [GET /api/payment/key]
    ├─ Initialize Razorpay with order_id
    └─ User Selects Payment Method
    ↓
User Selects Payment Method
    ├─ Credit Card
    ├─ Debit Card
    ├─ UPI
    ├─ Net Banking
    └─ Other methods
    ↓
Razorpay Processes Payment
    ├─ Acquires authorization from bank/payment provider
    ├─ Returns payment_id on success
    └─ Generates signature
    ↓
Frontend Receives Payment Response
    ├─ razorpay_order_id
    ├─ razorpay_payment_id
    └─ razorpay_signature
    ↓
Verify Payment Signature [POST /api/payment/verify]
    ├─ Concatenate: order_id + "|" + payment_id
    ├─ Calculate HMAC-SHA256 using Razorpay secret
    ├─ Compare with received signature
    └─ Return success if match
    ↓
Update Booking Status
    ├─ paymentStatus: "paid"
    ├─ status: "confirmed"
    └─ paymentMethod: "razorpay"
    ↓
Send Confirmation Email to User
    ├─ Booking reference
    ├─ Hotel details
    ├─ Guest information
    └─ Check-in/out dates
    ↓
Workflow Complete
```

**Step-by-Step Details:**

1. **Order Creation**
   - Endpoint: `POST /api/payment/create-order`
   - Input: `amount` (in rupees, will be converted to paise)
   - Validation:
     - Amount must be positive number
     - Currency must be from supported list (currently only INR)
   - Output: Razorpay order object with `order_id`, `amount`, `currency`
   - Error Handling: Return 400 for invalid amount, 500 for server errors

2. **Payment Verification**
   - Endpoint: `POST /api/payment/verify`
   - Input: `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`
   - Security: HMAC-SHA256 signature verification
   - Algorithm:
     ```
     sign = razorpay_order_id + "|" + razorpay_payment_id
     expectedSign = HMAC-SHA256(sign, RAZORPAY_KEY_SECRET)
     isValid = (razorpay_signature === expectedSign)
     ```
   - Output on Success: `{ success: true, message, paymentId }`
   - Output on Failure: `{ success: false, message: "Invalid signature" }`
   - Error Handling: Return 400 for invalid signature, 500 for server errors

3. **Public Key Retrieval**
   - Endpoint: `GET /api/payment/key`
   - Purpose: Frontend needs public key to initialize Razorpay SDK
   - Output: `{ key: RAZORPAY_KEY_ID }`
   - Error: 500 if key not configured in environment

**Payment Methods Supported (via Razorpay):**
1. Credit Card
2. Debit Card
3. UPI (Unified Payments Interface)
4. Net Banking
5. Digital Wallets
6. Cash on Delivery (if configured)

**Booking Status Transitions:**
```
Initial: pending → (after payment) → confirmed → completed
                 → (if cancelled) → cancelled
```

**Payment Status Transitions:**
```
pending → paid → (if refund requested) → refunded
       → failed (if signature verification fails)
```

**Security Measures:**
1. HMAC-SHA256 signature verification (prevents tampering)
2. Server-side validation of payment
3. JWT authentication required for payment endpoints
4. Amount validation on server
5. Secure storage of Razorpay keys (environment variables)
6. No sensitive payment data stored in database

**Configuration Requirements:**
- `RAZORPAY_KEY_ID` - Public key for SDK initialization
- `RAZORPAY_KEY_SECRET` - Secret key for signature verification
- Both must be obtained from Razorpay dashboard

**Error Scenarios:**
1. **Invalid Amount:** Amount not a number or ≤ 0
2. **Unsupported Currency:** Currency other than INR
3. **Invalid Signature:** Payment signature doesn't match
4. **Missing Razorpay Key:** Configuration error
5. **Network Error:** Connection to Razorpay fails
6. **Unauthorized Access:** User not authenticated

---

## 6. ADDITIONAL TECHNICAL DETAILS

### Middleware Stack
1. **CORS Middleware** - Allow cross-origin requests from specified domains
2. **JSON Parser** - Parse incoming JSON requests
3. **Static File Server** - Serve uploaded room images
4. **Auth Middleware** - JWT token validation
5. **Admin Middleware** - Role-based access control
6. **Error Middleware** - Global error handling
7. **Sanitization Middleware** - Input sanitization
8. **Rate Limiting Middleware** - DDoS protection
9. **Request Logger Middleware** - API request logging
10. **Compression Middleware** - Response compression

### Database
- **Type:** MongoDB
- **Collections:** users, rooms, bookings
- **Connection:** Mongoose ODM
- **Validation:** Schema-based validation

### File Upload
- **Directory:** `/server/uploads`
- **Supported:** Room images
- **Middleware:** Multer for file handling
- **Location:** `/uploads/{filename}` accessible via static route

### Authentication
- **Method:** JWT (JSON Web Tokens)
- **Secret:** `JWT_SECRET` (environment variable)
- **Token Content:** `{ id, role }`
- **Expiry:** Not specified in code (depends on configuration)

### Email Service
- **Purpose:** Password reset, OTP delivery
- **Configuration:** SMTP settings in environment

### SMS Service
- **Purpose:** Phone OTP delivery
- **Provider:** To be configured

### Testing
- **Frontend Tests:** Vitest/Jest for React components
- **Test Files:** `*.test.jsx` in src/pages and src/context
- **Coverage:** Authentication, Booking, MyBookings pages

---

## 7. SUMMARY TABLE

| Category | Count | Items |
|----------|-------|-------|
| **APIs** | 23 | Auth (5), Rooms (5), Bookings (4), Payment (3), Verification (5), Health (1) |
| **Models** | 3 | User, Room, Booking |
| **Roles** | 2 | User, Admin |
| **Features** | 9 | Auth, Room Mgmt, Booking, Payment, Email Verify, Phone Verify, Routes, Dashboard, Navigation |
| **Payment Workflows** | 1 | Razorpay Integration |

---

## 8. ENVIRONMENT VARIABLES REFERENCE

**Required for Payment:**
- `RAZORPAY_KEY_ID` - Razorpay public key
- `RAZORPAY_KEY_SECRET` - Razorpay secret key

**Required for Authentication:**
- `JWT_SECRET` - JWT signing secret

**Required for Database:**
- `MONGO_URI` - MongoDB connection string

**Required for Email:**
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` - Email configuration

**Optional/Deployment:**
- `PORT` - Server port (default: 5000)
- `FRONTEND_URL` - Frontend URL for CORS
- `VERCEL` - Deployment platform flag

---

**Document Generated:** 2024  
**System:** Hotel Booking System v1.0
