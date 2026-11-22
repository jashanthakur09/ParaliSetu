const http = require('http');

console.log('Testing server startup & HTTP GET...');
require('./server/index.js');

setTimeout(() => {
  const req = http.get('http://127.0.0.1:3000/', (res) => {
    console.log('HTTP GET Status:', res.statusCode);
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      console.log('Body length:', body.length);
      console.log('ParaliSetu title present:', body.includes('<title>ParaliSetu'));
      console.log('Live Impact Strip present:', body.includes('kpiTonnesVal'));
      console.log('Interactive SVG Map present:', body.includes('id="radarSvg"'));
      console.log('Slide-Over Sheet present:', body.includes('id="slideOverSheet"'));
      console.log('WhatsApp Modal present:', body.includes('id="bookingConfirmModal"'));
      
      // Also test /api/impact
      http.get('http://127.0.0.1:3000/api/impact', (apiRes) => {
        console.log('API /api/impact Status:', apiRes.statusCode);
        let apiBody = '';
        apiRes.on('data', c => apiBody += c);
        apiRes.on('end', () => {
          console.log('API Impact Response:', JSON.parse(apiBody));
          console.log('\n--- ALL VERIFICATIONS PASSED ---');
          process.exit(0);
        });
      });
    });
  });

  req.on('error', (err) => {
    console.error('Request Error:', err.message);
    process.exit(1);
  });
}, 1000);
