// ParaliSetu: Enterprise Client Engine
// Formal Enterprise Light-Mode Architecture
// Powered by Leaflet.js + OpenStreetMap, Stateful Storage & Trilingual Localization

const SEEDED_STATE = {
  clusters: [
    {
      id: 'VIL-KHERI',
      name: 'Kheri',
      district: 'Sangrur',
      lat: 30.2458,
      lng: 75.8421,
      targetAcres: 20.0,
      pooledAcres: 16.0, // EXACTLY 16 / 20 acres! Demo submission of 5 acres crosses 20 acres!
      strawTonnes: 32.0,
      status: 'GATHERING',
      enrolledFarmers: [
        { id: 'BK-KH-01', farmerName: 'Balwinder Singh', phone: '+91 98140 22334', acres: 6.0, strawTonnes: 12.0, harvestDate: '2026-11-18', moisturePercent: 14.5, referralCode: 'KHER-401', status: 'PENDING' },
        { id: 'BK-KH-02', farmerName: 'Harpreet Kaur', phone: '+91 98140 22335', acres: 5.5, strawTonnes: 11.0, harvestDate: '2026-11-19', moisturePercent: 15.2, referralCode: 'KHER-402', status: 'PENDING' },
        { id: 'BK-KH-03', farmerName: 'Gurnam Singh', phone: '+91 98140 22336', acres: 4.5, strawTonnes: 9.0, harvestDate: '2026-11-19', moisturePercent: 13.8, referralCode: 'KHER-403', status: 'PENDING' }
      ],
      nearestHubName: 'Sangrur Central Depot',
      hubDistanceKm: 3.2,
      assignedBalerId: null,
      earliestPickupDate: '2026-11-23',
      isMoistureSafe: true
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
        { id: 'BK-BH-01', farmerName: 'Sukhdev Singh', phone: '+91 98140 55667', acres: 10.5, strawTonnes: 21.0, harvestDate: '2026-11-17', moisturePercent: 14.0, referralCode: 'BHAW-101', status: 'DISPATCHED' },
        { id: 'BK-BH-02', farmerName: 'Avtar Singh', phone: '+91 98140 55668', acres: 8.0, strawTonnes: 16.0, harvestDate: '2026-11-18', moisturePercent: 15.0, referralCode: 'BHAW-102', status: 'DISPATCHED' },
        { id: 'BK-BH-03', farmerName: 'Manmohan Singh', phone: '+91 98140 55669', acres: 6.0, strawTonnes: 12.0, harvestDate: '2026-11-18', moisturePercent: 14.8, referralCode: 'BHAW-103', status: 'DISPATCHED' }
      ],
      nearestHubName: 'Sangrur Central Depot',
      hubDistanceKm: 1.8,
      assignedBalerId: 'BALER-PB-01',
      earliestPickupDate: '2026-11-23',
      isMoistureSafe: true
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
        { id: 'BK-NB-01', farmerName: 'Davinder Singh', phone: '+91 98140 77881', acres: 9.0, strawTonnes: 18.0, harvestDate: '2026-11-18', moisturePercent: 13.5, referralCode: 'NAB-201', status: 'DISPATCHED' },
        { id: 'BK-NB-02', farmerName: 'Jaspal Kaur', phone: '+91 98140 77882', acres: 7.0, strawTonnes: 14.0, harvestDate: '2026-11-19', moisturePercent: 14.2, referralCode: 'NAB-202', status: 'DISPATCHED' },
        { id: 'BK-NB-03', farmerName: 'Paramjit Singh', phone: '+91 98140 77883', acres: 5.0, strawTonnes: 10.0, harvestDate: '2026-11-19', moisturePercent: 15.0, referralCode: 'NAB-203', status: 'DISPATCHED' }
      ],
      nearestHubName: 'Nabha Agro Logistics Depot',
      hubDistanceKm: 1.4,
      assignedBalerId: 'BALER-PB-02',
      earliestPickupDate: '2026-11-23',
      isMoistureSafe: true
    },
    {
      id: 'VIL-SUNAM',
      name: 'Sunam',
      district: 'Sangrur',
      lat: 30.1294,
      lng: 75.8012,
      targetAcres: 20.0,
      pooledAcres: 8.5,
      strawTonnes: 17.0,
      status: 'GATHERING',
      enrolledFarmers: [
        { id: 'BK-SN-01', farmerName: 'Bikramjit Singh', phone: '+91 98140 33441', acres: 5.0, strawTonnes: 10.0, harvestDate: '2026-11-20', moisturePercent: 16.0, referralCode: 'SUN-101', status: 'PENDING' },
        { id: 'BK-SN-02', farmerName: 'Gurmeet Kaur', phone: '+91 98140 33442', acres: 3.5, strawTonnes: 7.0, harvestDate: '2026-11-20', moisturePercent: 15.5, referralCode: 'SUN-102', status: 'PENDING' }
      ],
      nearestHubName: 'Sangrur Central Depot',
      hubDistanceKm: 14.8,
      assignedBalerId: null,
      earliestPickupDate: '2026-11-24',
      isMoistureSafe: true
    },
    {
      id: 'VIL-PATTI',
      name: 'Patti',
      district: 'Tarn Taran',
      lat: 31.2821,
      lng: 74.8541,
      targetAcres: 20.0,
      pooledAcres: 11.0,
      strawTonnes: 22.0,
      status: 'GATHERING',
      enrolledFarmers: [
        { id: 'BK-PT-01', farmerName: 'Amrik Singh', phone: '+91 98140 88991', acres: 6.5, strawTonnes: 13.0, harvestDate: '2026-11-19', moisturePercent: 14.8, referralCode: 'PAT-301', status: 'PENDING' },
        { id: 'BK-PT-02', farmerName: 'Gurtej Singh', phone: '+91 98140 88992', acres: 4.5, strawTonnes: 9.0, harvestDate: '2026-11-20', moisturePercent: 15.0, referralCode: 'PAT-302', status: 'PENDING' }
      ],
      nearestHubName: 'Nabha Agro Logistics Depot',
      hubDistanceKm: 12.4,
      assignedBalerId: null,
      earliestPickupDate: '2026-11-24',
      isMoistureSafe: true
    },
    {
      id: 'VIL-RAMPURA',
      name: 'Rampura Phul',
      district: 'Bathinda',
      lat: 30.2741,
      lng: 75.2412,
      targetAcres: 20.0,
      pooledAcres: 6.5,
      strawTonnes: 13.0,
      status: 'GATHERING',
      enrolledFarmers: [
        { id: 'BK-RP-01', farmerName: 'Joginder Singh', phone: '+91 98140 44551', acres: 4.0, strawTonnes: 8.0, harvestDate: '2026-11-20', moisturePercent: 15.2, referralCode: 'RAM-501', status: 'PENDING' },
        { id: 'BK-RP-02', farmerName: 'Navneet Kaur', phone: '+91 98140 44552', acres: 2.5, strawTonnes: 5.0, harvestDate: '2026-11-21', moisturePercent: 17.5, referralCode: 'RAM-502', status: 'PENDING' }
      ],
      nearestHubName: 'Malwa Green Southern Depot',
      hubDistanceKm: 2.1,
      assignedBalerId: null,
      earliestPickupDate: '2026-11-25',
      isMoistureSafe: false
    }
  ],
  hotspots: [
    { id: 'F-01', lat: 30.2458, lng: 75.8421, frp: 38.4, village: 'Kheri', district: 'Sangrur', brightTemp: 358.4 },
    { id: 'F-02', lat: 30.2582, lng: 75.8614, frp: 28.2, village: 'Bhawanigarh', district: 'Sangrur', brightTemp: 346.2 },
    { id: 'F-03', lat: 30.1294, lng: 75.8012, frp: 21.5, village: 'Sunam', district: 'Sangrur', brightTemp: 339.8 },
    { id: 'F-04', lat: 30.0612, lng: 75.8821, frp: 32.1, village: 'Dirba', district: 'Sangrur', brightTemp: 352.0 },
    { id: 'F-05', lat: 29.8921, lng: 75.8942, frp: 26.4, village: 'Moonak', district: 'Sangrur', brightTemp: 344.0 },
    { id: 'F-06', lat: 30.2312, lng: 75.6841, frp: 19.8, village: 'Longowal', district: 'Sangrur', brightTemp: 337.5 },
    { id: 'F-07', lat: 30.3752, lng: 76.1524, frp: 35.6, village: 'Nabha', district: 'Patiala', brightTemp: 355.2 },
    { id: 'F-08', lat: 30.1491, lng: 76.1912, frp: 22.8, village: 'Samana', district: 'Patiala', brightTemp: 341.2 },
    { id: 'F-09', lat: 30.4821, lng: 76.5921, frp: 18.2, village: 'Rajpura', district: 'Patiala', brightTemp: 335.6 },
    { id: 'F-10', lat: 29.9341, lng: 76.0612, frp: 29.5, village: 'Patran', district: 'Patiala', brightTemp: 349.0 },
    { id: 'F-11', lat: 31.2821, lng: 74.8541, frp: 41.2, village: 'Patti', district: 'Tarn Taran', brightTemp: 362.5 },
    { id: 'F-12', lat: 31.4121, lng: 75.1241, frp: 27.5, village: 'Khadoor Sahib', district: 'Tarn Taran', brightTemp: 347.1 },
    { id: 'F-13', lat: 31.1841, lng: 74.9821, frp: 33.4, village: 'Chohla Sahib', district: 'Tarn Taran', brightTemp: 354.0 },
    { id: 'F-14', lat: 31.3341, lng: 74.7012, frp: 23.1, village: 'Bhikhiwind', district: 'Tarn Taran', brightTemp: 341.0 },
    { id: 'F-15', lat: 31.8412, lng: 74.7621, frp: 36.8, village: 'Ajnala', district: 'Amritsar', brightTemp: 356.4 },
    { id: 'F-16', lat: 31.7521, lng: 74.9541, frp: 24.3, village: 'Majitha', district: 'Amritsar', brightTemp: 342.5 },
    { id: 'F-17', lat: 31.5621, lng: 75.0241, frp: 30.2, village: 'Jandiala Guru', district: 'Amritsar', brightTemp: 350.1 },
    { id: 'F-18', lat: 31.5241, lng: 75.1621, frp: 21.0, village: 'Rayya', district: 'Amritsar', brightTemp: 338.2 },
    { id: 'F-19', lat: 30.2741, lng: 75.2412, frp: 39.5, village: 'Rampura Phul', district: 'Bathinda', brightTemp: 359.0 },
    { id: 'F-20', lat: 30.0741, lng: 75.2412, frp: 25.1, village: 'Maur', district: 'Bathinda', brightTemp: 343.8 },
    { id: 'F-21', lat: 29.9841, lng: 75.0912, frp: 31.2, village: 'Talwandi Sabo', district: 'Bathinda', brightTemp: 351.4 },
    { id: 'F-22', lat: 30.3121, lng: 74.9121, frp: 22.4, village: 'Goniana', district: 'Bathinda', brightTemp: 340.0 },
    { id: 'F-23', lat: 30.6841, lng: 75.1412, frp: 28.9, village: 'Baghapurana', district: 'Moga', brightTemp: 348.0 },
    { id: 'F-24', lat: 30.5841, lng: 75.2841, frp: 20.5, village: 'Nihal Singh Wala', district: 'Moga', brightTemp: 337.0 },
    { id: 'F-25', lat: 30.7921, lng: 75.4741, frp: 34.2, village: 'Jagraon', district: 'Ludhiana', brightTemp: 353.8 },
    { id: 'F-26', lat: 30.9841, lng: 74.9912, frp: 27.8, village: 'Zira', district: 'Firozpur', brightTemp: 346.5 }
  ],
  hubs: [
    { id: 'HUB-SANGRUR', name: 'Sangrur Central Depot', lat: 30.2520, lng: 75.8750, capacityTonnes: 15000, currentStockTonnes: 4800, maxRadiusKm: 15 },
    { id: 'HUB-PATIALA', name: 'Nabha Agro Logistics Depot', lat: 30.3680, lng: 76.1420, capacityTonnes: 12000, currentStockTonnes: 3900, maxRadiusKm: 15 },
    { id: 'HUB-BATHINDA', name: 'Malwa Green Southern Depot', lat: 30.2600, lng: 75.2500, capacityTonnes: 14000, currentStockTonnes: 2600, maxRadiusKm: 15 }
  ],
  buyers: [
    { id: 'BUYER-VERBIO', name: 'Verbio India Bio-CNG Plant', type: 'Bio-CNG', lat: 29.9320, lng: 75.8210, dailyDemand: 300, ratePerTonne: 1800, maxRadiusKm: 50 },
    { id: 'BUYER-SAEL', name: 'SAEL Biomass Power Plant', type: 'Biomass Power', lat: 30.0820, lng: 75.7640, dailyDemand: 450, ratePerTonne: 1800, maxRadiusKm: 50 },
    { id: 'BUYER-MALWA', name: 'Malwa Eco-Briquettes', type: 'Eco-Briquette', lat: 30.3420, lng: 75.5210, dailyDemand: 180, ratePerTonne: 1800, maxRadiusKm: 50 }
  ],
  balers: [
    { id: 'BALER-PB-01', model: 'Claas Markant 65', operator: 'Satnam Singh', status: 'DISPATCHED', assignedClusterId: 'VIL-BHAWANIGARH', lat: 30.2582, lng: 75.8614 },
    { id: 'BALER-PB-02', model: 'New Holland BC5070', operator: 'Kulwinder Singh', status: 'DISPATCHED', assignedClusterId: 'VIL-NABHA', lat: 30.3752, lng: 76.1524 },
    { id: 'BALER-PB-03', model: 'John Deere 348', operator: 'Amanpreet Singh', status: 'IDLE', assignedClusterId: null, lat: 30.2520, lng: 75.8750 },
    { id: 'BALER-PB-04', model: 'Sonalika Prime HD', operator: 'Manjit Singh', status: 'IDLE', assignedClusterId: null, lat: 30.2600, lng: 75.2500 }
  ],
  lots: [
    { id: 'LOT-SAN-01', hubName: 'Sangrur Central Depot', village: 'Bhawanigarh (Cluster 01)', tonnes: 80.0, acres: 40.0, moisture: 14.2, value: 144000, buyerDistance: '34 km (≤50km PASS)', status: 'AVAILABLE' },
    { id: 'LOT-PAT-02', hubName: 'Nabha Agro Depot', village: 'Nabha (Cluster 02)', tonnes: 42.0, acres: 21.0, moisture: 13.6, value: 75600, buyerDistance: '41 km (≤50km PASS)', status: 'AVAILABLE' },
    { id: 'LOT-BAT-03', hubName: 'Malwa Green Depot', village: 'Rampura Phul (Pre-Allocated)', tonnes: 65.0, acres: 32.5, moisture: 15.0, value: 117000, buyerDistance: '28 km (≤50km PASS)', status: 'AVAILABLE' }
  ],
  impact: {
    tonnesDiverted: 176.0,
    co2TonnesAvoided: 257.0,
    pm25KgPrevented: 528.0,
    farmerSavingsInr: 352000,
    ruralCashPaidInr: 26400,
    platformProfitInr: 70400
  }
};

