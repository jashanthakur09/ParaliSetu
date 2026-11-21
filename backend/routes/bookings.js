const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../data/store');
const {
  STRAW_YIELD_PER_ACRE,
  calculateDispatchDate,
  findNearestIdleBaler,
  haversineKm
} = require('../services/economics');

// POST /api/bookings
// Body: { cluster_id, bookings: [{ farmer_name, phone, acres, booking_mode, referred_by? }] }
// Or single: { cluster_id, farmer_name, phone, acres, booking_mode, referred_by? }
router.post('/', (req, res) => {
  try {
    const db = readDB();
    const { cluster_id } = req.body;

    // Find the target cluster
    const cluster = db.clusters.find(c => c.id === cluster_id);
    if (!cluster) {
      return res.status(404).json({ error: `Cluster ${cluster_id} not found` });
    }

    // Normalize to array of bookings
    let bookingInputs = req.body.bookings || [req.body];
    // Filter out cluster_id from individual booking objects
    bookingInputs = bookingInputs.map(b => ({
      farmer_name: b.farmer_name,
      phone: b.phone,
      acres: b.acres,
      booking_mode: b.booking_mode || 'self',
      referred_by: b.referred_by || null
    }));

    // Validate
    for (const b of bookingInputs) {
      if (!b.farmer_name || !b.phone || !b.acres || b.acres <= 0) {
        return res.status(400).json({ error: 'Each booking requires farmer_name, phone, and acres > 0' });
      }
    }

    // Generate bookings
    const villageName = cluster.village.toUpperCase();
    const existingCount = cluster.bookings.length;
    const newBookings = bookingInputs.map((b, i) => {
      const seqNum = (existingCount + i + 1) * 100 + Math.floor(Math.random() * 99) + 1;
      return {
        id: `BK-${String(Date.now()).slice(-6)}-${i}`,
        farmer_name: b.farmer_name,
        phone: b.phone,
        acres: b.acres,
        booking_mode: b.booking_mode,
        referred_by: b.referred_by,
        referral_code: `${villageName}-${seqNum}`,
        created_at: new Date().toISOString()
      };
    });

    // Add bookings to cluster
    cluster.bookings.push(...newBookings);
    const addedAcres = newBookings.reduce((sum, b) => sum + b.acres, 0);
    cluster.total_booked_acres += addedAcres;

    // Update latest_harvest_date to today if bookings come in after current harvest date
    const today = new Date().toISOString().split('T')[0];
    if (!cluster.latest_harvest_date || today > cluster.latest_harvest_date) {
      cluster.latest_harvest_date = today;
    }

    let dispatchedBaler = null;
    let newlyUnlocked = false;

    // Check 20-acre dispatch threshold
    if (cluster.total_booked_acres >= cluster.threshold_acres && cluster.status === 'Gathering Demand') {
      cluster.status = 'Machine Dispatched';
      cluster.scheduled_dispatch_date = calculateDispatchDate(cluster.latest_harvest_date);
      newlyUnlocked = true;

      // Find and dispatch nearest idle baler
      const baler = findNearestIdleBaler(db.balers, cluster.lat, cluster.lng);
      if (baler) {
        baler.status = 'Dispatched';
        baler.assigned_cluster_id = cluster.id;
        baler.lat = cluster.lat;
        baler.lng = cluster.lng;
        cluster.assigned_baler_id = baler.id;
        dispatchedBaler = baler;
      }

      // Add tonnage to assigned storage hub
      const hub = db.storage_hubs.find(h => h.id === cluster.assigned_hub_id);
      if (hub) {
        const newTonnes = cluster.total_booked_acres * STRAW_YIELD_PER_ACRE;
        hub.current_tonnes += newTonnes;
      }
    }

    writeDB(db);

    res.status(201).json({
      bookings: newBookings,
      updatedCluster: cluster,
      dispatchedBaler,
      newlyUnlocked
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
