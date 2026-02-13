const User = require("../models/User");
const Task = require("../models/Task");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    await Task.deleteMany({ user: user._id });

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User and their tasks removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({})
      .populate("user", "username email")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getAllTasks,
};