// Client Live State (LocalStorage backed)
let clientState = loadClientState();
let currentLang = 'en';
let selectedCluster = null;
let currentLeaseType = '45_DAY_SEASONAL'; // '45_DAY_SEASONAL' | '15_DAY_PEAK'
let currentBookingMode = 'captain'; // 'captain' | 'farmer'

// Leaflet Map & Layer References
let leafletMap = null;
let fireLayerGroup = null;
let clusterLayerGroup = null;
let hubLayerGroup = null;
let buyerLayerGroup = null;
let balerLayerGroup = null;

const PUNJAB_CENTER = [30.80, 75.80];
const PUNJAB_DEFAULT_ZOOM = 8.5;

function loadClientState() {
  try {
    const raw = localStorage.getItem('paralisetu_enterprise_state_v1');
    if (raw) {
      const state = JSON.parse(raw);
      if (!state.impact) {
        state.impact = JSON.parse(JSON.stringify(SEEDED_STATE.impact));
      }
      return state;
    }
  } catch (e) {}
  return JSON.parse(JSON.stringify(SEEDED_STATE));
}

function saveClientState() {
  try {
    localStorage.setItem('paralisetu_enterprise_state_v1', JSON.stringify(clientState));
  } catch (e) {}
}

// =============================================================
// Supabase Live Database Integration & Credentials
// =============================================================
const SUPABASE_URL = "https://gmxclrkoistbsgenqxxt.supabase.co";
const SUPABASE_KEY = "sb_publishable_Br_Fs5Wm61pMhk0AhaF5CQ_t1bYvGK3";

let supabaseClient = null;

function getSupabaseClient() {
  if (!supabaseClient && window.supabase && typeof window.supabase.createClient === 'function') {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      console.log('[Supabase] Initialized client for', SUPABASE_URL);
    } catch (err) {
      console.warn('[Supabase] Initialization error:', err);
    }
  }
  return supabaseClient;
}

