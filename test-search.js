const fetch = require('node-fetch');

async function testSearch() {
    try {
        console.log("Testing secure search endpoint...");
        // This will fail with 401 Unauthorized because we don't have a token,
        // but it will prove the endpoint is reachable!
        const res = await fetch('http://localhost:3000/api/search/secure', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: 'test' })
        });
        
        const data = await res.json().catch(e => ({ error: 'Parse failed' }));
        console.log(`Status: ${res.status}`);
        console.log(`Response:`, data);
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

testSearch();
