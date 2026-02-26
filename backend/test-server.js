const express = require('express');

console.log('🔍 Starting test server...');

const app = express();

app.use(express.json());

// Simple test endpoint
app.get('/api/test', (req, res) => {
  console.log('✅ Test endpoint hit!');
  res.json({ 
    message: 'Test server is working!',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', (req, res) => {
  console.log('✅ Health check hit!');
  res.json({ 
    status: 'OK', 
    message: 'Test server is running',
    timestamp: new Date().toISOString()
  });
});

// Login endpoint (simplified)
app.post('/api/auth/login', (req, res) => {
  console.log('✅ Login endpoint hit!');
  console.log('Request body:', req.body);
  
  const { email, password } = req.body;
  
  // Simple demo authentication
  if (email === 'admin@mkshop.com' && password === 'admin123') {
    console.log('✅ Login successful!');
    res.json({
      success: true,
      message: 'Login successful',
      token: 'demo-jwt-token',
      user: {
        id: '1',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@mkshop.com',
        role: 'admin'
      }
    });
  } else {
    console.log('❌ Login failed!');
    res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📊 Test endpoints:`);
  console.log(`   - http://localhost:${PORT}/api/test`);
  console.log(`   - http://localhost:${PORT}/api/health`);
  console.log(`   - http://localhost:${PORT}/api/auth/login`);
  console.log('\n🔑 Demo credentials:');
  console.log('   Email: admin@mkshop.com');
  console.log('   Password: admin123');
});
