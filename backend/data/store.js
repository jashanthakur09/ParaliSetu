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
  ]
};

module.exports = { SEED };