// -------------------------------------------------------------
// Requirement 4: NASA FIRMS Map Key Telemetry Loader
// -------------------------------------------------------------
async function loadNasaFirmsHotspots(apiKey) {
  if (!apiKey || !apiKey.trim()) return false;
  const trimmedKey = apiKey.trim();

  // 1. Try local server proxy sync endpoint
  try {
    const resp = await fetch('/api/firms/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: trimmedKey })
    });
    const json = await resp.json();
    if (json && json.hotspots && json.hotspots.length > 0) {
      clientState.hotspots = json.hotspots.map((h, i) => ({
        id: h.id || `NASA-${i + 1}`,
        lat: parseFloat(h.latitude || h.lat),
        lng: parseFloat(h.longitude || h.lng || h.lon),
        frp: parseFloat(h.frp || 25),
        village: h.village || 'Active Detection',
        district: h.district || 'Punjab',
        brightTemp: parseFloat(h.bright_ti4 || h.brightTemp || 345)
      }));
      if (leafletMap) updateLeafletMarkers();
      console.log(`[NASA FIRMS] Loaded ${clientState.hotspots.length} live satellite hotspots via backend.`);
      return true;
    }
  } catch (e) {}

  // 2. Direct NASA FIRMS CSV fetch
  try {
    const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${trimmedKey}/VIIRS_SNPP_NRT/73,29,77,33/1`;
    const res = await fetch(url);
    if (res.ok) {
      const text = await res.text();
      const lines = text.trim().split('\n');
      if (lines.length > 1 && !lines[0].toLowerCase().includes('invalid')) {
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const latIdx = headers.indexOf('latitude');
        const lonIdx = headers.indexOf('longitude');
        const frpIdx = headers.indexOf('frp');
        const brightIdx = headers.indexOf('bright_ti4');

        if (latIdx !== -1 && lonIdx !== -1) {
          const parsed = [];
          for (let i = 1; i < lines.length && parsed.length < 50; i++) {
            const parts = lines[i].split(',');
            const lat = parseFloat(parts[latIdx]);
            const lng = parseFloat(parts[lonIdx]);
            if (!isNaN(lat) && !isNaN(lng)) {
              parsed.push({
                id: `NASA-${i}`,
                lat,
                lng,
                frp: frpIdx !== -1 ? parseFloat(parts[frpIdx]) || 25 : 25,
                village: 'Satellite Hotspot',
                district: 'Punjab Area',
                brightTemp: brightIdx !== -1 ? parseFloat(parts[brightIdx]) || 345 : 345
              });
            }
          }
          if (parsed.length > 0) {
            clientState.hotspots = parsed;
            if (leafletMap) updateLeafletMarkers();
            console.log(`[NASA FIRMS] Direct loaded ${parsed.length} live satellite hotspots.`);
            return true;
          }
        }
      }
    }
  } catch (e) {
    console.warn('[NASA FIRMS] Direct fetch notice:', e);
  }

  console.log('[NASA FIRMS] Using seeded baseline hotspots.');
  clientState.hotspots = JSON.parse(JSON.stringify(SEEDED_STATE.hotspots));
  return false;
}

// -------------------------------------------------------------
// Requirement 1: Live Supabase Tables Fetcher on Load
// -------------------------------------------------------------
async function loadSupabaseData() {
  const sb = getSupabaseClient();
  if (!sb) {
    console.warn('[Supabase] Client not available yet, using baseline seeded data.');
    return;
  }

  try {
    console.log('[Supabase] Synchronizing live tables from database...');

    // 1. Fetch app_settings (check for nasa_firms_map_key)
    try {
      const { data: settingsData, error: settingsErr } = await sb.from('app_settings').select('*');
      if (settingsErr) {
        console.warn('[Supabase] app_settings notice:', settingsErr.message);
      } else if (settingsData && settingsData.length > 0) {
        let firmsKey = null;
        for (const row of settingsData) {
          if (row.key === 'nasa_firms_map_key' || row.setting_key === 'nasa_firms_map_key' || row.name === 'nasa_firms_map_key') {
            firmsKey = row.value || row.setting_value || row.val;
          } else if (row.nasa_firms_map_key) {
            firmsKey = row.nasa_firms_map_key;
          }
        }
        if (firmsKey && firmsKey.trim()) {
          console.log('[Supabase] Found nasa_firms_map_key in app_settings. Loading NASA FIRMS telemetry...');
          await loadNasaFirmsHotspots(firmsKey.trim());
        } else {
          console.log('[Supabase] No nasa_firms_map_key found; falling back to seeded hotspots.');
        }
      }
    } catch (e) {
      console.warn('[Supabase] Error reading app_settings:', e);
    }

    // 2. Fetch storage_hubs
    try {
      const { data: hubsData, error: hubsErr } = await sb.from('storage_hubs').select('*');
      if (hubsErr) {
        console.warn('[Supabase] storage_hubs notice:', hubsErr.message);
      } else if (hubsData && hubsData.length > 0) {
        clientState.hubs = hubsData.map(h => ({
          id: h.id || `HUB-${h.name}`,
          name: h.name || 'Storage Hub',
          lat: parseFloat(h.lat ?? h.latitude ?? 30.25),
          lng: parseFloat(h.lng ?? h.longitude ?? h.lon ?? 75.87),
          capacityTonnes: parseFloat(h.capacity_tonnes ?? h.capacityTonnes ?? 15000),
          currentStockTonnes: parseFloat(h.current_stock_tonnes ?? h.currentStockTonnes ?? 4800),
          maxRadiusKm: parseFloat(h.max_radius_km ?? h.maxRadiusKm ?? 15)
        }));
      }
    } catch (e) {
      console.warn('[Supabase] Error reading storage_hubs:', e);
    }

    // 3. Fetch industrial_buyers
    try {
      const { data: buyersData, error: buyersErr } = await sb.from('industrial_buyers').select('*');
      if (buyersErr) {
        console.warn('[Supabase] industrial_buyers notice:', buyersErr.message);
      } else if (buyersData && buyersData.length > 0) {
        clientState.buyers = buyersData.map(b => ({
          id: b.id || `BUYER-${b.name}`,
          name: b.name || 'Industrial Buyer',
          type: b.type || 'Bio-CNG',
          lat: parseFloat(b.lat ?? b.latitude ?? 29.93),
          lng: parseFloat(b.lng ?? b.longitude ?? b.lon ?? 75.82),
          dailyDemand: parseFloat(b.daily_demand ?? b.dailyDemand ?? b.daily_demand_tonnes ?? 300),
          ratePerTonne: parseFloat(b.rate_per_tonne ?? b.ratePerTonne ?? 1800),
          maxRadiusKm: parseFloat(b.max_radius_km ?? b.maxRadiusKm ?? 50)
        }));
      }
    } catch (e) {
      console.warn('[Supabase] Error reading industrial_buyers:', e);
    }

    // 4. Fetch leased_balers
    try {
      const { data: balersData, error: balersErr } = await sb.from('leased_balers').select('*');
      if (balersErr) {
        console.warn('[Supabase] leased_balers notice:', balersErr.message);
      } else if (balersData && balersData.length > 0) {
        clientState.balers = balersData.map(b => {
          const rawSt = (b.status || 'IDLE').toString();
          const isDispatched = rawSt.toLowerCase() === 'dispatched';
          return {
            id: b.id,
            model: b.model || 'Heavy Baler',
            operator: b.operator || 'Operator',
            phone: b.phone || '',
            status: isDispatched ? 'DISPATCHED' : 'IDLE',
            rawStatus: rawSt,
            assignedClusterId: b.assigned_cluster_id ?? b.assignedClusterId ?? null,
            lat: parseFloat(b.lat ?? b.latitude ?? 30.25),
            lng: parseFloat(b.lng ?? b.longitude ?? b.lon ?? 75.87)
          };
        });
      }
    } catch (e) {
      console.warn('[Supabase] Error reading leased_balers:', e);
    }

    // 5. Fetch bulk_lots
    try {
      const { data: lotsData, error: lotsErr } = await sb.from('bulk_lots').select('*');
      if (lotsErr) {
        console.warn('[Supabase] bulk_lots notice:', lotsErr.message);
      } else if (lotsData && lotsData.length > 0) {
        clientState.lots = lotsData.map(l => {
          const tonnes = parseFloat(l.tonnes ?? 0);
          const rawSt = (l.status || '').toString().toLowerCase();
          const isSold = rawSt === 'sold' || rawSt === 'settled';
          return {
            id: l.id,
            hubName: l.hub_name ?? l.hubName ?? 'Regional Storage Depot',
            village: l.village ?? l.village_name ?? l.villageName ?? 'Village Lot',
            tonnes: tonnes,
            acres: parseFloat(l.acres ?? l.acres_equivalent ?? l.acresEquivalent ?? (tonnes ? tonnes / 2 : 20)),
            moisture: parseFloat(l.moisture ?? l.moisture_percent ?? l.moisturePercent ?? 14.0),
            value: parseFloat(l.value ?? l.lot_value ?? l.lotValue ?? (tonnes ? tonnes * 1800 : 72000)),
            buyerDistance: l.buyer_distance ?? l.buyerDistance ?? l.distance_to_buyer_km ?? '34 km (≤50km PASS)',
            status: isSold ? 'Sold' : (l.status || 'AVAILABLE')
          };
        });
      }
    } catch (e) {
      console.warn('[Supabase] Error reading bulk_lots:', e);
    }

    // 6. Fetch bookings
    let bookingsList = [];
    try {
      const { data: bookingsData, error: bookingsErr } = await sb.from('bookings').select('*');
      if (bookingsErr) {
        console.warn('[Supabase] bookings notice:', bookingsErr.message);
      } else if (bookingsData && Array.isArray(bookingsData)) {
        bookingsList = bookingsData.map(b => ({
          id: b.id,
          villageId: b.village_id ?? b.villageId ?? b.cluster_id ?? b.clusterId,
          villageName: b.village_name ?? b.villageName ?? b.village,
          farmerName: b.farmer_name ?? b.farmerName,
          phone: b.phone,
          acres: parseFloat(b.acres ?? 0),
          strawTonnes: parseFloat(b.straw_tonnes ?? b.strawTonnes ?? (b.acres * 2.0)),
          harvestDate: b.harvest_date ?? b.harvestDate,
          moisturePercent: parseFloat(b.moisture_percent ?? b.moisturePercent ?? 14.5),
          referralCode: b.referral_code ?? b.referralCode,
          referredBy: b.referred_by ?? b.referredBy ?? null,
          status: b.status || 'POOLED'
        }));
      }
    } catch (e) {
      console.warn('[Supabase] Error reading bookings:', e);
    }

    // 7. Fetch village_clusters
    try {
      const { data: clustersData, error: clustersErr } = await sb.from('village_clusters').select('*');
      if (clustersErr) {
        console.warn('[Supabase] village_clusters notice:', clustersErr.message);
      } else if (clustersData && clustersData.length > 0) {
        clientState.clusters = clustersData.map(c => {
          const clusterBookings = bookingsList.filter(b => 
            b.villageId === c.id || 
            b.villageName === c.name || 
            b.villageName?.toLowerCase() === c.name?.toLowerCase()
          );
          const pooled = parseFloat(c.pooled_acres ?? c.pooledAcres ?? c.acres ?? 0);
          const rawStatus = (c.status || '').toString().toLowerCase();
          const isDispatched = rawStatus === 'dispatched' || pooled >= 20.0;
          return {
            id: c.id,
            name: c.name,
            district: c.district || 'Punjab',
            lat: parseFloat(c.lat ?? c.latitude ?? 30.25),
            lng: parseFloat(c.lng ?? c.longitude ?? c.lon ?? 75.84),
            targetAcres: parseFloat(c.target_acres ?? c.targetAcres ?? 20.0),
            pooledAcres: pooled,
            strawTonnes: parseFloat(c.straw_tonnes ?? c.strawTonnes ?? (pooled * 2.0)),
            status: isDispatched ? 'DISPATCHED' : 'GATHERING',
            nearestHubName: c.nearest_hub_name ?? c.nearestHubName ?? 'Sangrur Central Depot',
            hubDistanceKm: parseFloat(c.hub_distance_km ?? c.hubDistanceKm ?? 3.2),
            assignedBalerId: c.baler ?? c.assigned_baler_id ?? c.assignedBalerId ?? (isDispatched ? 'BALER-PB-03' : null),
            earliestPickupDate: c.earliest_pickup_date ?? c.earliestPickupDate ?? '2026-11-23',
            isMoistureSafe: c.is_moisture_safe ?? c.isMoistureSafe ?? true,
            enrolledFarmers: clusterBookings.length > 0 ? clusterBookings : (c.enrolled_farmers ?? c.enrolledFarmers ?? [])
          };
        });
      }
    } catch (e) {
      console.warn('[Supabase] Error reading village_clusters:', e);
    }

    // Re-render UI views with updated data
    renderAllViews();
    if (leafletMap) updateLeafletMarkers();
    populateVillageDropdown();
    console.log('[Supabase] Live database sync complete.');
  } catch (err) {
    console.warn('[Supabase] Sync error, continuing with cached/seeded state:', err);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  if (window.lucide) window.lucide.createIcons();

  // Set default harvest date (4 days ago) for individual booking form
  const dateInput = document.getElementById('indivHarvestDate');
  if (dateInput) {
    const past = new Date();
    past.setDate(past.getDate() - 4);
    dateInput.value = past.toISOString().split('T')[0];
  }

  // Populate Villages dropdown in booking forms
  populateVillageDropdown();

  // Initialize Sarpanch Multi-Farmer Batch Table
  renderBatchRows();

  // Set default booking mode to Village Captain / Sarpanch
  setBookingMode('captain');

  // Initialize Interactive Leaflet Map
  initLeafletMap();

  // Render all views
  renderAllViews();

  // Setup input listener for dynamic value swing calculation on individual form
  const indivAcresInput = document.getElementById('indivAcres');
  if (indivAcresInput) {
    indivAcresInput.addEventListener('input', () => updateFarmerValueSwing(parseFloat(indivAcresInput.value) || 0));
  }

  // Connect to Supabase and fetch live database tables
  await loadSupabaseData();
});

// -------------------------------------------------------------
// Top Navigation & Tabs (Clean 4 Tabs Row)
// -------------------------------------------------------------
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
  document.querySelectorAll('.enterprise-tab-btn').forEach(b => b.classList.remove('active'));

  const targetTab = document.getElementById(tabId);
  if (targetTab) targetTab.classList.remove('hidden');

  const btn = document.getElementById(`tabBtn-${tabId}`);
  if (btn) btn.classList.add('active');

  // Trigger Leaflet resize calculation when switching to map tab
  if (tabId === 'map-tab' && leafletMap) {
    setTimeout(() => {
      leafletMap.invalidateSize();
    }, 150);
  }

  if (window.lucide) window.lucide.createIcons();
}

function changeLanguage(lang) {
  currentLang = lang;
  const dict = window.LOCALES[lang] || window.LOCALES.en;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.textContent = dict[key];
  });
}

function resetDemo() {
  localStorage.removeItem('paralisetu_enterprise_state_v1');
  clientState = JSON.parse(JSON.stringify(SEEDED_STATE));
  sarpanchBatchRows = [
    { farmerName: 'Sukhwinder Singh', phone: '+91 98140 11223', acres: 2.5, harvestDate: getHarvestDateOffset(-3) },
    { farmerName: 'Kuldeep Singh', phone: '+91 98140 44556', acres: 2.5, harvestDate: getHarvestDateOffset(-3) }
  ];
  saveClientState();
  populateVillageDropdown();
  renderBatchRows();
  setBookingMode('captain');
  renderAllViews();
  if (leafletMap) {
    updateLeafletMarkers();
    resetMapView();
  }
  const dict = window.LOCALES[currentLang] || window.LOCALES.en;
  alert(dict.demoResetConfirm || "Demo baseline reset to initial seed (Village Kheri at 16 / 20 acres).");
}

// -------------------------------------------------------------
// Persistent Live Impact KPI Strip (6 Cards)
// -------------------------------------------------------------
function updateImpactStrip() {
  const totalAcres = clientState.clusters.reduce((sum, c) => sum + c.pooledAcres, 0);
  const tonnes = Number((totalAcres * 2.0).toFixed(1));
  const co2Tonnes = Number((tonnes * 1.46).toFixed(1));
  const pm25Kg = Number((tonnes * 3.0).toFixed(1));
  const farmerSavings = Math.round(totalAcres * 4000);
  const ruralCash = Math.round(totalAcres * (180 + 120));
  const platformProfit = Math.round(totalAcres * (currentLeaseType === '45_DAY_SEASONAL' ? 800 : 764));

  const elTonnes = document.getElementById('kpiTonnesVal');
  const elCo2 = document.getElementById('kpiCo2Val');
  const elPm25 = document.getElementById('kpiPm25Val');
  const elSavings = document.getElementById('kpiSavingsVal');
  const elCash = document.getElementById('kpiCashVal');
  const elProfit = document.getElementById('kpiProfitVal');

  if (elTonnes) elTonnes.textContent = `${tonnes.toLocaleString()} t`;
  if (elCo2) elCo2.textContent = `${co2Tonnes.toLocaleString()} t`;
  if (elPm25) elPm25.textContent = `${pm25Kg.toLocaleString()} kg`;
  if (elSavings) elSavings.textContent = `₹${farmerSavings.toLocaleString()}`;
  if (elCash) elCash.textContent = `₹${ruralCash.toLocaleString()}`;
  if (elProfit) elProfit.textContent = `₹${platformProfit.toLocaleString()}`;
}

// -------------------------------------------------------------
// Interactive Leaflet Map Engine (OpenStreetMap - Zero API Key)
// -------------------------------------------------------------
function initLeafletMap() {
  const container = document.getElementById('leafletMap');
  if (!container || leafletMap) return;

  // Initialize Leaflet Map centered on Punjab
  leafletMap = L.map('leafletMap', {
    center: PUNJAB_CENTER,
    zoom: PUNJAB_DEFAULT_ZOOM,
    zoomControl: false,
    scrollWheelZoom: true
  });

  // OpenStreetMap Standard Tiles (Clean, reliable, no API key required)
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
  }).addTo(leafletMap);

  // Initialize Layer Groups
  fireLayerGroup = L.layerGroup().addTo(leafletMap);
  hubLayerGroup = L.layerGroup().addTo(leafletMap);
  buyerLayerGroup = L.layerGroup().addTo(leafletMap);
  balerLayerGroup = L.layerGroup().addTo(leafletMap);
  clusterLayerGroup = L.layerGroup().addTo(leafletMap);

  // Populate layers with markers
  updateLeafletMarkers();

  setTimeout(() => {
    if (leafletMap) leafletMap.invalidateSize();
  }, 200);
}

function updateLeafletMarkers() {
  if (!leafletMap) return;

  // Clear existing layers
  fireLayerGroup.clearLayers();
  hubLayerGroup.clearLayers();
  buyerLayerGroup.clearLayers();
  balerLayerGroup.clearLayers();
  clusterLayerGroup.clearLayers();

  // 1. NASA Fire Hotspots (Interactive red circle markers)
  clientState.hotspots.forEach(spot => {
    const radius = Math.max(5, Math.min(11, spot.frp * 0.25));
    const circle = L.circleMarker([spot.lat, spot.lng], {
      radius: radius,
      color: '#DC2626',
      fillColor: '#EF4444',
      fillOpacity: 0.35,
      weight: 1.5
    });

    circle.bindPopup(`
      <div class="space-y-1 text-slate-800">
        <div class="font-bold text-xs text-rose-700 flex items-center justify-between">
          <span>NASA VIIRS Fire Anomaly</span>
          <span class="text-[10px] font-mono">${spot.id}</span>
        </div>
        <div class="text-xs">Location: <strong>${spot.village}</strong>, ${spot.district}</div>
        <div class="text-xs font-mono">FRP: <strong class="text-rose-600">${spot.frp} MW</strong> • Brightness: ${spot.brightTemp} K</div>
        <div class="text-[11px] text-slate-500 pt-1 border-t border-slate-100">Active crop residue burning detected by satellite.</div>
      </div>
    `);

    fireLayerGroup.addLayer(circle);
  });

  // 2. Storage Hubs (Cyan markers with 15 km transit radius)
  clientState.hubs.forEach(hub => {
    // 15 km Radius Geofence Circle
    const radiusCircle = L.circle([hub.lat, hub.lng], {
      radius: hub.maxRadiusKm * 1000,
      color: '#0284C7',
      fillColor: '#0284C7',
      fillOpacity: 0.04,
      weight: 1.5,
      dashArray: '5, 5'
    });
    hubLayerGroup.addLayer(radiusCircle);

    // Hub Icon
    const hubIcon = L.divIcon({
      className: 'custom-hub-icon',
      html: `
        <div class="marker-pin-hub">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
          <span>${hub.name.split(' ')[0]} Hub</span>
        </div>
      `,
      iconSize: [80, 24]
    });

    const marker = L.marker([hub.lat, hub.lng], { icon: hubIcon });
    marker.bindPopup(`
      <div class="space-y-1 text-slate-800">
        <div class="font-bold text-xs text-sky-800">${hub.name}</div>
        <div class="text-xs">Capacity: <strong>${hub.capacityTonnes.toLocaleString()} Tonnes</strong></div>
        <div class="text-xs font-mono">Current Stock: <strong class="text-sky-700">${hub.currentStockTonnes.toLocaleString()} Tonnes</strong></div>
        <div class="text-[11px] text-slate-500 pt-1 border-t border-slate-100">Maximum field transit geofence: ≤15 km.</div>
      </div>
    `);
    hubLayerGroup.addLayer(marker);
  });

  // 3. Industrial Buyers (Purple markers with subtle 50 km delivery radius)
  clientState.buyers.forEach(buyer => {
    // 50 km Delivery Corridor Circle
    const radiusCircle = L.circle([buyer.lat, buyer.lng], {
      radius: buyer.maxRadiusKm * 1000,
      color: '#7C3AED',
      fillColor: '#7C3AED',
      fillOpacity: 0.03,
      weight: 1.5,
      dashArray: '6, 6'
    });
    buyerLayerGroup.addLayer(radiusCircle);

    // Buyer Icon
    const buyerIcon = L.divIcon({
      className: 'custom-buyer-icon',
      html: `
        <div class="marker-pin-buyer">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/></svg>
          <span>${buyer.name.split(' ')[0]}</span>
        </div>
      `,
      iconSize: [80, 24]
    });

    const marker = L.marker([buyer.lat, buyer.lng], { icon: buyerIcon });
    marker.bindPopup(`
      <div class="space-y-1 text-slate-800">
        <div class="font-bold text-xs text-purple-900">${buyer.name}</div>
        <div class="text-xs">Category: <strong>${buyer.type}</strong></div>
        <div class="text-xs font-mono">Demand: <strong>${buyer.dailyDemand} Tonnes / day</strong></div>
        <div class="text-xs font-mono text-emerald-700">Contract Rate: <strong>₹1,800 / Tonne</strong></div>
        <div class="text-[11px] text-slate-500 pt-1 border-t border-slate-100">Guaranteed offtake within ≤50 km corridor.</div>
      </div>
    `);
    buyerLayerGroup.addLayer(marker);
  });

  // 4. Village Clusters (Amber <20 Ac / Emerald >=20 Ac interactive pins)
  clientState.clusters.forEach(c => {
    const isDispatched = c.pooledAcres >= c.targetAcres;
    const badgeClass = isDispatched ? 'dispatched' : '';

    const clusterIcon = L.divIcon({
      className: 'custom-cluster-icon',
      html: `
        <div class="marker-pin-cluster ${badgeClass}" onclick="openSlideOverSheet('${c.id}')">
          <span class="w-2 h-2 rounded-full ${isDispatched ? 'bg-emerald-600' : 'bg-amber-500'}"></span>
          <span>${c.name}: ${c.pooledAcres}/20 Ac</span>
        </div>
      `,
      iconSize: [110, 26]
    });

    const marker = L.marker([c.lat, c.lng], { icon: clusterIcon });
    marker.on('click', () => {
      selectClusterAndPan(c.id);
    });

    clusterLayerGroup.addLayer(marker);
  });
}

function toggleMapLayer(layerKey) {
  if (!leafletMap) return;

  const isChecked = document.getElementById(layerKey)?.checked;

  if (layerKey === 'chkFires') {
    if (isChecked) leafletMap.addLayer(fireLayerGroup);
    else leafletMap.removeLayer(fireLayerGroup);
  } else if (layerKey === 'chkClusters') {
    if (isChecked) leafletMap.addLayer(clusterLayerGroup);
    else leafletMap.removeLayer(clusterLayerGroup);
  } else if (layerKey === 'chkHubs') {
    if (isChecked) leafletMap.addLayer(hubLayerGroup);
    else leafletMap.removeLayer(hubLayerGroup);
  } else if (layerKey === 'chkBuyers') {
    if (isChecked) leafletMap.addLayer(buyerLayerGroup);
    else leafletMap.removeLayer(buyerLayerGroup);
  }
}

function zoomInMap() {
  if (leafletMap) leafletMap.zoomIn();
}

function zoomOutMap() {
  if (leafletMap) leafletMap.zoomOut();
}

function resetMapView() {
  if (leafletMap) {
    leafletMap.flyTo(PUNJAB_CENTER, PUNJAB_DEFAULT_ZOOM, { duration: 0.8 });
  }
}

function selectClusterAndPan(clusterId) {
  const cluster = clientState.clusters.find(c => c.id === clusterId);
  if (!cluster) return;

  if (leafletMap) {
    leafletMap.flyTo([cluster.lat, cluster.lng], 11, { duration: 0.8 });
  }

  openSlideOverSheet(cluster.id);
}

// -------------------------------------------------------------
// Cluster Radar List Rendering (Right Side of Map)
// -------------------------------------------------------------
function renderClusterRadarList() {
  const container = document.getElementById('clusterRadarList');
  if (!container) return;

  container.innerHTML = clientState.clusters.map(c => {
    const isDispatched = c.pooledAcres >= c.targetAcres;
    const percent = Math.min(Math.round((c.pooledAcres / c.targetAcres) * 100), 100);
    const badgeColor = isDispatched ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200';
    const barColor = isDispatched ? 'bg-emerald-600' : 'bg-amber-500';

    return `
      <div onclick="selectClusterAndPan('${c.id}')" class="p-3 bg-white border border-slate-200 hover:border-slate-300 rounded-lg transition cursor-pointer space-y-2">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-semibold text-slate-900">${c.name} Village</div>
            <div class="text-xs text-slate-500">${c.district} District • Hub: ${c.hubDistanceKm} km</div>
          </div>
          <span class="px-2 py-0.5 rounded text-xs font-semibold border ${badgeColor} tabular-nums">
            ${c.pooledAcres} / 20 Ac
          </span>
        </div>

        <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div class="${barColor} h-1.5 rounded-full" style="width: ${percent}%"></div>
        </div>

        <div class="flex items-center justify-between text-xs text-slate-500">
          <span>${isDispatched ? 'Baler Dispatched' : 'Gathering Landholdings'}</span>
          <span class="font-medium text-slate-700">${percent}%</span>
        </div>
      </div>
    `;
  }).join('');
}

// -------------------------------------------------------------
// Slide-Over Detail Sheet (Cluster Breakdown & 3-Way Ledger)
// -------------------------------------------------------------
function openSlideOverSheet(clusterId) {
  const cluster = clientState.clusters.find(c => c.id === clusterId) || clientState.clusters[0];
  selectedCluster = cluster;

  const sheet = document.getElementById('slideOverSheet');
  const backdrop = document.getElementById('sheetBackdrop');
  if (!sheet || !backdrop) return;

  const isDispatched = cluster.pooledAcres >= cluster.targetAcres;
  const percent = Math.min(Math.round((cluster.pooledAcres / cluster.targetAcres) * 100), 100);

  // Cluster Header & Badge
  document.getElementById('sheetVillageName').textContent = `${cluster.name} Village Cluster`;
  document.getElementById('sheetDistrict').textContent = `${cluster.district} District • Punjab`;

  const statusBadge = document.getElementById('sheetStatusBadge');
  if (statusBadge) {
    if (isDispatched) {
      statusBadge.textContent = 'DISPATCHED';
      statusBadge.className = 'px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200';
    } else {
      statusBadge.textContent = 'GATHERING DEMAND';
      statusBadge.className = 'px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200';
    }
  }

  // Progress Bar
  document.getElementById('sheetProgressText').textContent = `${cluster.pooledAcres} / ${cluster.targetAcres} Acres (${percent}%)`;
  document.getElementById('sheetProgressBar').style.width = `${percent}%`;

  // Drying Buffer & Pickup
  document.getElementById('sheetPickupDateVal').textContent = cluster.earliestPickupDate;
  const dryingBadge = document.getElementById('sheetDryingBadge');
  if (dryingBadge) {
    dryingBadge.textContent = cluster.isMoistureSafe ? 'Moisture Safe (<20%)' : 'Drying Buffer Active';
    dryingBadge.className = cluster.isMoistureSafe ? 'text-xs text-emerald-700 font-semibold' : 'text-xs text-amber-700 font-semibold';
  }

  // Hub Distance
  document.getElementById('sheetHubDistanceVal').textContent = `${cluster.nearestHubName} (${cluster.hubDistanceKm} km — ≤15km PASS)`;

  // Assigned Baler
  document.getElementById('sheetAssignedBalerVal').textContent = cluster.assignedBalerId || 'Pending 20-Acre Trigger';

  // Enrolled Farmers List
  const farmersList = document.getElementById('sheetFarmersList');
  if (farmersList) {
    farmersList.innerHTML = cluster.enrolledFarmers.map(f => `
      <div class="p-2.5 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
        <div>
          <div class="font-medium text-slate-900">${f.farmerName} <span class="text-slate-500 font-normal">(${f.phone})</span></div>
          <div class="text-[11px] text-slate-500 font-mono-code">Code: ${f.referralCode} • Harvest: ${f.harvestDate}</div>
        </div>
        <div class="text-right">
          <div class="font-semibold text-slate-900 tabular-nums">${f.acres} Acres</div>
          <div class="text-[11px] text-emerald-700 font-medium">₹0 Clearing</div>
        </div>
      </div>
    `).join('');
  }

  // 3-Way Payout Ledger Breakdown
  const acres = cluster.pooledAcres;
  const gross = acres * 3600;
  const baler = acres * 1400;
  const log = acres * 1100;
  const farmer = acres * 180;
  const coord = acres * 120;
  const profit = acres * 800;

  document.getElementById('sheetLedgerGross').textContent = `+₹${gross.toLocaleString()}`;
  document.getElementById('sheetLedgerBaler').textContent = `-₹${baler.toLocaleString()}`;
  document.getElementById('sheetLedgerLogistics').textContent = `-₹${log.toLocaleString()}`;
  document.getElementById('sheetLedgerFarmer').textContent = `+₹${farmer.toLocaleString()}`;
  document.getElementById('sheetLedgerCoord').textContent = `+₹${coord.toLocaleString()}`;
  document.getElementById('sheetLedgerProfit').textContent = `+₹${profit.toLocaleString()} (22.2%)`;

  sheet.classList.add('open');
  backdrop.classList.add('open');
}

function closeSlideOverSheet() {
  document.getElementById('slideOverSheet')?.classList.remove('open');
  document.getElementById('sheetBackdrop')?.classList.remove('open');
}

function addFarmerFromSheet() {
  closeSlideOverSheet();
  switchTab('booking-tab');
  if (selectedCluster) {
    const selCaptain = document.getElementById('captainVillageSelect');
    if (selCaptain) selCaptain.value = selectedCluster.id;
    const selIndiv = document.getElementById('indivVillageSelect');
    if (selIndiv) selIndiv.value = selectedCluster.id;
    onCaptainVillageChange();
  }
}

// -------------------------------------------------------------
// Tab 2: Village Captain & Farmer Booking Portal
// -------------------------------------------------------------
function getHarvestDateOffset(daysOffset = -3) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Pre-seeded Sarpanch multi-farmer batch: 2 farmers of 2.5 ac each = 5.0 ac total
// Since Kheri starts at 16 / 20 ac, submitting this batch brings Kheri to 21 / 20 ac, triggering baler dispatch!
let sarpanchBatchRows = [
  { farmerName: 'Sukhwinder Singh', phone: '+91 98140 11223', acres: 2.5, harvestDate: getHarvestDateOffset(-3) },
  { farmerName: 'Kuldeep Singh', phone: '+91 98140 44556', acres: 2.5, harvestDate: getHarvestDateOffset(-3) }
];

function renderBatchRows() {
  const tbody = document.getElementById('batchTableBody');
  if (!tbody) return;

  tbody.innerHTML = sarpanchBatchRows.map((row, idx) => `
    <tr class="hover:bg-slate-50/70 transition">
      <td class="py-2.5 px-3 text-center text-slate-400 font-mono-code">${idx + 1}</td>
      <td class="py-2.5 px-3">
        <input type="text" value="${escapeHtml(row.farmerName)}" onchange="updateBatchRow(${idx}, 'farmerName', this.value)" class="form-input text-xs py-1" placeholder="e.g. Gurpreet Singh">
      </td>
      <td class="py-2.5 px-3">
        <input type="tel" value="${escapeHtml(row.phone)}" onchange="updateBatchRow(${idx}, 'phone', this.value)" class="form-input text-xs py-1 font-mono-code" placeholder="+91 98140 00000">
      </td>
      <td class="py-2.5 px-3">
        <input type="number" min="0.5" max="50" step="0.5" value="${row.acres}" oninput="updateBatchRow(${idx}, 'acres', this.value)" class="form-input text-xs py-1 font-bold tabular-nums">
      </td>
      <td class="py-2.5 px-3">
        <input type="date" value="${row.harvestDate}" onchange="updateBatchRow(${idx}, 'harvestDate', this.value)" class="form-input text-xs py-1 font-mono-code">
      </td>
      <td class="py-2.5 px-3 text-center">
        <button type="button" onclick="removeBatchRow(${idx})" class="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition" title="Delete Row">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        </button>
      </td>
    </tr>
  `).join('');

  updateBatchSummary();
  if (window.lucide) window.lucide.createIcons();
}

function updateBatchRow(idx, field, value) {
  if (!sarpanchBatchRows[idx]) return;
  if (field === 'acres') {
    sarpanchBatchRows[idx].acres = parseFloat(value) || 0;
  } else {
    sarpanchBatchRows[idx][field] = value;
  }
  updateBatchSummary();
}

function addBatchRow() {
  sarpanchBatchRows.push({
    farmerName: '',
    phone: '+91 98140 ',
    acres: 2.0,
    harvestDate: getHarvestDateOffset(-3)
  });
  renderBatchRows();
}

function removeBatchRow(idx) {
  if (sarpanchBatchRows.length <= 1) {
    alert('At least one farmer row is required in the Panchayat batch.');
    return;
  }
  sarpanchBatchRows.splice(idx, 1);
  renderBatchRows();
}

function updateBatchSummary() {
  const totalCount = sarpanchBatchRows.length;
  const totalAcres = sarpanchBatchRows.reduce((sum, r) => sum + (parseFloat(r.acres) || 0), 0);
  const totalTonnes = totalAcres * 2.0;
  const sarpanchReward = Math.round(totalAcres * 120);
  const dieselSaved = Math.round(totalAcres * 4000);

  const elCount = document.getElementById('batchCountVal');
  const elAcres = document.getElementById('batchAcresVal');
  const elTonnes = document.getElementById('batchTonnesVal');
  const elReward = document.getElementById('batchRewardVal');
  const elSavings = document.getElementById('batchSavingsVal');

  if (elCount) elCount.textContent = totalCount;
  if (elAcres) elAcres.textContent = `${totalAcres.toFixed(1)} Acres`;
  if (elTonnes) elTonnes.textContent = `(~${totalTonnes.toFixed(1)} Tonnes)`;
  if (elReward) elReward.textContent = `+₹${sarpanchReward.toLocaleString()}`;
  if (elSavings) elSavings.textContent = `₹${dieselSaved.toLocaleString()}`;
}

function copySarpanchCode() {
  const codeEl = document.getElementById('sarpanchCodeDisplay');
  const code = codeEl ? codeEl.textContent.trim() : 'SARPANCH-KHERI';
  navigator.clipboard.writeText(code).then(() => {
    const btn = document.getElementById('btnCopyCodeEl');
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> <span>Copied!</span>`;
      setTimeout(() => { btn.innerHTML = orig; }, 2000);
    }
  }).catch(() => {});
}

