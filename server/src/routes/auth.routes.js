const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { register, login } = require("../controllers/authController");
const { validate, schemas } = require("../middlewares/validateMiddleware");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many attempts, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(authLimiter);

router.post("/register", validate(schemas.register), register);

router.post("/login", validate(schemas.login), login);

module.exports = router;
