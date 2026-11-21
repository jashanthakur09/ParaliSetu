const express = require('express');
const router = express.Router();
const { readDB } = require('../data/store');

// GET /api/bookings — list all bookings across all clusters
router.get('/', (req, res) => {
  try {
    const db = readDB();
    const allBookings = [];
    for (const cluster of db.clusters || []) {
      for (const b of cluster.bookings || []) {
        allBookings.push({ ...b, cluster_id: cluster.id, village: cluster.village });
      }
    }
    res.json({ bookings: allBookings, count: allBookings.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper: validate booking inputs
function validateBookingInput(booking) {
  if (!booking.farmer_name || typeof booking.farmer_name !== 'string') {
    return 'farmer_name is required';
  }
  if (!booking.phone || typeof booking.phone !== 'string') {
    return 'phone number is required';
  }
  if (!booking.acres || typeof booking.acres !== 'number' || booking.acres <= 0) {
    return 'acres must be a positive number';
  }
  return null;
}

module.exports = router;
