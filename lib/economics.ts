// ParaliSetu: Core Economics Engine & Impact Formulas
// Implements exact calculations specified in project specifications

import { LeaseDuration, UnitEconomics } from '../types/paralisetu';

const YIELD_TONNES_PER_ACRE = 2.0;
const PRICE_PER_TONNE_INR = 1800;
const GROSS_REVENUE_PER_ACRE_INR = YIELD_TONNES_PER_ACRE * PRICE_PER_TONNE_INR; // ₹3,600

// Logistics & Storage Hub Breakdown (₹1,100/acre)
const TROLLEY_FIELD_TO_HUB_INR = 360;
const HUB_STORAGE_SECURITY_INR = 140;
const TRUCK_FREIGHT_HUB_TO_FACTORY_INR = 600;
const TOTAL_TRANSPORT_HUB_PER_ACRE =
  TROLLEY_FIELD_TO_HUB_INR + HUB_STORAGE_SECURITY_INR + TRUCK_FREIGHT_HUB_TO_FACTORY_INR; // ₹1,100

// Stakeholder Payouts
const FARMER_SHARE_PERCENT = 0.05; // 5% of gross revenue
const FARMER_SHARE_PER_ACRE = GROSS_REVENUE_PER_ACRE_INR * FARMER_SHARE_PERCENT; // ₹180
const COORDINATOR_REFERRAL_PER_ACRE = 120.0; // Single pool: Captain OR Referral
const FIXED_NON_BALER_COSTS_PER_ACRE =
  TOTAL_TRANSPORT_HUB_PER_ACRE + FARMER_SHARE_PER_ACRE + COORDINATOR_REFERRAL_PER_ACRE; // ₹1,400

// 45-Day Seasonal Lease (700 acres / season) -> ₹1,400/acre total baler cost
const LEASE_45_TOTAL_INR = 150000;
const LEASE_45_ACRES_TARGET = 700;
const LEASE_45_PER_ACRE = Number((LEASE_45_TOTAL_INR / LEASE_45_ACRES_TARGET).toFixed(2)); // ₹214.29
const LEASE_45_OPEX = Number((1400 - LEASE_45_PER_ACRE).toFixed(2)); // ₹1,185.71
const LEASE_45_TOTAL_BALER_COST = Number((LEASE_45_PER_ACRE + LEASE_45_OPEX).toFixed(2)); // ₹1,400.00
const LEASE_45_PROFIT = Number(
  (GROSS_REVENUE_PER_ACRE_INR - LEASE_45_TOTAL_BALER_COST - FIXED_NON_BALER_COSTS_PER_ACRE).toFixed(2)
); // ₹800.00
const LEASE_45_MARGIN = Number(((LEASE_45_PROFIT / GROSS_REVENUE_PER_ACRE_INR) * 100).toFixed(2)); // 22.22%

// 15-Day Peak Window Lease (240 acres / peak) -> ₹1,436/acre total baler cost
const LEASE_15_TOTAL_INR = 60000;
const LEASE_15_ACRES_TARGET = 240;
const LEASE_15_PER_ACRE = Number((LEASE_15_TOTAL_INR / LEASE_15_ACRES_TARGET).toFixed(2)); // ₹250.00
const LEASE_15_OPEX = 1186.0;
const LEASE_15_TOTAL_BALER_COST = Number((LEASE_15_PER_ACRE + LEASE_15_OPEX).toFixed(2)); // ₹1,436.00
const LEASE_15_PROFIT = Number(
  (GROSS_REVENUE_PER_ACRE_INR - LEASE_15_TOTAL_BALER_COST - FIXED_NON_BALER_COSTS_PER_ACRE).toFixed(2)
); // ₹764.00
const LEASE_15_MARGIN = Number(((LEASE_15_PROFIT / GROSS_REVENUE_PER_ACRE_INR) * 100).toFixed(2)); // 21.22%

