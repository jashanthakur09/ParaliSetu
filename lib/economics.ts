// ParaliSetu: Core Economics Engine & Impact Formulas
// Implements exact calculations specified in project specifications

import { LeaseDuration, UnitEconomics } from '../types/paralisetu';

export const ECONOMICS_CONSTANTS = {
  YIELD_TONNES_PER_ACRE: 2.0,
  PRICE_PER_TONNE_INR: 1800,
  GROSS_REVENUE_PER_ACRE_INR: 3600, // 2.0 * 1800
  BALER_DAILY_ACRES_CAPACITY: 20.0, // 1 baler-day = 20 acres
  BALER_DAILY_TONNES_CAPACITY: 40.0, // 20 * 2.0

  // 45-Day Seasonal Lease Model (700 acres / season)
  LEASE_45_DAY: {
    TOTAL_LEASE_COST_INR: 150000,
    SEASONAL_ACRES_TARGET: 700,
    LEASE_COST_PER_ACRE: 214.28,
    OPEX_DIESEL_TWINE_OPERATOR: 1185.72,
    TOTAL_BALER_COST_PER_ACRE: 1400.0, // ₹1,400/acre (₹700/tonne)
    PLATFORM_PROFIT_PER_ACRE: 800.0, // ₹800/acre (₹400/tonne - 22.2%)
    PLATFORM_MARGIN_PERCENT: 22.22
  },

  // 15-Day Peak Window Lease Model (240 acres / peak)
  LEASE_15_DAY: {
    TOTAL_LEASE_COST_INR: 60000,
    SEASONAL_ACRES_TARGET: 240,
    LEASE_COST_PER_ACRE: 250.0,
    OPEX_DIESEL_TWINE_OPERATOR: 1186.0,
    TOTAL_BALER_COST_PER_ACRE: 1436.0, // ₹1,436/acre (₹718/tonne)
    PLATFORM_PROFIT_PER_ACRE: 764.0, // ₹764/acre (₹382/tonne - 21.2%)
    PLATFORM_MARGIN_PERCENT: 21.22
  },

  // Logistics & Storage Hub Breakdown (₹1,100/acre)
  LOGISTICS: {
    TROLLEY_FIELD_TO_HUB_INR: 360,
    HUB_STORAGE_SECURITY_INR: 140,
    TRUCK_FREIGHT_HUB_TO_FACTORY_INR: 600,
    TOTAL_TRANSPORT_HUB_PER_ACRE: 1100.0, // ₹1,100/acre (₹550/tonne)
    MAX_FARM_TO_HUB_KM: 15.0,
    MAX_HUB_TO_BUYER_KM: 50.0
  },

  // Stakeholder Payouts
  PAYOUTS: {
    FARMER_SHARE_PERCENT: 0.05, // 5% of gross revenue
    FARMER_SHARE_PER_ACRE: 180.0, // ₹180/acre (₹90/tonne)
    FARMER_DIESEL_SAVED_PER_ACRE: 4000.0, // Saves ₹3,500-₹5,000 (avg ₹4,000)
    FARMER_TOTAL_SWING_PER_ACRE: 4180.0, // ₹4,000 saved + ₹180 cashback
    COORDINATOR_REFERRAL_PER_ACRE: 120.0, // Single pool: Captain OR Referral (₹60/tonne)
    FARMER_CLEARING_CHARGE: 0 // ₹0 to farmer!
  },

  // Climate Impact Factors
  IMPACT_FACTORS: {
    CO2_TONNES_PER_TONNE_STRAW: 1.46, // 1.46 t CO2 avoided / tonne straw
    PM25_KG_PER_TONNE_STRAW: 3.0, // 3.0 kg PM2.5 smoke stopped / tonne straw
    CO2_TONNES_PER_ACRE: 2.92, // 2.0 * 1.46
    PM25_KG_PER_ACRE: 6.0 // 2.0 * 3.0
  }
};

/**
 * Calculates Unit Economics for given acreage and lease model
 */
export function calculateUnitEconomics(
  acres: number,
  leaseType: LeaseDuration = '45_DAY_SEASONAL'
): UnitEconomics {
  const safeAcres = Math.max(0, acres);
  const tonnes = Number((safeAcres * ECONOMICS_CONSTANTS.YIELD_TONNES_PER_ACRE).toFixed(2));
  const model = leaseType === '45_DAY_SEASONAL' ? ECONOMICS_CONSTANTS.LEASE_45_DAY : ECONOMICS_CONSTANTS.LEASE_15_DAY;

  return {
    leaseType,
    acres: safeAcres,
    tonnes,
    grossRevenuePerAcre: ECONOMICS_CONSTANTS.GROSS_REVENUE_PER_ACRE_INR,
    grossRevenuePerTonne: ECONOMICS_CONSTANTS.PRICE_PER_TONNE_INR,
    balerCostPerAcre: model.TOTAL_BALER_COST_PER_ACRE,
    balerCostPerTonne: Number((model.TOTAL_BALER_COST_PER_ACRE / 2).toFixed(2)),
    transportHubCostPerAcre: ECONOMICS_CONSTANTS.LOGISTICS.TOTAL_TRANSPORT_HUB_PER_ACRE,
    transportHubCostPerTonne: Number((ECONOMICS_CONSTANTS.LOGISTICS.TOTAL_TRANSPORT_HUB_PER_ACRE / 2).toFixed(2)),
    farmerSharePerAcre: ECONOMICS_CONSTANTS.PAYOUTS.FARMER_SHARE_PER_ACRE,
    farmerSharePerTonne: Number((ECONOMICS_CONSTANTS.PAYOUTS.FARMER_SHARE_PER_ACRE / 2).toFixed(2)),
    coordinatorSharePerAcre: ECONOMICS_CONSTANTS.PAYOUTS.COORDINATOR_REFERRAL_PER_ACRE,
    coordinatorSharePerTonne: Number((ECONOMICS_CONSTANTS.PAYOUTS.COORDINATOR_REFERRAL_PER_ACRE / 2).toFixed(2)),
    platformProfitPerAcre: model.PLATFORM_PROFIT_PER_ACRE,
    platformProfitPerTonne: Number((model.PLATFORM_PROFIT_PER_ACRE / 2).toFixed(2)),
    marginPercent: model.PLATFORM_MARGIN_PERCENT,
    farmerDieselSavedPerAcre: ECONOMICS_CONSTANTS.PAYOUTS.FARMER_DIESEL_SAVED_PER_ACRE,
    farmerNetSwingPerAcre: ECONOMICS_CONSTANTS.PAYOUTS.FARMER_TOTAL_SWING_PER_ACRE
  };
}

