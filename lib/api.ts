// ParaliSetu: API Abstraction Layer & Stateful In-Memory Mock Store
// Controlled by USE_MOCK_DATA flag. Mutates state and localStorage for interactive demo.

import {
  BookingPayload,
  BulkLot,
  FarmerBooking,
  ImpactSummary,
  IndustrialBuyer,
  LeasedBaler,
  NASAHotspot,
  StorageHub,
  VillageCluster
} from '../types/paralisetu';
import {
  calculateEarliestPickupDate,
  calculateFarmerValueSwing,
  calculateHaversineDistance,
  ECONOMICS_CONSTANTS
} from './economics';

export const USE_MOCK_DATA = true;

const STORAGE_KEY = 'paralisetu_demo_state_v1';

// Initial Pre-Seeded Datasets (25+ NASA Hotspots, 6 Village Clusters, 4 Balers, 3 Hubs, 3 Buyers)
const SEEDED_HOTSPOTS: NASAHotspot[] = [
  // Sangrur Belt
  { id: 'F-SAN-01', lat: 30.2458, lng: 75.8421, frp: 38.4, confidence: 'high', village: 'Kheri', district: 'Sangrur', acqDate: '2026-11-21', acqTime: '0815', brightTempKelvin: 358.4, satellite: 'Suomi-NPP VIIRS', riskLevel: 'CRITICAL' },
  { id: 'F-SAN-02', lat: 30.2582, lng: 75.8614, frp: 28.2, confidence: 'high', village: 'Bhawanigarh', district: 'Sangrur', acqDate: '2026-11-21', acqTime: '0815', brightTempKelvin: 346.2, satellite: 'Suomi-NPP VIIRS', riskLevel: 'HIGH' },
  { id: 'F-SAN-03', lat: 30.1294, lng: 75.8012, frp: 21.5, confidence: 'nominal', village: 'Sunam', district: 'Sangrur', acqDate: '2026-11-21', acqTime: '0815', brightTempKelvin: 339.8, satellite: 'Suomi-NPP VIIRS', riskLevel: 'MODERATE' },
  { id: 'F-SAN-04', lat: 30.0612, lng: 75.8821, frp: 32.1, confidence: 'high', village: 'Dirba', district: 'Sangrur', acqDate: '2026-11-21', acqTime: '0815', brightTempKelvin: 352.0, satellite: 'Suomi-NPP VIIRS', riskLevel: 'CRITICAL' },
  { id: 'F-SAN-05', lat: 29.8921, lng: 75.8942, frp: 26.4, confidence: 'high', village: 'Moonak', district: 'Sangrur', acqDate: '2026-11-21', acqTime: '0815', brightTempKelvin: 344.0, satellite: 'Suomi-NPP VIIRS', riskLevel: 'HIGH' },
  { id: 'F-SAN-06', lat: 30.2312, lng: 75.6841, frp: 19.8, confidence: 'nominal', village: 'Longowal', district: 'Sangrur', acqDate: '2026-11-21', acqTime: '0815', brightTempKelvin: 337.5, satellite: 'Suomi-NPP VIIRS', riskLevel: 'MODERATE' },

  // Patiala Belt
  { id: 'F-PAT-01', lat: 30.3752, lng: 76.1524, frp: 35.6, confidence: 'high', village: 'Nabha', district: 'Patiala', acqDate: '2026-11-21', acqTime: '0815', brightTempKelvin: 355.2, satellite: 'Suomi-NPP VIIRS', riskLevel: 'CRITICAL' },
  { id: 'F-PAT-02', lat: 30.1491, lng: 76.1912, frp: 22.8, confidence: 'nominal', village: 'Samana', district: 'Patiala', acqDate: '2026-11-21', acqTime: '0815', brightTempKelvin: 341.2, satellite: 'Suomi-NPP VIIRS', riskLevel: 'HIGH' },
  { id: 'F-PAT-03', lat: 30.4821, lng: 76.5921, frp: 18.2, confidence: 'nominal', village: 'Rajpura', district: 'Patiala', acqDate: '2026-11-21', acqTime: '0815', brightTempKelvin: 335.6, satellite: 'Suomi-NPP VIIRS', riskLevel: 'MODERATE' },
  { id: 'F-PAT-04', lat: 29.9341, lng: 76.0612, frp: 29.5, confidence: 'high', village: 'Patran', district: 'Patiala', acqDate: '2026-11-21', acqTime: '0815', brightTempKelvin: 349.0, satellite: 'Suomi-NPP VIIRS', riskLevel: 'HIGH' },

  // Tarn Taran Belt
  { id: 'F-TT-01', lat: 31.2821, lng: 74.8541, frp: 41.2, confidence: 'high', village: 'Patti', district: 'Tarn Taran', acqDate: '2026-11-21', acqTime: '0815', brightTempKelvin: 362.5, satellite: 'Suomi-NPP VIIRS', riskLevel: 'CRITICAL' },
  { id: 'F-TT-02', lat: 31.4121, lng: 75.1241, frp: 27.5, confidence: 'high', village: 'Khadoor Sahib', district: 'Tarn Taran', acqDate: '2026-11-21', acqTime: '0815', brightTempKelvin: 347.1, satellite: 'Suomi-NPP VIIRS', riskLevel: 'HIGH' },
  { id: 'F-TT-03', lat: 31.1841, lng: 74.9821, frp: 33.4, confidence: 'high', village: 'Chohla Sahib', district: 'Tarn Taran', acqDate: '2026-11-21', acqTime: '0815', brightTempKelvin: 354.0, satellite: 'Suomi-NPP VIIRS', riskLevel: 'CRITICAL' },
  { id: 'F-TT-04', lat: 31.3341, lng: 74.7012, frp: 23.1, confidence: 'nominal', village: 'Bhikhiwind', district: 'Tarn Taran', acqDate: '2026-11-21', acqTime: '0815', brightTempKelvin: 341.0, satellite: 'Suomi-NPP VIIRS', riskLevel: 'HIGH' },

  // Amritsar Belt
  { id: 'F-ASR-01', lat: 31.8412, lng: 74.7621, frp: 36.8, confidence: 'high', village: 'Ajnala', district: 'Amritsar', acqDate: '2026-11-21', acqTime: '0815', brightTempKelvin: 356.4, satellite: 'Suomi-NPP VIIRS', riskLevel: 'CRITICAL' },
  { id: 'F-ASR-02', lat: 31.7521, lng: 74.9541, frp: 24.3, confidence: 'nominal', village: 'Majitha', district: 'Amritsar', acqDate: '2026-11-21', acqTime: '0815', brightTempKelvin: 342.5, satellite: 'Suomi-NPP VIIRS', riskLevel: 'HIGH' },
  { id: 'F-ASR-03', lat: 31.5621, lng: 75.0241, frp: 30.2, confidence: 'high', village: 'Jandiala Guru', district: 'Amritsar', acqDate: '2026-11-21', acqTime: '0815', brightTempKelvin: 350.1, satellite: 'Suomi-NPP VIIRS', riskLevel: 'CRITICAL' },
  { id: 'F-ASR-04', lat: 31.5241, lng: 75.1621, frp: 21.0, confidence: 'nominal', village: 'Rayya', district: 'Amritsar', acqDate: '2026-11-21', acqTime: '0815', brightTempKelvin: 338.2, satellite: 'Suomi-NPP VIIRS', riskLevel: 'MODERATE' },

  // Bathinda Belt
  { id: 'F-BTI-01', lat: 30.2741, lng: 75.2412, frp: 39.5, confidence: 'high', village: 'Rampura Phul', district: 'Bathinda', acqDate: '2026-11-21', acqTime: '0815', brightTempKelvin: 359.0, satellite: 'Suomi-NPP VIIRS', riskLevel: 'CRITICAL' },
  { id: 'F-BTI-02', lat: 30.0741, lng: 75.2412, frp: 25.1, confidence: 'nominal', village: 'Maur', district: 'Bathinda', acqDate: '2026-11-21', acqTime: '0815', brightTempKelvin: 343.8, satellite: 'Suomi-NPP VIIRS', riskLevel: 'HIGH' },
  { id: 'F-BTI-03', lat: 29.9841, lng: 75.0912, frp: 31.2, confidence: 'high', village: 'Talwandi Sabo', district: 'Bathinda', acqDate: '2026-11-21', acqTime: '0815', brightTempKelvin: 351.4, satellite: 'Suomi-NPP VIIRS', riskLevel: 'CRITICAL' },
  { id: 'F-BTI-04', lat: 30.3121, lng: 74.9121, frp: 22.4, confidence: 'nominal', village: 'Goniana', district: 'Bathinda', acqDate: '2026-11-21', acqTime: '0815', brightTempKelvin: 340.0, satellite: 'Suomi-NPP VIIRS', riskLevel: 'MODERATE' },

  // Moga / Firozpur / Ludhiana
  { id: 'F-MOG-01', lat: 30.6841, lng: 75.1412, frp: 28.9, confidence: 'high', village: 'Baghapurana', district: 'Moga', acqDate: '2026-11-21', acqTime: '0815', brightTempKelvin: 348.0, satellite: 'Suomi-NPP VIIRS', riskLevel: 'HIGH' },
  { id: 'F-MOG-02', lat: 30.5841, lng: 75.2841, frp: 20.5, confidence: 'nominal', village: 'Nihal Singh Wala', district: 'Moga', acqDate: '2026-11-21', acqTime: '0815', brightTempKelvin: 337.0, satellite: 'Suomi-NPP VIIRS', riskLevel: 'MODERATE' },
  { id: 'F-LUD-01', lat: 30.7921, lng: 75.4741, frp: 34.2, confidence: 'high', village: 'Jagraon', district: 'Ludhiana', acqDate: '2026-11-21', acqTime: '0815', brightTempKelvin: 353.8, satellite: 'Suomi-NPP VIIRS', riskLevel: 'CRITICAL' },
  { id: 'F-FIR-01', lat: 30.9841, lng: 74.9912, frp: 27.8, confidence: 'high', village: 'Zira', district: 'Firozpur', acqDate: '2026-11-21', acqTime: '0815', brightTempKelvin: 346.5, satellite: 'Suomi-NPP VIIRS', riskLevel: 'HIGH' }
];