function broadcastSarpanchWhatsApp() {
  const sel = document.getElementById('captainVillageSelect');
  const villageName = sel ? sel.options[sel.selectedIndex]?.text.split('(')[0].trim() : 'Kheri';
  const refCode = `SARPANCH-${villageName.replace(/\s+/g, '').toUpperCase()}`;
  const origin = window.location.origin;

  const msg = `🌾 *ਗ੍ਰਾਮ ਪੰਚਾਇਤ ${villageName} - ਪਰਾਲੀਸੇਤੂ ਖੇਤ ਸਫ਼ਾਈ ਸੂਚਨਾ*\n` +
    `ਸਾਰੇ ਕਿਸਾਨ ਵੀਰਾਂ ਨੂੰ ਸੂਚਿਤ ਕੀਤਾ ਜਾਂਦਾ ਹੈ ਕਿ ਪਰਾਲੀਸੇਤੂ ਰਾਹੀਂ ਖੇਤ ਦੀ ਪਰਾਲੀ ਬਿਲਕੁਲ ਮੁਫ਼ਤ (₹0 ਫੀਸ) ਚੁੱਕੀ ਜਾ ਰਹੀ ਹੈ ਅਤੇ ਕਿਸਾਨਾਂ ਨੂੰ ₹180/ਏਕੜ ਕੈਸ਼ਬੈਕ ਮਿਲੇਗਾ।\n` +
    `ਪੰਚਾਇਤ ਰੈਫਰਲ ਕੋਡ: *${refCode}*\n` +
    `ਆਪਣਾ ਖੇਤ ਦਰਜ ਕਰਨ ਲਈ ਇਸ ਲਿੰਕ 'ਤੇ ਜਾਓ:\n${origin}\n\n` +
    `🌾 *Village Panchayat ${villageName} Stubble Aggregation Notice*\n` +
    `Complimentary mechanical baling (₹0 clearing fee) + ₹180/acre cashback. Quote official village code: *${refCode}*`;

  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
}

