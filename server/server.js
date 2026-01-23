const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.json({ message: "Hotel Booking API is running" });
});

console.log("Attempting to connect to MongoDB...");
console.log("MONGO_URI:", process.env.MONGO_URI ? "Set" : "NOT SET");

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    console.error("Full error:", err);
  });

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));

try {
  app.use("/api/payment", require("./routes/paymentRoutes"));
  console.log("Payment routes loaded successfully");
} catch (error) {
  console.error("Error loading payment routes:", error.message);
}

// For Vercel serverless
if (process.env.VERCEL) {
  module.exports = app;
} else {
  // For local development
  const server = app.listen(process.env.PORT || 5000, () =>
    console.log(`Server running on port ${process.env.PORT || 5000}`),
  );

  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
  });
}
