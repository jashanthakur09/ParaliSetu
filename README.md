# 🌾 ParaliSetu [ਪਰਾਲੀਸੇਤੂ 1.0]
### Satellite-Guided Stubble Aggregation & Automated Rural Dispatch Engine
> **Track:** AgriTech / ClimateTech / Logistics  
> **Team:** InfiniteLoop — Jashan Thakur, Prakul Thakur, Sikand Arora, Ruchir Sharma, Tanish Kinger  
> **Event:** THE BUILDER'S THEORY 1.0

---

## 🚀 Overview

**ParaliSetu** replaces unenforceable stubble-burning bans with a self-sustaining logistics and dispatch engine. It connects real-time satellite fire intelligence directly to rural village aggregation and industrial biomass/Bio-CNG off-takers.

### Core Problems Solved:
1. **The Cost Trap:** Smallholder farmers have only a 15-day window before wheat sowing, and ploughing stubble back in costs ₹3,500–₹5,000/acre in tractor diesel and machinery wear. Burning is the cheap default option.
2. **The Machine Gap:** Small farmers (averaging 2 acres) cannot afford balers, and large biomass/Bio-CNG plants refuse scattered, unverified straw from hundreds of individual 2-acre sellers.
3. **The Adoption Gap:** Farmers refuse standalone complex apps. ParaliSetu enables **zero-app onboarding** where trusted Village Captains log neighbouring farms in 60 seconds with viral referral incentives.

---

## ⚡ The 4-Stage Engine

1. **Detect (NASA FIRMS VIIRS):**
   - Ingests thermal anomaly coordinates from NASA's Suomi-NPP / NOAA-20 VIIRS 375m sensor.
   - Computes Fire Radiative Power (FRP) and thermal brightness to rank high-risk villages before burning spreads.
2. **Aggregate (The 20-Acre Rule):**
   - Village Captains and peer referrals pool neighbouring farms until contiguous acreage reaches **20 acres** (1 full baler machine-day ~ 40 tonnes).
   - Peer referrals earn ₹120/acre.
3. **Dispatch & Store (Haversine Geofencing):**
   - Enforces a **3-day moisture drying buffer** (moisture < 20%) to prevent baler jamming or decomposition.
   - Automatically dispatches a seasonally leased baler at **₹0 cost to the farmer**.
   - Strict Haversine geofences: Farm → Storage Hub ≤ 15 km; Hub → Bio-CNG / Biomass Plant ≤ 50 km.
4. **Bulk B2B Sale & 3-Way Auto-Settlement:**
   - Biomass / Bio-CNG plants reserve bulk verified lots at standardized ₹1,800/tonne rates.
   - Instant 3-way automated settlement ledger:
     - Factory Revenue (+₹3,600 / acre @ 2t)
     - Leased Baler (-₹1,400 / acre)
     - Logistics & Hub Storage (-₹1,100 / acre)
     - Farmer 5% Revenue Share (+₹180 / acre + ₹0 clearing!)
     - Captain / Referral Pool (+₹120 / acre)
     - **Platform Net Profit (+₹800 / acre, ₹400/tonne, 22% net margin)**

---

## 🛰️ NASA FIRMS API Key Integration

ParaliSetu supports both **Live NASA EOSDIS FIRMS API keys** and an **Authentic Offline High-Resolution Punjab VIIRS Dataset**:

1. **Get a Free NASA FIRMS Key:**
   - Register free at [https://firms.modaps.eosdis.nasa.gov/api/map_key/](https://firms.modaps.eosdis.nasa.gov/api/map_key/).
   - NASA will email your 32-character hexadecimal `MAP_KEY`.
2. **How to Connect in ParaliSetu:**
   - Go to the **"NASA FIRMS API Key"** tab in the top navigation bar.
   - Paste your key and click **"Save & Query NASA Live Feed"**.
   - The engine queries:
     `https://firms.modaps.eosdis.nasa.gov/api/area/csv/{MAP_KEY}/VIIRS_SNPP_NRT/73.8,29.5,77.2,32.5/1`
   - Real-time hotspots are parsed, geo-ranked, and rendered on the radar map.
3. **Offline / Out-of-the-Box Mode:**
   - If you do not have a key, ParaliSetu automatically uses the verified satellite dataset with real VIIRS detections across Sangrur, Patiala, Mansa, and Ludhiana.

---

## 🛠️ Project Structure

```
paralisetu/
├── package.json               # Project manifest
├── README.md                  # Complete documentation
├── test_backend.js            # Automated verification test script
├── server/
│   ├── index.js               # Standalone native Node.js HTTP server & REST APIs
│   ├── services/
│   │   ├── firmsService.js    # NASA FIRMS VIIRS caller, CSV parser, and caching
│   │   ├── geoEngine.js       # Haversine distance, 15km/50km geofencing, risk scoring
│   │   └── dataStore.js       # 20-acre aggregation, baler fleet, drying checks, 3-way ledger
│   └── data/
│       ├── punjab_hotspots.json # Verified VIIRS active fire anomalies
│       └── hubs_buyers.json     # Storage hubs & Bio-CNG / Biomass plants
└── public/
    ├── index.html             # High-tech HUD single-page application
    ├── app.js                 # Leaflet map, API communications, quick logs & dispatch
    ├── styles.css             # ClimateTech dark theme, radar sweep & pulse markers
    └── locales.js             # Trilingual dictionary (English, Punjabi, Hindi)
```

---

## 🏃 Quick Start (How to Run)

1. Open a terminal / command prompt in this directory:
   ```bash
   cd "C:\Users\JASHAN THAKUR\.gemini\antigravity\scratch\paralisetu"
   ```

2. Start the ParaliSetu server:
   ```bash
   node server/index.js
   ```
   *(Or `npm start`)*

3. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

4. Run the test suite:
   ```bash
   node test_backend.js
   ```

---

## 🌍 Climate & Economic Impact (Per 100 Leased Balers)
- **70,000 Acres** cleared & **140,000 Tonnes** of stubble diverted per season
- **~204,400 Tonnes CO₂ Avoided** (~1,460 kg CO₂ / tonne open-burn baseline)
- **~420 Tonnes PM2.5 Prevented** protecting North Indian air quality
- **~₹28 Crore Saved by Farmers** in field-clearing expenses
- **~₹2.1 Crore Paid to Villagers** in referral and captain payouts + revenue share
