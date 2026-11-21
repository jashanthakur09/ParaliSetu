const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');

const SEED = {
  hotspots: [
    { id: "HS-001", district: "Sangrur", lat: 30.245, lng: 75.845, brightness: 342.5, confidence: 88, detected_at: "2024-11-05T04:30:00Z" },
    { id: "HS-002", district: "Sangrur", lat: 30.251, lng: 75.832, brightness: 338.1, confidence: 82, detected_at: "2024-11-05T05:15:00Z" },
    { id: "HS-003", district: "Sangrur", lat: 30.238, lng: 75.861, brightness: 345.0, confidence: 91, detected_at: "2024-11-05T03:45:00Z" },
    { id: "HS-004", district: "Tarn Taran", lat: 31.451, lng: 74.927, brightness: 350.2, confidence: 94, detected_at: "2024-11-04T22:00:00Z" },
    { id: "HS-005", district: "Tarn Taran", lat: 31.462, lng: 74.915, brightness: 341.8, confidence: 85, detected_at: "2024-11-04T22:30:00Z" },
    { id: "HS-006", district: "Tarn Taran", lat: 31.448, lng: 74.941, brightness: 348.6, confidence: 90, detected_at: "2024-11-05T01:00:00Z" },
    { id: "HS-007", district: "Tarn Taran", lat: 31.470, lng: 74.905, brightness: 336.4, confidence: 79, detected_at: "2024-11-05T02:15:00Z" },
    { id: "HS-008", district: "Amritsar", lat: 31.634, lng: 74.872, brightness: 355.1, confidence: 96, detected_at: "2024-11-04T21:00:00Z" },
    { id: "HS-009", district: "Amritsar", lat: 31.628, lng: 74.885, brightness: 340.3, confidence: 83, detected_at: "2024-11-04T23:30:00Z" },
    { id: "HS-010", district: "Amritsar", lat: 31.641, lng: 74.860, brightness: 347.9, confidence: 92, detected_at: "2024-11-05T00:45:00Z" },
    { id: "HS-011", district: "Patiala", lat: 30.340, lng: 76.387, brightness: 339.7, confidence: 81, detected_at: "2024-11-05T04:00:00Z" },
    { id: "HS-012", district: "Patiala", lat: 30.332, lng: 76.401, brightness: 344.2, confidence: 87, detected_at: "2024-11-05T05:30:00Z" },
    { id: "HS-013", district: "Patiala", lat: 30.351, lng: 76.375, brightness: 351.6, confidence: 93, detected_at: "2024-11-05T03:15:00Z" },
    { id: "HS-014", district: "Ludhiana", lat: 30.901, lng: 75.857, brightness: 346.8, confidence: 89, detected_at: "2024-11-04T23:00:00Z" },
    { id: "HS-015", district: "Ludhiana", lat: 30.912, lng: 75.842, brightness: 353.4, confidence: 95, detected_at: "2024-11-05T01:30:00Z" },
    { id: "HS-016", district: "Ludhiana", lat: 30.895, lng: 75.868, brightness: 337.2, confidence: 80, detected_at: "2024-11-05T02:45:00Z" },
    { id: "HS-017", district: "Ludhiana", lat: 30.908, lng: 75.831, brightness: 349.5, confidence: 91, detected_at: "2024-11-05T04:15:00Z" },
    { id: "HS-018", district: "Bathinda", lat: 30.210, lng: 74.945, brightness: 343.6, confidence: 86, detected_at: "2024-11-04T22:15:00Z" },
    { id: "HS-019", district: "Bathinda", lat: 30.221, lng: 74.932, brightness: 356.2, confidence: 97, detected_at: "2024-11-05T00:00:00Z" },
    { id: "HS-020", district: "Bathinda", lat: 30.198, lng: 74.958, brightness: 341.1, confidence: 84, detected_at: "2024-11-05T03:30:00Z" },
    { id: "HS-021", district: "Ferozepur", lat: 30.933, lng: 74.613, brightness: 347.3, confidence: 88, detected_at: "2024-11-04T21:30:00Z" },
    { id: "HS-022", district: "Ferozepur", lat: 30.941, lng: 74.601, brightness: 352.8, confidence: 94, detected_at: "2024-11-05T00:15:00Z" },
    { id: "HS-023", district: "Ferozepur", lat: 30.926, lng: 74.625, brightness: 338.5, confidence: 81, detected_at: "2024-11-05T02:00:00Z" },
    { id: "HS-024", district: "Ferozepur", lat: 30.948, lng: 74.590, brightness: 345.7, confidence: 90, detected_at: "2024-11-05T04:45:00Z" },
    { id: "HS-025", district: "Sangrur", lat: 30.260, lng: 75.818, brightness: 340.9, confidence: 83, detected_at: "2024-11-05T05:00:00Z" },
    { id: "HS-026", district: "Amritsar", lat: 31.650, lng: 74.848, brightness: 354.3, confidence: 96, detected_at: "2024-11-05T01:15:00Z" }
  ],

  clusters: [
    {
      id: "CL-001",
      village: "Kheri",
      district: "Sangrur",
      lat: 30.248,
      lng: 75.840,
      total_booked_acres: 16.0,
      status: "Gathering Demand",
      threshold_acres: 20,
      latest_harvest_date: "2024-11-03",
      scheduled_dispatch_date: null,
      assigned_baler_id: null,
      assigned_hub_id: "HUB-001",
      bookings: [
        { id: "BK-001", farmer_name: "Gurpreet Singh", phone: "98765xxxxx", acres: 6.0, booking_mode: "self", referred_by: null, referral_code: "KHERI-101", created_at: "2024-11-01T08:00:00Z" },
        { id: "BK-002", farmer_name: "Harjit Kaur", phone: "98764xxxxx", acres: 5.0, booking_mode: "captain_bulk", referred_by: null, referral_code: "KHERI-201", created_at: "2024-11-01T10:30:00Z" },
        { id: "BK-003", farmer_name: "Balwinder Pal", phone: "98763xxxxx", acres: 5.0, booking_mode: "self", referred_by: "KHERI-101", referral_code: "KHERI-301", created_at: "2024-11-02T09:00:00Z" }
      ]
    },
    {
      id: "CL-002",
      village: "Bhikhi",
      district: "Tarn Taran",
      lat: 31.455,
      lng: 74.930,
      total_booked_acres: 24.0,
      status: "Machine Dispatched",
      threshold_acres: 20,
      latest_harvest_date: "2024-11-02",
      scheduled_dispatch_date: "2024-11-05",
      assigned_baler_id: "BLR-002",
      assigned_hub_id: "HUB-002",
      bookings: [
        { id: "BK-004", farmer_name: "Amrik Singh", phone: "97651xxxxx", acres: 8.0, booking_mode: "captain_bulk", referred_by: null, referral_code: "BHIKHI-101", created_at: "2024-10-28T07:00:00Z" },
        { id: "BK-005", farmer_name: "Jagtar Kaur", phone: "97652xxxxx", acres: 10.0, booking_mode: "self", referred_by: "BHIKHI-101", referral_code: "BHIKHI-201", created_at: "2024-10-29T11:00:00Z" },
        { id: "BK-006", farmer_name: "Sukhdev Ram", phone: "97653xxxxx", acres: 6.0, booking_mode: "self", referred_by: null, referral_code: "BHIKHI-301", created_at: "2024-10-30T14:00:00Z" }
      ]
    },
    {
      id: "CL-003",
      village: "Rajpura",
      district: "Patiala",
      lat: 30.335,
      lng: 76.390,
      total_booked_acres: 22.0,
      status: "Machine Dispatched",
      threshold_acres: 20,
      latest_harvest_date: "2024-11-01",
      scheduled_dispatch_date: "2024-11-04",
      assigned_baler_id: "BLR-003",
      assigned_hub_id: "HUB-003",
      bookings: [
        { id: "BK-007", farmer_name: "Ranjit Kumar", phone: "98871xxxxx", acres: 12.0, booking_mode: "captain_bulk", referred_by: null, referral_code: "RAJPURA-101", created_at: "2024-10-27T06:30:00Z" },
        { id: "BK-008", farmer_name: "Paramjit Kaur", phone: "98872xxxxx", acres: 10.0, booking_mode: "self", referred_by: "RAJPURA-101", referral_code: "RAJPURA-201", created_at: "2024-10-28T09:15:00Z" }
      ]
    },
    {
      id: "CL-004",
      village: "Moga",
      district: "Ludhiana",
      lat: 30.905,
      lng: 75.850,
      total_booked_acres: 8.0,
      status: "Gathering Demand",
      threshold_acres: 20,
      latest_harvest_date: "2024-11-04",
      scheduled_dispatch_date: null,
      assigned_baler_id: null,
      assigned_hub_id: "HUB-001",
      bookings: [
        { id: "BK-009", farmer_name: "Daljit Singh", phone: "99881xxxxx", acres: 8.0, booking_mode: "self", referred_by: null, referral_code: "MOGA-101", created_at: "2024-11-03T08:45:00Z" }
      ]
    },
    {
      id: "CL-005",
      village: "Rampura",
      district: "Bathinda",
      lat: 30.215,
      lng: 74.950,
      total_booked_acres: 12.0,
      status: "Gathering Demand",
      threshold_acres: 20,
      latest_harvest_date: "2024-11-03",
      scheduled_dispatch_date: null,
      assigned_baler_id: null,
      assigned_hub_id: "HUB-002",
      bookings: [
        { id: "BK-010", farmer_name: "Kulwant Kaur", phone: "98541xxxxx", acres: 7.0, booking_mode: "captain_bulk", referred_by: null, referral_code: "RAMPURA-101", created_at: "2024-11-01T07:30:00Z" },
        { id: "BK-011", farmer_name: "Manjeet Singh", phone: "98542xxxxx", acres: 5.0, booking_mode: "self", referred_by: "RAMPURA-101", referral_code: "RAMPURA-201", created_at: "2024-11-02T10:00:00Z" }
      ]
    },
    {
      id: "CL-006",
      village: "Fazilka",
      district: "Ferozepur",
      lat: 30.935,
      lng: 74.615,
      total_booked_acres: 6.0,
      status: "Gathering Demand",
      threshold_acres: 20,
      latest_harvest_date: "2024-11-05",
      scheduled_dispatch_date: null,
      assigned_baler_id: null,
      assigned_hub_id: "HUB-003",
      bookings: [
        { id: "BK-012", farmer_name: "Nirmal Kaur", phone: "97761xxxxx", acres: 6.0, booking_mode: "self", referred_by: null, referral_code: "FAZILKA-101", created_at: "2024-11-04T11:00:00Z" }
      ]
    }
  ],

  balers: [
    { id: "BLR-001", machine_code: "PB-BLR-2024-001", lease_type: "45_day_seasonal", daily_capacity_acres: 20, status: "Idle", assigned_cluster_id: null, lat: 30.300, lng: 75.900 },
    { id: "BLR-002", machine_code: "PB-BLR-2024-002", lease_type: "45_day_seasonal", daily_capacity_acres: 20, status: "Dispatched", assigned_cluster_id: "CL-002", lat: 31.455, lng: 74.930 },
    { id: "BLR-003", machine_code: "PB-BLR-2024-003", lease_type: "15_day_peak", daily_capacity_acres: 20, status: "Operating", assigned_cluster_id: "CL-003", lat: 30.335, lng: 76.390 },
    { id: "BLR-004", machine_code: "PB-BLR-2024-004", lease_type: "45_day_seasonal", daily_capacity_acres: 20, status: "Idle", assigned_cluster_id: null, lat: 30.150, lng: 74.980 }
  ],

  storage_hubs: [
    { id: "HUB-001", name: "Sangrur Collection Hub", lat: 30.260, lng: 75.870, capacity_tonnes: 500, current_tonnes: 48.0 },
    { id: "HUB-002", name: "Tarn Taran Agri Hub", lat: 31.440, lng: 74.950, capacity_tonnes: 400, current_tonnes: 48.0 },
    { id: "HUB-003", name: "Patiala Storage Yard", lat: 30.350, lng: 76.410, capacity_tonnes: 600, current_tonnes: 44.0 }
  ],

  buyers: [
    { id: "BUY-001", name: "Punjab Biomass Power Ltd", type: "Biomass Power", lat: 30.290, lng: 75.920, rate_per_tonne: 1800, demand_tonnes_month: 1000 },
    { id: "BUY-002", name: "Green Valley Bio-CNG", type: "Bio-CNG", lat: 31.410, lng: 74.890, rate_per_tonne: 1800, demand_tonnes_month: 600 },
    { id: "BUY-003", name: "Modern Brick Works", type: "Brick Kiln", lat: 30.380, lng: 76.350, rate_per_tonne: 1800, demand_tonnes_month: 400 }
  ],

  lots: [
    { id: "LOT-001", hub_id: "HUB-001", buyer_id: "BUY-001", tonnes: 48.0, moisture_pct: 14.2, status: "Ready for Pickup", verified_at: "2024-11-04T10:00:00Z", settlement: null },
    { id: "LOT-002", hub_id: "HUB-002", buyer_id: "BUY-002", tonnes: 48.0, moisture_pct: 13.8, status: "Ready for Pickup", verified_at: "2024-11-04T12:00:00Z", settlement: null },
    { id: "LOT-003", hub_id: "HUB-003", buyer_id: "BUY-003", tonnes: 44.0, moisture_pct: 15.1, status: "Reserved & Settled", verified_at: "2024-11-03T09:00:00Z", settlement: { farmer_share_inr: 3960, coordinator_share_inr: 2640, platform_net_inr: 17600, transport_hub_inr: 24200, baler_opex_inr: 30800, gross_revenue_inr: 79200, settled_at: "2024-11-03T15:00:00Z" } },
    { id: "LOT-004", hub_id: "HUB-001", buyer_id: "BUY-001", tonnes: 30.0, moisture_pct: 16.5, status: "Reserved & Settled", verified_at: "2024-11-02T08:00:00Z", settlement: { farmer_share_inr: 2700, coordinator_share_inr: 1800, platform_net_inr: 12000, transport_hub_inr: 16500, baler_opex_inr: 21000, gross_revenue_inr: 54000, settled_at: "2024-11-02T14:00:00Z" } }
  ]
};

module.exports = { SEED };
