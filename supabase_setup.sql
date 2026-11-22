-- ==============================================================================
-- ParaliSetu: Supabase SQL Setup & Permissions Script
-- Execute this script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- Project: gmxclrkoistbsgenqxxt
-- ==============================================================================

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS public.village_clusters (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    district TEXT NOT NULL,
    lat NUMERIC NOT NULL,
    lng NUMERIC NOT NULL,
    target_acres NUMERIC DEFAULT 20.0,
    acres NUMERIC DEFAULT 0.0,
    pooled_acres NUMERIC DEFAULT 0.0,
    straw_tonnes NUMERIC DEFAULT 0.0,
    status TEXT DEFAULT 'GATHERING', -- 'GATHERING' or 'Dispatched'
    nearest_hub_name TEXT,
    hub_distance_km NUMERIC DEFAULT 3.2,
    baler TEXT,                      -- Assigned baler identifier
    assigned_baler_id TEXT,
    earliest_pickup_date TEXT,
    is_moisture_safe BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cluster_id TEXT REFERENCES public.village_clusters(id) ON DELETE CASCADE,
    village_id TEXT,
    village_name TEXT,
    farmer_name TEXT NOT NULL,
    phone TEXT,
    acres NUMERIC NOT NULL,
    straw_tonnes NUMERIC,
    harvest_date TEXT,
    booking_mode TEXT DEFAULT 'individual',
    moisture_percent NUMERIC DEFAULT 14.5,
    referral_code TEXT,
    referred_by TEXT,
    status TEXT DEFAULT 'POOLED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.leased_balers (
    id TEXT PRIMARY KEY,
    model TEXT NOT NULL,
    operator TEXT,
    phone TEXT,
    status TEXT DEFAULT 'IDLE',      -- 'IDLE' or 'Dispatched'
    assigned_cluster_id TEXT,
    lat NUMERIC,
    lng NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.storage_hubs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    lat NUMERIC NOT NULL,
    lng NUMERIC NOT NULL,
    capacity_tonnes NUMERIC DEFAULT 15000,
    current_stock_tonnes NUMERIC DEFAULT 4800,
    max_radius_km NUMERIC DEFAULT 15,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.industrial_buyers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    lat NUMERIC NOT NULL,
    lng NUMERIC NOT NULL,
    daily_demand NUMERIC DEFAULT 300,
    rate_per_tonne NUMERIC DEFAULT 1800,
    max_radius_km NUMERIC DEFAULT 50,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bulk_lots (
    id TEXT PRIMARY KEY,
    hub_name TEXT NOT NULL,
    village TEXT NOT NULL,
    tonnes NUMERIC NOT NULL,
    acres NUMERIC NOT NULL,
    moisture NUMERIC DEFAULT 14.0,
    value NUMERIC NOT NULL,
    buyer_distance TEXT,
    status TEXT DEFAULT 'AVAILABLE', -- 'AVAILABLE' or 'Sold'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.app_settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Grant Full Permissions to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- Disable RLS or allow full public access
ALTER TABLE public.village_clusters DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.leased_balers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.storage_hubs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.industrial_buyers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_lots DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings DISABLE ROW LEVEL SECURITY;

-- 3. Pre-seed Default Data (Run if empty)
INSERT INTO public.village_clusters (id, name, district, lat, lng, target_acres, pooled_acres, straw_tonnes, status, nearest_hub_name, hub_distance_km, baler, earliest_pickup_date, is_moisture_safe)
VALUES
('VIL-KHERI', 'Kheri', 'Sangrur', 30.2458, 75.8421, 20.0, 16.0, 32.0, 'GATHERING', 'Sangrur Central Depot', 3.2, NULL, '2026-11-23', TRUE),
('VIL-BHAWANIGARH', 'Bhawanigarh', 'Sangrur', 30.2582, 75.8614, 20.0, 24.5, 49.0, 'Dispatched', 'Sangrur Central Depot', 1.8, 'BALER-PB-01', '2026-11-23', TRUE),
('VIL-NABHA', 'Nabha', 'Patiala', 30.3752, 76.1524, 20.0, 21.0, 42.0, 'Dispatched', 'Nabha Agro Logistics Depot', 1.4, 'BALER-PB-02', '2026-11-23', TRUE),
('VIL-SUNAM', 'Sunam', 'Sangrur', 30.1294, 75.8012, 20.0, 8.5, 17.0, 'GATHERING', 'Sangrur Central Depot', 14.8, NULL, '2026-11-24', TRUE),
('VIL-PATTI', 'Patti', 'Tarn Taran', 31.2821, 74.8541, 20.0, 11.0, 22.0, 'GATHERING', 'Nabha Agro Logistics Depot', 12.4, NULL, '2026-11-24', TRUE),
('VIL-RAMPURA', 'Rampura Phul', 'Bathinda', 30.2741, 75.2412, 20.0, 6.5, 13.0, 'GATHERING', 'Malwa Green Southern Depot', 2.1, NULL, '2026-11-25', FALSE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.leased_balers (id, model, operator, phone, status, assigned_cluster_id, lat, lng)
VALUES
('BALER-PB-01', 'Claas Markant 65', 'Satnam Singh', '+91 94172 11001', 'Dispatched', 'VIL-BHAWANIGARH', 30.2582, 75.8614),
('BALER-PB-02', 'New Holland BC5070', 'Kulwinder Singh', '+91 94172 11002', 'Dispatched', 'VIL-NABHA', 30.3752, 76.1524),
('BALER-PB-03', 'John Deere 348', 'Amanpreet Singh', '+91 94172 11003', 'IDLE', NULL, 30.2520, 75.8750),
('BALER-PB-04', 'Sonalika Prime HD', 'Manjit Singh', '+91 94172 11004', 'IDLE', NULL, 30.2600, 75.2500)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.storage_hubs (id, name, lat, lng, capacity_tonnes, current_stock_tonnes, max_radius_km)
VALUES
('HUB-SANGRUR', 'Sangrur Central Depot', 30.2520, 75.8750, 15000, 4800, 15),
('HUB-PATIALA', 'Nabha Agro Logistics Depot', 30.3680, 76.1420, 12000, 3900, 15),
('HUB-BATHINDA', 'Malwa Green Southern Depot', 30.2600, 75.2500, 14000, 2600, 15)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.industrial_buyers (id, name, type, lat, lng, daily_demand, rate_per_tonne, max_radius_km)
VALUES
('BUYER-VERBIO', 'Verbio India Bio-CNG Plant', 'Bio-CNG', 29.9320, 75.8210, 300, 1800, 50),
('BUYER-SAEL', 'SAEL Biomass Power Plant', 'Biomass Power', 30.0820, 75.7640, 450, 1800, 50),
('BUYER-MALWA', 'Malwa Eco-Briquettes', 'Eco-Briquette', 30.3420, 75.5210, 180, 1800, 50)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.bulk_lots (id, hub_name, village, tonnes, acres, moisture, value, buyer_distance, status)
VALUES
('LOT-SAN-01', 'Sangrur Central Depot', 'Bhawanigarh (Cluster 01)', 80.0, 40.0, 14.2, 144000, '34 km (≤50km PASS)', 'AVAILABLE'),
('LOT-PAT-02', 'Nabha Agro Depot', 'Nabha (Cluster 02)', 42.0, 21.0, 13.6, 75600, '41 km (≤50km PASS)', 'AVAILABLE'),
('LOT-BAT-03', 'Malwa Green Depot', 'Rampura Phul (Pre-Allocated)', 65.0, 32.5, 15.0, 117000, '28 km (≤50km PASS)', 'AVAILABLE')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.app_settings (key, value, description)
VALUES
('nasa_firms_map_key', '', 'Optional NASA FIRMS API Map Key for real-time VIIRS fire detections')
ON CONFLICT (key) DO NOTHING;
