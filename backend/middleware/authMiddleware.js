const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { isDatabaseEnabled } = require("../config/db");

const demoRoles = {
  "demo-admin": "admin",
  "demo-manager": "staff",
  "demo-volunteer": "volunteer"
};

const protect = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "change-this-secret");

    if (!isDatabaseEnabled()) {
      req.user = { _id: decoded.id, role: demoRoles[decoded.id] || "volunteer" };
      return next();
    }

    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

module.exports = { protect };