const SEEDED_HUBS: StorageHub[] = [
  { id: 'HUB-SANGRUR', name: 'Sangrur Central Depot', location: 'Bhawanigarh Bypass, Sangrur', district: 'Sangrur', lat: 30.2520, lng: 75.8750, capacityTonnes: 15000, currentStockTonnes: 4800, maxRadiusKm: 15, manager: 'Gurpreet Singh', phone: '+91 98765 43210' },
  { id: 'HUB-PATIALA', name: 'Nabha Agro Logistics Depot', location: 'Patiala-Nabha Road, Nabha', district: 'Patiala', lat: 30.3680, lng: 76.1420, capacityTonnes: 12000, currentStockTonnes: 3900, maxRadiusKm: 15, manager: 'Harmanpreet Kaur', phone: '+91 98765 43211' },
  { id: 'HUB-BATHINDA', name: 'Malwa Green Southern Depot', location: 'Rampura Phul Highway, Bathinda', district: 'Bathinda', lat: 30.2600, lng: 75.2500, capacityTonnes: 14000, currentStockTonnes: 2600, maxRadiusKm: 15, manager: 'Jagjit Singh', phone: '+91 98765 43212' }
];

const SEEDED_BUYERS: IndustrialBuyer[] = [
  { id: 'BUYER-VERBIO', name: 'Verbio India Bio-CNG / CBG Plant', type: 'Bio-CNG / CBG', location: 'Lehragaga, Sangrur, Punjab', lat: 29.9320, lng: 75.8210, dailyDemandTonnes: 300, ratePerTonne: 1800, maxDeliveryDistanceKm: 50, certified: true, totalPurchasedTonnes: 34200 },
  { id: 'BUYER-SAEL', name: 'SAEL Biomass Power Plant', type: 'Biomass Power', location: 'Chhajli, Sunam, Punjab', lat: 30.0820, lng: 75.7640, dailyDemandTonnes: 450, ratePerTonne: 1800, maxDeliveryDistanceKm: 50, certified: true, totalPurchasedTonnes: 52100 },
  { id: 'BUYER-MALWA', name: 'Malwa Eco-Briquettes & Pellets', type: 'Eco-Briquette / Pellets', location: 'Dhanaula, Barnala, Punjab', lat: 30.3420, lng: 75.5210, dailyDemandTonnes: 180, ratePerTonne: 1800, maxDeliveryDistanceKm: 50, certified: true, totalPurchasedTonnes: 18900 }
];

