const User = require("../models/User");
const { asyncHandler, ApiError } = require("../middlewares/errorMiddleware");

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.json({
    success: true,
    data: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { username, email } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if new email is already taken by another user
  if (email && email.toLowerCase() !== user.email) {
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      throw new ApiError(400, "Email is already in use");
    }
    user.email = email.toLowerCase();
  }

  if (username) {
    user.username = username;
  }

  await user.save();

  res.json({
    success: true,
    message: "Profile updated successfully",
    data: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

module.exports = { getProfile, updateProfile };
