const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createOrder,
  verifyPayment,
  getRazorpayKey,
} = require("../controllers/paymentController");

router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);
router.get("/key", getRazorpayKey);

module.exports = router;