function applySarpanchCode() {
  const input = document.getElementById('indivReferredBy');
  if (input) {
    const sel = document.getElementById('indivVillageSelect');
    const villageName = sel ? sel.options[sel.selectedIndex]?.text.split('(')[0].trim() : 'KHERI';
    input.value = `SARPANCH-${villageName.replace(/\s+/g, '').toUpperCase()}`;
    input.focus();
  }
}

function setBookingMode(mode) {
  currentBookingMode = mode;
  const btnCaptain = document.getElementById('btnModeCaptain');
  const btnFarmer = document.getElementById('btnModeFarmer');
  const captainContainer = document.getElementById('captainViewContainer');
  const individualContainer = document.getElementById('individualViewContainer');

  if (mode === 'captain') {
    if (btnCaptain) btnCaptain.className = 'px-3 py-1.5 rounded-md bg-[#143628] text-white font-medium text-xs shadow-sm transition';
    if (btnFarmer) btnFarmer.className = 'px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900 font-medium text-xs transition';
    if (captainContainer) captainContainer.classList.remove('hidden');
    if (individualContainer) individualContainer.classList.add('hidden');
  } else {
    if (btnCaptain) btnCaptain.className = 'px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900 font-medium text-xs transition';
    if (btnFarmer) btnFarmer.className = 'px-3 py-1.5 rounded-md bg-[#143628] text-white font-medium text-xs shadow-sm transition';
    if (captainContainer) captainContainer.classList.add('hidden');
    if (individualContainer) individualContainer.classList.remove('hidden');
    const acresVal = document.getElementById('indivAcres')?.value || 5;
    updateFarmerValueSwing(acresVal);
  }
  if (window.lucide) window.lucide.createIcons();
}

