# 📄 JSON Host Server

A simple, lightweight server that allows you to host JSON files at custom routes with a clean web interface for management.

## ✨ Features

- 🌐 **Simple Web Interface** - Add and manage JSON routes through a clean UI
- 🚀 **Instant JSON APIs** - Create JSON endpoints on the fly
- 💾 **Persistent Storage** - Routes are saved to a local JSON file
- 🎯 **Easy to Use** - No database required, just start and go
- 🔄 **Real-time Updates** - Add/delete routes instantly

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
2. Enter a route path (e.g., `/api/users`, `/config`, `/data/products`)
3. Enter your JSON content in the textarea
4. Click "Add Route"
5. Your JSON is now available at `http://localhost:3000/your-route`

### Direct API Access

Once you've added routes through the interface, you can access them directly:

```bash
# If you added a route /api/users
curl http://localhost:3000/api/users

# If you added a route /config
curl http://localhost:3000/config
```

## 🛠️ API Endpoints

The server provides a few management endpoints:

- `GET /api/routes` - List all configured routes
- `POST /api/routes` - Add a new route
- `DELETE /api/routes/:route` - Delete a route

## 📁 File Structure

```
json-host-server/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── routes.json        # Auto-generated storage file
└── public/
    └── index.html     # Web interface
```

## 🎯 Example Usage

**Add a user list:**
- Route: `/api/users`
- JSON: 
  ```json
  {
    "users": [
      {"id": 1, "name": "John Doe", "email": "john@example.com"},
      {"id": 2, "name": "Jane Smith", "email": "jane@example.com"}
    ],
    "total": 2
  }
  ```

**Add a configuration:**
- Route: `/config`
- JSON:
  ```json
  {
    "app_name": "My App",
    "version": "1.0.0",
    "debug": false,
    "features": ["auth", "logging", "cache"]
  }
  ```

Now you can access:
- `http://localhost:3000/api/users` - Returns the user list
- `http://localhost:3000/config` - Returns the configuration

## 🔧 Configuration

The server runs on port 3000 by default. You can change this by setting the `PORT` environment variable:

```bash
PORT=8080 npm start
```

## 💾 Data Persistence

All routes are automatically saved to `routes.json` in the project directory. This file is loaded when the server starts, so your routes persist between restarts.

## 🌟 Perfect For

- 🔧 **Prototyping** - Quickly mock APIs for development
- 📱 **Mobile App Development** - Provide JSON endpoints for testing
- 🎭 **Frontend Development** - Mock backend responses
- 📊 **Static Data Hosting** - Host configuration files or static datasets
- 🧪 **API Testing** - Create test endpoints for integration testing

## 🚀 Deployment

This server can be easily deployed to any Node.js hosting platform:

- Heroku
- Vercel
- Railway
- DigitalOcean App Platform
- Or any VPS with Node.js

Just make sure to set the `PORT` environment variable if required by your hosting platform.

---

**That's it!** You now have a simple JSON hosting server running. Visit the web interface to start adding your JSON routes! 🎉 