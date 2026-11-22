// ParaliSetu: Core TypeScript Domain Interfaces & Types
// Covers Satellite Fire Radar, 20-Acre Clusters, 3-Way Economics & Logistics

export type ClusterStatus = 'GATHERING' | 'DISPATCHED' | 'BALING' | 'STORED_AT_HUB' | 'SOLD';
export type BalerStatus = 'IDLE' | 'ASSIGNED' | 'DISPATCHED' | 'BALING';
export type LotStatus = 'AVAILABLE' | 'RESERVED' | 'SETTLED';
export type LeaseDuration = '45_DAY_SEASONAL' | '15_DAY_PEAK';
export type Language = 'en' | 'pa' | 'hi';

export interface NASAHotspot {
  id: string;
  lat: number;
  lng: number;
  frp: number; // Fire Radiative Power (MW)
  confidence: 'nominal' | 'high';
  village: string;
  district: string;
  acqDate: string;
  acqTime: string; // UTC
  brightTempKelvin: number;
  satellite: 'Suomi-NPP VIIRS' | 'NOAA-20 VIIRS';
  riskLevel: 'MODERATE' | 'HIGH' | 'CRITICAL';
}

export interface FarmerBooking {
  id: string;
  villageId: string;
  villageName: string;
  farmerName: string;
  phone: string;
  acres: number;
  strawTonnes: number;
  harvestDate: string;
  moisturePercent: number;
  calculatedPickupDate: string;
  isMoistureSafe: boolean; // Moisture < 20% & harvest >= 3 days
  referralCode: string; // e.g. KHERI-402
  referredBy?: string | null;
  farmerSavings: number; // ₹4,000 * acres
  farmerCashback: number; // 5% = ₹180 * acres
  totalFarmerSwing: number; // ₹4,180 * acres
  coordinatorReward: number; // ₹120 * acres
  createdAt: string;
  status: 'PENDING' | 'DISPATCHED' | 'BALED' | 'SETTLED';
}

export interface VillageCluster {
  id: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
  targetAcres: number; // Always 20.0
  pooledAcres: number;
  strawTonnes: number;
  status: ClusterStatus; // 'GATHERING' (<20) | 'DISPATCHED' (>=20)
  enrolledFarmers: FarmerBooking[];
  nearestHubId: string;
  nearestHubName: string;
  hubDistanceKm: number; // <= 15 km
  isHubGeofenceValid: boolean;
  assignedBalerId: string | null;
  earliestPickupDate: string; // max(tomorrow, latest_harvest_date + 3 days)
  isMoistureSafe: boolean;
  createdAt: string;
}

export interface LeasedBaler {
  id: string;
  model: string;
  operator: string;
  phone: string;
  status: BalerStatus;
  assignedClusterId: string | null;
  lat: number;
  lng: number;
  baseStation: string;
  dailyAcresCapacity: number; // 20.0 acres/day (~40 tonnes)
  seasonalLeaseAcresTarget: number; // 700 acres (45-day) or 240 acres (15-day)
}

export interface StorageHub {
  id: string;
  name: string;
  location: string;
  district: string;
  lat: number;
  lng: number;
  capacityTonnes: number;
  currentStockTonnes: number;
  maxRadiusKm: number; // 15 km
  manager: string;
  phone: string;
}

export interface IndustrialBuyer {
  id: string;
  name: string;
  type: 'Bio-CNG / CBG' | 'Biomass Power' | 'Eco-Briquette / Pellets';
  location: string;
  lat: number;
  lng: number;
  dailyDemandTonnes: number;
  ratePerTonne: number; // Standardized ₹1,800/t
  maxDeliveryDistanceKm: number; // 50 km
  certified: boolean;
  totalPurchasedTonnes: number;
}

export interface BulkLot {
  id: string;
  hubId: string;
  hubName: string;
  clusterId: string;
  villageName: string;
  tonnes: number;
  acresEquivalent: number;
  moisturePercent: number;
  pricePerTonne: number; // ₹1,800
  lotValue: number; // tonnes * 1800
  distanceToBuyerKm: number; // <= 50 km
  status: LotStatus;
  buyerId?: string | null;
  buyerName?: string | null;
  settledAt?: string | null;
  financialBreakdown?: {
    factoryGross: number;
    balerMachineryCost: number;
    transportHubCost: number;
    farmerShare: number;
    coordinatorShare: number;
    platformNetProfit: number;
  };
}

export interface ImpactSummary {
  totalAcresPooled: number;
  tonnesDiverted: number;
  co2AvoidedTonnes: number; // tonnes * 1.46
  pm25PreventedKg: number; // tonnes * 3.0
  farmerSavingsInr: number; // acres * 4000
  ruralCashPaidInr: number; // acres * (180 + 120)
  platformNetProfitInr: number; // acres * 800 (or 764)
  activeHotspotsCount: number;
  activeClustersCount: number;
  dispatchedClustersCount: number;
  idleBalersCount: number;
}

export interface BookingPayload {
  villageId: string;
  farmerName: string;
  phone: string;
  acres: number;
  harvestDate: string;
  moisturePercent?: number;
  referredBy?: string | null;
  isCaptainBatch?: boolean;
}

export interface UnitEconomics {
  leaseType: LeaseDuration;
  acres: number;
  tonnes: number;
  grossRevenuePerAcre: number; // ₹3,600
  grossRevenuePerTonne: number; // ₹1,800
  balerCostPerAcre: number; // ₹1,400 or ₹1,436
  balerCostPerTonne: number; // ₹700 or ₹718
  transportHubCostPerAcre: number; // ₹1,100
  transportHubCostPerTonne: number; // ₹550
  farmerSharePerAcre: number; // ₹180
  farmerSharePerTonne: number; // ₹90
  coordinatorSharePerAcre: number; // ₹120
  coordinatorSharePerTonne: number; // ₹60
  platformProfitPerAcre: number; // ₹800 or ₹764
  platformProfitPerTonne: number; // ₹400 or ₹382
  marginPercent: number; // 22.2% or 21.2%
  farmerDieselSavedPerAcre: number; // ₹4,000
  farmerNetSwingPerAcre: number; // ₹4,180
}
