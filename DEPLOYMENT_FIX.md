# Quick Fix for Vercel 404 Error

You have **3 options** to fix this:

---

## Option 1: Deploy Frontend Only (RECOMMENDED - Easiest)

This deploys only the React frontend on Vercel and backend elsewhere.

### Steps:

1. **Deploy Backend on Render** (Free):
   - Go to https://render.com
   - Create new Web Service
   - Connect your GitHub repo
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Add environment variables (MONGO_URI, JWT_SECRET, etc.)
   - Deploy and copy the URL (e.g., `https://your-app.onrender.com`)

2. **Configure Vercel for Frontend Only**:
   - In Vercel dashboard:
   - **Framework**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

   Add Environment Variable:

   ```
   VITE_API_URL=https://your-app.onrender.com/api
   ```

3. **Update Backend CORS** (in server/server.js):

   ```javascript
   app.use(
     cors({
       origin: ["https://your-vercel-app.vercel.app", "http://localhost:5173"],
       credentials: true,
     }),
   );
   ```

4. **Redeploy both**

---

## Option 2: Use Current Monorepo Setup

If you want both on Vercel:

### In Vercel Dashboard Settings:

1. **General Settings**:
   - Framework Preset: **Other**
   - Root Directory: `.` (leave empty/root)
   - Build Command: `cd client && npm install && npm run build`
   - Output Directory: `client/dist`
   - Install Command: `npm install --prefix client && npm install --prefix server`

2. **Environment Variables** - Add ALL of these:

   ```
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=supersecretkey
   RAZORPAY_KEY_ID=rzp_test_RztWycUn9lABDY
   RAZORPAY_KEY_SECRET=your_secret
   PORT=5000
   NODE_VERSION=18.x
   ```

3. **Redeploy**

---

## Option 3: Separate Deployments (Most Reliable)

### Frontend (Vercel):

1. Create separate repo or branch with only `client/` folder
2. Deploy as Vite app
3. Set `VITE_API_URL` environment variable

### Backend (Railway/Render):

1. Deploy `server/` folder
2. Add environment variables
3. Note the URL

---

## After Deployment - Verify:

1. **Check build logs** in Vercel dashboard
2. **Test API endpoint**: `https://your-app.vercel.app/api/`
3. **Check function logs** in Vercel dashboard

## Common Issues:

❌ **404 Error**: Wrong root directory or build settings
❌ **API Not Working**: Environment variables not set or CORS issue
❌ **Build Failed**: Missing dependencies or wrong Node version

## Which Option Should You Choose?

- **New to deployment?** → Option 1 (Frontend on Vercel, Backend on Render)
- **Want everything on Vercel?** → Option 2 (Monorepo setup)
- **Need reliability?** → Option 3 (Separate deployments)

---

**Current Status**: I've updated your files for Option 2. If still getting 404, try Option 1.
