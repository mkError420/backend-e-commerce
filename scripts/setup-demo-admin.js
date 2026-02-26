const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

// Add backend node_modules to path
process.chdir(path.join(__dirname, '../backend'));
const User = require('./models/User');

// Demo admin credentials
const DEMO_ADMIN = {
  email: 'admin@mkshop.com',
  password: 'admin123',
  firstName: 'Admin',
  lastName: 'User',
  phone: '+8801234567890'
};

async function setupDemoAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mkshop');
    console.log('Connected to MongoDB');

    // Check if demo admin already exists
    const existingAdmin = await User.findOne({ email: DEMO_ADMIN.email });
    
    if (existingAdmin) {
      console.log('Demo admin already exists!');
      console.log('Email:', DEMO_ADMIN.email);
      console.log('Password:', DEMO_ADMIN.password);
      console.log('\nYou can use these credentials to login to admin dashboard.');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(DEMO_ADMIN.password, 12);

    // Create demo admin user
    const adminUser = new User({
      ...DEMO_ADMIN,
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      emailVerified: true
    });

    await adminUser.save();
    
    console.log('✅ Demo admin user created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('📧 Email:', DEMO_ADMIN.email);
    console.log('🔑 Password:', DEMO_ADMIN.password);
    console.log('\n🌐 Admin Dashboard: http://localhost:3000/admin');
    console.log('\n⚠️  Please change these credentials in production!');
    
  } catch (error) {
    console.error('❌ Error setting up demo admin:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the setup
setupDemoAdmin();
