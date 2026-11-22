// DataStore: In-Memory + Persistent Store for Farms, Clusters, Baler Fleet, Settlements & Impact
const fs = require('fs');
const path = require('path');
const {
  calculateHaversineDistance,
  validateFarmToHubGeofence,
  validateHubToBuyerGeofence,
  findNearestHub,
  findNearestBuyer
} = require('./geoEngine');

const HUBS_BUYERS_PATH = path.join(__dirname, '../data/hubs_buyers.json');

class DataStore {
  constructor() {
    this.hubs = [];
    this.buyers = [];
    this.farms = [];
    this.clusters = [];
    this.balerFleet = [];
    this.settlements = [];
    this.b2bOrders = [];
    this.init();
  }

  init() {
    // Load hubs and buyers
    try {
      if (fs.existsSync(HUBS_BUYERS_PATH)) {
        const raw = JSON.parse(fs.readFileSync(HUBS_BUYERS_PATH, 'utf-8'));
        this.hubs = raw.hubs || [];
        this.buyers = raw.buyers || [];
      }
    } catch (err) {
      console.error('Error loading hubs/buyers:', err);
    }

    // Seed Baler Fleet (Seasonally Leased Fleet)
    this.balerFleet = [
      {
        id: 'BALER-PB-01',
        model: 'Claas Markant 65 Heavy Baler',
        operator: 'Satnam Singh',
        phone: '+91 94172 11001',
        status: 'IDLE',
        currentLocation: { lat: 30.2500, lon: 75.8700, village: 'Bhawanigarh Base' },
        assignedClusterId: null,
        acresCompletedToday: 0,
        capacityAcresPerDay: 20
      },
      {
        id: 'BALER-PB-02',
        model: 'New Holland BC5070 Square Baler',
        operator: 'Jagjit Singh',
        phone: '+91 94172 11002',
        status: 'IDLE',
        currentLocation: { lat: 30.3700, lon: 76.1400, village: 'Nabha Base' },
        assignedClusterId: null,
        acresCompletedToday: 0,
        capacityAcresPerDay: 20
      },
      {
        id: 'BALER-PB-03',
        model: 'John Deere 348 Compact Baler',
        operator: 'Kulwinder Singh',
        phone: '+91 94172 11003',
        status: 'IDLE',
        currentLocation: { lat: 30.0000, lon: 75.4100, village: 'Budhlada Base' },
        assignedClusterId: null,
        acresCompletedToday: 0,
        capacityAcresPerDay: 20
      },
      {
        id: 'BALER-PB-04',
        model: 'Sonalika Baler Prime HD',
        operator: 'Amanpreet Singh',
        phone: '+91 94172 11004',
        status: 'IDLE',
        currentLocation: { lat: 30.7900, lon: 75.4800, village: 'Jagraon Hub' },
        assignedClusterId: null,
        acresCompletedToday: 0,
        capacityAcresPerDay: 20
      }
    ];

    // Seed initial clusters & farms to show real functionality out of the box
    this.seedInitialFarmsAndClusters();
  }

