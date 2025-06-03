const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// In-memory storage for routes and content data
let contentRoutes = {};

// Load existing routes from file if it exists
const routesFile = path.join(__dirname, 'routes.json');
if (fs.existsSync(routesFile)) {
  try {
    const data = fs.readFileSync(routesFile, 'utf8');
    const loadedData = JSON.parse(data);
    
    // Migrate old format to new format if needed
    contentRoutes = {};
    for (const [route, routeData] of Object.entries(loadedData)) {
      if (routeData && typeof routeData === 'object') {
        // Check if it's already in new format
        if (routeData.type && routeData.content !== undefined) {
          // Already in new format
          contentRoutes[route] = routeData;
        } else {
          // Old format - convert to new format
          console.log(`Migrating old format route: ${route}`);
          contentRoutes[route] = {
            type: 'json',
            content: routeData
          };
        }
      } else {
        // Very old or malformed format
        console.log(`Skipping malformed route: ${route}`);
      }
    }
    
    // Save the migrated data
    saveRoutes();
    console.log('Routes loaded and migrated successfully');
  } catch (error) {
    console.log('Could not load existing routes:', error.message);
  }
}

// Save routes to file
function saveRoutes() {
  try {
    fs.writeFileSync(routesFile, JSON.stringify(contentRoutes, null, 2));
  } catch (error) {
    console.error('Error saving routes:', error.message);
  }
}

// Serve the main UI
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to get all routes
app.get('/api/routes', (req, res) => {
  const routes = Object.keys(contentRoutes).map(route => ({
    route,
    type: contentRoutes[route].type,
    content: contentRoutes[route].content
  }));
  res.json(routes);
});

// API endpoint to add/update a route
app.post('/api/routes', (req, res) => {
  const { route, content, type } = req.body;
  
  if (!route || !content || !type) {
    return res.status(400).json({ error: 'Route, content, and type are required' });
  }
  
  // Ensure route starts with /
  const cleanRoute = route.startsWith('/') ? route : `/${route}`;
  
  try {
    if (type === 'json') {
      // Validate JSON
      const parsedJson = typeof content === 'string' ? JSON.parse(content) : content;
      contentRoutes[cleanRoute] = {
        type: 'json',
        content: parsedJson
      };
    } else if (type === 'html') {
      // Store HTML as string
      contentRoutes[cleanRoute] = {
        type: 'html',
        content: content
      };
    } else {
      return res.status(400).json({ error: 'Type must be either "json" or "html"' });
    }
    
    saveRoutes();
    res.json({ message: 'Route added successfully', route: cleanRoute, type });
  } catch (error) {
    if (type === 'json') {
      res.status(400).json({ error: 'Invalid JSON format' });
    } else {
      res.status(400).json({ error: 'Error processing content' });
    }
  }
});

// API endpoint to delete a route
app.delete('/api/routes/:route(*)', (req, res) => {
  const route = '/' + req.params.route;
  
  if (contentRoutes[route]) {
    delete contentRoutes[route];
    saveRoutes();
    res.json({ message: 'Route deleted successfully' });
  } else {
    res.status(404).json({ error: 'Route not found' });
  }
});

// Dynamic route handler for content endpoints
app.get('*', (req, res) => {
  const route = req.path;
  
  if (contentRoutes[route]) {
    const routeData = contentRoutes[route];
    
    if (routeData.type === 'json') {
      res.json(routeData.content);
    } else if (routeData.type === 'html') {
      res.setHeader('Content-Type', 'text/html');
      res.send(routeData.content);
    }
  } else {
    res.status(404).json({ error: 'Route not found' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 JSON & HTML Host Server running on http://localhost:${PORT}`);
  console.log(`📋 Admin interface: http://localhost:${PORT}`);
  console.log(`📁 Routes saved to: ${routesFile}`);
}); 