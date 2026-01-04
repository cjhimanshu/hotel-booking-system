const router = require("express").Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  createBooking,
  getUserBookings,
  cancelBooking,
  getAllBookings,
} = require("../controllers/bookingController");

router.post("/", protect, createBooking);
router.get("/user", protect, getUserBookings);
router.get("/all", protect, admin, getAllBookings);
router.delete("/:id", protect, cancelBooking);

module.exports = router;
