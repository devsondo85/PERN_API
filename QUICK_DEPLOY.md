# Quick Deployment Guide - Step by Step

## 🚀 Simplest Deployment: Railway (Recommended)

### Step 1: Go to Railway
1. Open your browser
2. Go to: **https://railway.app**
3. Click **"Start a New Project"** or **"Login"**

### Step 2: Sign Up / Login
- Click **"Login with GitHub"**
- Authorize Railway to access your GitHub
- You'll be redirected to Railway dashboard

### Step 3: Create New Project
1. Click **"New Project"** button (top right)
2. Select **"Deploy from GitHub repo"**
3. If asked, authorize Railway to access your repositories
4. Find and select **"PERN_API"** repository
5. Click on it

### Step 4: Railway Auto-Deploys
- Railway will automatically:
  - Detect it's a Node.js project
  - Install dependencies
  - Try to start your app
- **Wait for the build to complete** (2-5 minutes)
- You'll see build logs in the Railway dashboard

### Step 5: Add PostgreSQL Database
1. In your project dashboard, click **"+ New"** button
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway creates the database automatically
4. **Important**: Railway automatically sets `DATABASE_URL` environment variable

### Step 6: Connect Database to Your App
1. Go back to your main service (the one that's deploying)
2. Click on it to open settings
3. Go to **"Variables"** tab
4. Railway should have automatically added `DATABASE_URL`
5. If not, click **"New Variable"** and add:
   - Name: `DATABASE_URL`
   - Value: (copy from PostgreSQL service → "Connect" → "Postgres Connection URL")

### Step 7: Update Database Connection Code
Your code needs to use `DATABASE_URL` if Railway provides it. Let me check if we need to update the queries.js file.

### Step 8: Run Database Migrations
1. Go to your PostgreSQL service in Railway
2. Click **"Connect"** or **"Query"** tab
3. Copy the connection string
4. Or use Railway's built-in terminal:
   - Click on your PostgreSQL service
   - Go to "Data" tab
   - Use the SQL editor to run your schema

### Step 9: Get Your App URL
1. Go to your main service (the Node.js app)
2. Click **"Settings"** tab
3. Under **"Domains"**, Railway provides a URL like:
   - `https://your-app-name.up.railway.app`
4. This is your backend API URL!

### Step 10: Deploy Frontend (Vercel)
1. Go to **https://vercel.com**
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository **PERN_API**
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Add Environment Variable:
   - Name: `REACT_APP_API_URL`
   - Value: `https://your-app-name.up.railway.app` (from Step 9)
6. Click **"Deploy"**

---

## 🐛 Common Issues & Solutions

### Issue: Build Fails
**Solution**: Check Railway logs for errors. Common causes:
- Missing dependencies in package.json
- Wrong start command
- Database connection issues

### Issue: App Crashes After Deploy
**Solution**: 
- Check Railway logs: Click on your service → "Deployments" → View logs
- Common causes:
  - Database not connected
  - Wrong PORT configuration
  - Missing environment variables

### Issue: Database Connection Error
**Solution**:
- Verify `DATABASE_URL` is set in Railway variables
- Check that PostgreSQL service is running
- Ensure database exists

### Issue: Frontend Can't Connect to Backend
**Solution**:
- Verify `REACT_APP_API_URL` is set correctly in Vercel
- Check CORS is enabled (it is in your code)
- Make sure backend URL is accessible (test in browser)

---

## 📋 Deployment Checklist

- [ ] Railway account created and logged in
- [ ] GitHub repository connected to Railway
- [ ] Project created and deploying
- [ ] PostgreSQL database added
- [ ] `DATABASE_URL` environment variable set
- [ ] Database schema run (server/schema.sql)
- [ ] Backend URL obtained from Railway
- [ ] Frontend deployed to Vercel
- [ ] `REACT_APP_API_URL` set in Vercel
- [ ] Test deployed application

---

## 🆘 Need Help?

**What specific error are you seeing?**
- Share the error message from Railway logs
- Or describe what step you're stuck on

**Quick Test Commands:**
```bash
# Test if your backend is working (after deployment)
curl https://your-app-name.up.railway.app/products

# Should return JSON array of products
```