function populateVillageDropdown() {
  const selCaptain = document.getElementById('captainVillageSelect');
  const selIndiv = document.getElementById('indivVillageSelect');

  const optionsHtml = clientState.clusters.map(c => `
    <option value="${c.id}" ${c.id === 'VIL-KHERI' ? 'selected' : ''}>
      ${c.name} (${c.district}) — ${c.pooledAcres} / 20 Acres (${c.status})
    </option>
  `).join('');

  if (selCaptain) selCaptain.innerHTML = optionsHtml;
  if (selIndiv) selIndiv.innerHTML = optionsHtml;
}

function onCaptainVillageChange() {
  const sel = document.getElementById('captainVillageSelect');
  if (!sel) return;
  const villageName = sel.options[sel.selectedIndex]?.text.split('(')[0].trim();
  const codeDisplay = document.getElementById('sarpanchCodeDisplay');
  if (codeDisplay && villageName) {
    codeDisplay.textContent = `SARPANCH-${villageName.replace(/\s+/g, '').toUpperCase()}`;
  }
}

function updateFarmerValueSwing(acresVal) {
  const acres = Math.max(0, parseFloat(acresVal) || 0);
  const clearingCostSaved = Math.round(acres * 4000);
  const cashSharePayout = Math.round(acres * 180);
  const totalSwing = clearingCostSaved + cashSharePayout;

  const elSaved = document.getElementById('swingSavedVal');
  const elCash = document.getElementById('swingCashVal');
  const elTotal = document.getElementById('swingTotalVal');
  const elTonnes = document.getElementById('swingTonnesVal');

  if (elSaved) elSaved.textContent = `₹${clearingCostSaved.toLocaleString()}`;
  if (elCash) elCash.textContent = `+₹${cashSharePayout.toLocaleString()}`;
  if (elTotal) elTotal.textContent = `+₹${totalSwing.toLocaleString()}`;
  if (elTonnes) elTonnes.textContent = `~${(acres * 2.0).toFixed(1)} Tonnes Stubble`;
}