const SEEDED_BALERS: LeasedBaler[] = [
  { id: 'BALER-PB-01', model: 'Claas Markant 65 Heavy Square Baler', operator: 'Satnam Singh', phone: '+91 94172 11001', status: 'DISPATCHED', assignedClusterId: 'VIL-BHAWANIGARH', lat: 30.2582, lng: 75.8614, baseStation: 'Sangrur Depot', dailyAcresCapacity: 20.0, seasonalLeaseAcresTarget: 700 },
  { id: 'BALER-PB-02', model: 'New Holland BC5070 Heavy Baler', operator: 'Kulwinder Singh', phone: '+91 94172 11002', status: 'DISPATCHED', assignedClusterId: 'VIL-NABHA', lat: 30.3752, lng: 76.1524, baseStation: 'Nabha Depot', dailyAcresCapacity: 20.0, seasonalLeaseAcresTarget: 700 },
  { id: 'BALER-PB-03', model: 'John Deere 348 Compact Baler', operator: 'Amanpreet Singh', phone: '+91 94172 11003', status: 'IDLE', assignedClusterId: null, lat: 30.2520, lng: 75.8750, baseStation: 'Sangrur Depot', dailyAcresCapacity: 20.0, seasonalLeaseAcresTarget: 700 },
  { id: 'BALER-PB-04', model: 'Sonalika Prime HD Baler', operator: 'Manjit Singh', phone: '+91 94172 11004', status: 'IDLE', assignedClusterId: null, lat: 30.2600, lng: 75.2500, baseStation: 'Bathinda Depot', dailyAcresCapacity: 20.0, seasonalLeaseAcresTarget: 700 }
];

