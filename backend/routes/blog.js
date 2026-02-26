const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'blog');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ success: false, message: 'File upload error: ' + error.message });
  } else if (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
  next();
});

// Mock blog posts data (in production, this would be in a database)
let blogPosts = [
  {
    _id: '1',
    title: 'Getting Started with E-commerce',
    excerpt: 'Learn the basics of setting up your online store with our comprehensive guide.',
    content: 'Full content of the blog post goes here...',
    category: 'tutorial',
    status: 'published',
    image: '/uploads/blog/sample1.jpg',
    tags: ['e-commerce', 'tutorial', 'getting-started'],
    author: {
      name: 'Admin User',
      avatar: '/images/admin-avatar.png',
      bio: 'Blog administrator'
    },
    publishedAt: new Date('2024-01-15').toISOString(),
    readTime: '5 min read',
    featured: true,
    likes: 42,
    comments: 8
  },
  {
    _id: '2',
    title: 'Top 10 Business Strategies',
    excerpt: 'Discover the most effective business strategies for growing your online presence.',
    content: 'Full content of the blog post goes here...',
    category: 'business',
    status: 'published',
    image: '/uploads/blog/sample2.jpg',
    tags: ['business', 'strategy', 'growth'],
    author: {
      name: 'Admin User',
      avatar: '/images/admin-avatar.png',
      bio: 'Blog administrator'
    },
    publishedAt: new Date('2024-01-10').toISOString(),
    readTime: '8 min read',
    featured: false,
    likes: 28,
    comments: 3
  },
  {
    _id: '3',
    title: 'Latest Technology Trends',
    excerpt: 'Stay updated with the latest technology trends shaping the future.',
    content: 'Full content of the blog post goes here...',
    category: 'technology',
    status: 'draft',
    image: '/uploads/blog/sample3.jpg',
    tags: ['technology', 'trends', 'innovation'],
    author: {
      name: 'Admin User',
      avatar: '/images/admin-avatar.png',
      bio: 'Blog administrator'
    },
    publishedAt: new Date('2024-01-05').toISOString(),
    readTime: '6 min read',
    featured: false,
    likes: 15,
    comments: 2
  }
];

// Middleware to verify admin authentication
const verifyAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }
  
  try {
    // In production, verify token with JWT
    // For now, we'll just check if token exists
    if (token.length > 10) {
      next();
    } else {
      res.status(401).json({ success: false, message: 'Invalid token.' });
    }
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

// GET all blog posts
router.get('/', verifyAdmin, (req, res) => {
  try {
    const { category, status, search } = req.query;
    let filteredPosts = [...blogPosts];
    
    // Filter by category
    if (category && category !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.category === category);
    }
    
    // Filter by status
    if (status && status !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.status === status);
    }
    
    // Filter by search term
    if (search) {
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        post.content.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    res.json({ 
      success: true, 
      posts: filteredPosts,
      total: filteredPosts.length
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET single blog post
router.get('/:id', verifyAdmin, (req, res) => {
  try {
    const post = blogPosts.find(p => p._id === req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    
    res.json({ success: true, post });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST create new blog post
router.post('/', verifyAdmin, upload.single('image'), (req, res) => {
  try {
    console.log('POST /api/blog - Request body:', req.body);
    console.log('POST /api/blog - File:', req.file);
    
    const { title, excerpt, content, category, status, tags, author, publishedAt, readTime, featured, likes, comments } = req.body;
    
    if (!title || !excerpt || !content) {
      return res.status(400).json({ success: false, message: 'Title, excerpt, and content are required' });
    }
    
    const newPost = {
      _id: Date.now().toString(),
      title,
      excerpt,
      content,
      category: category || 'technology',
      status: status || 'draft',
      image: req.file ? `/uploads/blog/${req.file.filename}` : null,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      author: author ? JSON.parse(author) : {
        name: 'Admin User',
        avatar: '/images/admin-avatar.png',
        bio: 'Blog administrator'
      },
      publishedAt: publishedAt || new Date().toISOString(),
      readTime: readTime || '5 min read',
      featured: featured === 'true',
      likes: parseInt(likes) || 0,
      comments: parseInt(comments) || 0
    };
    
    blogPosts.unshift(newPost);
    
    console.log('POST /api/blog - New post created:', newPost);
    
    res.status(201).json({ 
      success: true, 
      message: 'Blog post created successfully',
      post: newPost
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

// PUT update blog post
router.put('/:id', verifyAdmin, upload.single('image'), (req, res) => {
  try {
    console.log('PUT /api/blog/:id - Request body:', req.body);
    console.log('PUT /api/blog/:id - File:', req.file);
    console.log('PUT /api/blog/:id - Params:', req.params);
    
    const postIndex = blogPosts.findIndex(p => p._id === req.params.id);
    
    if (postIndex === -1) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    
    const { title, excerpt, content, category, status, tags, author, publishedAt, readTime, featured, likes, comments, existingImage } = req.body;
    
    const updatedPost = {
      ...blogPosts[postIndex],
      title: title || blogPosts[postIndex].title,
      excerpt: excerpt || blogPosts[postIndex].excerpt,
      content: content || blogPosts[postIndex].content,
      category: category || blogPosts[postIndex].category,
      status: status || blogPosts[postIndex].status,
      image: req.file ? `/uploads/blog/${req.file.filename}` : (existingImage || blogPosts[postIndex].image),
      tags: tags ? tags.split(',').map(tag => tag.trim()) : blogPosts[postIndex].tags,
      author: author ? JSON.parse(author) : blogPosts[postIndex].author,
      publishedAt: publishedAt || blogPosts[postIndex].publishedAt,
      readTime: readTime || blogPosts[postIndex].readTime,
      featured: featured !== undefined ? featured === 'true' : blogPosts[postIndex].featured,
      likes: likes !== undefined ? parseInt(likes) : blogPosts[postIndex].likes,
      comments: comments !== undefined ? parseInt(comments) : blogPosts[postIndex].comments
    };
    
    blogPosts[postIndex] = updatedPost;
    
    console.log('PUT /api/blog/:id - Post updated:', updatedPost);
    
    res.json({ 
      success: true, 
      message: 'Blog post updated successfully',
      post: updatedPost
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

// DELETE blog post
router.delete('/:id', verifyAdmin, (req, res) => {
  try {
    const postIndex = blogPosts.findIndex(p => p._id === req.params.id);
    
    if (postIndex === -1) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    
    const deletedPost = blogPosts[postIndex];
    
    // Delete associated image file if it exists
    if (deletedPost.image && deletedPost.image.startsWith('/uploads/blog/')) {
      const imagePath = path.join(__dirname, '..', deletedPost.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    blogPosts.splice(postIndex, 1);
    
    res.json({ 
      success: true, 
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
