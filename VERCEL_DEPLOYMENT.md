# Vercel Deployment Guide

## Files Created

✅ `vercel.json` - Vercel configuration for monorepo deployment
✅ `client/.env.production` - Production environment variables
✅ Updated `client/src/services/api.js` - Dynamic API URL configuration

## Deployment Steps

### 1. Push to GitHub

```bash
git add .
git commit -m "Add Vercel configuration"
git push origin main
```

### 2. Import Project to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. **Framework Preset**: Select **Other** (we have custom vercel.json config)
4. **Root Directory**: Leave as `.` (root directory)
5. **Build Command**: Leave empty (vercel.json handles this)
6. **Output Directory**: Leave empty (vercel.json handles this)

### 3. Add Environment Variables in Vercel Dashboard

Go to Settings → Environment Variables and add:

**Production Environment Variables:**

```
MONGO_URI=mongodb+srv://cjhimanshu49_db_user:12345@cluster0.0ei2jqf.mongodb.net/?appName=Cluster0
JWT_SECRET=supersecretkey
RAZORPAY_KEY_ID=rzp_test_RztWycUn9lABDY
RAZORPAY_KEY_SECRET=IZDOjoPb21hNS2h1b3IoTkT4
PORT=5000
```

⚠️ **IMPORTANT**: Never commit your `.env` file to Git!

### 4. Deploy

Click "Deploy" button

## What the Configuration Does

### vercel.json

- **Builds**: Configures both client (Vite) and server (Node.js) builds
- **Routes**:
  - `/api/*` → Server backend
  - `/uploads/*` → Server uploads
  - Everything else → Client (React)

### API Configuration

- Development: Uses `http://localhost:5000/api`
- Production: Uses relative `/api` path (same domain)

## Troubleshooting

### If you still get 404:

1. Check build logs in Vercel dashboard
2. Ensure all environment variables are set
3. Make sure MongoDB allows connections from anywhere (0.0.0.0/0)
4. Check function logs in Vercel dashboard

### File Uploads Issue

⚠️ Vercel serverless functions are **read-only**. For file uploads:

- Option 1: Use a cloud storage service (AWS S3, Cloudinary)
- Option 2: Deploy backend separately (Render, Railway, Heroku)

## Alternative: Deploy Backend Separately

If you prefer to deploy backend on another platform:

1. **Frontend on Vercel**: Set `VITE_API_URL` to your backend URL
2. **Backend on Render/Railway**: Deploy server folder separately
3. Update CORS in server.js to allow your Vercel domain

## Next Steps

1. Add your `.env` file to `.gitignore`
2. Push changes to GitHub
3. Import to Vercel
4. Add environment variables
5. Deploy!
