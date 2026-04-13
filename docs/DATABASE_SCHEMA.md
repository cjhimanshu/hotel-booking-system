# Database Schema Documentation

## User Model

```
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  phone: String,
  isAdmin: Boolean (default: false),
  emailVerified: Boolean (default: false),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Room Model

```
{
  _id: ObjectId,
  name: String (required),
  price: Number (required),
  category: String (enum: ['standard', 'deluxe', 'luxury']),
  description: String,
  image: String (URL),
  available: Boolean (default: true),
  capacity: Number (default: 2),
  amenities: [String],
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Booking Model

```
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  roomId: ObjectId (ref: 'Room', required),
  checkIn: Date (required),
  checkOut: Date (required),
  nights: Number,
  totalPrice: Number,
  paymentStatus: String (enum: ['pending', 'completed', 'cancelled']),
  paymentMethod: String (enum: ['razorpay', 'hotel']),
  status: String (enum: ['active', 'completed', 'cancelled']),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Indices for Performance

- User: email (unique)
- Booking: userId, roomId, checkIn, checkOut
- Room: category, available
