import { createServer } from 'http';
import { parse } from 'url';
import handler from './api/index.js';

// Load environment variables from .env.local
import { config } from 'dotenv';
config({ path: '.env.local' });

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3000;

const server = createServer(async (req, res) => {
  try {
    // Parse URL
    const parsedUrl = parse(req.url, true);
    
    // Get request body
    const body = await getRequestBody(req);
    
    // Create request object similar to Vercel's
    const request = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: body,
      // Add query for compatibility
      query: parsedUrl.query,
    };

    // Call the API handler
    await handler(request, res);
  } catch (error) {
    console.error('Server error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
});

function getRequestBody(req) {
  return new Promise((resolve) => {
    if (req.method === 'GET' || req.method === 'HEAD') {
      resolve(undefined);
      return;
    }

    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      if (!body) {
        resolve(undefined);
        return;
      }

      const contentType = req.headers['content-type'] || '';
      if (contentType.includes('application/json')) {
        try {
          resolve(JSON.parse(body));
        } catch {
          // If JSON parsing fails, return as string
          resolve(body);
        }
      } else {
        resolve(body);
      }
    });
  });
}

server.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api/*`);
});

// Handle graceful shutdown
// eslint-disable-next-line no-undef
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server closed');
    // eslint-disable-next-line no-undef
    process.exit(0);
  });
});
