const express = require('express');
const router = express.Router();
const { readDB } = require('../data/store');

// GET /api/impact — basic environmental and operational aggregates
router.get('/', (req, res) => {
  try {
    const db = readDB();
    const dispatched = (db.clusters || []).filter(c => c.status === 'Machine Dispatched');
    const totalAcres = dispatched.reduce((s, c) => s + (c.total_booked_acres || 0), 0);
    const tonnesDiverted = totalAcres * 2.0;

    res.json({
      tonnes_diverted: tonnesDiverted,
      acres_covered: totalAcres,
      dispatched_clusters: dispatched.length,
      settled_lots: (db.lots || []).filter(l => l.status === 'Reserved & Settled').length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
