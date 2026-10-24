const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT_DIR = path.join(__dirname, 'landing-page');
const ZIP_PATH = path.join(__dirname, '..', 'ClipMind-AI-v1.0.0.zip');
const POOL_PATH = path.join(__dirname, 'keys-pool.json');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.zip': 'application/zip',
  '.json': 'application/json'
};

function readKeysPool() {
  try {
    if (fs.existsSync(POOL_PATH)) {
      return JSON.parse(fs.readFileSync(POOL_PATH, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading keys pool:', err);
  }
  return [];
}

function writeKeysPool(pool) {
  try {
    fs.writeFileSync(POOL_PATH, JSON.stringify(pool, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing keys pool:', err);
  }
}

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  let reqPath = req.url.split('?')[0];

  // 1. API: Check Remaining Keys Stock
  if (reqPath === '/api/keys-status') {
    const pool = readKeysPool();
    const remaining = pool.filter(k => !k.used).length;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: true, remaining, total: pool.length }));
  }

  // 2. API: Automatic CD-Key Dispenser (100% Automated Auto-Delivery)
  if (reqPath === '/api/claim-key') {
    const pool = readKeysPool();
    const unusedItem = pool.find(k => !k.used);

    if (!unusedItem) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({
        success: false,
        message: '库存卡密已全部分配完毕，请联系店长补货！'
      }));
    }

    // Mark as used
    unusedItem.used = true;
    unusedItem.claimedAt = new Date().toISOString();
    writeKeysPool(pool);

    const remaining = pool.filter(k => !k.used).length;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      success: true,
      key: unusedItem.key,
      remaining
    }));
  }

  // 3. Download Zip Package
  if (reqPath === '/ClipMind-AI-v1.0.0.zip') {
    if (fs.existsSync(ZIP_PATH)) {
      res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="ClipMind-AI-v1.0.0.zip"'
      });
      return fs.createReadStream(ZIP_PATH).pipe(res);
    }
  }

  // 4. Static Files (Landing Page)
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const filePath = path.join(ROOT_DIR, reqPath);
  const ext = path.extname(filePath).toLowerCase();

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 Not Found');
    }

    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`ClipMind AI Auto-Dispenser Server running on port ${PORT}`);
});
