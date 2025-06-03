# 🚀 JSON Host Server - Render.com Deployment Guide

## Quick Deploy to Render.com

### Option 1: One-Click Deploy

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/CorentinPapernest/ppn-smart-links.git)

### Option 2: Manual Deployment

1. **Go to Render Dashboard**
   - Visit [render.com](https://render.com)
   - Sign up or log in to your account

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub account if not already connected
   - Select your repository: `CorentinPapernest/ppn-smart-links`

3. **Configure Service Settings**
   ```
   Name: json-host-server
   Region: [Choose closest to your users]
   Branch: main
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free (or your preferred plan)
   ```

4. **Environment Variables (Optional)**
   - Go to "Environment" tab
   - Add any custom environment variables if needed:
     ```
     NODE_ENV=production
     ```
   - The server will work with default settings without any environment variables

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application
   - Your app will be available at: `https://your-app-name.onrender.com`

## ✨ What You Get

After deployment, your JSON host server will be available with:

- 🌐 **Web Interface**: `https://your-app-name.onrender.com`
- 🔗 **API Endpoint**: `https://your-app-name.onrender.com/api/routes`
- 📊 **Health Check**: `https://your-app-name.onrender.com/api/routes` (returns `[]` when healthy)

## 🎯 Using Your Deployed Server

1. **Access the Admin Interface**
   - Visit your Render app URL
   - Use the web interface to add JSON routes

2. **Add JSON Routes**
   - Route: `/api/users`
   - JSON: Your user data
   - The route will be available at: `https://your-app-name.onrender.com/api/users`

3. **Test Your Routes**
   ```bash
   # Test with curl
   curl https://your-app-name.onrender.com/api/users
   
   # Or use in your applications
   fetch('https://your-app-name.onrender.com/api/users')
   ```

## 🔄 Automatic Updates

With Render.com:
- ✅ **Auto-deploy**: Every push to `main` branch triggers a new deployment
- ✅ **HTTPS**: Automatic SSL certificate
- ✅ **Health Monitoring**: Built-in health checks
- ✅ **Custom Domain**: Easy custom domain setup (paid plans)

## 💾 Data Persistence

**Important**: Render's free tier may restart your service, which could clear the `routes.json` file. For production use, consider:

1. **Upgrading to a paid plan** for persistent disk storage
2. **Using a database** (PostgreSQL, MongoDB) for production workloads
3. **External storage** (AWS S3, etc.) for JSON data

## 🛡️ Security Notes

Your deployed server includes:
- ✅ CORS enabled for cross-origin requests
- ✅ JSON validation for all routes
- ✅ Error handling and graceful failures
- ⚠️ No authentication (add if needed for production)

## 🔧 Troubleshooting

### Common Issues:

1. **Service won't start**
   - Check build logs in Render dashboard
   - Ensure `package.json` scripts are correct

2. **Routes not persisting**
   - This is expected on free tier
   - Upgrade to paid plan for disk persistence

3. **CORS errors**
   - The server includes CORS by default
   - Check your client-side code

### Debug Commands:

```bash
# Check if your service is running
curl https://your-app-name.onrender.com/api/routes

# Test health (should return empty array initially)
curl -I https://your-app-name.onrender.com/api/routes
```

## 🎉 You're Ready!

Your JSON host server is now live on Render.com! 

**Next Steps:**
1. Visit your deployed URL
2. Add your first JSON route via the web interface
3. Test the API endpoints
4. Share your JSON API URLs

---

**Need help?** Check the [main README](README.md) or open an issue on GitHub! 