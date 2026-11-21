export type BookingMode = 'individual' | 'captain' | 'self';

export interface Booking {
  id: string;
  farmer_name: string;
  phone: string;
  acres: number;
  booking_mode: string;
  referred_by: string | null;
  referral_code: string;
  created_at: string;
}

export interface Cluster {
  id: string;
  village: string;
  district: string;
  lat: number;
  lng: number;
  total_booked_acres: number;
  status: 'Gathering Demand' | 'Machine Dispatched' | 'Operating' | 'gathering' | 'dispatched';
  threshold_acres: number;
  latest_harvest_date: string;
  scheduled_dispatch_date: string | null;
  assigned_baler_id: string | null;
  assigned_hub_id: string;
  bookings: Booking[];
  // View model fields
  name?: string;
  totalAcres?: number;
  progressPct?: number;
  latestHarvestDate?: string;
}

export interface Baler {
  id: string;
  machine_code: string;
  lease_type: '45_day_seasonal' | '15_day_peak';
  daily_capacity_acres: number;
  status: 'Idle' | 'Dispatched' | 'Operating';
  assigned_cluster_id: string | null;
  lat: number;
  lng: number;
}

export interface StorageHub {
  id: string;
  name: string;
  lat: number;
  lng: number;
  capacity_tonnes: number;
  current_tonnes: number;
  storedTonnes?: number;
  capacityTonnes?: number;
}

export interface Buyer {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  rate_per_tonne: number;
  demand_tonnes_month: number;
}

export interface Fleet {
  balers: Baler[];
  storage_hubs: StorageHub[];
  buyers: Buyer[];
  hubs?: StorageHub[];
}

export interface Lot {
  id: string;
  hub_id: string;
  buyer_id: string;
  tonnes: number;
  moisture_pct: number;
  status: 'Ready for Pickup' | 'Reserved & Settled' | 'available' | 'sold';
  verified_at: string;
  settlement: SettlementResult | null;
  hub_name?: string;
  buyer_name?: string;
  distance_km?: number;
  geo_fence_ok?: boolean;
}

export interface SettlementResult {
  gross_revenue_inr: number;
  farmer_share_inr: number;
  coordinator_share_inr: number;
  baler_opex_inr: number;
  transport_hub_inr: number;
  platform_net_inr: number;
  settled_at?: string;
}

export interface BookingResult {
  bookings: Booking[];
  updatedCluster: Cluster;
  dispatchedBaler: Baler | null;
  newlyUnlocked: boolean;
}

export interface ImpactMetrics {
  tonnes_diverted: number;
  co2_avoided_tonnes: number;
  pm25_prevented_kg: number;
  farmer_clearing_saved_inr: number;
  rural_cash_paid_inr: number;
  platform_net_profit_inr: number;
  acres_covered: number;
  dispatched_clusters: number;
  settled_lots: number;
  season_simulator?: any;
}
