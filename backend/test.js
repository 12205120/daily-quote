const http = require('http');

console.log('Running API test...');

// Options for the HTTP request
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/quote',
  method: 'GET',
  timeout: 3000
};

// Function to test the API
function testApi() {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      console.log(`API Status Code: ${res.statusCode}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const quote = JSON.parse(data);
          console.log('Received quote:', quote);
          
          if (res.statusCode === 200 && quote.text && quote.author) {
            console.log('✅ Test PASSED: API returned 200 OK with valid quote');
            resolve(true);
          } else {
            console.log('❌ Test FAILED: API response was not as expected');
            resolve(false);
          }
        } catch (e) {
          console.error('❌ Test FAILED: Could not parse JSON response', e);
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Test FAILED: Error connecting to API:', error.message);
      resolve(false);
    });
    
    req.on('timeout', () => {
      console.error('❌ Test FAILED: Request timed out');
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

// Run the test
testApi().then(success => {
  process.exit(success ? 0 : 1);
});