import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer, loadEnv  } from 'vite';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT=3000;
const env = loadEnv(
  process.env.NODE_ENV === 'production' ? 'production' : 'development',
  process.cwd(),
  ''
);

const BACKEND_URL =
  env.BACKEND_URL ||
  process.env.BACKEND_URL ||
  'http://localhost:3001';


console.log('BACKEND_URL =', BACKEND_URL);

async function startServer() {
  const app = express();

  const apiProxy = createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
    proxyTimeout: 300000,
    timeout: 300000,
    on: {
      proxyReq: (proxyReq, req, res) => {
        // Forward cookies from the client request to the backend
        if (req.headers.cookie) {
          proxyReq.setHeader('cookie', req.headers.cookie);
        }
        // Add cache-busting header
        proxyReq.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        proxyReq.setHeader('Pragma', 'no-cache');
      },
      proxyRes: (proxyRes, req: Request, res: Response) => {
        console.log('[Proxy] Response status:', proxyRes.statusCode, 'for', req.originalUrl);
        // Strip caching headers from backend response
        delete proxyRes.headers['etag'];
        delete proxyRes.headers['last-modified'];
        delete proxyRes.headers['cache-control'];
        delete proxyRes.headers['expires'];
        // Add no-cache headers
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        // Forward set-cookie headers from backend to client (skip for SSE)
        const isSSE = proxyRes.headers['content-type']?.includes('text/event-stream');
        if (!isSSE) {
          const setCookie = proxyRes.headers['set-cookie'];
          if (setCookie) {
            res.setHeader('set-cookie', setCookie);
          }
        }
        // For SSE, ensure proper headers
        if (isSSE) {
          res.setHeader('Content-Type', 'text/event-stream');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Connection', 'keep-alive');
        }
      },
      error: (err: Error, req: Request, res: Response) => {
        console.error('[Proxy] Error:', err.message, 'for', req.originalUrl);
        res.status(500).json({ success: false, message: 'Proxy error' });
      },
    },
  });

  app.use((req, res, next) => {
    if (
      req.originalUrl.startsWith('/api') &&
      req.originalUrl !== '/api/health'
    ) {
      console.log('[Proxy Middleware] Proxying:', req.originalUrl);
      return apiProxy(req, res, next);
    }
    console.log('[Proxy Middleware] Skipping:', req.originalUrl);
    next();
  });

  // Body parser for local routes (after proxy so proxy gets raw body)
  app.use(express.json());

  // Local API Route: health (GET, no body needed)
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BuildPath server running on http://0.0.0.0:${PORT}`);
  });
}

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

startServer().catch(err => {
  console.error('Server startup error:', err);
  process.exit(1);
});