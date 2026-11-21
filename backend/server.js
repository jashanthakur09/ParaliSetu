require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { resetDemoData, readDB } = require('./data/store');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure DB exists on startup
readDB();

// Mount routes
const hotspotsRouter = require('./routes/hotspots');
const clustersRouter = require('./routes/clusters');
const bookingsRouter = require('./routes/bookings');
const lotsRouter = require('./routes/lots');
const impactRouter = require('./routes/impact');

app.use('/api/hotspots', hotspotsRouter);
app.use('/api/clusters', clustersRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/lots', lotsRouter);
app.use('/api/impact', impactRouter);

// Direct fleet endpoint at /api/fleet
app.get('/api/fleet', (req, res) => {
  try {
    const db = readDB();
    res.json({
      balers: db.balers || [],
      storage_hubs: db.storage_hubs || [],
      buyers: db.buyers || []
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset endpoint
app.post('/api/reset', (req, res) => {
  try {
    const data = resetDemoData();
    res.json({ message: 'Demo data reset to initial state', summary: { clusters: data.clusters.length, balers: data.balers.length, hotspots: data.hotspots.length, lots: data.lots.length } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n🌾 ParaliSetu Backend running on http://localhost:${PORT}`);
  console.log(`   Endpoints:`);
  console.log(`   GET  /api/health`);
  console.log(`   GET  /api/hotspots`);
  console.log(`   GET  /api/clusters`);
  console.log(`   GET  /api/fleet`);
  console.log(`   POST /api/bookings`);
  console.log(`   GET  /api/lots`);
  console.log(`   POST /api/lots/:id/reserve`);
  console.log(`   GET  /api/impact`);
  console.log(`   POST /api/reset\n`);
});
