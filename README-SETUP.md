# MK Shop E-Commerce Platform Setup

## Overview
This is a full-stack e-commerce platform with a Next.js frontend and Node.js/Express backend with MongoDB database.

## Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mkshop
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

## Frontend Setup

1. Install dependencies in the root directory:
```bash
npm install
```

2. Create a `.env.local` file in the root directory with the following:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Database Setup

### Option 1: Local MongoDB
1. Install MongoDB locally
2. Make sure MongoDB is running on the default port (27017)
3. The backend will automatically create the `mkshop` database

### Option 2: MongoDB Atlas
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update the `MONGODB_URI` in your backend `.env` file

## Features

### Frontend
- Responsive design with Tailwind CSS
- Product catalog with categories
- Shopping cart functionality
- User authentication
- Admin dashboard
- Dynamic content from backend

### Backend
- RESTful API with Express.js
- JWT authentication
- MongoDB database with Mongoose
- CRUD operations for products, categories, orders, users
- Admin role-based access control
- Rate limiting and security headers

### Admin Dashboard
- Product management (CRUD)
- Category management
- Order management
- User management
- Dashboard with statistics

## Default Admin Account

After setting up, you can create an admin account through the registration page or directly in the database. The first user with role "admin" will have access to the admin dashboard at `/admin/dashboard`.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Orders
- `GET /api/orders` - Get all orders (admin only)
- `GET /api/orders/myorders` - Get current user orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status (admin only)

### Users
- `GET /api/users` - Get all users (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

## Project Structure

```
 backend/
    config/
    controllers/
    middleware/
    models/
    routes/
    server.js
 app/
    admin/
       dashboard/
       products/
       categories/
       orders/
       users/
    login/
    ...
 components/
 contexts/
 lib/
    api/
 ...
```

## Development

### Adding New Features
1. Backend: Add new routes, controllers, and models as needed
2. Frontend: Create new components and pages
3. API: Use the centralized API service in `lib/api/index.js`

### Security Features
- JWT authentication
- Rate limiting
- CORS configuration
- Input validation
- Password hashing with bcryptjs

## Deployment

### Backend Deployment
1. Set environment variables for production
2. Update CORS origins
3. Use a process manager like PM2
4. Set up MongoDB with proper security

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or any hosting service
3. Update environment variables for production API URL

## Troubleshooting

### Common Issues
1. **MongoDB Connection Error**: Check your MongoDB URI and ensure MongoDB is running
2. **CORS Error**: Verify CORS configuration in backend
3. **Authentication Issues**: Check JWT secret and token handling
4. **Image Loading**: Ensure image URLs are accessible and properly formatted

### Getting Help
- Check the browser console for frontend errors
- Check the backend console for API errors
- Verify environment variables are correctly set
- Ensure all dependencies are installed