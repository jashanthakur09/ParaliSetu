const express = require('express');
const router = express.Router();
const { readDB } = require('../data/store');

// GET /api/lots?buyer_id=X — list verified lots with storage hub references
router.get('/', (req, res) => {
  try {
    const db = readDB();
    let lots = db.lots || [];
    const { buyer_id } = req.query;

    lots = lots.map(lot => {
      const hub = db.storage_hubs.find(h => h.id === lot.hub_id);
      const buyer = db.buyers.find(b => b.id === lot.buyer_id);
      return {
        ...lot,
        hub_name: hub?.name,
        buyer_name: buyer?.name
      };
    });

    if (buyer_id) {
      lots = lots.filter(l => l.buyer_id === buyer_id);
    }

    res.json({ lots, count: lots.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
