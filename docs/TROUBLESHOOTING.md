# Deployment Troubleshooting Guide

## Common Issues and Solutions

### Backend (Render)

#### 1. Service Not Starting
**Problem**: Render service shows "Build failed" or "Service crashed"
**Solution**:
- Check environment variables are set correctly in Render dashboard
- Verify MongoDB Atlas connection string is correct
- Ensure all required env vars are present: `PORT`, `MONGO_URI`, `JWT_SECRET`

#### 2. Database Connection Timeout
**Problem**: `MongooseError: Cannot connect to MongoDB`
**Solution**:
- Check MongoDB Atlas IP whitelist includes Render IP
- Verify connection string has correct username/password
- Check network connectivity in MongoDB Atlas

#### 3. Webhook Failures (Razorpay)
**Problem**: Payments not being verified
**Solution**:
- Ensure `RAZORPAY_KEY_SECRET` is correct in environment
- Verify webhook endpoint is accessible
- Check Razorpay dashboard for webhook configuration

### Frontend (Vercel)

#### 1. Build Fails
**Problem**: `npm run build` fails during deployment
**Solution**:
- Check `vite.config.js` is correctly configured
- Ensure all imports are resolved
- Verify `VITE_API_URL` points to correct backend

#### 2. API Calls Fail
**Problem**: CORS errors or API timeouts
**Solution**:
- Verify backend CORS configuration allows frontend domain
- Check backend server is running and accessible
- Look for network errors in browser DevTools

#### 3. Environment Variables Not Loading
**Problem**: `VITE_API_URL` shows as undefined
**Solution**:
- Vercel env vars must use `VITE_` prefix for Vite
- Rebuild after changing environment variables
- Check `.env` file is in client directory

### Local Development

#### 1. Port Already in Use
**Problem**: `Error: listen EADDRINUSE`
**Solution**:
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

#### 2. Dependencies Not Installing
**Problem**: `npm install` fails
**Solution**:
- Delete `node_modules` and `package-lock.json`
- Clear npm cache: `npm cache clean --force`
- Try installing again

#### 3. Hot Reload Not Working
**Problem**: Changes don't reflect in browser
**Solution**:
- Restart dev server
- Clear browser cache (Ctrl+Shift+Delete)
- Check file paths are correct
