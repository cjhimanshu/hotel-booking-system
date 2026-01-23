# Render Deployment Guide

## Prerequisites
- MongoDB Atlas account (free tier: https://www.mongodb.com/cloud/atlas)
- Render account (free tier: https://render.com)
- Vercel account (for frontend)

## Step 1: Setup MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Start Free" → Sign up/Login
3. Create a new cluster (Free M0 tier)
4. Click "Database Access" → Add Database User
   - Username: `hotel_admin`
   - Password: Generate secure password (save it!)
5. Click "Network Access" → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
6. Click "Database" → Connect → "Connect your application"
   - Copy connection string (looks like):
   ```
   mongodb+srv://hotel_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password
   - Add database name: `mongodb+srv://...mongodb.net/hotel-booking?retryWrites=true&w=majority`

## Step 2: Deploy Backend on Render

### Option A: From GitHub (Recommended)

1. **Push your code to GitHub** (already done ✅)

2. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Click "New +" → "Web Service"

3. **Connect Repository**
   - Click "Connect account" → GitHub
   - Select repository: `hotel-booking-system`

4. **Configure Service**
   ```
   Name: hotel-booking-backend
   Region: Singapore (or closest to you)
   Branch: main
   Root Directory: server
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

5. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable"
   
   ```
   MONGO_URI = mongodb+srv://hotel_admin:yourpassword@cluster0.xxxxx.mongodb.net/hotel-booking?retryWrites=true&w=majority
   
   JWT_SECRET = your-super-secret-jwt-key-min-32-chars-long
   
   RAZORPAY_KEY_ID = your_razorpay_key_id
   
   RAZORPAY_KEY_SECRET = your_razorpay_secret
   
   CLIENT_URL = https://your-frontend.vercel.app
   
   NODE_ENV = production
   
   PORT = 10000
   ```

6. **Click "Create Web Service"**
   - Render will automatically deploy
   - Wait 3-5 minutes
   - Your backend URL: `https://hotel-booking-backend.onrender.com`

### Option B: Manual Deploy

1. Go to https://dashboard.render.com
2. New + → Web Service
3. "Build and deploy from a Git repository"
4. Follow steps above

## Step 3: Deploy Frontend on Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click "Add New" → "Project"

2. **Import Repository**
   - Select `hotel-booking-system`
   - Click "Import"

3. **Configure Project**
   ```
   Framework Preset: Vite
   Root Directory: client
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Add Environment Variables**
   ```
   VITE_API_URL = https://hotel-booking-backend.onrender.com/api
   ```

5. **Click "Deploy"**
   - Wait 1-2 minutes
   - Your frontend URL: `https://hotel-booking-system.vercel.app`

## Step 4: Update Backend Environment

1. **Go back to Render dashboard**
2. **Edit your backend service**
3. **Update CLIENT_URL variable:**
   ```
   CLIENT_URL = https://hotel-booking-system.vercel.app
   ```
4. **Save Changes** (will auto-redeploy)

## Step 5: Update API URL in Frontend

Make sure your `client/src/services/api.js` uses:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

## Step 6: Test Your Live App

1. Visit your Vercel URL: `https://hotel-booking-system.vercel.app`
2. Test:
   - ✅ User registration
   - ✅ Login
   - ✅ Browse rooms
   - ✅ Make a booking (test payment)
   - ✅ Admin dashboard

## Important Notes

### Free Tier Limitations
- **Render Free:** Backend spins down after 15 min inactivity (first request takes 30-50 seconds to wake)
- **MongoDB Atlas Free:** 512MB storage
- **Vercel Free:** Unlimited deployments

### Cost-Free Setup
- Total Cost: **$0/month** 🎉
- Perfect for portfolio/recruitment

### Production Upgrade (When Scaling)
- Render Starter: $7/month (no spin-down)
- MongoDB Atlas M10: $57/month
- Vercel Pro: $20/month

## Troubleshooting

### Backend won't start
- Check logs in Render dashboard
- Verify all environment variables are set
- Check MongoDB Atlas allows connections from anywhere

### Frontend can't connect
- Verify VITE_API_URL is correct
- Check CORS settings in server
- Check browser console for errors

### Uploads don't work
- Render's filesystem is ephemeral (files deleted on restart)
- Upgrade to AWS S3 for file storage (see scaling guide)

## Auto-Deploy Setup

Both platforms support auto-deploy:
- Push to GitHub → Automatic deployment ✅
- No manual work needed!

## Next Steps

1. Test all features on live site
2. Share links with recruiters:
   - Live Demo: `https://hotel-booking-system.vercel.app`
   - GitHub: `https://github.com/cjhimanshu/hotel-booking-system`
3. Monitor usage in Render/Vercel dashboards
4. Add custom domain (optional)

## Custom Domain (Optional)

### For Vercel (Frontend)
1. Buy domain from Namecheap/GoDaddy
2. In Vercel: Settings → Domains → Add
3. Follow DNS configuration steps

### For Render (Backend API)
1. In Render: Settings → Custom Domain
2. Add subdomain like `api.yourdomain.com`

---

**Your live URLs will be:**
- Frontend: `https://hotel-booking-system.vercel.app`
- Backend: `https://hotel-booking-backend.onrender.com`
- Database: MongoDB Atlas (cloud)

🎉 **Ready to impress recruiters!**
