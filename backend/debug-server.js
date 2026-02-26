const express = require('express');
const mongoose = require('mongoose');

console.log('🔍 Debug: Starting server with basic setup...');

// Basic express setup without dependencies first
const app = express();

app.use(express.json());

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date() });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'MK Shop Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Try to connect to MongoDB with detailed error logging
const connectToMongoDB = async () => {
  try {
    console.log('🔍 Debug: Attempting MongoDB connection...');
    console.log('🔍 Debug: MONGODB_URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/mkshop');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mkshop', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Debug: MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Debug: MongoDB connection failed:', error.message);
    console.error('❌ Debug: Full error:', error);
    return false;
  }
};

// Start server with error handling
const startServer = () => {
  const PORT = process.env.PORT || 5000;
  
  try {
    app.listen(PORT, async () => {
      console.log(`🚀 Debug: Server started on port ${PORT}`);
      console.log(`🔍 Debug: Environment variables loaded:`);
      console.log('  - PORT:', PORT);
      console.log('  - MONGODB_URI:', process.env.MONGODB_URI || 'Not set');
      console.log('  - JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
      console.log('  - NODE_ENV:', process.env.NODE_ENV || 'development');
      
      // Try to connect to MongoDB after server starts
      const connected = await connectToMongoDB();
      if (!connected) {
        console.log('⚠️ Debug: Server running but MongoDB failed - this may cause GOAWAY errors');
      }
    });
  } catch (error) {
    console.error('❌ Debug: Failed to start server:', error);
  }
};

// Start the server
startServer();