// =============================================================
// Requirement 2: Core Booking Submission & Supabase Sync
// =============================================================
async function submitBooking(payload) {
  let bookingData = {};
  if (payload && payload.preventDefault) {
    payload.preventDefault();
    const isIndividual = currentBookingMode === 'farmer';
    const villageId = document.getElementById(isIndividual ? 'indivVillageSelect' : 'captainVillageSelect')?.value || 'VIL-KHERI';
    const farmerName = document.getElementById(isIndividual ? 'indivFarmerName' : 'bookFarmerName')?.value || 'Farmer';
    const phone = document.getElementById(isIndividual ? 'indivPhone' : 'bookPhone')?.value || '+91 98140 00000';
    const acres = parseFloat(document.getElementById(isIndividual ? 'indivAcres' : 'bookAcres')?.value) || 5.0;
    const harvestDate = document.getElementById(isIndividual ? 'indivHarvestDate' : 'bookHarvestDate')?.value || new Date().toISOString().split('T')[0];
    const referredBy = document.getElementById('indivReferredBy')?.value || null;
    const bookingMode = isIndividual ? 'individual' : 'captain';
    bookingData = { clusterId: villageId, villageId, farmerName, phone, acres, harvestDate, referredBy, booking_mode: bookingMode };
  } else if (payload && typeof payload === 'object') {
    bookingData = payload;
  } else {
    bookingData = { clusterId: 'VIL-KHERI', farmerName: 'Jagtar Singh', phone: '+91 98140 99881', acres: 5.0 };
  }

  const villageId = bookingData.clusterId || bookingData.villageId || 'VIL-KHERI';
  const cluster = clientState.clusters.find(c => c.id === villageId || c.name === villageId) || clientState.clusters[0];
  const acres = parseFloat(bookingData.acres) || 5.0;
  const wasUnder20 = cluster.pooledAcres < cluster.targetAcres;
  const newPooledAcres = Number((cluster.pooledAcres + acres).toFixed(1));
  const thresholdReached = wasUnder20 && newPooledAcres >= cluster.targetAcres;

  const villageCode = cluster.name.slice(0, 4).toUpperCase();
  const refCode = bookingData.referralCode || `${villageCode}-${Math.floor(100 + Math.random() * 900)}`;
  const bookingId = bookingData.id || `BK-${Date.now().toString(36).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;

  const newBooking = {
    id: bookingId,
    villageId: cluster.id,
    villageName: cluster.name,
    farmerName: (bookingData.farmerName || 'Farmer').trim(),
    phone: (bookingData.phone || '+91 98140 00000').trim(),
    acres: acres,
    strawTonnes: Number((acres * 2.0).toFixed(1)),
    harvestDate: bookingData.harvestDate || new Date().toISOString().split('T')[0],
    moisturePercent: 14.5,
    referralCode: refCode,
    referredBy: bookingData.referredBy || null,
    status: thresholdReached ? 'DISPATCHED' : 'POOLED'
  };

  // Update in-memory cluster
  cluster.enrolledFarmers.unshift(newBooking);
  cluster.pooledAcres = newPooledAcres;
  cluster.strawTonnes = Number((cluster.pooledAcres * 2.0).toFixed(1));

  let assignedBalerId = cluster.assignedBalerId;
  if (thresholdReached) {
    cluster.status = 'DISPATCHED';
    if (!assignedBalerId) {
      const idleBaler = clientState.balers.find(b => b.status === 'IDLE');
      if (idleBaler) {
        idleBaler.status = 'DISPATCHED';
        idleBaler.assignedClusterId = cluster.id;
        assignedBalerId = idleBaler.id;
      } else {
        assignedBalerId = 'BALER-PB-03';
      }
    }
    cluster.assignedBalerId = assignedBalerId;
  }

  // Update persistent impact strip safely
  if (!clientState.impact) {
    clientState.impact = { tonnesDiverted: 0, co2TonnesAvoided: 0, pm25KgPrevented: 0, farmerSavingsInr: 0, ruralCashPaidInr: 0, platformProfitInr: 0 };
  }
  const allAcres = clientState.clusters.reduce((sum, c) => sum + c.pooledAcres, 0);
  clientState.impact.tonnesDiverted = Number((allAcres * 2.0).toFixed(1));
  clientState.impact.co2TonnesAvoided = Number((clientState.impact.tonnesDiverted * 1.46).toFixed(1));
  clientState.impact.pm25KgPrevented = Number((clientState.impact.tonnesDiverted * 3.0).toFixed(1));
  clientState.impact.farmerSavingsInr = Math.round(allAcres * 4000);
  clientState.impact.ruralCashPaidInr = Math.round(allAcres * 300);
  clientState.impact.platformProfitInr = Math.round(allAcres * 800);

  saveClientState();
  populateVillageDropdown();
  renderAllViews();
  if (leafletMap) updateLeafletMarkers();

  // Supabase Database Operations
  const sb = getSupabaseClient();
  if (sb) {
    try {
      // 1. Insert new booking into 'bookings' (auto-generated id; ONLY sending specified columns)
      console.log('[Supabase] Inserting new booking into "bookings"...');
      const bookingMode = bookingData.booking_mode || bookingData.bookingMode || (currentBookingMode === 'farmer' ? 'individual' : 'captain');
      const bookingPayload = {
        village_id: cluster.id,
        cluster_id: cluster.id,
        village_name: cluster.name,
        farmer_name: newBooking.farmerName,
        phone: newBooking.phone,
        acres: newBooking.acres,
        harvest_date: newBooking.harvestDate,
        booking_mode: bookingMode,
        referral_code: newBooking.referralCode || null,
        referred_by: newBooking.referredBy || null,
        moisture_percent: newBooking.moisturePercent ?? 14.5,
        status: newBooking.status || 'POOLED'
      };
      const { error: bErr } = await sb.from('bookings').insert([bookingPayload]);
      if (bErr) console.warn('[Supabase] bookings insert note:', bErr.message);

      // 2. Update matching row in 'village_clusters' (ONLY sending: acres, pooled_acres, baler, assigned_baler_id, status)
      console.log('[Supabase] Updating "village_clusters"...');
      const balerId = assignedBalerId || cluster.assignedBalerId || (newPooledAcres >= 20 ? 'BALER-PB-03' : null);
      const clusterUpdateData = {
        acres: newPooledAcres,
        pooled_acres: newPooledAcres,
        baler: balerId,
        assigned_baler_id: balerId,
        status: newPooledAcres >= 20 ? 'Dispatched' : cluster.status
      };
      const { error: cErr } = await sb.from('village_clusters').update(clusterUpdateData).eq('id', cluster.id);
      if (cErr) console.warn('[Supabase] village_clusters update note:', cErr.message);

      // 3. Update the assigned baler's status to 'Dispatched' in 'leased_balers'
      if (thresholdReached && assignedBalerId) {
        console.log('[Supabase] Updating assigned baler status to "Dispatched" in "leased_balers"...');
        const { error: blrErr } = await sb.from('leased_balers').update({
          status: 'Dispatched',
          assigned_cluster_id: cluster.id
        }).eq('id', assignedBalerId);
        if (blrErr) console.warn('[Supabase] leased_balers update note:', blrErr.message);
      }
    } catch (sbEx) {
      console.warn('[Supabase] submitBooking exception:', sbEx);
    }
  }

  // Also sync with backend server API
  try {
    fetch('/api/captain/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        farmerName: newBooking.farmerName,
        phone: newBooking.phone,
        acres: newBooking.acres,
        harvestDate: newBooking.harvestDate,
        village: cluster.name,
        district: cluster.district,
        referredBy: newBooking.referredBy,
        referralCode: newBooking.referralCode
      })
    }).catch(() => {});
  } catch (e) {}

  return { booking: newBooking, cluster, thresholdReached };
}
window.submitBooking = submitBooking;

// -------------------------------------------------------------
// Sarpanch Multi-Farmer Batch Submission Handler
// -------------------------------------------------------------
async function handleSarpanchBatchSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();

  const sel = document.getElementById('captainVillageSelect');
  const villageId = sel ? sel.value : 'VIL-KHERI';
  const cluster = clientState.clusters.find(c => c.id === villageId) || clientState.clusters[0];

  const validRows = sarpanchBatchRows.filter(r => r.farmerName.trim() && parseFloat(r.acres) > 0);
  if (validRows.length === 0) {
    alert('Please enter at least one farmer with name and acreage.');
    return;
  }

  const batchAcres = validRows.reduce((sum, r) => sum + parseFloat(r.acres), 0);
  const wasUnder20 = cluster.pooledAcres < cluster.targetAcres;
  const newPooledAcres = Number((cluster.pooledAcres + batchAcres).toFixed(1));
  const thresholdReached = wasUnder20 && newPooledAcres >= cluster.targetAcres;

  const addedFarmers = validRows.map(r => ({
    id: `BK-${Date.now().toString(36).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
    farmerName: r.farmerName.trim(),
    phone: r.phone.trim() || '+91 98140 00000',
    acres: parseFloat(r.acres),
    strawTonnes: Number((parseFloat(r.acres) * 2.0).toFixed(1)),
    harvestDate: r.harvestDate,
    moisturePercent: 14.5,
    referralCode: `SARPANCH-${cluster.name.replace(/\s+/g, '').toUpperCase()}`,
    referredBy: null,
    status: thresholdReached ? 'DISPATCHED' : 'POOLED'
  }));

  cluster.enrolledFarmers.unshift(...addedFarmers);
  cluster.pooledAcres = newPooledAcres;
  cluster.strawTonnes = Number((cluster.pooledAcres * 2.0).toFixed(1));

  let assignedBalerId = cluster.assignedBalerId;
  if (thresholdReached) {
    cluster.status = 'DISPATCHED';
    if (!assignedBalerId) {
      const idleBaler = clientState.balers.find(b => b.status === 'IDLE');
      if (idleBaler) {
        idleBaler.status = 'DISPATCHED';
        idleBaler.assignedClusterId = cluster.id;
        assignedBalerId = idleBaler.id;
      } else {
        assignedBalerId = 'BALER-PB-03';
      }
    }
    cluster.assignedBalerId = assignedBalerId;
  }

  // Update persistent impact strip safely
  if (!clientState.impact) {
    clientState.impact = { tonnesDiverted: 0, co2TonnesAvoided: 0, pm25KgPrevented: 0, farmerSavingsInr: 0, ruralCashPaidInr: 0, platformProfitInr: 0 };
  }
  const allAcres = clientState.clusters.reduce((sum, c) => sum + c.pooledAcres, 0);
  clientState.impact.tonnesDiverted = Number((allAcres * 2.0).toFixed(1));
  clientState.impact.co2TonnesAvoided = Number((clientState.impact.tonnesDiverted * 1.46).toFixed(1));
  clientState.impact.pm25KgPrevented = Number((clientState.impact.tonnesDiverted * 3.0).toFixed(1));
  clientState.impact.farmerSavingsInr = Math.round(allAcres * 4000);
  clientState.impact.ruralCashPaidInr = Math.round(allAcres * 300);
  clientState.impact.platformProfitInr = Math.round(allAcres * 800);

  saveClientState();
  populateVillageDropdown();
  renderAllViews();
  if (leafletMap) updateLeafletMarkers();

  // Supabase Live Batch Sync
  const sb = getSupabaseClient();
  if (sb) {
    try {
      console.log('[Supabase] Inserting batch bookings into "bookings" (auto-generated id; ONLY specified columns)...');
      const insertRows = addedFarmers.map(f => ({
        village_id: cluster.id,
        cluster_id: cluster.id,
        village_name: cluster.name,
        farmer_name: f.farmerName,
        phone: f.phone,
        acres: f.acres,
        harvest_date: f.harvestDate,
        booking_mode: 'captain',
        referral_code: f.referralCode || null,
        referred_by: null,
        moisture_percent: f.moisturePercent ?? 14.5,
        status: f.status || 'POOLED'
      }));
      await sb.from('bookings').insert(insertRows);

      console.log('[Supabase] Updating "village_clusters"...');
      const balerId = assignedBalerId || cluster.assignedBalerId || (newPooledAcres >= 20 ? 'BALER-PB-03' : null);
      const clusterUpdateData = {
        acres: newPooledAcres,
        pooled_acres: newPooledAcres,
        baler: balerId,
        assigned_baler_id: balerId,
        status: newPooledAcres >= 20 ? 'Dispatched' : cluster.status
      };
      await sb.from('village_clusters').update(clusterUpdateData).eq('id', cluster.id);

      if (thresholdReached && assignedBalerId) {
        console.log('[Supabase] Updating assigned baler status to "Dispatched" in "leased_balers"...');
        await sb.from('leased_balers').update({
          status: 'Dispatched',
          assigned_cluster_id: cluster.id
        }).eq('id', assignedBalerId);
      }
    } catch (sbEx) {
      console.warn('[Supabase] handleSarpanchBatchSubmit exception:', sbEx);
    }
  }

  // Send to backend API
  try {
    fetch('/api/captain/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        village: cluster.name,
        district: cluster.district,
        captainName: 'Jaswant Singh (Sarpanch)',
        referralCode: `SARPANCH-${cluster.name.replace(/\s+/g, '').toUpperCase()}`,
        farmers: validRows
      })
    }).catch(err => console.warn('Backend sync notice:', err));
  } catch (err) {}

  openSarpanchBatchModal(cluster, addedFarmers.length, batchAcres, thresholdReached);
}

function openSarpanchBatchModal(cluster, count, acres, thresholdReached) {
  const modal = document.getElementById('sarpanchBatchModal');
  if (!modal) return;

  document.getElementById('sarpanchModalVillage').textContent = `${cluster.name} (${cluster.district})`;
  document.getElementById('sarpanchModalCount').textContent = `${count} Landholders`;
  document.getElementById('sarpanchModalAcres').textContent = `${acres.toFixed(1)} Acres (~${(acres * 2.0).toFixed(1)} Tonnes)`;
  document.getElementById('sarpanchModalReward').textContent = `+₹${Math.round(acres * 120).toLocaleString()} (+₹120/ac)`;
  document.getElementById('sarpanchModalSavings').textContent = `₹${Math.round(acres * 4000).toLocaleString()}`;

  const alertBox = document.getElementById('sarpanchThresholdAlert');
  if (alertBox) {
    if (thresholdReached) {
      alertBox.classList.remove('hidden');
      document.getElementById('sarpanchBalerAssignedName').textContent = cluster.assignedBalerId || 'BALER-PB-03';
    } else {
      alertBox.classList.add('hidden');
    }
  }

  // Pre-compose WhatsApp announcement
  const waMsg = `🌾 *ਗ੍ਰਾਮ ਪੰਚਾਇਤ ${cluster.name} - ਪਰਾਲੀਸੇਤੂ ਬੈਚ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਪੁਸ਼ਟੀ*\n` +
    `ਪੰਚਾਇਤ ਵੱਲੋਂ ${count} ਕਿਸਾਨਾਂ ਦਾ ਕੁੱਲ ${acres.toFixed(1)} ਏਕੜ ਰਕਬਾ ਸਫ਼ਲਤਾਪੂਰਵਕ ਦਰਜ ਕਰ ਲਿਆ ਗਿਆ ਹੈ।\n` +
    (thresholdReached ? `20-ਏਕੜ ਟੀਚਾ ਪੂਰਾ! ਬੇਲਰ ਮਸ਼ੀਨ (${cluster.assignedBalerId || 'BALER-PB-03'}) ₹0 ਫੀਸ 'ਤੇ ਰਵਾਨਾ ਹੋ ਚੁੱਕੀ ਹੈ।\n` : `ਪਿੰਡ ਦਾ ਕੁੱਲ ਰਕਬਾ: ${cluster.pooledAcres}/20 ਏਕੜ।\n`) +
    `ਕਿਸਾਨ ਬਚਤ: ₹${Math.round(acres * 4000).toLocaleString()} | ਪੰਚਾਇਤ ਫੰਡ: +₹${Math.round(acres * 120).toLocaleString()}\n` +
    `ਹੋਰ ਕਿਸਾਨ ਵੀ ਆਪਣਾ ਖੇਤ ਮੁਫ਼ਤ ਸਾਫ਼ ਕਰਵਾਉਣ ਲਈ ਸਰਪੰਚ ਕੋਡ *SARPANCH-${cluster.name.replace(/\s+/g, '').toUpperCase()}* ਨਾਲ ਰਜਿਸਟਰ ਕਰਨ: ${window.location.origin}`;

  const preview = document.getElementById('sarpanchWaPreviewText');
  if (preview) preview.textContent = waMsg;

  const btnShare = document.getElementById('sarpanchWaShareBtn');
  if (btnShare) {
    btnShare.onclick = () => {
      window.open(`https://wa.me/?text=${encodeURIComponent(waMsg)}`, '_blank');
    };
  }

  modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

function closeSarpanchBatchModal() {
  document.getElementById('sarpanchBatchModal')?.classList.add('hidden');
}

// -------------------------------------------------------------
// Individual Landholder Submission Handler
// -------------------------------------------------------------
async function handleIndividualSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();

  const villageId = document.getElementById('indivVillageSelect').value;
  const farmerName = document.getElementById('indivFarmerName').value.trim();
  const phone = document.getElementById('indivPhone').value.trim();
  const acres = parseFloat(document.getElementById('indivAcres').value) || 5.0;
  const harvestDate = document.getElementById('indivHarvestDate').value;
  const referredBy = document.getElementById('indivReferredBy').value.trim();

  // Call the core submitBooking function which inserts to bookings and updates village_clusters & leased_balers
  const res = await submitBooking({
    clusterId: villageId,
    villageId,
    farmerName,
    phone,
    acres,
    harvestDate,
    booking_mode: 'individual',
    referredBy: referredBy || null
  });

  // Show Confirmation Modal
  openBookingConfirmationModal(res.booking, res.cluster, res.thresholdReached);
}

