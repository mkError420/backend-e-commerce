const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mkshop';
    console.log('Attempting to connect to MongoDB with URI:', mongoUri ? '***configured***' : 'undefined');
    
    if (!mongoUri) {
      console.error('MONGODB_URI is not defined in environment variables');
      console.log('Please check your .env file and ensure MONGODB_URI is set');
      process.exit(1);
    }
    
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error);
    console.log('Please ensure MongoDB is running and accessible');
    process.exit(1);
  }
};

module.exports = connectDB;