const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/database");
const errorHandler = require("./middleware/errorHandler");

// Load environment variables
dotenv.config();

// Use hardcoded values temporarily since dotenv is not working
const port = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mkshop';

console.log('Using port:', port);
console.log('Using MONGODB_URI:', MONGODB_URI ? '***configured***' : 'undefined');

// Temporarily comment out database connection to test server startup
// connectDB();

const app = express();

// CORS configuration - must be first
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"], // Allow both ports
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.json({ message: "MK Shop API is running..." });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products-mock"));
app.use("/api/categories", require("./routes/categories-mock"));
app.use("/api/orders", require("./routes/orders-mock"));
app.use("/api/users", require("./routes/users"));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});