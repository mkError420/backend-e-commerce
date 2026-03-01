const jwt = require("jsonwebtoken");
const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, "your_jwt_secret_key_here", {
    expiresIn: "7d",
  });
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists in database
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Create new user in database
  const user = await User.create({
    name,
    email,
    password, // In production, hash this password
  });

  const token = generateToken(user._id);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email in database (include password for comparison)
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = generateToken(user._id);

  // Return user without password
  const userWithoutPassword = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  res.json({
    ...userWithoutPassword,
    token,
  });
});

const getMe = asyncHandler(async (req, res) => {
  // Get user from database using req.user.id
  console.log("getMe called, req.user:", req.user);
  
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }
  
  // User is already attached by auth middleware (without password), so return it
  res.json(req.user);
});

module.exports = {
  register,
  login,
  getMe,
};