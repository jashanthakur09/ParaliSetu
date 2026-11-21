// backend/tests/api.test.js
// Automated End-to-End Test Suite for ParaliSetu Backend

const BASE_URL = process.env.API_URL || 'http://localhost:5000/api';

async function testEndpoint(name, fn) {
  try {
    process.stdout.write(`Testing ${name}... `);
    await fn();
    console.log('✅ PASS');
  } catch (err) {
    console.log('❌ FAIL');
    console.error(`  -> Error: ${err.message}`);
    process.exitCode = 1;
  }
}

async function run() {
  console.log(`\n🌾 Starting ParaliSetu API Test Suite (${BASE_URL})\n`);

  await testEndpoint('GET /health', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.status !== 'ok') throw new Error('Expected status: ok');
  });

  await testEndpoint('GET /hotspots (NASA FIRMS & seeded)', async () => {
    const res = await fetch(`${BASE_URL}/hotspots`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data.hotspots) || data.hotspots.length < 25) {
      throw new Error(`Expected at least 25 hotspots, got ${data.hotspots?.length}`);
    }
  });

  await testEndpoint('GET /clusters & GET /fleet', async () => {
    const [cRes, fRes] = await Promise.all([
      fetch(`${BASE_URL}/clusters`),
      fetch(`${BASE_URL}/fleet`)
    ]);
    const cData = await cRes.json();
    const fData = await fRes.json();
    if (cData.clusters.length < 6) throw new Error('Expected 6 village clusters');
    if (fData.balers.length < 4) throw new Error('Expected 4 balers');
    if (fData.storage_hubs.length < 3) throw new Error('Expected 3 storage hubs');
    if (fData.buyers.length < 3) throw new Error('Expected 3 buyers');
  });

  await testEndpoint('POST /bookings (5-acre booking triggers baler dispatch)', async () => {
    const res = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cluster_id: 'CL-001',
        farmer_name: 'Test Farmer',
        phone: '9876543210',
        acres: 5.0,
        booking_mode: 'self',
        referred_by: 'KHERI-101'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.updatedCluster.total_booked_acres !== 21) {
      throw new Error(`Expected 21 acres, got ${data.updatedCluster.total_booked_acres}`);
    }
    if (data.updatedCluster.status !== 'Machine Dispatched') {
      throw new Error(`Expected 'Machine Dispatched', got '${data.updatedCluster.status}'`);
    }
    if (!data.dispatchedBaler || data.dispatchedBaler.status !== 'Dispatched') {
      throw new Error('Expected an idle baler to be auto-dispatched');
    }
    if (!data.newlyUnlocked) throw new Error('Expected newlyUnlocked to be true');
  });

  await testEndpoint('GET /lots and POST /lots/:id/reserve (3-way payout)', async () => {
    const lotsRes = await fetch(`${BASE_URL}/lots`);
    const lotsData = await lotsRes.json();
    const readyLot = lotsData.lots.find(l => l.status === 'Ready for Pickup');
    if (!readyLot) throw new Error('No ready lot available for testing');

    const reserveRes = await fetch(`${BASE_URL}/lots/${readyLot.id}/reserve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ buyer_id: readyLot.buyer_id, lease_type: '45_day_seasonal' })
    });
    if (!reserveRes.ok) throw new Error(`HTTP ${reserveRes.status}`);
    const reserveData = await reserveRes.json();
    if (reserveData.lot.status !== 'Reserved & Settled') {
      throw new Error('Expected lot to be Reserved & Settled');
    }
    const s = reserveData.settlement;
    if (!s.farmer_share_inr || !s.coordinator_share_inr || !s.platform_net_inr) {
      throw new Error('Missing 3-way payout shares in settlement');
    }
  });

  await testEndpoint('GET /impact', async () => {
    const res = await fetch(`${BASE_URL}/impact`);
    const data = await res.json();
    if (!data.tonnes_diverted || !data.co2_avoided_tonnes || !data.pm25_prevented_kg) {
      throw new Error('Incomplete impact metrics');
    }
    if (data.season_simulator.platform_margin_pct !== 22.2) {
      throw new Error('Expected 22.2% seasonal margin');
    }
  });

  await testEndpoint('POST /reset (Restore exact demo seed)', async () => {
    const res = await fetch(`${BASE_URL}/reset`, { method: 'POST' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.summary) throw new Error('Reset failed');

    // Verify Village Kheri is back to 16.0 acres
    const cRes = await fetch(`${BASE_URL}/clusters`);
    const cData = await cRes.json();
    const kheri = cData.clusters.find(c => c.id === 'CL-001');
    if (kheri.total_booked_acres !== 16.0 || kheri.status !== 'Gathering Demand') {
      throw new Error('Village Kheri did not reset cleanly to 16.0 acres');
    }
  });

  console.log('\n🎉 All API tests executed successfully!\n');
}

run();
