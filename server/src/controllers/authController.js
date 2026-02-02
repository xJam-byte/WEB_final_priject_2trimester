const jwt = require("jsonwebtoken");
const User = require("../models/User");
const emailService = require("../services/email.service");
const { asyncHandler, ApiError } = require("../middlewares/errorMiddleware");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(400, "User with this email already exists");
  }

  const user = await User.create({
    username,
    email: email.toLowerCase(),
    password,
  });

  emailService.sendWelcomeEmail(user).catch((err) => {
    console.error("Failed to send welcome email:", err.message);
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: "Registration successful",
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password",
  );

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user._id);

  res.json({
    success: true,
    message: "Login successful",
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    },
  });
});

module.exports = { register, login };
