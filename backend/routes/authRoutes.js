const express = require("express");
const { registerUser, loginUser, getDemoCredentials, getCurrentUser } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/demo-credentials", getDemoCredentials);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getCurrentUser);

module.exports = router;
