/**
 * unified-scrollbar - Demo Server
 * Serves the demo page on http://localhost:3456
 */

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3456;
const DEMO_DIR = path.join(__dirname, '..', 'demo');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png':  'image/png',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

const server = http.createServer((req, res) => {
  let urlPath = req.url === '/' ? '/index.html' : req.url;
  // Strip query string
  urlPath = urlPath.split('?')[0];

  // Allow serving from dist/ for the demo
  let filePath;
  if (urlPath.startsWith('/dist/')) {
    filePath = path.join(__dirname, '..', urlPath);
  } else {
    filePath = path.join(DEMO_DIR, urlPath);
  }

  const ext = path.extname(filePath);
  const mime = MIME_TYPES[ext] || 'text/plain';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`404 Not Found: ${urlPath}`);
      return;
    }
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n🚀  Demo running at http://localhost:${PORT}\n`);
  console.log('    Press Ctrl+C to stop.\n');
});
