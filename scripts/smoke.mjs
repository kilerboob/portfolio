import http from 'node:http';

const BASE = process.env.SMOKE_BASE || 'http://127.0.0.1:18000';

function req(path, opts = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path.startsWith('http') ? path : BASE + path);
    const req = http.request({
      method: opts.method || 'GET',
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname + url.search,
      headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf8');
        resolve({ status: res.statusCode, body });
      });
    });
    req.on('error', reject);
    if (opts.body) req.write(JSON.stringify(opts.body));
    req.end();
  });
}

async function main() {
  try {
    console.log('GET /health');
    console.log(await req('/health'));

    console.log('GET /api/services');
    console.log(await req('/api/services'));

    console.log('POST /api/contact');
    const res = await req('/api/contact', {
      method: 'POST',
      body: {
        name: 'Smoke Tester',
        email: 'smoke@example.com',
        subject: 'Smoke test',
        message: 'Hello from smoke test',
        source: 'smoke',
        utm: { a: 'b' }
      }
    });
    console.log(res);
  } catch (e) {
    console.error('Smoke failed', e);
    process.exit(1);
  }
}

main();
