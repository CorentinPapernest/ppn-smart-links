const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Increase payload limit for large HTML content
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Middleware
app.use(cors());
app.use(express.static('public'));

// Database setup
let pool = null;
const useDatabase = !!process.env.DATABASE_URL;

if (useDatabase) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
  
  // Initialize database table
  async function initDatabase() {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS routes (
          route VARCHAR(255) PRIMARY KEY,
          type VARCHAR(10) NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.error('❌ Database initialization failed:', error.message);
      process.exit(1);
    }
  }
  
  initDatabase();
}

// In-memory storage for routes and content data (fallback)
let contentRoutes = {};

// File-based storage setup (for local development)
const routesFile = path.join(__dirname, 'routes.json');

// Load existing routes from file if no database
if (!useDatabase && fs.existsSync(routesFile)) {
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
    saveRoutesToFile();
    console.log('Routes loaded and migrated successfully from file');
  } catch (error) {
    console.log('Could not load existing routes from file:', error.message);
  }
}

// Save routes to file (fallback storage)
function saveRoutesToFile() {
  if (!useDatabase) {
    try {
      fs.writeFileSync(routesFile, JSON.stringify(contentRoutes, null, 2));
    } catch (error) {
      console.error('Error saving routes to file:', error.message);
    }
  }
}

// Database operations
async function saveRouteToDatabase(route, type, content) {
  if (!useDatabase) return false;
  
  try {
    await pool.query(
      `INSERT INTO routes (route, type, content, updated_at) 
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       ON CONFLICT (route) 
       DO UPDATE SET type = $2, content = $3, updated_at = CURRENT_TIMESTAMP`,
      [route, type, JSON.stringify(content)]
    );
    return true;
  } catch (error) {
    console.error('Database save error:', error.message);
    return false;
  }
}

async function getRoutesFromDatabase() {
  if (!useDatabase) return null;
  
  try {
    const result = await pool.query('SELECT route, type, content FROM routes ORDER BY route');
    return result.rows.map(row => ({
      route: row.route,
      type: row.type,
      content: JSON.parse(row.content)
    }));
  } catch (error) {
    console.error('Database fetch error:', error.message);
    return null;
  }
}

async function deleteRouteFromDatabase(route) {
  if (!useDatabase) return false;
  
  try {
    const result = await pool.query('DELETE FROM routes WHERE route = $1', [route]);
    return result.rowCount > 0;
  } catch (error) {
    console.error('Database delete error:', error.message);
    return false;
  }
}

async function getRouteFromDatabase(route) {
  if (!useDatabase) return null;
  
  try {
    const result = await pool.query('SELECT type, content FROM routes WHERE route = $1', [route]);
    if (result.rows.length > 0) {
      return {
        type: result.rows[0].type,
        content: JSON.parse(result.rows[0].content)
      };
    }
    return null;
  } catch (error) {
    console.error('Database fetch single route error:', error.message);
    return null;
  }
}

// Serve the main UI
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to get all routes
app.get('/api/routes', async (req, res) => {
  try {
    if (useDatabase) {
      const routes = await getRoutesFromDatabase();
      if (routes !== null) {
        return res.json(routes);
      }
    }
    
    // Fallback to in-memory storage
    const routes = Object.keys(contentRoutes).map(route => ({
      route,
      type: contentRoutes[route].type,
      content: contentRoutes[route].content
    }));
    res.json(routes);
  } catch (error) {
    console.error('Error fetching routes:', error.message);
    res.status(500).json({ error: 'Failed to fetch routes' });
  }
});

// API endpoint to add/update a route
app.post('/api/routes', async (req, res) => {
  const { route, content, type } = req.body;
  
  if (!route || !content || !type) {
    return res.status(400).json({ error: 'Route, content, and type are required' });
  }
  
  // Ensure route starts with /
  const cleanRoute = route.startsWith('/') ? route : `/${route}`;
  
  try {
    let processedContent;
    
    if (type === 'json') {
      // Validate JSON
      processedContent = typeof content === 'string' ? JSON.parse(content) : content;
    } else if (type === 'html') {
      // Store HTML as string
      processedContent = content;
    } else {
      return res.status(400).json({ error: 'Type must be either "json" or "html"' });
    }
    
    // Try database first
    if (useDatabase) {
      const saved = await saveRouteToDatabase(cleanRoute, type, processedContent);
      if (saved) {
        return res.json({ message: 'Route added successfully', route: cleanRoute, type, storage: 'database' });
      }
    }
    
    // Fallback to in-memory/file storage
    contentRoutes[cleanRoute] = {
      type: type,
      content: processedContent
    };
    saveRoutesToFile();
    
    res.json({ message: 'Route added successfully', route: cleanRoute, type, storage: 'file' });
  } catch (error) {
    if (type === 'json') {
      res.status(400).json({ error: 'Invalid JSON format' });
    } else {
      res.status(400).json({ error: 'Error processing content' });
    }
  }
});

// API endpoint to delete a route
app.delete('/api/routes/:route(*)', async (req, res) => {
  const route = '/' + req.params.route;
  
  try {
    // Try database first
    if (useDatabase) {
      const deleted = await deleteRouteFromDatabase(route);
      if (deleted) {
        return res.json({ message: 'Route deleted successfully', storage: 'database' });
      }
    }
    
    // Fallback to in-memory storage
    if (contentRoutes[route]) {
      delete contentRoutes[route];
      saveRoutesToFile();
      res.json({ message: 'Route deleted successfully', storage: 'file' });
    } else {
      res.status(404).json({ error: 'Route not found' });
    }
  } catch (error) {
    console.error('Error deleting route:', error.message);
    res.status(500).json({ error: 'Failed to delete route' });
  }
});

// Dynamic route handler for content endpoints
app.get('*', async (req, res) => {
  const route = req.path;
  
  try {
    // Try database first
    if (useDatabase) {
      const routeData = await getRouteFromDatabase(route);
      if (routeData) {
        if (routeData.type === 'json') {
          return res.json(routeData.content);
        } else if (routeData.type === 'html') {
          res.setHeader('Content-Type', 'text/html');
          return res.send(routeData.content);
        }
      }
    }
    
    // Fallback to in-memory storage
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
  } catch (error) {
    console.error('Error serving route:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 JSON & HTML Host Server running on http://localhost:${PORT}`);
  console.log(`📋 Admin interface: http://localhost:${PORT}`);
  console.log(`💾 Storage: ${useDatabase ? 'PostgreSQL Database' : 'Local File'}`);
  if (!useDatabase) {
    console.log(`📁 Routes saved to: ${routesFile}`);
  }
}); 