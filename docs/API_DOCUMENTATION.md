# API Endpoints Documentation

## Authentication Endpoints

### Register User
- **POST** `/api/auth/register`
- **Body**: `{ email, password, name, phone }`
- **Response**: `{ success, message, token }`

### Login User
- **POST** `/api/auth/login`
- **Body**: `{ email, password }`
- **Response**: `{ success, message, token, user }`

## Room Endpoints

### Get All Rooms
- **GET** `/api/rooms`
- **Query**: `?category=luxury&page=1`
- **Response**: `{ success, data: [rooms] }`

### Create Room (Admin)
- **POST** `/api/rooms`
- **Headers**: `Authorization: Bearer token`
- **Body**: `{ name, price, category, description, image }`
- **Response**: `{ success, data: room }`

## Booking Endpoints

### Get User Bookings
- **GET** `/api/bookings`
- **Headers**: `Authorization: Bearer token`
- **Response**: `{ success, data: [bookings] }`

### Create Booking
- **POST** `/api/bookings`
- **Headers**: `Authorization: Bearer token`
- **Body**: `{ roomId, checkIn, checkOut }`
- **Response**: `{ success, data: booking }`

## Payment Endpoints

### Create Razorpay Order
- **POST** `/api/payments/create-order`
- **Headers**: `Authorization: Bearer token`
- **Body**: `{ bookingId, amount }`
- **Response**: `{ success, orderId }`

### Verify Payment
- **POST** `/api/payments/verify`
- **Headers**: `Authorization: Bearer token`
- **Body**: `{ orderId, paymentId, signature }`
- **Response**: `{ success, message }`

## Health Check Endpoint

### Server Health
- **GET** `/api/health`
- **Response**: `{ status, timestamp, uptime, environment }`
