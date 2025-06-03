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

// In-memory storage for routes and JSON data
let jsonRoutes = {};

// Load existing routes from file if it exists
const routesFile = path.join(__dirname, 'routes.json');
if (fs.existsSync(routesFile)) {
  try {
    const data = fs.readFileSync(routesFile, 'utf8');
    jsonRoutes = JSON.parse(data);
  } catch (error) {
    console.log('Could not load existing routes:', error.message);
  }
}

// Save routes to file
function saveRoutes() {
  try {
    fs.writeFileSync(routesFile, JSON.stringify(jsonRoutes, null, 2));
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
  const routes = Object.keys(jsonRoutes).map(route => ({
    route,
    json: jsonRoutes[route]
  }));
  res.json(routes);
});

// API endpoint to add/update a route
app.post('/api/routes', (req, res) => {
  const { route, json } = req.body;
  
  if (!route || !json) {
    return res.status(400).json({ error: 'Both route and json are required' });
  }
  
  // Ensure route starts with /
  const cleanRoute = route.startsWith('/') ? route : `/${route}`;
  
  try {
    // Validate JSON
    const parsedJson = typeof json === 'string' ? JSON.parse(json) : json;
    jsonRoutes[cleanRoute] = parsedJson;
    saveRoutes();
    
    res.json({ message: 'Route added successfully', route: cleanRoute });
  } catch (error) {
    res.status(400).json({ error: 'Invalid JSON format' });
  }
});

// API endpoint to delete a route
app.delete('/api/routes/:route(*)', (req, res) => {
  const route = '/' + req.params.route;
  
  if (jsonRoutes[route]) {
    delete jsonRoutes[route];
    saveRoutes();
    res.json({ message: 'Route deleted successfully' });
  } else {
    res.status(404).json({ error: 'Route not found' });
  }
});

// Dynamic route handler for JSON endpoints
app.get('*', (req, res) => {
  const route = req.path;
  
  if (jsonRoutes[route]) {
    res.json(jsonRoutes[route]);
  } else {
    res.status(404).json({ error: 'Route not found' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 JSON Host Server running on http://localhost:${PORT}`);
  console.log(`📋 Admin interface: http://localhost:${PORT}`);
  console.log(`📁 Routes saved to: ${routesFile}`);
}); 