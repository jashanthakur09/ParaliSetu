// economics.js – Core domain-logic engine for the ParaliSetu platform

const STRAW_YIELD_PER_ACRE = 2.0;       // tonnes
const BUYER_RATE_PER_TONNE = 1800;       // ₹
const GROSS_PER_ACRE = STRAW_YIELD_PER_ACRE * BUYER_RATE_PER_TONNE; // 3600

const FARMER_SHARE_PCT = 0.05;           // 5% of gross = ₹180/acre = ₹90/tonne
const COORDINATOR_PER_ACRE = 120;        // ₹120/acre = ₹60/tonne (captain OR referrer, never both)
const TRANSPORT_HUB_PER_ACRE = 1100;     // ₹1,100/acre

const BALER_COST = {
  '45_day_seasonal': { per_acre: 1400, season_acres: 700 },
  '15_day_peak':     { per_acre: 1436, season_acres: 240 }
};

const CO2_PER_TONNE = 1.46;             // tonnes CO₂ avoided per tonne straw
const PM25_PER_TONNE = 3.0;             // kg PM2.5 prevented per tonne straw
const FARMER_CLEARING_SAVED_PER_ACRE = 4000; // ₹ saved (not burning)

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
  checkGeoFence
};
