const express = require('express');
const router = express.Router();
const { readDB } = require('../data/store');

// GET /api/clusters — returns all village clusters
router.get('/', (req, res) => {
  try {
    const db = readDB();
    const clusters = (db.clusters || []).map(c => ({
      id: c.id,
      village: c.village,
      district: c.district,
      lat: c.lat,
      lng: c.lng,
      total_booked_acres: c.total_booked_acres,
      status: c.status,
      threshold_acres: c.threshold_acres,
      assigned_hub_id: c.assigned_hub_id
    }));
    res.json({ clusters, count: clusters.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
