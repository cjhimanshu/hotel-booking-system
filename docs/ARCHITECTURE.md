# Architecture Overview

## System Design

```
┌─────────────────────────────────────────────────────────────┐
│                     Client (React + Vite)                   │
│          Vercel Deployment                                  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP(S) API Calls
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    API Layer (Express)                       │
│     Health Check, Auth, Rooms, Bookings, Payments           │
│          Render Deployment                                  │
└────────────────────────┬────────────────────────────────────┘
                         │ Mongoose ODM
┌────────────────────────▼────────────────────────────────────┐
│                  Database (MongoDB Atlas)                    │
│    Collections: Users, Rooms, Bookings, Payments            │
└─────────────────────────────────────────────────────────────┘
```

## Request Flow

1. **Client Request**: Browser sends HTTP request to API
2. **Middleware Stack**: Request passes through:
   - Request logging
   - Input sanitization
   - Rate limiting
   - Authentication (if required)
3. **Route Handler**: Express routes request to appropriate controller
4. **Business Logic**: Controller processes request and queries database
5. **Response**: Standardized response is sent back to client

## Component Architecture

### Frontend
```
src/
├── components/        # Reusable UI components
├── pages/            # Page-level components
├── context/          # Global state (AuthContext)
├── services/         # API service layer
└── assets/           # Images, icons
```

### Backend
```
server/
├── controllers/      # Business logic
├── models/          # MongoDB schemas
├── routes/          # API endpoint definitions
├── middleware/      # Request processing
├── utils/           # Helper functions
└── uploads/         # File storage
```

## Data Models

### User
- Email (unique, indexed)
- Password (hashed)
- Name, Phone
- Admin flag
- Email verified flag

### Room
- Name, Price, Category
- Description, Image
- Capacity, Amenities
- Availability

### Booking
- User ID, Room ID
- Check-in, Check-out dates
- Total price, Payment status
- Booking status

## Security Layers

1. **Authentication**: JWT tokens
2. **Authorization**: Role-based (admin/user)
3. **Input Validation**: All user inputs validated
4. **Rate Limiting**: Prevent brute force attacks
5. **HTTPS**: Encrypted communication
6. **CORS**: Cross-origin request handling