// Seeded Village Clusters (Village Kheri seeded at exactly 16 / 20 acres)
const SEEDED_CLUSTERS: VillageCluster[] = [
  {
    id: 'VIL-KHERI',
    name: 'Kheri',
    district: 'Sangrur',
    lat: 30.2458,
    lng: 75.8421,
    targetAcres: 20.0,
    pooledAcres: 16.0, // EXACTLY 16 / 20 acres! 5-acre demo booking triggers instant dispatch!
    strawTonnes: 32.0,
    status: 'GATHERING',
    enrolledFarmers: [
      { id: 'BK-KH-01', villageId: 'VIL-KHERI', villageName: 'Kheri', farmerName: 'Balwinder Singh', phone: '+91 98140 22334', acres: 6.0, strawTonnes: 12.0, harvestDate: '2026-11-18', moisturePercent: 14.5, calculatedPickupDate: '2026-11-23', isMoistureSafe: true, referralCode: 'KHERI-401', referredBy: null, farmerSavings: 24000, farmerCashback: 1080, totalFarmerSwing: 25080, coordinatorReward: 720, createdAt: '2026-11-20T10:00:00Z', status: 'PENDING' },
      { id: 'BK-KH-02', villageId: 'VIL-KHERI', villageName: 'Kheri', farmerName: 'Harpreet Kaur', phone: '+91 98140 22335', acres: 5.5, strawTonnes: 11.0, harvestDate: '2026-11-19', moisturePercent: 15.2, calculatedPickupDate: '2026-11-23', isMoistureSafe: true, referralCode: 'KHERI-402', referredBy: 'KHERI-401', farmerSavings: 22000, farmerCashback: 990, totalFarmerSwing: 22990, coordinatorReward: 660, createdAt: '2026-11-20T11:30:00Z', status: 'PENDING' },
      { id: 'BK-KH-03', villageId: 'VIL-KHERI', villageName: 'Kheri', farmerName: 'Gurnam Singh', phone: '+91 98140 22336', acres: 4.5, strawTonnes: 9.0, harvestDate: '2026-11-19', moisturePercent: 13.8, calculatedPickupDate: '2026-11-23', isMoistureSafe: true, referralCode: 'KHERI-403', referredBy: 'KHERI-401', farmerSavings: 18000, farmerCashback: 810, totalFarmerSwing: 18810, coordinatorReward: 540, createdAt: '2026-11-21T09:15:00Z', status: 'PENDING' }
    ],
    nearestHubId: 'HUB-SANGRUR',
    nearestHubName: 'Sangrur Central Depot',
    hubDistanceKm: 3.2,
    isHubGeofenceValid: true,
    assignedBalerId: null,
    earliestPickupDate: '2026-11-23',
    isMoistureSafe: true,
    createdAt: '2026-11-20T08:00:00Z'
  },
  {
    id: 'VIL-BHAWANIGARH',
    name: 'Bhawanigarh',
    district: 'Sangrur',
    lat: 30.2582,
    lng: 75.8614,
    targetAcres: 20.0,
    pooledAcres: 24.5, // >= 20 acres (Dispatched, Emerald)
    strawTonnes: 49.0,
    status: 'DISPATCHED',
    enrolledFarmers: [
      { id: 'BK-BH-01', villageId: 'VIL-BHAWANIGARH', villageName: 'Bhawanigarh', farmerName: 'Sukhdev Singh', phone: '+91 98140 55667', acres: 10.5, strawTonnes: 21.0, harvestDate: '2026-11-17', moisturePercent: 14.0, calculatedPickupDate: '2026-11-23', isMoistureSafe: true, referralCode: 'BHAW-101', referredBy: null, farmerSavings: 42000, farmerCashback: 1890, totalFarmerSwing: 43890, coordinatorReward: 1260, createdAt: '2026-11-19T08:00:00Z', status: 'DISPATCHED' },
      { id: 'BK-BH-02', villageId: 'VIL-BHAWANIGARH', villageName: 'Bhawanigarh', farmerName: 'Avtar Singh', phone: '+91 98140 55668', acres: 8.0, strawTonnes: 16.0, harvestDate: '2026-11-18', moisturePercent: 15.0, calculatedPickupDate: '2026-11-23', isMoistureSafe: true, referralCode: 'BHAW-102', referredBy: 'BHAW-101', farmerSavings: 32000, farmerCashback: 1440, totalFarmerSwing: 33440, coordinatorReward: 960, createdAt: '2026-11-19T10:30:00Z', status: 'DISPATCHED' },
      { id: 'BK-BH-03', villageId: 'VIL-BHAWANIGARH', villageName: 'Bhawanigarh', farmerName: 'Manmohan Singh', phone: '+91 98140 55669', acres: 6.0, strawTonnes: 12.0, harvestDate: '2026-11-18', moisturePercent: 14.8, calculatedPickupDate: '2026-11-23', isMoistureSafe: true, referralCode: 'BHAW-103', referredBy: 'BHAW-101', farmerSavings: 24000, farmerCashback: 1080, totalFarmerSwing: 25080, coordinatorReward: 720, createdAt: '2026-11-20T14:00:00Z', status: 'DISPATCHED' }
    ],
    nearestHubId: 'HUB-SANGRUR',
    nearestHubName: 'Sangrur Central Depot',
    hubDistanceKm: 1.8,
    isHubGeofenceValid: true,
    assignedBalerId: 'BALER-PB-01',
    earliestPickupDate: '2026-11-23',
    isMoistureSafe: true,
    createdAt: '2026-11-19T06:00:00Z'
  },
  {
    id: 'VIL-NABHA',
    name: 'Nabha',
    district: 'Patiala',
    lat: 30.3752,
    lng: 76.1524,
    targetAcres: 20.0,
    pooledAcres: 21.0, // >= 20 acres (Dispatched, Emerald)
    strawTonnes: 42.0,
    status: 'DISPATCHED',
    enrolledFarmers: [
      { id: 'BK-NB-01', villageId: 'VIL-NABHA', villageName: 'Nabha', farmerName: 'Davinder Singh', phone: '+91 98140 77881', acres: 9.0, strawTonnes: 18.0, harvestDate: '2026-11-18', moisturePercent: 13.5, calculatedPickupDate: '2026-11-23', isMoistureSafe: true, referralCode: 'NAB-201', referredBy: null, farmerSavings: 36000, farmerCashback: 1620, totalFarmerSwing: 37620, coordinatorReward: 1080, createdAt: '2026-11-19T09:00:00Z', status: 'DISPATCHED' },
      { id: 'BK-NB-02', villageId: 'VIL-NABHA', villageName: 'Nabha', farmerName: 'Jaspal Kaur', phone: '+91 98140 77882', acres: 7.0, strawTonnes: 14.0, harvestDate: '2026-11-19', moisturePercent: 14.2, calculatedPickupDate: '2026-11-23', isMoistureSafe: true, referralCode: 'NAB-202', referredBy: 'NAB-201', farmerSavings: 28000, farmerCashback: 1260, totalFarmerSwing: 29260, coordinatorReward: 840, createdAt: '2026-11-20T12:00:00Z', status: 'DISPATCHED' },
      { id: 'BK-NB-03', villageId: 'VIL-NABHA', villageName: 'Nabha', farmerName: 'Paramjit Singh', phone: '+91 98140 77883', acres: 5.0, strawTonnes: 10.0, harvestDate: '2026-11-19', moisturePercent: 15.0, calculatedPickupDate: '2026-11-23', isMoistureSafe: true, referralCode: 'NAB-203', referredBy: 'NAB-202', farmerSavings: 20000, farmerCashback: 900, totalFarmerSwing: 20900, coordinatorReward: 600, createdAt: '2026-11-20T16:00:00Z', status: 'DISPATCHED' }
    ],
    nearestHubId: 'HUB-PATIALA',
    nearestHubName: 'Nabha Agro Logistics Depot',
    hubDistanceKm: 1.4,
    isHubGeofenceValid: true,
    assignedBalerId: 'BALER-PB-02',
    earliestPickupDate: '2026-11-23',
    isMoistureSafe: true,
    createdAt: '2026-11-19T07:30:00Z'
  },
  {
    id: 'VIL-SUNAM',
    name: 'Sunam',
    district: 'Sangrur',
    lat: 30.1294,
    lng: 75.8012,
    targetAcres: 20.0,
    pooledAcres: 8.5, // Gathering
    strawTonnes: 17.0,
    status: 'GATHERING',
    enrolledFarmers: [
      { id: 'BK-SN-01', villageId: 'VIL-SUNAM', villageName: 'Sunam', farmerName: 'Bikramjit Singh', phone: '+91 98140 33441', acres: 5.0, strawTonnes: 10.0, harvestDate: '2026-11-20', moisturePercent: 16.0, calculatedPickupDate: '2026-11-24', isMoistureSafe: true, referralCode: 'SUN-101', referredBy: null, farmerSavings: 20000, farmerCashback: 900, totalFarmerSwing: 20900, coordinatorReward: 600, createdAt: '2026-11-21T08:00:00Z', status: 'PENDING' },
      { id: 'BK-SN-02', villageId: 'VIL-SUNAM', villageName: 'Sunam', farmerName: 'Gurmeet Kaur', phone: '+91 98140 33442', acres: 3.5, strawTonnes: 7.0, harvestDate: '2026-11-20', moisturePercent: 15.5, calculatedPickupDate: '2026-11-24', isMoistureSafe: true, referralCode: 'SUN-102', referredBy: 'SUN-101', farmerSavings: 14000, farmerCashback: 630, totalFarmerSwing: 14630, coordinatorReward: 420, createdAt: '2026-11-21T11:00:00Z', status: 'PENDING' }
    ],
    nearestHubId: 'HUB-SANGRUR',
    nearestHubName: 'Sangrur Central Depot',
    hubDistanceKm: 14.8,
    isHubGeofenceValid: true,
    assignedBalerId: null,
    earliestPickupDate: '2026-11-24',
    isMoistureSafe: true,
    createdAt: '2026-11-21T07:00:00Z'
  },
  {
    id: 'VIL-PATTI',
    name: 'Patti',
    district: 'Tarn Taran',
    lat: 31.2821,
    lng: 74.8541,
    targetAcres: 20.0,
    pooledAcres: 11.0, // Gathering
    strawTonnes: 22.0,
    status: 'GATHERING',
    enrolledFarmers: [
      { id: 'BK-PT-01', villageId: 'VIL-PATTI', villageName: 'Patti', farmerName: 'Amrik Singh', phone: '+91 98140 88991', acres: 6.5, strawTonnes: 13.0, harvestDate: '2026-11-19', moisturePercent: 14.8, calculatedPickupDate: '2026-11-23', isMoistureSafe: true, referralCode: 'PAT-301', referredBy: null, farmerSavings: 26000, farmerCashback: 1170, totalFarmerSwing: 27170, coordinatorReward: 780, createdAt: '2026-11-20T09:00:00Z', status: 'PENDING' },
      { id: 'BK-PT-02', villageId: 'VIL-PATTI', villageName: 'Patti', farmerName: 'Gurtej Singh', phone: '+91 98140 88992', acres: 4.5, strawTonnes: 9.0, harvestDate: '2026-11-20', moisturePercent: 15.0, calculatedPickupDate: '2026-11-24', isMoistureSafe: true, referralCode: 'PAT-302', referredBy: 'PAT-301', farmerSavings: 18000, farmerCashback: 810, totalFarmerSwing: 18810, coordinatorReward: 540, createdAt: '2026-11-21T10:00:00Z', status: 'PENDING' }
    ],
    nearestHubId: 'HUB-PATIALA',
    nearestHubName: 'Nabha Agro Logistics Depot',
    hubDistanceKm: 12.4,
    isHubGeofenceValid: true,
    assignedBalerId: null,
    earliestPickupDate: '2026-11-24',
    isMoistureSafe: true,
    createdAt: '2026-11-20T08:30:00Z'
  },
  {
    id: 'VIL-RAMPURA',
    name: 'Rampura Phul',
    district: 'Bathinda',
    lat: 30.2741,
    lng: 75.2412,
    targetAcres: 20.0,
    pooledAcres: 6.5, // Gathering
    strawTonnes: 13.0,
    status: 'GATHERING',
    enrolledFarmers: [
      { id: 'BK-RP-01', villageId: 'VIL-RAMPURA', villageName: 'Rampura Phul', farmerName: 'Joginder Singh', phone: '+91 98140 44551', acres: 4.0, strawTonnes: 8.0, harvestDate: '2026-11-20', moisturePercent: 15.2, calculatedPickupDate: '2026-11-24', isMoistureSafe: true, referralCode: 'RAM-501', referredBy: null, farmerSavings: 16000, farmerCashback: 720, totalFarmerSwing: 16720, coordinatorReward: 480, createdAt: '2026-11-21T07:45:00Z', status: 'PENDING' },
      { id: 'BK-RP-02', villageId: 'VIL-RAMPURA', villageName: 'Rampura Phul', farmerName: 'Navneet Kaur', phone: '+91 98140 44552', acres: 2.5, strawTonnes: 5.0, harvestDate: '2026-11-21', moisturePercent: 17.5, calculatedPickupDate: '2026-11-25', isMoistureSafe: false, referralCode: 'RAM-502', referredBy: 'RAM-501', farmerSavings: 10000, farmerCashback: 450, totalFarmerSwing: 10450, coordinatorReward: 300, createdAt: '2026-11-21T13:00:00Z', status: 'PENDING' }
    ],
    nearestHubId: 'HUB-BATHINDA',
    nearestHubName: 'Malwa Green Southern Depot',
    hubDistanceKm: 2.1,
    isHubGeofenceValid: true,
    assignedBalerId: null,
    earliestPickupDate: '2026-11-25',
    isMoistureSafe: false,
    createdAt: '2026-11-21T06:30:00Z'
  }
];

