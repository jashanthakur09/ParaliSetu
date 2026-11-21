const express = require('express');
const router = express.Router();
const { readDB } = require('../data/store');

// GET /api/clusters — returns all village clusters with nested bookings
router.get('/', (req, res) => {
  try {
    const db = readDB();
    res.json({ clusters: db.clusters || [], count: (db.clusters || []).length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