function openBookingConfirmationModal(booking, cluster, thresholdReached) {
  const modal = document.getElementById('bookingConfirmModal');
  if (!modal) return;

  document.getElementById('modalFarmerName').textContent = booking.farmerName;
  document.getElementById('modalAcres').textContent = `${booking.acres} Acres (~${booking.strawTonnes} Tonnes)`;
  document.getElementById('modalVillage').textContent = `${cluster.name} (${cluster.district})`;
  document.getElementById('modalRefCode').textContent = booking.referralCode;

  const thresholdAlert = document.getElementById('modalThresholdAlert');
  if (thresholdAlert) {
    if (thresholdReached) {
      thresholdAlert.classList.remove('hidden');
      document.getElementById('modalBalerAssignedName').textContent = cluster.assignedBalerId || 'BALER-PB-03';
    } else {
      thresholdAlert.classList.add('hidden');
    }
  }

  // 1-Tap WhatsApp Preview Message in Punjabi & English
  const waMsg = `🌾 *ParaliSetu Stubble Aggregation Notification*\nਖੇਤ ਸਫ਼ਾਈ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਪੁਸ਼ਟੀ ਹੋ ਗਈ ਹੈ। ਬੇਲਰ ਮਸ਼ੀਨ ₹0 ਫੀਸ 'ਤੇ ਪਰਾਲੀ ਚੁੱਕੇਗੀ ਅਤੇ ₹180/ਏਕੜ ਕੈਸ਼ਬੈਕ ਮਿਲੇਗਾ।\nਰੈਫਰਲ ਕੋਡ: *${booking.referralCode}*\nਪੋਰਟਲ ਲਿੰਕ: ${window.location.origin}`;

  const waPreview = document.getElementById('modalWaPreviewText');
  if (waPreview) waPreview.textContent = waMsg;

  const waBtn = document.getElementById('modalWaShareBtn');
  if (waBtn) {
    waBtn.onclick = () => {
      window.open(`https://wa.me/?text=${encodeURIComponent(waMsg)}`, '_blank');
    };
  }

  modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

function closeBookingConfirmationModal() {
  document.getElementById('bookingConfirmModal')?.classList.add('hidden');
}

// -------------------------------------------------------------
// Tab 3: Industrial B2B Buyer Portal
// -------------------------------------------------------------
function renderB2BLots() {
  const container = document.getElementById('b2bLotsContainer');
  if (!container) return;

  container.innerHTML = clientState.lots.map(lot => {
    const rawSt = (lot.status || '').toString().toLowerCase();
    const isSold = rawSt === 'sold' || rawSt === 'settled';

    return `
      <div class="card-panel p-4 space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <div class="font-semibold text-slate-900 text-sm">${lot.village}</div>
            <div class="text-xs text-slate-500 font-mono-code">Lot ID: #${lot.id} • ${lot.hubName}</div>
          </div>
          <span class="px-2.5 py-0.5 rounded text-xs font-semibold ${isSold ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}">
            ${isSold ? 'SETTLED & SOLD' : 'AVAILABLE LOT'}
          </span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded border border-slate-200 text-xs text-slate-600">
          <div>
            <div class="text-slate-400 text-[11px]">Tonnage:</div>
            <div class="text-slate-900 font-semibold text-sm tabular-nums">${lot.tonnes} Tonnes</div>
          </div>
          <div>
            <div class="text-slate-400 text-[11px]">Moisture:</div>
            <div class="text-emerald-700 font-semibold tabular-nums">${lot.moisture}% (Safe)</div>
          </div>
          <div>
            <div class="text-slate-400 text-[11px]">Contract Rate:</div>
            <div class="text-slate-900 font-semibold tabular-nums">₹1,800 / t</div>
          </div>
          <div>
            <div class="text-slate-400 text-[11px]">Delivery Verification:</div>
            <div class="text-slate-700 font-semibold">${lot.buyerDistance}</div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-slate-100">
          <div>
            <div class="text-[11px] text-slate-400">Total Lot Valuation</div>
            <div class="text-base font-bold text-slate-900 tabular-nums">₹${lot.value.toLocaleString()}</div>
          </div>

          <div>
            ${isSold ? `
              <span class="text-xs text-slate-500 font-medium">Settled & Sold (Verbio Bio-CNG)</span>
            ` : `
              <button onclick="reserveLot('${lot.id}')" class="btn-primary text-xs py-2 px-3">
                Reserve & Settle Bulk Lot
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// =============================================================
// Requirement 3: Reserve Lot & Supabase Status Update
// =============================================================
async function reserveLot(lotId) {
  const lot = clientState.lots.find(l => l.id === lotId);
  if (!lot) return;

  // Update in-memory lot status to 'Sold'
  lot.status = 'Sold';
  saveClientState();
  renderAllViews();

  // Supabase Database Update: update that lot's status to Sold in bulk_lots
  const sb = getSupabaseClient();
  if (sb) {
    try {
      console.log(`[Supabase] Updating lot ${lotId} status to "Sold" in "bulk_lots"...`);
      const { error: lotErr } = await sb
        .from('bulk_lots')
        .update({ status: 'Sold' })
        .eq('id', lotId);
      if (lotErr) console.warn('[Supabase] bulk_lots update note:', lotErr.message);
    } catch (sbEx) {
      console.warn('[Supabase] reserveLot exception:', sbEx);
    }
  }

  const acres = lot.acres;
  const gross = lot.value;
  const baler = acres * 1400;
  const log = acres * 1100;
  const farmer = acres * 180;
  const coord = acres * 120;
  const profit = gross - (baler + log + farmer + coord);

  alert(`Bulk Straw Lot #${lot.id} successfully reserved & settled by Verbio India Bio-CNG Plant.\n\nStatus: Sold\nGross Contract Value: ₹${gross.toLocaleString()}\n- Leased Baler Machine Cost: -₹${baler.toLocaleString()}\n- Logistics & Hub Freight: -₹${log.toLocaleString()}\n+ Landholder 5% Revenue Share: +₹${farmer.toLocaleString()}\n+ Coordinator Referral Pool: +₹${coord.toLocaleString()}\n= Platform Operating Profit: +₹${profit.toLocaleString()} (22.2% Margin)`);
}
window.reserveLot = reserveLot;

// -------------------------------------------------------------
// Tab 4: Unit Economics & Lease Simulator
// -------------------------------------------------------------
function setLeaseDuration(type) {
  currentLeaseType = type;

  const btnSeasonal = document.getElementById('btnLeaseSeasonal');
  const btnPeak = document.getElementById('btnLeasePeak');

  if (type === '45_DAY_SEASONAL') {
    if (btnSeasonal) btnSeasonal.className = 'px-3.5 py-1.5 rounded-md bg-[#143628] text-white font-medium text-xs shadow-sm transition';
    if (btnPeak) btnPeak.className = 'px-3.5 py-1.5 rounded-md text-slate-600 hover:text-slate-900 font-medium text-xs transition';
    document.getElementById('econTableBalerRate').textContent = '-₹1,400';
    document.getElementById('econTableBalerPerTonne').textContent = '-₹700 / t';
    document.getElementById('econTableProfitRate').textContent = '+₹800 (22.2%)';
    document.getElementById('econTableProfitPerTonne').textContent = '+₹400 / t';
  } else {
    if (btnSeasonal) btnSeasonal.className = 'px-3.5 py-1.5 rounded-md text-slate-600 hover:text-slate-900 font-medium text-xs transition';
    if (btnPeak) btnPeak.className = 'px-3.5 py-1.5 rounded-md bg-[#143628] text-white font-medium text-xs shadow-sm transition';
    document.getElementById('econTableBalerRate').textContent = '-₹1,436';
    document.getElementById('econTableBalerPerTonne').textContent = '-₹718 / t';
    document.getElementById('econTableProfitRate').textContent = '+₹764 (21.2%)';
    document.getElementById('econTableProfitPerTonne').textContent = '+₹382 / t';
  }

  updateFleetSimulator();
  updateImpactStrip();
}

function updateFleetSimulator() {
  const slider = document.getElementById('fleetBalerSlider');
  const count = parseInt(slider?.value || '10');

  document.getElementById('fleetBalerCountVal').textContent = `${count} Balers`;

  const acresPerBaler = currentLeaseType === '45_DAY_SEASONAL' ? 700 : 240;
  const totalAcres = count * acresPerBaler;
  const totalTonnes = totalAcres * 2.0;
  const co2Tonnes = totalTonnes * 1.46;
  const pm25Tonnes = (totalTonnes * 3.0) / 1000;
  const farmerSavingsCr = (totalAcres * 4000) / 10000000;
  const ruralCashCr = (totalAcres * (180 + 120)) / 10000000;
  const profitPerAcre = currentLeaseType === '45_DAY_SEASONAL' ? 800 : 764;
  const profitCr = (totalAcres * profitPerAcre) / 10000000;

  document.getElementById('simAcres').textContent = `${totalAcres.toLocaleString()} Acres`;
  document.getElementById('simTonnes').textContent = `${totalTonnes.toLocaleString()} Tonnes`;
  document.getElementById('simCo2').textContent = `${Math.round(co2Tonnes).toLocaleString()} t`;
  document.getElementById('simPm25').textContent = `${pm25Tonnes.toFixed(1)} t`;
  document.getElementById('simSavings').textContent = `₹${farmerSavingsCr.toFixed(2)} Cr`;
  document.getElementById('simRuralCash').textContent = `₹${ruralCashCr.toFixed(2)} Cr`;
  document.getElementById('simProfit').textContent = `₹${profitCr.toFixed(2)} Cr`;
}

// -------------------------------------------------------------
// Master Render
// -------------------------------------------------------------
function renderAllViews() {
  updateImpactStrip();
  renderClusterRadarList();
  renderB2BLots();
  updateFleetSimulator();
  updateBatchSummary();
  updateFarmerValueSwing(document.getElementById('indivAcres')?.value || 5);
}