const SEEDED_BULK_LOTS: BulkLot[] = [
  {
    id: 'LOT-SAN-01',
    hubId: 'HUB-SANGRUR',
    hubName: 'Sangrur Central Depot',
    clusterId: 'VIL-BHAWANIGARH',
    villageName: 'Bhawanigarh (Cluster 01)',
    tonnes: 80.0,
    acresEquivalent: 40.0,
    moisturePercent: 14.2,
    pricePerTonne: 1800,
    lotValue: 144000,
    distanceToBuyerKm: 34.0, // To Verbio <= 50 km
    status: 'AVAILABLE'
  },
  {
    id: 'LOT-PAT-02',
    hubId: 'HUB-PATIALA',
    hubName: 'Nabha Agro Logistics Depot',
    clusterId: 'VIL-NABHA',
    villageName: 'Nabha (Cluster 02)',
    tonnes: 42.0,
    acresEquivalent: 21.0,
    moisturePercent: 13.6,
    pricePerTonne: 1800,
    lotValue: 75600,
    distanceToBuyerKm: 41.5, // To SAEL <= 50 km
    status: 'AVAILABLE'
  },
  {
    id: 'LOT-BAT-03',
    hubId: 'HUB-BATHINDA',
    hubName: 'Malwa Green Southern Depot',
    clusterId: 'VIL-RAMPURA',
    villageName: 'Rampura Phul (Pre-Allocated Lot)',
    tonnes: 65.0,
    acresEquivalent: 32.5,
    moisturePercent: 15.0,
    pricePerTonne: 1800,
    lotValue: 117000,
    distanceToBuyerKm: 28.0, // To Malwa Eco <= 50 km
    status: 'AVAILABLE'
  }
];

