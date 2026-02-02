const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const { validate, schemas } = require("../middlewares/validateMiddleware");

router.use(protect);

router.get("/profile", getProfile);

router.put("/profile", validate(schemas.updateProfile), updateProfile);

module.exports = router;
