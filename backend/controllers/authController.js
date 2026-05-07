const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { isDatabaseEnabled } = require("../config/db");

const demoUsers = [
  {
    _id: "demo-admin",
    name: "Mohammed Hafeez",
    email: "admin@sevafoundation.test",
    password: "admin123",
    role: "admin",
    title: "Owner & Executive Director"
  },
  {
    _id: "demo-manager",
    name: "Amaan Khan",
    email: "manager@sevafoundation.test",
    password: "manager123",
    role: "staff",
    title: "Program Manager"
  },
  {
    _id: "demo-volunteer",
    name: "Sana Ahmed",
    email: "volunteer@sevafoundation.test",
    password: "volunteer123",
    role: "volunteer",
    title: "Field Volunteer"
  }
];

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  title: user.title || "Team Member"
});

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }

  if (!isDatabaseEnabled()) {
    const user = { _id: Date.now().toString(), name, email, role: role || "volunteer" };
    return res.status(201).json({ user: publicUser(user), token: generateToken(user._id) });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  const user = await User.create({ name, email, password, role });

  return res.status(201).json({
    user: publicUser(user),
    token: generateToken(user._id)
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (!isDatabaseEnabled()) {
    const user = demoUsers.find((account) => account.email === email && account.password === password);
    if (!user) {
      return res.status(401).json({ message: "Choose one of the demo credentials shown on the login page" });
    }

    return res.json({ user: publicUser(user), token: generateToken(user._id) });
  }

  const user = await User.findOne({ email });
  const passwordMatches = user ? await user.matchPassword(password) : false;

  if (!user || !passwordMatches) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  return res.json({ user: publicUser(user), token: generateToken(user._id) });
};

const getCurrentUser = async (req, res) => {
  if (!isDatabaseEnabled()) {
    const user = demoUsers.find((account) => account._id === req.user._id) || demoUsers[0];
    return res.json(publicUser(user));
  }

  return res.json(publicUser(req.user));
};

const getDemoCredentials = (req, res) => {
  res.json(demoUsers.map(({ name, email, password, role, title }) => ({ name, email, password, role, title })));
};

module.exports = { registerUser, loginUser, getDemoCredentials, getCurrentUser };