// Persistent Stateful Store
interface AppState {
  hotspots: NASAHotspot[];
  clusters: VillageCluster[];
  balers: LeasedBaler[];
  hubs: StorageHub[];
  buyers: IndustrialBuyer[];
  lots: BulkLot[];
}

function loadState(): AppState {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('LocalStorage error, using initial mock data:', e);
    }
  }
  return {
    hotspots: SEEDED_HOTSPOTS,
    clusters: SEEDED_CLUSTERS,
    balers: SEEDED_BALERS,
    hubs: SEEDED_HUBS,
    buyers: SEEDED_BUYERS,
    lots: SEEDED_BULK_LOTS
  };
}

let inMemoryState: AppState = loadState();

function persistState() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryState));
    } catch (e) {
      console.warn('LocalStorage persist error:', e);
    }
  }
}

// -------------------------------------------------------------
// Async Public API Functions
// -------------------------------------------------------------

export async function getHotspots(): Promise<NASAHotspot[]> {
  return inMemoryState.hotspots;
}

export async function getClusters(): Promise<VillageCluster[]> {
  return inMemoryState.clusters;
}

export async function getFleet(): Promise<LeasedBaler[]> {
  return inMemoryState.balers;
}

export async function getHubs(): Promise<StorageHub[]> {
  return inMemoryState.hubs;
}

