// Geo Engine: Haversine distance, Geofencing (15km farm-hub, 50km hub-buyer) & Risk scoring

const EARTH_RADIUS_KM = 6371.0;

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
 * Calculates great-circle distance between two points on Earth using Haversine formula
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} distance in kilometers
 */
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((EARTH_RADIUS_KM * c).toFixed(2));
}

/**
 * Validates Farm -> Hub constraint (<= 15 km)
 */
function validateFarmToHubGeofence(farmLat, farmLon, hubLat, hubLon) {
  const distanceKm = calculateHaversineDistance(farmLat, farmLon, hubLat, hubLon);
  const MAX_FARM_HUB_KM = 15.0;
  return {
    distanceKm,
    allowedMaxKm: MAX_FARM_HUB_KM,
    isValid: distanceKm <= MAX_FARM_HUB_KM,
    penaltyFactor: distanceKm > MAX_FARM_HUB_KM ? (distanceKm - MAX_FARM_HUB_KM) * 12 : 0
  };
}

/**
 * Validates Hub -> Buyer constraint (<= 50 km)
 */
function validateHubToBuyerGeofence(hubLat, hubLon, buyerLat, buyerLon) {
  const distanceKm = calculateHaversineDistance(hubLat, hubLon, buyerLat, buyerLon);
  const MAX_HUB_BUYER_KM = 50.0;
  return {
    distanceKm,
    allowedMaxKm: MAX_HUB_BUYER_KM,
    isValid: distanceKm <= MAX_HUB_BUYER_KM
  };
}

/**
 * Finds the nearest Hub from a collection of hubs
 */
function findNearestHub(lat, lon, hubs) {
  if (!hubs || hubs.length === 0) return null;
  let nearest = null;
  let minDistance = Infinity;

  for (const hub of hubs) {
    const dist = calculateHaversineDistance(lat, lon, hub.latitude, hub.longitude);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = { ...hub, distanceKm: dist };
    }
  }
  return nearest;
}

/**
 * Finds the nearest Buyer from a collection of buyers
 */
function findNearestBuyer(lat, lon, buyers) {
  if (!buyers || buyers.length === 0) return null;
  let nearest = null;
  let minDistance = Infinity;

  for (const buyer of buyers) {
    const dist = calculateHaversineDistance(lat, lon, buyer.latitude, buyer.longitude);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = { ...buyer, distanceKm: dist };
    }
  }
  return nearest;
}

/**
 * Computes Risk Score based on NASA FIRMS satellite data
 * FRP (Fire Radiative Power), Brightness Kelvin, Confidence
 */
function computeHotspotRiskScore(hotspot) {
  const frp = parseFloat(hotspot.frp) || 0;
  const brightness = parseFloat(hotspot.bright_ti4) || 300;
  const confidence = hotspot.confidence || 'nominal';

  let score = 0;
  // FRP contribution
  score += Math.min(frp * 2, 50);
  // Thermal brightness contribution (above 310K)
  if (brightness > 310) {
    score += Math.min((brightness - 310) * 1.5, 30);
  }
  // Satellite confidence multiplier
  if (confidence === 'high' || confidence === 'h') score += 20;
  else if (confidence === 'nominal' || confidence === 'n') score += 10;
  else score += 5;

  score = Math.min(Math.round(score), 100);

  let riskCategory = 'LOW';
  if (score >= 75) riskCategory = 'CRITICAL';
  else if (score >= 50) riskCategory = 'HIGH';
  else if (score >= 25) riskCategory = 'MEDIUM';

  return { score, riskCategory };
}

module.exports = {
  calculateHaversineDistance,
  validateFarmToHubGeofence,
  validateHubToBuyerGeofence,
  findNearestHub,
  findNearestBuyer,
  computeHotspotRiskScore
};
