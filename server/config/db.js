const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Temporarily hardcoded for testing
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';
    console.log('Connecting to MongoDB with URI:', mongoURI);
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;