export async function getBuyers(): Promise<IndustrialBuyer[]> {
  return inMemoryState.buyers;
}

export async function getBulkLots(): Promise<BulkLot[]> {
  return inMemoryState.lots;
}

export async function getImpactSummary(): Promise<ImpactSummary> {
  const totalAcres = inMemoryState.clusters.reduce((sum, c) => sum + c.pooledAcres, 0);
  const tonnes = Number((totalAcres * ECONOMICS_CONSTANTS.YIELD_TONNES_PER_ACRE).toFixed(1));
  const co2AvoidedTonnes = Number((tonnes * ECONOMICS_CONSTANTS.IMPACT_FACTORS.CO2_TONNES_PER_TONNE_STRAW).toFixed(1));
  const pm25PreventedKg = Number((tonnes * ECONOMICS_CONSTANTS.IMPACT_FACTORS.PM25_KG_PER_TONNE_STRAW).toFixed(1));
  const farmerSavingsInr = Math.round(totalAcres * ECONOMICS_CONSTANTS.PAYOUTS.FARMER_DIESEL_SAVED_PER_ACRE);
  const ruralCashPaidInr = Math.round(totalAcres * (ECONOMICS_CONSTANTS.PAYOUTS.FARMER_SHARE_PER_ACRE + ECONOMICS_CONSTANTS.PAYOUTS.COORDINATOR_REFERRAL_PER_ACRE));
  const platformNetProfitInr = Math.round(totalAcres * ECONOMICS_CONSTANTS.LEASE_45_DAY.PLATFORM_PROFIT_PER_ACRE);

  const activeHotspotsCount = inMemoryState.hotspots.length;
  const activeClustersCount = inMemoryState.clusters.length;
  const dispatchedClustersCount = inMemoryState.clusters.filter(c => c.status === 'DISPATCHED' || c.status === 'BALING').length;
  const idleBalersCount = inMemoryState.balers.filter(b => b.status === 'IDLE').length;

  return {
    totalAcresPooled: totalAcres,
    tonnesDiverted: tonnes,
    co2AvoidedTonnes,
    pm25PreventedKg,
    farmerSavingsInr,
    ruralCashPaidInr,
    platformNetProfitInr,
    activeHotspotsCount,
    activeClustersCount,
    dispatchedClustersCount,
    idleBalersCount
  };
}

/**
 * Creates a farmer booking, adds acreage, checks 20-acre trigger, and auto-dispatches if threshold crossed!
 */
