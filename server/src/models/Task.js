const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    status: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Task must belong to a user"],
    },
  },
  {
    timestamps: true,
  },
);

taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, dueDate: 1 });

module.exports = mongoose.model("Task", taskSchema);
