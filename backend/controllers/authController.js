const jwt = require("jsonwebtoken");
const asyncHandler = require("../middleware/asyncHandler");

// Mock users for testing without MongoDB
const mockUsers = [
  {
    _id: "admin123",
    name: "Admin User",
    email: "admin@example.com",
    password: "123456", // In production, this would be hashed
    role: "admin"
  },
  {
    _id: "user123",
    name: "John Doe",
    email: "user@example.com",
    password: "123456", // In production, this would be hashed
    role: "user"
  }
];

const generateToken = (id) => {
  return jwt.sign({ id }, "your_jwt_secret_key_here", {
    expiresIn: "7d",
  });
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const userExists = mockUsers.find(user => user.email === email);
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Create new user (in production, save to database)
  const newUser = {
    _id: Date.now().toString(),
    name,
    email,
    password, // In production, hash this password
    role: "user"
  };

  mockUsers.push(newUser);

  const token = generateToken(newUser._id);

  res.status(201).json({
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    token,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = mockUsers.find(u => u.email === email);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = generateToken(user._id);

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  });
});

const getMe = asyncHandler(async (req, res) => {
  // Mock user data - in production, get from database using req.user.id
  console.log("getMe called, req.user:", req.user);
  
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }
  
  const user = mockUsers.find(u => u._id === req.user._id);

  if (!user) {
    console.log("User not found for ID:", req.user.id);
    return res.status(404).json({ message: "User not found" });
  }

  // Remove password from response
  const { password, ...userWithoutPassword } = user;
  
  res.json(userWithoutPassword);
});

module.exports = {
  register,
  login,
  getMe,
};