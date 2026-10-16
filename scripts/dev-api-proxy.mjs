// Development only. The production API accepts browser requests only from its
// own sites (CORS), so the web preview on http://localhost:8081 can't call it
// directly. This forwards http://localhost:8787/* to the API without the
// browser's Origin and adds the CORS headers the preview needs. Phone builds
// send no Origin and never use it.
//
//   pnpm api-proxy                     # → https://api.alansartaxi.com
//   API_TARGET=http://localhost:4000 pnpm api-proxy

import http from 'node:http';

const TARGET = process.env.API_TARGET ?? 'https://api.alansartaxi.com';
const PORT = Number(process.env.PORT ?? 8787);
const ALLOWED_ORIGIN = 'http://localhost:8081';

const cors = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'content-type, authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
};

http
  .createServer(async (req, res) => {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, cors);
      res.end();
      return;
    }

    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);

    const headers = { accept: req.headers.accept ?? 'application/json' };
    if (req.headers['content-type']) headers['content-type'] = req.headers['content-type'];
    if (req.headers.authorization) headers.authorization = req.headers.authorization;

    try {
      const upstream = await fetch(TARGET + req.url, {
        method: req.method,
        headers,
        body: chunks.length ? Buffer.concat(chunks) : undefined,
      });
      res.writeHead(upstream.status, {
        ...cors,
        'content-type': upstream.headers.get('content-type') ?? 'application/json',
      });
      res.end(Buffer.from(await upstream.arrayBuffer()));
    } catch {
      res.writeHead(502, { ...cors, 'content-type': 'application/json' });
      res.end(
        JSON.stringify({
          success: false,
          error: { code: 'PROXY_ERROR', message: `The dev proxy could not reach ${TARGET}` },
        }),
      );
    }
  })
  .listen(PORT, () => console.log(`API proxy: http://localhost:${PORT} -> ${TARGET}`));
