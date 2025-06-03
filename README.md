# 📄 JSON & HTML Host Server

A simple, lightweight server that allows you to host both JSON APIs and HTML pages at custom routes with a clean web interface for management.

## ✨ Features

- 🌐 **Simple Web Interface** - Add and manage both JSON and HTML routes through a clean UI
- 🚀 **Instant JSON APIs** - Create JSON endpoints on the fly
- 📄 **HTML Pages** - Host complete HTML pages with proper content types
- 💾 **Persistent Storage** - Routes are saved to a local JSON file
- 🎯 **Easy to Use** - No database required, just start and go
- 🔄 **Real-time Updates** - Add/delete routes instantly
- 🎨 **Content Type Support** - Automatic content-type headers (application/json for APIs, text/html for pages)

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   ```
   http://localhost:3000
   ```

## 📖 How to Use

### Through the Web Interface

1. Visit `http://localhost:3000` in your browser
2. Choose content type: **JSON (API Endpoint)** or **HTML (Web Page)**
3. Enter a route path (e.g., `/api/users`, `/about`, `/landing-page`)
4. Enter your content (JSON data or HTML code)
5. Click "Add Route"
6. Your content is now available at `http://localhost:3000/your-route`

### Content Types

**JSON Routes** (API Endpoints):
- Perfect for creating REST API endpoints
- Automatically served with `Content-Type: application/json`
- JSON validation included

**HTML Routes** (Web Pages):
- Host complete web pages
- Automatically served with `Content-Type: text/html`
- Support for any HTML content

### Direct API Access

Once you've added routes through the interface, you can access them directly:

```bash
# JSON API endpoint
curl http://localhost:3000/api/users

# HTML page (returns HTML content)
curl http://localhost:3000/about

# View in browser
open http://localhost:3000/your-html-page
```

## 🛠️ API Endpoints

The server provides management endpoints:

- `GET /api/routes` - List all configured routes
- `POST /api/routes` - Add a new route (requires `route`, `content`, and `type`)
- `DELETE /api/routes/:route` - Delete a route

## 📁 File Structure

```
json-html-host-server/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── routes.json        # Auto-generated storage file
└── public/
    └── index.html     # Web interface
```

## 🎯 Example Usage

### JSON API Routes

**User API:**
- Route: `/api/users`
- Type: `JSON`
- Content: 
  ```json
  {
    "users": [
      {"id": 1, "name": "John Doe", "email": "john@example.com"},
      {"id": 2, "name": "Jane Smith", "email": "jane@example.com"}
    ],
    "total": 2
  }
  ```

**Configuration API:**
- Route: `/api/config`
- Type: `JSON`
- Content:
  ```json
  {
    "app_name": "My App",
    "version": "1.0.0",
    "debug": false,
    "features": ["auth", "logging", "cache"]
  }
  ```

### HTML Page Routes

**About Page:**
- Route: `/about`
- Type: `HTML`
- Content:
  ```html
  <!DOCTYPE html>
  <html>
  <head>
      <title>About Us</title>
      <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #333; }
      </style>
  </head>
  <body>
      <h1>About Our Company</h1>
      <p>We are a innovative tech company focused on simplifying web development.</p>
  </body>
  </html>
  ```

**Landing Page:**
- Route: `/landing`
- Type: `HTML`
- Content: Your complete landing page HTML

### Access Your Content:
- `http://localhost:3000/api/users` - Returns JSON data
- `http://localhost:3000/api/config` - Returns JSON configuration
- `http://localhost:3000/about` - Displays HTML about page
- `http://localhost:3000/landing` - Shows your landing page

## 🔧 Configuration

The server runs on port 3000 by default. You can change this by setting the `PORT` environment variable:

```bash
PORT=8080 npm start
```

## 💾 Data Persistence

All routes are automatically saved to `routes.json` in the project directory. This file is loaded when the server starts, so your routes persist between restarts.

The storage format includes both content and type:
```json
{
  "/api/users": {
    "type": "json",
    "content": {"users": [...], "total": 2}
  },
  "/about": {
    "type": "html", 
    "content": "<!DOCTYPE html>..."
  }
}
```

## 🌟 Perfect For

- 🔧 **Prototyping** - Quickly mock APIs and pages for development
- 📱 **Mobile App Development** - Provide JSON endpoints for testing
- 🎭 **Frontend Development** - Mock backend responses and host demo pages
- 📊 **Static Content Hosting** - Host landing pages, documentation, or marketing pages
- 🧪 **API Testing** - Create test endpoints for integration testing
- 🎨 **Portfolio Sites** - Host simple HTML pages and portfolios
- 📋 **Documentation** - Create simple documentation pages

## 🚀 Deployment

This server can be easily deployed to any Node.js hosting platform:

- Render.com (see DEPLOYMENT.md)
- Heroku
- Vercel
- Railway
- DigitalOcean App Platform
- Or any VPS with Node.js

Just make sure to set the `PORT` environment variable if required by your hosting platform.

---

**That's it!** You now have a versatile content hosting server that can serve both JSON APIs and HTML pages. Visit the web interface to start adding your routes! 🎉 