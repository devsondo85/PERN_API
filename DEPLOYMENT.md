# Deployment Guide

This guide will help you deploy your Inventory Management System to production.

## 🚀 Quick Deployment Options

### Option 1: Heroku (Recommended for Beginners)

#### Backend Deployment

1. **Install Heroku CLI**
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Or download from: https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   cd /Users/valerysondo/PERN-API
   heroku create your-app-name-backend
   ```

4. **Add PostgreSQL Database**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

5. **Set Environment Variables**
   ```bash
   # Heroku automatically sets DATABASE_URL, but you can also set individual vars:
   heroku config:set DB_USER=$(heroku config:get DATABASE_URL | grep -oP 'user=\K[^:]+')
   # Or use the DATABASE_URL directly (recommended)
   ```

6. **Deploy Backend**
   ```bash
   git push heroku main
   ```

7. **Run Database Migrations**
   ```bash
   # Connect to Heroku database and run schema
   heroku pg:psql < server/schema.sql
   # Or manually:
   heroku run psql $DATABASE_URL -c "\i server/schema.sql"
   ```

8. **Get Your Backend URL**
   ```bash
   heroku info
   # Your backend will be at: https://your-app-name-backend.herokuapp.com
   ```

#### Frontend Deployment (Vercel)

1. **Go to [vercel.com](https://vercel.com)** and sign up/login

2. **Import GitHub Repository**
   - Click "New Project"
   - Import your `PERN_API` repository

3. **Configure Build Settings**
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

4. **Set Environment Variables**
   - Click "Environment Variables"
   - Add: `REACT_APP_API_URL` = `https://your-app-name-backend.herokuapp.com`

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at: `https://your-app.vercel.app`

---

### Option 2: Railway (All-in-One Solution)

1. **Go to [railway.app](https://railway.app)** and sign up

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add PostgreSQL Service**
   - Click "+ New"
   - Select "PostgreSQL"
   - Railway will automatically create the database

4. **Configure Environment Variables**
   - Go to your service → Variables
   - Railway automatically provides `DATABASE_URL`
   - Add: `PORT` = `9001` (or let Railway assign it)

5. **Deploy**
   - Railway will automatically detect your `Procfile`
   - Deploy happens automatically on git push

6. **Run Database Migrations**
   ```bash
   # Get database connection string from Railway dashboard
   # Then run:
   psql $DATABASE_URL -f server/schema.sql
   ```

---

### Option 3: Render

#### Backend Deployment

1. **Go to [render.com](https://render.com)** and sign up

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure Service**
   - **Name**: `inventory-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
   - **Plan**: Free (or paid for better performance)

4. **Add PostgreSQL Database**
   - Click "New +" → "PostgreSQL"
   - Create database
   - Copy the connection string

5. **Set Environment Variables**
   - In your web service settings:
     - `DATABASE_URL` = (from PostgreSQL service)
     - `PORT` = `9001` (or let Render assign it)

6. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy automatically

#### Frontend Deployment (Render or Netlify)

**Using Render:**
- Create another Web Service
- Root Directory: `client`
- Build Command: `npm install && npm run build`
- Publish Directory: `build`
- Environment Variable: `REACT_APP_API_URL` = your backend URL

**Using Netlify:**
- Go to [netlify.com](https://netlify.com)
- Import from GitHub
- Build command: `cd client && npm install && npm run build`
- Publish directory: `client/build`
- Environment Variable: `REACT_APP_API_URL` = your backend URL

---

## 📋 Pre-Deployment Checklist

- [x] Environment variables configured in code
- [x] `Procfile` created
- [x] `package.json` has start script
- [ ] Database credentials ready
- [ ] Frontend API URL updated for production
- [ ] All code committed to GitHub

## 🔧 Environment Variables Reference

### Backend Variables
- `PORT` - Server port (usually auto-assigned by platform)
- `DB_USER` - PostgreSQL username
- `DB_HOST` - PostgreSQL host
- `DB_NAME` - Database name
- `DB_PASSWORD` - PostgreSQL password
- `DB_PORT` - PostgreSQL port (usually 5432)
- `DATABASE_URL` - Full connection string (if provided by platform)

### Frontend Variables
- `REACT_APP_API_URL` - Backend API URL (e.g., `https://your-backend.herokuapp.com`)

## 🗄️ Database Setup After Deployment

After deploying, you need to run your database schema:

```bash
# Option 1: Using psql with connection string
psql $DATABASE_URL -f server/schema.sql

# Option 2: Using Heroku CLI
heroku pg:psql < server/schema.sql

# Option 3: Manual connection
# Get connection details from your platform
psql -h your-host -U your-user -d your-database -f server/schema.sql
```

Then insert sample data (optional):
```bash
psql $DATABASE_URL -f server/insert_data.sql
```

## 🧪 Testing Your Deployment

1. **Test Backend API**
   ```bash
   curl https://your-backend-url.herokuapp.com/products
   ```

2. **Test Frontend**
   - Visit your frontend URL
   - Check browser console for errors
   - Verify API calls are working

3. **Check Logs**
   ```bash
   # Heroku
   heroku logs --tail
   
   # Railway
   # View logs in Railway dashboard
   
   # Render
   # View logs in Render dashboard
   ```

## 🔄 Updating After Deployment

1. **Make changes locally**
2. **Commit and push to GitHub**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
3. **Platform will auto-deploy** (if connected to GitHub)
   - Or manually trigger deployment in platform dashboard

## 🐛 Common Deployment Issues

### Issue: Database Connection Failed
- **Solution**: Check environment variables are set correctly
- Verify database is running and accessible
- Check firewall/security settings

### Issue: CORS Errors
- **Solution**: CORS is already enabled in `server/index.js`
- If issues persist, check allowed origins

### Issue: Build Fails
- **Solution**: Check build logs for specific errors
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Issue: API Not Found
- **Solution**: Update `REACT_APP_API_URL` in frontend environment variables
- Rebuild and redeploy frontend

## 📚 Additional Resources

- [Heroku Node.js Guide](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)

---

**Need Help?** Check the logs in your platform's dashboard for detailed error messages.

