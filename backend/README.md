# ParaliSetu Backend 🌾

Production-grade Express backend for **ParaliSetu** — a stubble-burning prevention, cluster baling aggregation, and B2B biomass marketplace platform for Punjab & Haryana.

## Architecture

- **Runtime**: Node.js + Express + CORS
- **Storage**: Persistent local JSON store (`backend/data/db.json`) with zero external database dependencies
- **Logistics Engine**: Geo-fencing & Haversine formula (`backend/services/economics.js`)

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check & uptime |
| `GET` | `/api/hotspots` | 26+ NASA FIRMS VIIRS fire hotspots (supports `?district=`) |
| `GET` | `/api/clusters` | 6 village clusters with nested farmer bookings |
| `GET` | `/api/fleet` | Balers (seasonal/peak), storage hubs, and industrial buyers |
| `POST` | `/api/bookings` | Create bookings, generate referral codes, auto-trigger baler dispatch at $\ge 20$ acres |
| `GET` | `/api/lots` | Verified bulk lots with moisture $\%$ and distance to buyers |
| `POST` | `/api/lots/:id/reserve` | Reserve lot and execute 3-way payout settlement |
| `GET` | `/api/impact` | Real-time ecological metrics and 700-acre seasonal simulation |
| `POST` | `/api/reset` | Restore initial demo state cleanly |

## Quick Start

```bash
cd backend
npm install
npm start
```