export const ECONOMICS_CONSTANTS = {
  YIELD_TONNES_PER_ACRE,
  PRICE_PER_TONNE_INR,
  GROSS_REVENUE_PER_ACRE_INR,
  BALER_DAILY_ACRES_CAPACITY: 20.0, // 1 baler-day = 20 acres
  BALER_DAILY_TONNES_CAPACITY: 20.0 * YIELD_TONNES_PER_ACRE, // 40 tonnes

  // 45-Day Seasonal Lease Model (700 acres / season)
  LEASE_45_DAY: {
    TOTAL_LEASE_COST_INR: LEASE_45_TOTAL_INR,
    SEASONAL_ACRES_TARGET: LEASE_45_ACRES_TARGET,
    LEASE_COST_PER_ACRE: LEASE_45_PER_ACRE,
    OPEX_DIESEL_TWINE_OPERATOR: LEASE_45_OPEX,
    TOTAL_BALER_COST_PER_ACRE: LEASE_45_TOTAL_BALER_COST, // ₹1,400/acre (₹700/tonne)
    PLATFORM_PROFIT_PER_ACRE: LEASE_45_PROFIT, // ₹800/acre (₹400/tonne - 22.22%)
    PLATFORM_MARGIN_PERCENT: LEASE_45_MARGIN
  },

  // 15-Day Peak Window Lease Model (240 acres / peak)
  LEASE_15_DAY: {
    TOTAL_LEASE_COST_INR: LEASE_15_TOTAL_INR,
    SEASONAL_ACRES_TARGET: LEASE_15_ACRES_TARGET,
    LEASE_COST_PER_ACRE: LEASE_15_PER_ACRE,
    OPEX_DIESEL_TWINE_OPERATOR: LEASE_15_OPEX,
    TOTAL_BALER_COST_PER_ACRE: LEASE_15_TOTAL_BALER_COST, // ₹1,436/acre (₹718/tonne)
    PLATFORM_PROFIT_PER_ACRE: LEASE_15_PROFIT, // ₹764/acre (₹382/tonne - 21.22%)
    PLATFORM_MARGIN_PERCENT: LEASE_15_MARGIN
  },

  // Logistics & Storage Hub Breakdown (₹1,100/acre)
  LOGISTICS: {
    TROLLEY_FIELD_TO_HUB_INR,
    HUB_STORAGE_SECURITY_INR,
    TRUCK_FREIGHT_HUB_TO_FACTORY_INR,
    TOTAL_TRANSPORT_HUB_PER_ACRE, // ₹1,100/acre (₹550/tonne)
    MAX_FARM_TO_HUB_KM: 15.0,
    MAX_HUB_TO_BUYER_KM: 50.0
  },

  // Stakeholder Payouts
  PAYOUTS: {
    FARMER_SHARE_PERCENT,
    FARMER_SHARE_PER_ACRE, // ₹180/acre (₹90/tonne)
    FARMER_DIESEL_SAVED_PER_ACRE: 4000.0, // Saves ₹3,500-₹5,000 (avg ₹4,000)
    FARMER_TOTAL_SWING_PER_ACRE: 4000.0 + FARMER_SHARE_PER_ACRE, // ₹4,180/acre
    COORDINATOR_REFERRAL_PER_ACRE, // ₹120/acre (₹60/tonne)
    FARMER_CLEARING_CHARGE: 0 // ₹0 to farmer
  },

  // Climate Impact Factors
  IMPACT_FACTORS: {
    CO2_TONNES_PER_TONNE_STRAW: 1.46, // 1.46 t CO2 avoided / tonne straw
    PM25_KG_PER_TONNE_STRAW: 3.0, // 3.0 kg PM2.5 smoke stopped / tonne straw
    CO2_TONNES_PER_ACRE: Number((YIELD_TONNES_PER_ACRE * 1.46).toFixed(2)), // 2.92
    PM25_KG_PER_ACRE: Number((YIELD_TONNES_PER_ACRE * 3.0).toFixed(2)) // 6.0
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
  const yieldPerAcre = ECONOMICS_CONSTANTS.YIELD_TONNES_PER_ACRE;
  const tonnes = Number((safeAcres * yieldPerAcre).toFixed(2));
  const model =
    leaseType === '45_DAY_SEASONAL'
      ? ECONOMICS_CONSTANTS.LEASE_45_DAY
      : ECONOMICS_CONSTANTS.LEASE_15_DAY;

  return {
    leaseType,
    acres: safeAcres,
    tonnes,
    grossRevenuePerAcre: ECONOMICS_CONSTANTS.GROSS_REVENUE_PER_ACRE_INR,
    grossRevenuePerTonne: ECONOMICS_CONSTANTS.PRICE_PER_TONNE_INR,
    balerCostPerAcre: model.TOTAL_BALER_COST_PER_ACRE,
    balerCostPerTonne: Number((model.TOTAL_BALER_COST_PER_ACRE / yieldPerAcre).toFixed(2)),
    transportHubCostPerAcre: ECONOMICS_CONSTANTS.LOGISTICS.TOTAL_TRANSPORT_HUB_PER_ACRE,
    transportHubCostPerTonne: Number(
      (ECONOMICS_CONSTANTS.LOGISTICS.TOTAL_TRANSPORT_HUB_PER_ACRE / yieldPerAcre).toFixed(2)
    ),
    farmerSharePerAcre: ECONOMICS_CONSTANTS.PAYOUTS.FARMER_SHARE_PER_ACRE,
    farmerSharePerTonne: Number(
      (ECONOMICS_CONSTANTS.PAYOUTS.FARMER_SHARE_PER_ACRE / yieldPerAcre).toFixed(2)
    ),
    coordinatorSharePerAcre: ECONOMICS_CONSTANTS.PAYOUTS.COORDINATOR_REFERRAL_PER_ACRE,
    coordinatorSharePerTonne: Number(
      (ECONOMICS_CONSTANTS.PAYOUTS.COORDINATOR_REFERRAL_PER_ACRE / yieldPerAcre).toFixed(2)
    ),
    platformProfitPerAcre: model.PLATFORM_PROFIT_PER_ACRE,
    platformProfitPerTonne: Number((model.PLATFORM_PROFIT_PER_ACRE / yieldPerAcre).toFixed(2)),
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
  const clearingCostSaved = Math.round(
    safeAcres * ECONOMICS_CONSTANTS.PAYOUTS.FARMER_DIESEL_SAVED_PER_ACRE
  );
  const cashSharePayout = Math.round(safeAcres * ECONOMICS_CONSTANTS.PAYOUTS.FARMER_SHARE_PER_ACRE);
  const referralPotential = Math.round(
    safeAcres * ECONOMICS_CONSTANTS.PAYOUTS.COORDINATOR_REFERRAL_PER_ACRE
  );
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
export function simulateBalerFleet(
  balerCount: number,
  leaseType: LeaseDuration = '45_DAY_SEASONAL'
) {
  const safeCount = Math.max(1, Math.min(100, Math.round(balerCount)));
  const model =
    leaseType === '45_DAY_SEASONAL'
      ? ECONOMICS_CONSTANTS.LEASE_45_DAY
      : ECONOMICS_CONSTANTS.LEASE_15_DAY;

  const totalSeasonalAcres = safeCount * model.SEASONAL_ACRES_TARGET;
  const totalTonnes = totalSeasonalAcres * ECONOMICS_CONSTANTS.YIELD_TONNES_PER_ACRE;

  const co2AvoidedTonnes = Number(
    (totalTonnes * ECONOMICS_CONSTANTS.IMPACT_FACTORS.CO2_TONNES_PER_TONNE_STRAW).toFixed(1)
  );
  const pm25PreventedKg = Number(
    (totalTonnes * ECONOMICS_CONSTANTS.IMPACT_FACTORS.PM25_KG_PER_TONNE_STRAW).toFixed(1)
  );
  const farmerSavingsInr =
    totalSeasonalAcres * ECONOMICS_CONSTANTS.PAYOUTS.FARMER_DIESEL_SAVED_PER_ACRE;
  const ruralCashPaidInr =
    totalSeasonalAcres *
    (ECONOMICS_CONSTANTS.PAYOUTS.FARMER_SHARE_PER_ACRE +
      ECONOMICS_CONSTANTS.PAYOUTS.COORDINATOR_REFERRAL_PER_ACRE);

  const platformNetProfitInr = Math.round(totalSeasonalAcres * model.PLATFORM_PROFIT_PER_ACRE);
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
export function calculateEarliestPickupDate(harvestDateStr: string): {
  pickupDate: string;
  isMoistureSafe: boolean;
  daysSinceHarvest: number;
} {
  const harvest = new Date(harvestDateStr);
  const now = new Date();

  const harvestMid = new Date(harvest.getFullYear(), harvest.getMonth(), harvest.getDate());
  const nowMid = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const daysSinceHarvest = Math.floor(
    (nowMid.getTime() - harvestMid.getTime()) / (1000 * 60 * 60 * 24)
  );
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
 * Haversine Great Circle Distance (km)
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
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