const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../data/store');
const { haversineKm, checkGeoFence, calculateSettlement } = require('../services/economics');

// GET /api/lots?buyer_id=X
router.get('/', (req, res) => {
  try {
    const db = readDB();
    let lots = db.lots || [];
    const { buyer_id } = req.query;

    // Enrich lots with hub/buyer info and distance
    lots = lots.map(lot => {
      const hub = db.storage_hubs.find(h => h.id === lot.hub_id);
      const buyer = db.buyers.find(b => b.id === lot.buyer_id);
      let distance_km = null;
      let geo_fence_ok = null;
      if (hub && buyer) {
        distance_km = Math.round(haversineKm(hub.lat, hub.lng, buyer.lat, buyer.lng) * 10) / 10;
        geo_fence_ok = checkGeoFence('hub_to_buyer', distance_km).ok;
      }
      return { ...lot, hub_name: hub?.name, buyer_name: buyer?.name, distance_km, geo_fence_ok };
    });

    if (buyer_id) {
      lots = lots.filter(l => l.buyer_id === buyer_id);
    }

    res.json({ lots, count: lots.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/lots/:id/reserve
// Body: { buyer_id, lease_type? }
router.post('/:id/reserve', (req, res) => {
  try {
    const db = readDB();
    const lot = db.lots.find(l => l.id === req.params.id);
    if (!lot) {
      return res.status(404).json({ error: `Lot ${req.params.id} not found` });
    }
    if (lot.status !== 'Ready for Pickup') {
      return res.status(400).json({ error: `Lot ${lot.id} is already ${lot.status}` });
    }

    const buyer = db.buyers.find(b => b.id === (req.body.buyer_id || lot.buyer_id));
    if (!buyer) {
      return res.status(404).json({ error: 'Buyer not found' });
    }

    const hub = db.storage_hubs.find(h => h.id === lot.hub_id);
    if (hub) {
      const dist = haversineKm(hub.lat, hub.lng, buyer.lat, buyer.lng);
      const fence = checkGeoFence('hub_to_buyer', dist);
      if (!fence.ok) {
        return res.status(400).json({ error: `Buyer is ${dist.toFixed(1)} km from hub — exceeds ${fence.limit} km geo-fence` });
      }
    }

    const leaseType = req.body.lease_type || '45_day_seasonal';
    const settlement = calculateSettlement(lot.tonnes, leaseType);
    settlement.settled_at = new Date().toISOString();

    lot.status = 'Reserved & Settled';
    lot.settlement = settlement;

    writeDB(db);

    res.json({ lot, settlement });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
