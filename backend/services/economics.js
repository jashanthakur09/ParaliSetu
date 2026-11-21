// ---------------------------------------------------------------------------
// economics.js – Core domain-logic engine for the ParaliSetu platform
// ---------------------------------------------------------------------------

// ── Constants ───────────────────────────────────────────────────────────────

const STRAW_YIELD_PER_ACRE = 2.0;       // tonnes
const BUYER_RATE_PER_TONNE = 1800;       // ₹
const GROSS_PER_ACRE = STRAW_YIELD_PER_ACRE * BUYER_RATE_PER_TONNE; // 3600

const FARMER_SHARE_PCT = 0.05;           // 5% of gross = ₹180/acre = ₹90/tonne
const COORDINATOR_PER_ACRE = 120;        // ₹120/acre = ₹60/tonne (captain OR referrer, never both)
const TRANSPORT_HUB_PER_ACRE = 1100;     // ₹1,100/acre

// Baler lease cost depends on lease_type
const BALER_COST = {
  '45_day_seasonal': { per_acre: 1400, season_acres: 700 },
  '15_day_peak':     { per_acre: 1436, season_acres: 240 }
};

const CO2_PER_TONNE = 1.46;             // tonnes CO₂ avoided per tonne straw
const PM25_PER_TONNE = 3.0;             // kg PM2.5 prevented per tonne straw
const FARMER_CLEARING_SAVED_PER_ACRE = 4000; // ₹ saved (not burning)

// ── Geo helpers ─────────────────────────────────────────────────────────────

/**
 * haversineKm(lat1, lng1, lat2, lng2) → number (km)
 * Standard haversine formula using Earth radius 6371 km.
 */
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * checkGeoFence(type, distKm) → { ok: boolean, limit: number }
 * type 'village_to_hub' → limit 15 km
 * type 'hub_to_buyer'   → limit 50 km
 */
function checkGeoFence(type, distKm) {
  const limits = {
    village_to_hub: 15,
    hub_to_buyer:   50
  };

  const limit = limits[type];
  if (limit === undefined) {
    throw new Error(`Unknown geo-fence type: ${type}`);
  }

  return { ok: distKm <= limit, limit };
}

// ── Scheduling ──────────────────────────────────────────────────────────────

/**
 * calculateDispatchDate(latestHarvestDate) → string (ISO date)
 * Returns max(tomorrow, latestHarvestDate + 3 days) as YYYY-MM-DD string.
 * The 3-day buffer ensures baled straw dries below 20% moisture.
 */
