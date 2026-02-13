const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  getAllTasks,
} = require("../controllers/admin.controller");
const { protect } = require("../middlewares/authMiddleware");
const { requireAdmin } = require("../middlewares/roleMiddleware");

router.use(protect);
router.use(requireAdmin);

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.get("/tasks", getAllTasks);

module.exports = router;
