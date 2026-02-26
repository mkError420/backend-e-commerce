const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Test endpoint
router.get('/test', protect, (req, res) => {
  console.log('Upload test endpoint hit');
  res.status(200).json({
    success: true,
    message: 'Upload endpoint is working',
    user: req.user?.email || 'Unknown user'
  });
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
const productsDir = path.join(uploadsDir, 'products');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true });
}

// Configure multer for disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productsDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed'));
  }
};

// Initialize upload
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter
});

// @route   POST /api/upload-simple/image
// @desc    Upload single image (simple version)
router.post('/image', protect, upload.single('image'), async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('File:', req.file);
    console.log('Body:', req.body);
    console.log('Headers:', req.headers);
    
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Create file URL (in production, this would be your domain)
    const fileUrl = `/uploads/products/${req.file.filename}`;
    console.log('File URL generated:', fileUrl);

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: fileUrl,
        public_id: req.file.filename,
        size: req.file.size,
        format: path.extname(req.file.originalname).substring(1)
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
});

// @route   POST /api/upload-simple/images
// @desc    Upload multiple images (simple version)
router.post('/images', protect, upload.array('images', 10), async (req, res) => {
  try {
    console.log('Multiple upload request received');
    console.log('Files:', req.files);
    console.log('Number of files:', req.files?.length);
    
    if (!req.files || req.files.length === 0) {
      console.log('No files uploaded');
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const uploadedImages = req.files.map(file => ({
      url: `/uploads/products/${file.filename}`,
      public_id: file.filename,
      size: file.size,
      format: path.extname(file.originalname).substring(1)
    }));

    console.log('Uploaded images:', uploadedImages);

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      data: uploadedImages
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message
    });
  }
});

module.exports = router;
