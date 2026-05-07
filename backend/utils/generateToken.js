const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "change-this-secret", {
    expiresIn: "30d"
  });
};

module.exports = generateToken;
