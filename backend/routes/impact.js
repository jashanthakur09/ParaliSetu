const express = require('express');
const router = express.Router();
const { readDB } = require('../data/store');
const {
  STRAW_YIELD_PER_ACRE,
  calculateImpact,
  calculateSeasonSimulation,
  FARMER_SHARE_PCT,
  BUYER_RATE_PER_TONNE,
  COORDINATOR_PER_ACRE
} = require('../services/economics');

// GET /api/impact
router.get('/', (req, res) => {
  try {
    const db = readDB();

    // Calculate total tonnes diverted from all dispatched/operating clusters
    const dispatchedClusters = db.clusters.filter(c => c.status === 'Machine Dispatched');
    const totalDispatchedAcres = dispatchedClusters.reduce((s, c) => s + c.total_booked_acres, 0);
    const totalTonnesDiverted = totalDispatchedAcres * STRAW_YIELD_PER_ACRE;

    // Also count settled lots
    const settledLots = db.lots.filter(l => l.status === 'Reserved & Settled');
    const settledTonnes = settledLots.reduce((s, l) => s + l.tonnes, 0);

    const totalDiverted = totalTonnesDiverted + settledTonnes;

    const impact = calculateImpact(totalDiverted);

    // Financial aggregates
    const totalAcres = totalDiverted / STRAW_YIELD_PER_ACRE;
    const ruralCashPaid = settledLots.reduce((s, l) => s + (l.settlement?.farmer_share_inr || 0) + (l.settlement?.coordinator_share_inr || 0), 0);
    const platformNet = settledLots.reduce((s, l) => s + (l.settlement?.platform_net_inr || 0), 0);

    const seasonSim = calculateSeasonSimulation();

    res.json({
      tonnes_diverted: totalDiverted,
      co2_avoided_tonnes: impact.co2_avoided_tonnes,
      pm25_prevented_kg: impact.pm25_prevented_kg,
      farmer_clearing_saved_inr: impact.farmer_clearing_saved_inr,
      rural_cash_paid_inr: ruralCashPaid,
      platform_net_profit_inr: platformNet,
      acres_covered: totalAcres,
      dispatched_clusters: dispatchedClusters.length,
      settled_lots: settledLots.length,
      season_simulator: seasonSim
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
