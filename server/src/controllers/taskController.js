const Task = require("../models/Task");
const User = require("../models/User");
const emailService = require("../services/email.service");
const { asyncHandler, ApiError } = require("../middlewares/errorMiddleware");

const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, dueDate } = req.body;

  const task = await Task.create({
    title,
    description,
    status: status || false,
    dueDate: dueDate || null,
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: task,
  });
});

const getTasks = asyncHandler(async (req, res) => {
  const { status, sort } = req.query;

  const query = { user: req.user._id };

  if (status !== undefined) {
    query.status = status === "true";
  }

  let sortObj = { createdAt: -1 };
  if (sort) {
    const sortField = sort.startsWith("-") ? sort.substring(1) : sort;
    const sortOrder = sort.startsWith("-") ? -1 : 1;
    sortObj = { [sortField]: sortOrder };
  }

  const tasks = await Task.find(query).sort(sortObj);

  res.json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (
    task.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Not authorized to access this task");
  }

  res.json({
    success: true,
    data: task,
  });
});

const updateTask = asyncHandler(async (req, res) => {
  const { title, description, status, dueDate } = req.body;

  let task = await Task.findById(req.params.id);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (
    task.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Not authorized to update this task");
  }

  const wasCompleted = task.status;
  const isBeingCompleted = status === true && !wasCompleted;

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (status !== undefined) task.status = status;
  if (dueDate !== undefined) task.dueDate = dueDate;

  await task.save();

  if (isBeingCompleted) {
    const taskOwner = await User.findById(task.user);
    if (taskOwner) {
      emailService.sendTaskCompletedEmail(taskOwner, task).catch((err) => {
        console.error("Failed to send task completed email:", err.message);
      });
    }
  }

  res.json({
    success: true,
    message: "Task updated successfully",
    data: task,
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (
    task.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Not authorized to delete this task");
  }

  await Task.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "Task deleted successfully",
  });
});

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
