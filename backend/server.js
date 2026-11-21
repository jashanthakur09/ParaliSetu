require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { readDB } = require('./data/store');

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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

module.exports = app;
