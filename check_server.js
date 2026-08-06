const http = require('http');
const req = http.request({
  hostname: 'localhost',
  port: 3001,
  path: '/api/debug',
  method: 'GET'
}, (res) => {
  let body = '';
  res.on('data', (d) => body += d);
  res.on('end', () => console.log(body));
});
req.on('error', (error) => {
  console.error('ERROR', error);
});
req.end();
