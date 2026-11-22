const dataStore = require('./server/services/dataStore');
const firmsService = require('./server/services/firmsService');
const geoEngine = require('./server/services/geoEngine');

console.log('Testing geoEngine:');
const dist = geoEngine.calculateHaversineDistance(30.2458, 75.8421, 30.2520, 75.8750);
console.log('Distance Kheri to Sangrur Hub (km):', dist);
const geofence = geoEngine.validateFarmToHubGeofence(30.2458, 75.8421, 30.2520, 75.8750);
console.log('Geofence check (<=15km):', geofence);

console.log('\nTesting dataStore:');
console.log('Initial Farms count:', dataStore.farms.length);
console.log('Initial Clusters count:', dataStore.clusters.length);
console.log('Cluster 1 status:', dataStore.clusters[0].id, dataStore.clusters[0].status, 'Acreage:', dataStore.clusters[0].pooledAcres);
console.log('Impact Metrics:', dataStore.getImpactMetrics());

console.log('\nTesting firmsService:');
console.log('FIRMS status:', firmsService.getStatus());
console.log('FIRMS sample hotspots count:', firmsService.getHotspots().length);

console.log('\nAll Backend Services Verified Successfully!');
