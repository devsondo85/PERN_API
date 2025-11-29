# Deploy Frontend to Vercel - Step by Step Guide

## 🚀 Quick Deployment Steps

### Step 1: Go to Vercel
1. Open your browser
2. Go to: **https://vercel.com**
3. Click **"Sign Up"** or **"Log In"**

### Step 2: Sign Up / Login
- Click **"Continue with GitHub"**
- Authorize Vercel to access your GitHub account
- You'll be redirected to Vercel dashboard

### Step 3: Import Your Project
1. Click **"Add New..."** button (top right)
2. Select **"Project"**
3. Click **"Import Git Repository"**
4. Find and select your **"PERN_API"** repository
5. Click **"Import"**

### Step 4: Configure Project Settings
Vercel will auto-detect some settings, but you need to configure:

**Framework Preset:**
- Select: **"Other"** or **"Create React App"**

**Root Directory:**
- Click **"Edit"** next to Root Directory
- Set to: **`client`**
- Click **"Continue"**

**Build Settings:**
- **Build Command:** `npm run build` (should auto-fill)
- **Output Directory:** `build` (should auto-fill)
- **Install Command:** `npm install` (should auto-fill)

### Step 5: Add Environment Variable (IMPORTANT!)
1. Scroll down to **"Environment Variables"** section
2. Click **"Add"** or **"Add Environment Variable"**
3. Add this variable:
   - **Name:** `REACT_APP_API_URL`
   - **Value:** `https://inventory-api-1764384362-d19466f8dcdc.herokuapp.com`
   - **Environment:** Select all (Production, Preview, Development)
4. Click **"Save"**

### Step 6: Deploy!
1. Click **"Deploy"** button
2. Wait for build to complete (2-5 minutes)
3. Vercel will provide you with a URL like:
   - `https://pern-api.vercel.app` or similar

### Step 7: Test Your Deployment
1. Open the URL Vercel provided
2. Your React app should load
3. Test adding a product
4. Test editing a product
5. Everything should work! 🎉

---

## 🔧 Alternative: Deploy via Vercel CLI

If you prefer command line:

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to client directory
cd client

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? (press enter for default)
# - Directory? ./build
# - Override settings? No

# Add environment variable
vercel env add REACT_APP_API_URL
# Enter: https://inventory-api-1764384362-d19466f8dcdc.herokuapp.com
# Select: Production, Preview, Development

# Deploy to production
vercel --prod
```

---

## ✅ Verification Checklist

After deployment, verify:
- [ ] Frontend loads without errors
- [ ] Products list displays
- [ ] Can add new products
- [ ] Can edit products
- [ ] Can delete products
- [ ] Search and filter work
- [ ] Dashboard stats show correctly

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to API"
- Check `REACT_APP_API_URL` is set correctly
- Verify backend URL is accessible: https://inventory-api-1764384362-d19466f8dcdc.herokuapp.com/products

### Issue: "Build failed"
- Check Vercel build logs
- Ensure Root Directory is set to `client`
- Verify `package.json` has build script

### Issue: "Blank page"
- Check browser console for errors
- Verify API URL is correct
- Check CORS is enabled on backend (it is)

### Issue: "API calls fail"
- Verify `REACT_APP_API_URL` environment variable is set
- Check backend is running: https://inventory-api-1764384362-d19466f8dcdc.herokuapp.com/products
- Check CORS settings (should be enabled)

---

## 📝 Important Notes

1. **Environment Variable**: Must be named exactly `REACT_APP_API_URL` (React requires `REACT_APP_` prefix)

2. **Root Directory**: Must be `client` so Vercel knows where your React app is

3. **Build Output**: Should be `build` (default for Create React App)

4. **Backend URL**: Your Heroku backend URL is:
   - `https://inventory-api-1764384362-d19466f8dcdc.herokuapp.com`

5. **Automatic Deployments**: Vercel will automatically redeploy when you push to GitHub!

---

## 🎉 Success!

Once deployed, you'll have:
- **Backend**: https://inventory-api-1764384362-d19466f8dcdc.herokuapp.com
- **Frontend**: https://your-app-name.vercel.app

Your full-stack PERN application is now live! 🚀

