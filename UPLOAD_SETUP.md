# Image Upload Setup Guide

This project supports two image upload methods:

## 1. Simple File Upload (Current Setup)
The simple upload system stores images locally on the server. This is already configured and working.

**Features:**
- Images stored in `backend/uploads/products/`
- No external dependencies required
- Works immediately after setup

**Limitations:**
- Storage limited by server disk space
- No automatic image optimization
- No CDN benefits

## 2. Cloudinary Upload (Recommended for Production)
For production use, Cloudinary provides better performance and scalability.

### Setup Instructions:

1. **Create a Cloudinary Account:**
   - Go to [cloudinary.com](https://cloudinary.com)
   - Sign up for a free account

2. **Get Your Credentials:**
   - Go to Dashboard → Settings → API Keys
   - Note down:
     - Cloud name
     - API Key
     - API Secret

3. **Update Environment Variables:**
   Create or update `backend/.env`:
   ```env
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Restart the Backend Server:**
   ```bash
   npm run dev
   ```

5. **Update Frontend (Optional):**
   The frontend automatically uses Cloudinary when credentials are properly configured.

### Benefits of Cloudinary:
- Automatic image optimization
- CDN delivery for faster loading
- Multiple format support
- Advanced transformations
- Better scalability

## Testing Image Upload

1. **Start the Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the Frontend:**
   ```bash
   npm run dev
   ```

3. **Test Upload:**
   - Go to Admin Dashboard
   - Click "Add Product"
   - Try uploading thumbnail and gallery images
   - Check if images appear in the preview

## Troubleshooting

### Upload Fails with Authentication Error
- Ensure you're logged in to the admin panel
- Check that your JWT token is valid

### Upload Fails with Server Error
- Check backend console for error messages
- Ensure the uploads directory has write permissions
- Verify file size is under 5MB limit

### Images Not Displaying
- Check if the backend is serving static files correctly
- Verify the image URLs in the browser network tab
- Ensure the uploads directory exists

## File Upload Limits

- **Maximum file size:** 5MB per image
- **Supported formats:** JPEG, JPG, PNG, GIF, WebP
- **Maximum gallery images:** 10 per product
- **Maximum thumbnail:** 1 per product

## Security Notes

- All uploads require authentication
- File type validation prevents malicious uploads
- Images are stored in a dedicated uploads directory
- Consider implementing additional security measures for production