  seedInitialFarmsAndClusters() {
    // Seed pre-loaded village farms
    const initialBatches = [
      {
        captainName: 'Jaswant Singh (Sarpanch)',
        captainPhone: '+91 98721 34567',
        farmerName: 'Balwinder Singh',
        farmerPhone: '+91 98140 22334',
        village: 'Kheri',
        district: 'Sangrur',
        acres: 4.5,
        harvestDate: '2026-11-18', // > 3 days ago
        moisturePercent: 14.2,
        referralCode: 'KHERI-401',
        referredBy: 'KHERI-400',
        lat: 30.2458,
        lon: 75.8421
      },
      {
        captainName: 'Jaswant Singh (Sarpanch)',
        captainPhone: '+91 98721 34567',
        farmerName: 'Harpreet Kaur',
        farmerPhone: '+91 98140 22335',
        village: 'Kheri',
        district: 'Sangrur',
        acres: 6.0,
        harvestDate: '2026-11-19',
        moisturePercent: 15.1,
        referralCode: 'KHERI-402',
        referredBy: 'KHERI-401',
        lat: 30.2462,
        lon: 75.8435
      },
      {
        captainName: 'Jaswant Singh (Sarpanch)',
        captainPhone: '+91 98721 34567',
        farmerName: 'Gurnam Singh',
        farmerPhone: '+91 98140 22336',
        village: 'Kheri',
        district: 'Sangrur',
        acres: 5.5,
        harvestDate: '2026-11-19',
        moisturePercent: 13.8,
        referralCode: 'KHERI-403',
        referredBy: 'KHERI-401',
        lat: 30.2470,
        lon: 75.8410
      },
      {
        captainName: 'Jaswant Singh (Sarpanch)',
        captainPhone: '+91 98721 34567',
        farmerName: 'Davinder Singh',
        farmerPhone: '+91 98140 22337',
        village: 'Kheri',
        district: 'Sangrur',
        acres: 4.0, // Total = 4.5 + 6 + 5.5 + 4.0 = 20.0 Acres! Full baler unit day!
        harvestDate: '2026-11-18',
        moisturePercent: 12.5,
        referralCode: 'KHERI-404',
        referredBy: 'KHERI-402',
        lat: 30.2481,
        lon: 75.8440
      },
      // Second Village: Bhawanigarh (Partial Cluster 12.5 / 20 acres)
      {
        captainName: 'Manpreet Singh',
        captainPhone: '+91 98721 88990',
        farmerName: 'Sukhdev Singh',
        farmerPhone: '+91 98140 55667',
        village: 'Bhawanigarh',
        district: 'Sangrur',
        acres: 7.5,
        harvestDate: '2026-11-20',
        moisturePercent: 16.4,
        referralCode: 'BHAW-101',
        referredBy: null,
        lat: 30.2582,
        lon: 75.8614
      },
      {
        captainName: 'Manpreet Singh',
        captainPhone: '+91 98721 88990',
        farmerName: 'Avtar Singh',
        farmerPhone: '+91 98140 55668',
        village: 'Bhawanigarh',
        district: 'Sangrur',
        acres: 5.0,
        harvestDate: '2026-11-21', // 1 day ago -> drying buffer active
        moisturePercent: 21.5, // > 20%
        referralCode: 'BHAW-102',
        referredBy: 'BHAW-101',
        lat: 30.2590,
        lon: 75.8625
      }
    ];

    for (const b of initialBatches) {
      this.addFarmerBatch(b);
    }
  }

