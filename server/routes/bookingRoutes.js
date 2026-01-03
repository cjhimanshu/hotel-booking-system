const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createBooking,
  getUserBookings,
  cancelBooking
} = require("../controllers/bookingController");

router.post("/", protect, createBooking);
router.get("/user", protect, getUserBookings);
router.delete("/:id", protect, cancelBooking);

module.exports = router;
