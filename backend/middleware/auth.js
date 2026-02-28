const jwt = require("jsonwebtoken");

// Mock users for testing without MongoDB
const mockUsers = [
  {
    _id: "admin123",
    name: "Admin User",
    email: "admin@example.com",
    password: "123456",
    role: "admin"
  },
  {
    _id: "user123",
    name: "John Doe",
    email: "user@example.com",
    password: "123456",
    role: "user"
  }
];

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, "your_jwt_secret_key_here");
      
      // Mock user lookup - in production, use database
      const user = mockUsers.find(u => u._id === decoded.id);
      
      if (!user) {
        console.log("User not found for ID:", decoded.id);
        return res.status(401).json({ message: "Not authorized, token failed" });
      }
      
      req.user = user;
      next();
    } catch (error) {
      console.log("JWT verification error:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

module.exports = { protect, admin };