function calculateDispatchDate(latestHarvestDate) {
  // Tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  // latestHarvestDate + 3 days
  const harvest = new Date(latestHarvestDate);
  harvest.setDate(harvest.getDate() + 3);
  harvest.setHours(0, 0, 0, 0);

  const dispatch = harvest > tomorrow ? harvest : tomorrow;

  // Format as YYYY-MM-DD
  const y = dispatch.getFullYear();
  const m = String(dispatch.getMonth() + 1).padStart(2, '0');
  const d = String(dispatch.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// ── Baler matching ──────────────────────────────────────────────────────────

/**
 * findNearestIdleBaler(balers, clusterLat, clusterLng) → baler object or null
 * Filters balers with status === 'Idle', picks the one with minimum haversine distance.
 */
function findNearestIdleBaler(balers, clusterLat, clusterLng) {
  if (!balers || balers.length === 0) return null;

  const idleBalers = balers.filter((b) => b.status === 'Idle');
  if (idleBalers.length === 0) return null;

  let nearest = null;
  let minDist = Infinity;

  for (const baler of idleBalers) {
    const dist = haversineKm(clusterLat, clusterLng, baler.lat, baler.lng);
    if (dist < minDist) {
      minDist = dist;
      nearest = baler;
    }
  }

  return nearest;
}

// ── Financial calculations ──────────────────────────────────────────────────

/**
 * calculateSettlement(tonnes, leaseType) → object
 * Returns full cost/revenue breakdown for a given tonnage and baler lease type.
 */
function calculateSettlement(tonnes, leaseType) {
  const acres = tonnes / STRAW_YIELD_PER_ACRE;

  const gross_revenue_inr    = tonnes * BUYER_RATE_PER_TONNE;
  const farmer_share_inr     = gross_revenue_inr * FARMER_SHARE_PCT;
  const coordinator_share_inr = acres * COORDINATOR_PER_ACRE;
  const baler_opex_inr       = acres * BALER_COST[leaseType].per_acre;
  const transport_hub_inr    = acres * TRANSPORT_HUB_PER_ACRE;
  const platform_net_inr     = gross_revenue_inr - farmer_share_inr -
                                coordinator_share_inr - baler_opex_inr -
                                transport_hub_inr;

  return {
    gross_revenue_inr,
    farmer_share_inr,
    coordinator_share_inr,
    baler_opex_inr,
    transport_hub_inr,
    platform_net_inr
  };
}

// ── Impact metrics ──────────────────────────────────────────────────────────

/**
 * calculateImpact(totalTonnesDiverted) → object
 * Returns environmental and economic impact metrics.
 */
function calculateImpact(totalTonnesDiverted) {
  const acres_equivalent = totalTonnesDiverted / STRAW_YIELD_PER_ACRE;

  return {
    tonnes_diverted:           totalTonnesDiverted,
    co2_avoided_tonnes:        totalTonnesDiverted * CO2_PER_TONNE,
    pm25_prevented_kg:         totalTonnesDiverted * PM25_PER_TONNE,
    farmer_clearing_saved_inr: acres_equivalent * FARMER_CLEARING_SAVED_PER_ACRE,
    acres_equivalent
  };
}

// ── Season simulation ───────────────────────────────────────────────────────

/**
 * calculateSeasonSimulation() → object
 * Returns metrics for a hypothetical 700-acre seasonal operation.
 */
function calculateSeasonSimulation() {
  const total_acres  = 700;
  const total_tonnes = total_acres * STRAW_YIELD_PER_ACRE; // 1400

  const gross_revenue = total_acres * GROSS_PER_ACRE;      // 2,520,000

  const seasonal_lease = {
    per_acre: BALER_COST['45_day_seasonal'].per_acre,       // 1400
    total:    total_acres * BALER_COST['45_day_seasonal'].per_acre // 980,000
  };

  const peak_lease = {
    per_acre: BALER_COST['15_day_peak'].per_acre,           // 1436
    total:    total_acres * BALER_COST['15_day_peak'].per_acre // 1,005,200
  };

  const farmer_payout_per_acre = GROSS_PER_ACRE * FARMER_SHARE_PCT; // 180
  const farmer_payout      = total_acres * farmer_payout_per_acre;  // 126,000
  const coordinator_payout = total_acres * COORDINATOR_PER_ACRE;    // 84,000
  const transport_hub      = total_acres * TRANSPORT_HUB_PER_ACRE;  // 770,000

  // Platform net using seasonal lease
  const platform_net_seasonal = gross_revenue - farmer_payout -
                                 coordinator_payout - seasonal_lease.total -
                                 transport_hub; // 560,000

  const platform_margin_pct = parseFloat(
    ((platform_net_seasonal / gross_revenue) * 100).toFixed(1)
  ); // 22.2

  return {
    total_acres,
    total_tonnes,
    gross_revenue,
    seasonal_lease,
    peak_lease,
    farmer_payout,
    coordinator_payout,
    transport_hub,
    platform_net_seasonal,
    platform_margin_pct
  };
}

// ── Exports ─────────────────────────────────────────────────────────────────

module.exports = {
  STRAW_YIELD_PER_ACRE,
  BUYER_RATE_PER_TONNE,
  GROSS_PER_ACRE,
  FARMER_SHARE_PCT,
  COORDINATOR_PER_ACRE,
  TRANSPORT_HUB_PER_ACRE,
  BALER_COST,
  CO2_PER_TONNE,
  PM25_PER_TONNE,
  FARMER_CLEARING_SAVED_PER_ACRE,
  haversineKm,
  checkGeoFence,
  calculateDispatchDate,
  findNearestIdleBaler,
  calculateSettlement,
  calculateImpact,
  calculateSeasonSimulation
};