export async function createBooking(payload: BookingPayload): Promise<{
  booking: FarmerBooking;
  cluster: VillageCluster;
  thresholdReached: boolean;
  assignedBalerId: string | null;
  message: string;
}> {
  const cluster = inMemoryState.clusters.find(c => c.id === payload.villageId) || inMemoryState.clusters[0];
  const acres = Math.max(0.5, parseFloat(String(payload.acres)) || 5.0);
  const swing = calculateFarmerValueSwing(acres);
  const harvestCheck = calculateEarliestPickupDate(payload.harvestDate);

  const villagePrefix = cluster.name.slice(0, 4).toUpperCase();
  const randomNum = Math.floor(100 + Math.random() * 900);
  const generatedReferralCode = `${villagePrefix}-${randomNum}`;

  const newBooking: FarmerBooking = {
    id: `BK-${Date.now().toString(36).toUpperCase()}`,
    villageId: cluster.id,
    villageName: cluster.name,
    farmerName: payload.farmerName.trim(),
    phone: payload.phone.trim(),
    acres,
    strawTonnes: swing.tonnesResidue,
    harvestDate: payload.harvestDate,
    moisturePercent: payload.moisturePercent || 14.5,
    calculatedPickupDate: harvestCheck.pickupDate,
    isMoistureSafe: harvestCheck.isMoistureSafe,
    referralCode: generatedReferralCode,
    referredBy: payload.referredBy ? payload.referredBy.trim().toUpperCase() : null,
    farmerSavings: swing.clearingCostSaved,
    farmerCashback: swing.cashSharePayout,
    totalFarmerSwing: swing.totalFinancialSwing,
    coordinatorReward: swing.referralPotential,
    createdAt: new Date().toISOString(),
    status: 'PENDING'
  };

  // Add to cluster
  const wasUnder20 = cluster.pooledAcres < cluster.targetAcres;
  cluster.enrolledFarmers.unshift(newBooking);
  cluster.pooledAcres = Number((cluster.pooledAcres + acres).toFixed(1));
  cluster.strawTonnes = Number((cluster.pooledAcres * 2.0).toFixed(1));

  let thresholdReached = false;
  let assignedBalerId: string | null = null;

  // The 20-Acre Rule Trigger
  if (wasUnder20 && cluster.pooledAcres >= cluster.targetAcres) {
    cluster.status = 'DISPATCHED';
    thresholdReached = true;

    // Find and assign first available idle baler
    const idleBaler = inMemoryState.balers.find(b => b.status === 'IDLE');
    if (idleBaler) {
      idleBaler.status = 'DISPATCHED';
      idleBaler.assignedClusterId = cluster.id;
      cluster.assignedBalerId = idleBaler.id;
      assignedBalerId = idleBaler.id;
    } else {
      cluster.assignedBalerId = 'BALER-PB-03';
      assignedBalerId = 'BALER-PB-03';
    }

    // Mark all cluster farmers dispatched
    cluster.enrolledFarmers.forEach(f => {
      f.status = 'DISPATCHED';
    });
  }

  persistState();

  const msg = thresholdReached
    ? `🎉 20-Acre Threshold Reached! Baler ${cluster.assignedBalerId} auto-dispatched to ${cluster.name} for 100% free field clearing!`
    : `Enrolled ${newBooking.farmerName} (${newBooking.acres} acres). Cluster is at ${cluster.pooledAcres} / 20.0 acres.`;

  return {
    booking: newBooking,
    cluster,
    thresholdReached,
    assignedBalerId: cluster.assignedBalerId,
    message: msg
  };
}

/**
 * Industrial B2B Buyer reserves and settles a verified bulk lot at standard ₹1,800/tonne
 */
export async function reserveBulkLot(
  lotId: string,
  buyerId: string = 'BUYER-VERBIO'
): Promise<{ success: boolean; lot: BulkLot; message: string }> {
  const lot = inMemoryState.lots.find(l => l.id === lotId);
  if (!lot) {
    throw new Error('Lot not found');
  }

  const buyer = inMemoryState.buyers.find(b => b.id === buyerId) || inMemoryState.buyers[0];

  const factoryGross = lot.tonnes * ECONOMICS_CONSTANTS.PRICE_PER_TONNE_INR;
  const acres = lot.acresEquivalent;
  const balerCost = acres * ECONOMICS_CONSTANTS.LEASE_45_DAY.TOTAL_BALER_COST_PER_ACRE;
  const transportCost = acres * ECONOMICS_CONSTANTS.LOGISTICS.TOTAL_TRANSPORT_HUB_PER_ACRE;
  const farmerShare = acres * ECONOMICS_CONSTANTS.PAYOUTS.FARMER_SHARE_PER_ACRE;
  const coordinatorShare = acres * ECONOMICS_CONSTANTS.PAYOUTS.COORDINATOR_REFERRAL_PER_ACRE;
  const platformProfit = factoryGross - (balerCost + transportCost + farmerShare + coordinatorShare);

  lot.status = 'SETTLED';
  lot.buyerId = buyer.id;
  lot.buyerName = buyer.name;
  lot.settledAt = new Date().toISOString();
  lot.financialBreakdown = {
    factoryGross,
    balerMachineryCost: balerCost,
    transportHubCost: transportCost,
    farmerShare,
    coordinatorShare,
    platformNetProfit: platformProfit
  };

  buyer.totalPurchasedTonnes += lot.tonnes;

  persistState();

  return {
    success: true,
    lot,
    message: `Lot #${lot.id} successfully reserved and settled by ${buyer.name} for ₹${factoryGross.toLocaleString()}!`
  };
}

/**
 * Resets the demo to its exact initial seeded state (Kheri at 16 / 20 acres)
 */
export async function resetDemo(): Promise<boolean> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  inMemoryState = {
    hotspots: JSON.parse(JSON.stringify(SEEDED_HOTSPOTS)),
    clusters: JSON.parse(JSON.stringify(SEEDED_CLUSTERS)),
    balers: JSON.parse(JSON.stringify(SEEDED_BALERS)),
    hubs: JSON.parse(JSON.stringify(SEEDED_HUBS)),
    buyers: JSON.parse(JSON.stringify(SEEDED_BUYERS)),
    lots: JSON.parse(JSON.stringify(SEEDED_BULK_LOTS))
  };
  persistState();
  return true;
}
