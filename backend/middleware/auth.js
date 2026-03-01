const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, "your_jwt_secret_key_here");
      
      // Use real database user lookup
      const user = await User.findById(decoded.id).select("-password");
      
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