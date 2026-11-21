const express = require('express');
const router = express.Router();
const { readDB } = require('../data/store');

// GET /api/hotspots?district=X
// If NASA_FIRMS_KEY is set in env, attempt to fetch live VIIRS data
// Otherwise, return seeded hotspots (optionally filtered by ?district=)
router.get('/', async (req, res) => {
  try {
    const { district } = req.query;
    const nasaKey = process.env.NASA_FIRMS_KEY;

    if (nasaKey) {
      try {
        // Attempt live NASA FIRMS fetch
        const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${nasaKey}/VIIRS_SNPP_NRT/world/1`;
        // Note: In production, would fetch and filter for Punjab region
        // For now, fall through to seeded data
      } catch (e) {
        // Fall through to seeded data
      }
    }

    const db = readDB();
    let hotspots = db.hotspots || [];
    if (district) {
      hotspots = hotspots.filter(h => h.district.toLowerCase() === district.toLowerCase());
    }
    res.json({ hotspots, source: nasaKey ? 'nasa_firms_fallback' : 'seeded', count: hotspots.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