/**
 * Calculates live Farmer Lump-Sum Financial Swing for input acreage
 */
export function calculateFarmerValueSwing(acres: number) {
  const safeAcres = Math.max(0, acres);
  const clearingCostSaved = Math.round(safeAcres * ECONOMICS_CONSTANTS.PAYOUTS.FARMER_DIESEL_SAVED_PER_ACRE);
  const cashSharePayout = Math.round(safeAcres * ECONOMICS_CONSTANTS.PAYOUTS.FARMER_SHARE_PER_ACRE);
  const referralPotential = Math.round(safeAcres * ECONOMICS_CONSTANTS.PAYOUTS.COORDINATOR_REFERRAL_PER_ACRE);
  const totalFinancialSwing = clearingCostSaved + cashSharePayout;

  return {
    acres: safeAcres,
    clearingCostCharged: 0, // Always ₹0
    clearingCostSaved,
    cashSharePayout,
    referralPotential,
    totalFinancialSwing,
    tonnesResidue: Number((safeAcres * ECONOMICS_CONSTANTS.YIELD_TONNES_PER_ACRE).toFixed(1))
  };
}

/**
 * Multi-Baler Fleet Simulator (Slider 1 to 100 Balers)
 */
export function simulateBalerFleet(balerCount: number, leaseType: LeaseDuration = '45_DAY_SEASONAL') {
  const safeCount = Math.max(1, Math.min(100, Math.round(balerCount)));
  const acresPerBaler = leaseType === '45_DAY_SEASONAL' ? 700 : 240;
  const totalSeasonalAcres = safeCount * acresPerBaler;
  const totalTonnes = totalSeasonalAcres * ECONOMICS_CONSTANTS.YIELD_TONNES_PER_ACRE;

  const co2AvoidedTonnes = Number((totalTonnes * ECONOMICS_CONSTANTS.IMPACT_FACTORS.CO2_TONNES_PER_TONNE_STRAW).toFixed(1));
  const pm25PreventedKg = Number((totalTonnes * ECONOMICS_CONSTANTS.IMPACT_FACTORS.PM25_KG_PER_TONNE_STRAW).toFixed(1));
  const farmerSavingsInr = totalSeasonalAcres * ECONOMICS_CONSTANTS.PAYOUTS.FARMER_DIESEL_SAVED_PER_ACRE;
  const ruralCashPaidInr = totalSeasonalAcres * (ECONOMICS_CONSTANTS.PAYOUTS.FARMER_SHARE_PER_ACRE + ECONOMICS_CONSTANTS.PAYOUTS.COORDINATOR_REFERRAL_PER_ACRE);

  const profitPerAcre = leaseType === '45_DAY_SEASONAL' ? 800 : 764;
  const platformNetProfitInr = totalSeasonalAcres * profitPerAcre;
  const grossRevenueInr = totalTonnes * ECONOMICS_CONSTANTS.PRICE_PER_TONNE_INR;

  return {
    balerCount: safeCount,
    leaseType,
    totalSeasonalAcres,
    totalTonnes,
    co2AvoidedTonnes,
    pm25PreventedKg,
    farmerSavingsInr,
    ruralCashPaidInr,
    platformNetProfitInr,
    grossRevenueInr
  };
}

/**
 * 3-Day Moisture Drying Buffer Calculation
 * Earliest Pickup Date = max(tomorrow, harvest_date + 3 days)
 */
export function calculateEarliestPickupDate(harvestDateStr: string): { pickupDate: string; isMoistureSafe: boolean; daysSinceHarvest: number } {
  const harvest = new Date(harvestDateStr);
  const now = new Date();
  
  // Normalize dates to midnight
  const harvestMid = new Date(harvest.getFullYear(), harvest.getMonth(), harvest.getDate());
  const nowMid = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const daysSinceHarvest = Math.floor((nowMid.getTime() - harvestMid.getTime()) / (1000 * 60 * 60 * 24));
  const minRequiredDate = new Date(harvestMid.getTime() + 3 * 24 * 60 * 60 * 1000);
  
  const tomorrow = new Date(nowMid.getTime() + 1 * 24 * 60 * 60 * 1000);
  const pickupDateObj = minRequiredDate > tomorrow ? minRequiredDate : tomorrow;

  const yyyy = pickupDateObj.getFullYear();
  const mm = String(pickupDateObj.getMonth() + 1).padStart(2, '0');
  const dd = String(pickupDateObj.getDate()).padStart(2, '0');

  return {
    pickupDate: `${yyyy}-${mm}-${dd}`,
    isMoistureSafe: daysSinceHarvest >= 3,
    daysSinceHarvest
  };
}

/**
 * Haversine Great Circle Distance
 */
export function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371.0; // km
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}
