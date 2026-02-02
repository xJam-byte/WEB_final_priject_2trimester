const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middlewares/authMiddleware");
const { validate, schemas } = require("../middlewares/validateMiddleware");

router.use(protect);

router.post("/", validate(schemas.createTask), createTask);

router.get("/", validate(schemas.taskQuery, "query"), getTasks);

router.get("/:id", getTaskById);

router.put("/:id", validate(schemas.updateTask), updateTask);

router.delete("/:id", deleteTask);

module.exports = router;
