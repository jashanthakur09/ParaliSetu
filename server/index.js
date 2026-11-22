// ParaliSetu: Satellite-Guided Stubble Aggregation & Automated Rural Dispatch Engine
// Standalone Native Node.js Server (Zero External Dependencies)

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const firmsService = require('./services/firmsService');
const dataStore = require('./services/dataStore');
const {
  calculateHaversineDistance,
  validateFarmToHubGeofence,
  validateHubToBuyerGeofence
} = require('./services/geoEngine');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, '../public');

// MIME types for static assets
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-nasa-key'
  });
  res.end(JSON.stringify(data, null, 2));
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) {
        req.connection.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function serveStatic(req, res, pathname) {
  let safePath = pathname === '/' ? '/index.html' : pathname;
  let filePath = path.join(PUBLIC_DIR, safePath);

  // Security check to prevent directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA
      filePath = path.join(PUBLIC_DIR, 'index.html');
    }

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });
      res.end(content);
    });
  });
}

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-nasa-key'
    });
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  try {
    // -------------------------------------------------------------
    // API: NASA FIRMS Satellite Endpoints
    // -------------------------------------------------------------
    if (pathname === '/api/firms/status' && method === 'GET') {
      return sendJson(res, 200, firmsService.getStatus());
    }

    if (pathname === '/api/firms/hotspots' && method === 'GET') {
      const hotspots = firmsService.getHotspots();
      return sendJson(res, 200, {
        success: true,
        source: firmsService.source,
        mode: firmsService.dataSourceMode,
        count: hotspots.length,
        hotspots: hotspots
      });
    }

    if (pathname === '/api/firms/key' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { apiKey, syncNow } = body;

      firmsService.setApiKey(apiKey);

      let fetchResult = null;
      if (syncNow || (apiKey && apiKey.length >= 16)) {
        fetchResult = await firmsService.testAndFetch(apiKey);
      }

      return sendJson(res, 200, {
        success: true,
        status: firmsService.getStatus(),
        fetchResult: fetchResult
      });
    }

    if (pathname === '/api/firms/sync' && method === 'POST') {
      const body = await parseJsonBody(req);
      const result = await firmsService.testAndFetch(body.apiKey);
      return sendJson(res, 200, result);
    }

    // -------------------------------------------------------------
    // API: Hubs, Buyers, and GeoEngine Endpoints
    // -------------------------------------------------------------
    if (pathname === '/api/hubs-buyers' && method === 'GET') {
      return sendJson(res, 200, {
        hubs: dataStore.hubs,
        buyers: dataStore.buyers
      });
    }

    if (pathname === '/api/geo/check' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { farmLat, farmLon, hubId, buyerId } = body;

      const hub = dataStore.hubs.find(h => h.id === hubId) || dataStore.hubs[0];
      const buyer = dataStore.buyers.find(b => b.id === buyerId) || dataStore.buyers[0];

      const farmToHub = validateFarmToHubGeofence(farmLat, farmLon, hub.latitude, hub.longitude);
      const hubToBuyer = validateHubToBuyerGeofence(hub.latitude, hub.longitude, buyer.latitude, buyer.longitude);

      return sendJson(res, 200, {
        farmToHub: {
          hubName: hub.name,
          ...farmToHub
        },
        hubToBuyer: {
          hubName: hub.name,
          buyerName: buyer.name,
          ...hubToBuyer
        }
      });
    }

    // -------------------------------------------------------------
    // API: Clusters & Farmer Pooling (20-Acre Rule)
    // -------------------------------------------------------------
    if (pathname === '/api/clusters' && method === 'GET') {
      return sendJson(res, 200, {
        clusters: dataStore.clusters,
        farms: dataStore.farms
      });
    }

    if (pathname === '/api/captain/batch' && method === 'POST') {
      const body = await parseJsonBody(req);

      // Support multi-farmer batch submission from Sarpanch
      if (Array.isArray(body.farmers) && body.farmers.length > 0) {
        const villageName = body.village || 'Kheri';
        const captainName = body.captainName || 'Jaswant Singh (Sarpanch)';
        const captainPhone = body.captainPhone || '+91 98721 34567';
        const referralCode = body.referralCode || `SARPANCH-${villageName.toUpperCase()}`;

        const addedFarms = [];
        for (const f of body.farmers) {
          if (!f.farmerName || !f.acres) continue;
          const entry = dataStore.addFarmerBatch({
            captainName,
            captainPhone,
            farmerName: f.farmerName,
            farmerPhone: f.phone || f.farmerPhone || '+91 98140 00000',
            village: villageName,
            district: body.district || 'Sangrur',
            acres: parseFloat(f.acres) || 0,
            harvestDate: f.harvestDate || new Date().toISOString().split('T')[0],
            referredBy: null, // Sarpanch entry has no referredBy
            referralCode: referralCode
          });
          addedFarms.push(entry);
        }

        const totalBatchAcres = addedFarms.reduce((sum, f) => sum + f.acres, 0);
        return sendJson(res, 201, {
          success: true,
          mode: 'batch',
          count: addedFarms.length,
          totalAcres: totalBatchAcres,
          message: `Successfully registered Panchayat batch of ${addedFarms.length} farmers (${totalBatchAcres.toFixed(1)} acres) for ${villageName}.`,
          farms: addedFarms,
          clusters: dataStore.clusters,
          impact: dataStore.getImpactMetrics()
        });
      }

      // Single entry submission (e.g. Individual Landholder)
      if (!body.farmerName || !body.village || !body.acres) {
        return sendJson(res, 400, { success: false, message: 'Farmer name, village, and acreage are required.' });
      }

      const farmEntry = dataStore.addFarmerBatch(body);
      return sendJson(res, 201, {
        success: true,
        mode: 'single',
        message: `Successfully logged ${farmEntry.farmerName}'s ${farmEntry.acres} acres for village ${farmEntry.village}.`,
        farm: farmEntry,
        clusters: dataStore.clusters,
        impact: dataStore.getImpactMetrics()
      });
    }

    // -------------------------------------------------------------
    // API: Automated Rural Dispatch Engine
    // -------------------------------------------------------------
    if (pathname === '/api/dispatch/fleet' && method === 'GET') {
      return sendJson(res, 200, {
        fleet: dataStore.balerFleet
      });
    }

    if (pathname === '/api/dispatch/trigger' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { clusterId } = body;
      const result = dataStore.attemptAutoDispatch(clusterId);
      return sendJson(res, 200, result);
    }

    if (pathname === '/api/dispatch/advance' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { clusterId } = body;
      const updated = dataStore.advanceClusterStage(clusterId);
      return sendJson(res, 200, {
        success: Boolean(updated),
        cluster: updated
      });
    }

    // -------------------------------------------------------------
    // API: 3-Way Auto Settlement Ledger & Invoices
    // -------------------------------------------------------------
    if (pathname === '/api/settlement/ledger' && method === 'GET') {
      return sendJson(res, 200, {
        unitEconomicsPerAcre: {
          factoryRevenue: 3600,
          balerMachineryCost: -1400,
          logisticsHubCost: -1100,
          farmerShare: 180,
          referralCaptainPool: 120,
          platformNetProfit: 800,
          currency: 'INR'
        },
        settlements: dataStore.settlements
      });
    }

    // -------------------------------------------------------------
    // API: Climate & Financial Impact Dashboard
    // -------------------------------------------------------------
    if ((pathname === '/api/impact/stats' || pathname === '/api/impact') && method === 'GET') {
      return sendJson(res, 200, dataStore.getImpactMetrics());
    }

    // -------------------------------------------------------------
    // API: System Overview & Diagnostics
    // -------------------------------------------------------------
    if (pathname === '/api/health' && method === 'GET') {
      return sendJson(res, 200, {
        status: 'UP',
        system: 'ParaliSetu v1.0',
        uptime: process.uptime(),
        firmsMode: firmsService.dataSourceMode,
        activeHotspots: firmsService.cachedHotspots.length
      });
    }

    // Fallthrough: Serve Static Web Assets
    return serveStatic(req, res, pathname);

  } catch (err) {
    console.error('API Error:', err);
    return sendJson(res, 500, { success: false, error: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  🌾 PARALISETU - Rural Dispatch & Stubble Engine 🌾`);
  console.log(`  Track: AgriTech / ClimateTech / Logistics`);
  console.log(`  Running live at http://localhost:${PORT}`);
  console.log(`  NASA FIRMS Status: ${firmsService.dataSourceMode}`);
  console.log(`====================================================`);
});
