@echo off
cd /d "e:\rabbani\e-Commerce-by-MK-main\backend"
echo Creating .env file...
(
echo PORT=5000
echo MONGODB_URI=mongodb://localhost:27017/mkshop
echo JWT_SECRET=mkshop_jwt_secret_key_for_development_2024
echo JWT_EXPIRE=7d
echo NODE_ENV=development
echo CLOUDINARY_CLOUD_NAME=demo_cloud_name
echo CLOUDINARY_API_KEY=demo_api_key
echo CLOUDINARY_API_SECRET=demo_api_secret
echo FRONTEND_URL=http://localhost:3000
) > .env

echo .env file created successfully!
echo.
echo Starting backend server...
node server.js
pause