  /**
   * Village Captain logs a batch
   */
  addFarmerBatch(batch) {
    const id = `FARM-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`.toUpperCase();
    const harvestDate = new Date(batch.harvestDate || Date.now());
    const daysSinceHarvest = Math.floor((Date.now() - harvestDate.getTime()) / (1000 * 60 * 60 * 24));
    const moisture = parseFloat(batch.moisturePercent) || 15.0;

    // Drying buffer check: Needs 3 days drying AND moisture < 20%
    const isMoistureSafe = moisture < 20.0;
    const isDryingDaysMet = daysSinceHarvest >= 3;
    const dryingBufferPassed = isMoistureSafe && isDryingDaysMet;

    const farmEntry = {
      id,
      captainName: batch.captainName || 'Village Captain',
      captainPhone: batch.captainPhone || '',
      farmerName: batch.farmerName,
      farmerPhone: batch.farmerPhone,
      village: batch.village,
      district: batch.district || 'Sangrur',
      acres: parseFloat(batch.acres) || 0,
      estimatedTonnes: Number(((parseFloat(batch.acres) || 0) * 2.0).toFixed(1)),
      harvestDate: batch.harvestDate,
      daysSinceHarvest,
      moisturePercent: moisture,
      dryingBufferPassed,
      referralCode: batch.referralCode || `${batch.village.slice(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      referredBy: batch.referredBy || null,
      lat: parseFloat(batch.lat) || 30.2458,
      lon: parseFloat(batch.lon) || 75.8421,
      registeredAt: new Date().toISOString(),
      status: 'POOLED' // 'POOLED' | 'DISPATCHED' | 'BALED' | 'SETTLED'
    };

    this.farms.push(farmEntry);

    // Aggregate into 20-acre village cluster
    this.aggregateFarmIntoCluster(farmEntry);

    return farmEntry;
  }

  /**
   * Aggregates a farm into a 20-acre cluster
   */
  aggregateFarmIntoCluster(farm) {
    // Look for an existing OPEN cluster in the same village with space
    let cluster = this.clusters.find(
      c => c.village.toLowerCase() === farm.village.toLowerCase() && c.status === 'POOLING'
    );

    if (!cluster) {
      const nearestHub = findNearestHub(farm.lat, farm.lon, this.hubs);
      const nearestBuyer = findNearestBuyer(nearestHub ? nearestHub.latitude : farm.lat, nearestHub ? nearestHub.longitude : farm.lon, this.buyers);

      cluster = {
        id: `CLUSTER-${farm.village.toUpperCase()}-${Date.now().toString(36).slice(-4)}`.toUpperCase(),
        village: farm.village,
        district: farm.district,
        centerLat: farm.lat,
        centerLon: farm.lon,
        targetAcres: 20.0,
        pooledAcres: 0,
        totalTonnes: 0,
        farmIds: [],
        status: 'POOLING', // 'POOLING' | 'READY_FOR_DISPATCH' | 'DISPATCHED' | 'BALING' | 'AT_HUB' | 'SOLD'
        nearestHub: nearestHub ? { id: nearestHub.id, name: nearestHub.name, distanceKm: nearestHub.distanceKm } : null,
        nearestBuyer: nearestBuyer ? { id: nearestBuyer.id, name: nearestBuyer.name, distanceKm: nearestBuyer.distanceKm } : null,
        hubDistanceValid: nearestHub ? nearestHub.distanceKm <= 15.0 : true,
        buyerDistanceValid: nearestBuyer ? nearestBuyer.distanceKm <= 50.0 : true,
        assignedBalerId: null,
        allDryingBuffersPassed: false,
        createdAt: new Date().toISOString()
      };
      this.clusters.push(cluster);
    }

    cluster.farmIds.push(farm.id);
    cluster.pooledAcres = Number((cluster.pooledAcres + farm.acres).toFixed(1));
    cluster.totalTonnes = Number((cluster.pooledAcres * 2.0).toFixed(1));

    // Update center coordinates as centroid
    const clusterFarms = this.farms.filter(f => cluster.farmIds.includes(f.id));
    if (clusterFarms.length > 0) {
      cluster.centerLat = Number((clusterFarms.reduce((sum, f) => sum + f.lat, 0) / clusterFarms.length).toFixed(4));
      cluster.centerLon = Number((clusterFarms.reduce((sum, f) => sum + f.lon, 0) / clusterFarms.length).toFixed(4));
    }

    // Check drying buffer status across all cluster farms
    cluster.allDryingBuffersPassed = clusterFarms.every(f => f.dryingBufferPassed);

    // 20-Acre Rule trigger check
    if (cluster.pooledAcres >= cluster.targetAcres) {
      cluster.status = 'READY_FOR_DISPATCH';
      // Attempt automated dispatch if drying buffers are met
      this.attemptAutoDispatch(cluster.id);
    }
  }

  /**
   * Attempts automatic dispatch of seasonally leased baler
   */
  attemptAutoDispatch(clusterId) {
    const cluster = this.clusters.find(c => c.id === clusterId);
    if (!cluster) return { success: false, message: 'Cluster not found' };

    if (cluster.pooledAcres < cluster.targetAcres) {
      return {
        success: false,
        message: `Cluster acreage is ${cluster.pooledAcres} / 20.0 acres. 20-acre aggregation rule not yet reached.`
      };
    }

    // Verify drying buffer
    const clusterFarms = this.farms.filter(f => cluster.farmIds.includes(f.id));
    const pendingDrying = clusterFarms.filter(f => !f.dryingBufferPassed);
    if (pendingDrying.length > 0) {
      return {
        success: false,
        message: `Drying buffer active: ${pendingDrying.length} farm(s) in cluster have moisture >=20% or harvest <3 days ago.`
      };
    }

    // Find available idle baler nearest to the cluster
    let chosenBaler = null;
    let minBalerDist = Infinity;

    for (const baler of this.balerFleet) {
      if (baler.status === 'IDLE') {
        const dist = calculateHaversineDistance(
          baler.currentLocation.lat,
          baler.currentLocation.lon,
          cluster.centerLat,
          cluster.centerLon
        );
        if (dist < minBalerDist) {
          minBalerDist = dist;
          chosenBaler = baler;
        }
      }
    }

    if (!chosenBaler) {
      // Fallback: assign first baler for mock orchestration
      chosenBaler = this.balerFleet[0];
    }

    chosenBaler.status = 'DISPATCHED';
    chosenBaler.assignedClusterId = cluster.id;

    cluster.status = 'DISPATCHED';
    cluster.assignedBalerId = chosenBaler.id;
    cluster.dispatchedAt = new Date().toISOString();

    // Mark member farms as DISPATCHED
    clusterFarms.forEach(f => {
      f.status = 'DISPATCHED';
    });

    return {
      success: true,
      clusterId: cluster.id,
      balerId: chosenBaler.id,
      balerOperator: chosenBaler.operator,
      transitDistanceKm: minBalerDist !== Infinity ? minBalerDist : 4.2,
      farmerCost: 0, // ₹0 to farmer!
      message: `Baler ${chosenBaler.id} auto-dispatched to ${cluster.village} for 20-acre aggregation run. Farmer fee: ₹0.`
    };
  }

  /**
   * Advance cluster workflow (e.g. BALING -> AT_HUB -> SOLD)
   */
  advanceClusterStage(clusterId) {
    const cluster = this.clusters.find(c => c.id === clusterId);
    if (!cluster) return null;

    if (cluster.status === 'DISPATCHED') {
      cluster.status = 'BALING';
      const baler = this.balerFleet.find(b => b.id === cluster.assignedBalerId);
      if (baler) baler.status = 'BALING_IN_PROGRESS';
    } else if (cluster.status === 'BALING') {
      cluster.status = 'AT_HUB';
      const baler = this.balerFleet.find(b => b.id === cluster.assignedBalerId);
      if (baler) {
        baler.status = 'IDLE';
        baler.assignedClusterId = null;
        baler.acresCompletedToday += cluster.pooledAcres;
      }
    } else if (cluster.status === 'AT_HUB') {
      // Trigger 3-way settlement upon B2B bulk sale!
      this.executeSettlement(cluster);
    }

    return cluster;
  }

  /**
   * 3-Way Auto-Settlement Ledger execution as per Slide 5 Unit Economics:
   * Per acre (~2 tonnes yield):
   * Factory revenue (₹1,800 / tonne) = +₹3,600 / acre
   * Leased baler + diesel + twine = -₹1,400 / acre
   * Trolley to hub, storage, truck to factory = -₹1,100 / acre
   * Farmer 5% revenue share = +₹180 / acre (plus field clearing at ₹0 saves ₹4,000!)
   * Captain / Referral pool = +₹120 / acre
   * Platform Net Profit = +₹800 / acre (₹400 / tonne, 22% net margin)
   */
  executeSettlement(cluster) {
    const acres = cluster.pooledAcres;
    const tonnes = cluster.totalTonnes;
    const buyer = this.buyers[0]; // Verbio India Bio-CNG / CBG Plant

    const factoryRevenue = tonnes * 1800; // ₹1,800/t
    const balerMachineryCost = acres * 1400; // Leased baler + diesel + twine
    const logisticsHubCost = acres * 1100; // Trolley to hub + storage + transit to factory
    const farmerShareTotal = acres * 180; // 5% revenue share (₹180/acre)
    const referralPoolTotal = acres * 120; // Captain / referral incentive (₹120/acre)
    const platformNetProfit = factoryRevenue - (balerMachineryCost + logisticsHubCost + farmerShareTotal + referralPoolTotal);

    const clusterFarms = this.farms.filter(f => cluster.farmIds.includes(f.id));

    // Per farmer payout breakdown
    const farmerPayouts = clusterFarms.map(f => ({
      farmId: f.id,
      farmerName: f.farmerName,
      farmerPhone: f.farmerPhone,
      acres: f.acres,
      stubbleTonnes: f.acres * 2.0,
      clearingCostCharged: 0, // ₹0 to farmer!
      fieldClearingSaved: f.acres * 4000, // ₹4,000/acre saved vs tractor diesel
      revenueSharePayout: f.acres * 180,
      referralEarnings: f.referredBy ? f.acres * 120 : 0
    }));

    const settlementEntry = {
      id: `SETTLE-${Date.now().toString(36).toUpperCase()}`,
      clusterId: cluster.id,
      village: cluster.village,
      acresBaled: acres,
      tonnesStubble: tonnes,
      buyerName: buyer ? buyer.name : 'Verbio India Bio-CNG',
      buyerRatePerTonne: 1800,
      financials: {
        factoryRevenue,
        balerMachineryCost,
        logisticsHubCost,
        farmerShareTotal,
        referralPoolTotal,
        platformNetProfit,
        profitMarginPercent: Number(((platformNetProfit / factoryRevenue) * 100).toFixed(1))
      },
      farmerPayouts,
      settledAt: new Date().toISOString()
    };

    this.settlements.push(settlementEntry);
    cluster.status = 'SOLD';
    cluster.settlementId = settlementEntry.id;

    clusterFarms.forEach(f => {
      f.status = 'SETTLED';
    });

    return settlementEntry;
  }

  /**
   * Climate and Financial Impact Counters
   */
  getImpactMetrics() {
    const totalAcres = this.farms.reduce((sum, f) => sum + f.acres, 0);
    const settledAcres = this.settlements.reduce((sum, s) => sum + s.acresBaled, 0);

    // Baseline stats:
    // Stubble tonnes: ~2 tonnes per acre
    // CO2 avoided: ~1,460 kg CO2 per tonne open-burn
    // PM2.5 prevented: ~3.0 kg PM2.5 per tonne
    // Farmer clearing expense saved: ~₹4,000 / acre
    // Captain & referral earnings: ~₹120 / acre
    const tonnesDiverted = Number((totalAcres * 2.0).toFixed(1));
    const co2AvoidedKg = Math.round(tonnesDiverted * 1460);
    const co2AvoidedTonnes = Number((co2AvoidedKg / 1000).toFixed(1));
    const pm25PreventedKg = Number((tonnesDiverted * 3.0).toFixed(1));
    const farmerSavingsInr = Math.round(totalAcres * 4000);
    const ruralIncomeGeneratedInr = Math.round(totalAcres * (180 + 120));

    return {
      totalFarmsEnrolled: this.farms.length,
      totalAcresPooled: totalAcres,
      totalClusters: this.clusters.length,
      tonnesStubbleDiverted: tonnesDiverted,
      co2AvoidedKg,
      co2AvoidedTonnes,
      pm25PreventedKg,
      farmerSavingsInr,
      ruralIncomeGeneratedInr,
      activeBalersCount: this.balerFleet.length,
      hubsCount: this.hubs.length,
      buyersCount: this.buyers.length,
      settledOrdersCount: this.settlements.length
    };
  }
}

module.exports = new DataStore();
