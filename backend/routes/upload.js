const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(file.originalname.toLowerCase());
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

// @route   POST /api/upload/image
// @desc    Upload single image
router.post('/image', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'mkshop',
          transformation: [
            { quality: 'auto', fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        size: result.bytes,
        format: result.format
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

// @route   POST /api/upload/images
// @desc    Upload multiple images
router.post('/images', protect, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const uploadPromises = req.files.map(file => 
      new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'mkshop',
            transformation: [
              { quality: 'auto', fetch_format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(file.buffer);
      })
    );

    const results = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      data: results.map(result => ({
        url: result.secure_url,
        public_id: result.public_id,
        size: result.bytes,
        format: result.format
      }))
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

// @route   DELETE /api/upload/:public_id
// @desc    Delete image from Cloudinary
router.delete('/:public_id', protect, async (req, res) => {
  try {
    const { public_id } = req.params;

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === 'ok') {
      res.status(200).json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Image not found or already deleted'
      });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message
    });
  }
});

// @route   POST /api/upload/product-images
// @desc    Upload product images with thumbnail generation
router.post('/product-images', protect, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const uploadPromises = req.files.map((file, index) => {
      const isThumbnail = index === 0; // First image is thumbnail
      
      return new Promise((resolve, reject) => {
        const transformations = isThumbnail 
          ? [
              { width: 800, height: 800, crop: 'fill', quality: 'auto', fetch_format: 'auto' },
              { width: 400, height: 400, crop: 'fill', quality: 'auto', fetch_format: 'auto' }
            ]
          : [
              { width: 800, height: 800, crop: 'fill', quality: 'auto', fetch_format: 'auto' }
            ];

        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'mkshop/products',
            transformation: transformations[0]
          },
          (error, result) => {
            if (error) reject(error);
            else {
              resolve({
                url: result.secure_url,
                public_id: result.public_id,
                size: result.bytes,
                format: result.format,
                isThumbnail
              });
            }
          }
        ).end(file.buffer);
      });
    });

    const results = await Promise.all(uploadPromises);

    // Separate thumbnail and other images
    const thumbnail = results.find(img => img.isThumbnail);
    const images = results.filter(img => !img.isThumbnail);

    res.status(200).json({
      success: true,
      message: 'Product images uploaded successfully',
      data: {
        thumbnail: thumbnail?.url || results[0]?.url,
        images: results.map(img => ({
          url: img.url,
          public_id: img.public_id
        }))
      }
    });
  } catch (error) {
    console.error('Product images upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload product images',
      error: error.message
    });
  }
});

module.exports = router;
