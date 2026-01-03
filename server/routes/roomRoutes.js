const router = require("express").Router();
const upload = require("../utils/upload");
const { protect, admin } = require("../middleware/authMiddleware");
const {
  createRoom,
  getRooms,
  getRoomById,
  deleteRoom,
  updateRoomImages,
} = require("../controllers/roomController");

router.post("/", protect, admin, upload.array("images"), createRoom);
router.get("/", getRooms);
router.get("/:id", getRoomById);
router.put(
  "/:id/images",
  protect,
  admin,
  upload.array("images"),
  updateRoomImages
);
router.delete("/:id", protect, admin, deleteRoom);

module.exports = router;
