const mongoose = require("mongoose");

const resetDatabase = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/mk-ecommerce');
    console.log("MongoDB Connected");
    
    // Drop the entire database
    await mongoose.connection.db.dropDatabase();
    console.log("Database dropped successfully");
    
    await mongoose.connection.close();
    console.log("Connection closed");
  } catch (error) {
    console.error("Error resetting database:", error);
  }
};

resetDatabase();
