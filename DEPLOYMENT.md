# 🚀 JSON & HTML Host Server - Render.com Deployment Guide

## Quick Deploy to Render.com

### Option 1: One-Click Deploy

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/CorentinPapernest/ppn-smart-links.git)

### Option 2: Manual Deployment

#### Step 1: Create PostgreSQL Database (Recommended)

For persistent storage that survives deployments:

1. **Go to Render Dashboard** → [render.com](https://render.com)
2. **Create PostgreSQL Database**:
   - Click "New +" → "PostgreSQL"
   - Name: `json-html-host-db` (or your preferred name)
   - Plan: **Free** (sufficient for most use cases)
   - Click "Create Database"
3. **Copy Database URL**:
   - Once created, go to the database page
   - Copy the "External Database URL" (starts with `postgresql://`)

#### Step 2: Create Web Service

1. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub account if not already connected
   - Select your repository: `CorentinPapernest/ppn-smart-links`

2. **Configure Service Settings**
   ```
   Name: json-html-host-server
   Region: [Choose closest to your users]
   Branch: main
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free (or your preferred plan)
   ```

3. **Environment Variables**
   - Go to "Environment" tab
   - Add the following variables:
     ```
     NODE_ENV=production
     DATABASE_URL=[paste your PostgreSQL URL from Step 1]
     ```

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application
   - Your app will be available at: `https://your-app-name.onrender.com`

## ✨ What You Get

After deployment with database, your JSON & HTML host server will have:

- 🌐 **Web Interface**: `https://your-app-name.onrender.com`
- 🔗 **API Endpoint**: `https://your-app-name.onrender.com/api/routes`
- 💾 **Persistent Storage**: Routes saved in PostgreSQL database
- 🔄 **Deployment Persistence**: Routes survive server restarts and redeployments

## 🎯 Using Your Deployed Server

1. **Access the Admin Interface**
   - Visit your Render app URL
   - Use the web interface to add JSON and HTML routes

2. **Add Content Routes**
   - **JSON Route**: `/api/users` → API endpoint
   - **HTML Route**: `/landing` → Web page
   - Routes persist forever (even after redeployments!)

3. **Test Your Routes**
   ```bash
   # Test JSON API
   curl https://your-app-name.onrender.com/api/users
   
   # View HTML page in browser
   open https://your-app-name.onrender.com/landing
   ```

## 🔄 Storage Options

### 🏆 **PostgreSQL Database (Recommended)**
- ✅ **Persistent**: Routes survive deployments
- ✅ **Scalable**: Handle thousands of routes
- ✅ **Reliable**: ACID compliance
- ✅ **Free**: Render provides free PostgreSQL
- ✅ **Automatic**: Works seamlessly

### 📁 **File Storage (Fallback)**
- ⚠️ **Temporary**: Routes lost on deployment
- ✅ **Simple**: No setup required
- ✅ **Local Development**: Perfect for testing

## 🔧 Database Management

### Viewing Your Data

You can connect to your database to view stored routes:

```sql
-- Connect to your database using the URL from Render
-- View all routes
SELECT route, type, created_at FROM routes ORDER BY route;

-- View specific route content
SELECT * FROM routes WHERE route = '/api/users';
```

### Manual Database Operations

```sql
-- Add a route manually
INSERT INTO routes (route, type, content) 
VALUES ('/manual-route', 'json', '{"message": "Added manually"}');

-- Update a route
UPDATE routes 
SET content = '{"updated": true}' 
WHERE route = '/api/config';

-- Delete a route
DELETE FROM routes WHERE route = '/old-route';
```

## 🔄 Automatic Updates

With Render.com + Database:
- ✅ **Auto-deploy**: Every push to `main` branch triggers a new deployment
- ✅ **Data Persistence**: All routes remain intact during deployments
- ✅ **HTTPS**: Automatic SSL certificate
- ✅ **Health Monitoring**: Built-in health checks
- ✅ **Backup**: Database backups available

## 🆚 Local Development vs Production

### Local Development
```bash
# No DATABASE_URL set - uses file storage
npm run dev
# Storage: routes.json file
```

### Production
```bash
# DATABASE_URL set - uses PostgreSQL
npm start
# Storage: PostgreSQL database
```

## 🛡️ Security Notes

Your deployed server includes:
- ✅ **Database Security**: PostgreSQL with SSL in production
- ✅ **CORS Enabled**: Cross-origin requests supported
- ✅ **JSON Validation**: All routes validated before storage
- ✅ **Error Handling**: Graceful failure handling
- ✅ **Large Content Support**: 10MB payload limit for big HTML pages
- ⚠️ **No Authentication**: Add if needed for production (see below)

### Adding Basic Authentication (Optional)

If you want to protect your admin interface:

```javascript
// Add to server.js before routes
app.use('/admin', (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || auth !== 'Bearer YOUR_SECRET_TOKEN') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});
```

## 🔧 Troubleshooting

### Common Issues:

1. **Routes disappearing after deployment**
   - ✅ **Solution**: Set up PostgreSQL database (see Step 1 above)
   - The server will show: `💾 Storage: PostgreSQL Database`

2. **Database connection fails**
   - Check `DATABASE_URL` environment variable is set correctly
   - Ensure database is in same region as web service
   - Check database is running and accessible

3. **Large HTML content rejected**
   - The server now supports up to 10MB payloads
   - For larger content, consider splitting into multiple routes

4. **Service won't start**
   - Check build logs in Render dashboard
   - Ensure `package.json` includes `pg` dependency

### Debug Commands:

```bash
# Check if database is being used
curl https://your-app-name.onrender.com/api/routes
# Response includes storage info

# Check server logs
# Go to Render dashboard → Your service → Logs
```

### Migration from File to Database

If you have existing routes in file storage and want to migrate to database:

1. Deploy with database setup
2. Access your old routes via the web interface
3. Copy/recreate important routes (they'll automatically save to database)
4. Old file-based routes will be preserved until you redeploy

## 🎉 You're Ready!

Your JSON & HTML host server is now live on Render.com with persistent storage! 

**Next Steps:**
1. Visit your deployed URL
2. Add your routes via the web interface
3. Test that routes persist after redeployment
4. Share your API URLs and web pages

**Pro Tip:** Bookmark your Render app URL and database dashboard for easy management!

---

**Need help?** Check the [main README](README.md) or open an issue on GitHub! 