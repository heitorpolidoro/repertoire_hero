import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { mockSongs, mockPlaylists, mockImportablePlaylists } from './data/mockData';
import crypto from 'node:crypto';

// __dirname is not available in ESM, so derive it
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Simple dev mock API plugin to serve mock data from the same origin during development
function mockApiPlugin(): Plugin {
  const TOKEN_COOKIE = 'rh_token';

  function parseCookies(cookieHeader: string | undefined) {
    const out: Record<string, string> = {};
    if (!cookieHeader) return out;
    cookieHeader.split(';').forEach(part => {
      const [k, ...rest] = part.split('=');
      if (!k) return;
      out[k.trim()] = decodeURIComponent(rest.join('=').trim());
    });
    return out;
  }

  function b64url(input: Buffer) {
    return input.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function verifySignature(token: string, payloadB64: string, sig: string) {
    try {
      const mac = crypto.createHmac('sha256', token).update(payloadB64, 'utf8').digest();
      const expected = b64url(mac);
      // timing-safe compare
      return expected.length === sig.length && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
    } catch {
      return false;
    }
  }

  return {
    name: 'mock-api',
    configureServer(server) {
      // --- Session router (no auth) ---
      server.middlewares.use('/api/session', (req, res, next) => {
        if (!req.method) return next();

        if (req.method === 'POST') {
          const cookies = parseCookies(req.headers.cookie as string | undefined);
          let token = cookies[TOKEN_COOKIE];
          if (!token) {
            token = b64url(crypto.randomBytes(24));
          }
          const expires = new Date(Date.now() + 30 * 60 * 1000).toUTCString();
          res.setHeader('Set-Cookie', `${TOKEN_COOKIE}=${encodeURIComponent(token)}; Path=/; Expires=${expires}; SameSite=Lax`);
          res.statusCode = 204;
          res.end();
          return;
        }

        if (req.method === 'DELETE') {
          const expires = new Date(0).toUTCString();
          res.setHeader('Set-Cookie', `${TOKEN_COOKIE}=deleted; Path=/; Expires=${expires}; SameSite=Lax`);
          res.statusCode = 204;
          res.end();
          return;
        }

        res.statusCode = 405;
        res.setHeader('Allow', 'POST, DELETE');
        res.end();
      });

      // --- Auth router for /api (skips /api/session) ---
      server.middlewares.use('/api', (req, res, next) => {
        if (!req.url) return next();
        if (req.url.startsWith('/session')) return next(); // let the session router handle it

        const cookies = parseCookies(req.headers.cookie as string | undefined);
        const token = cookies[TOKEN_COOKIE];
        const headerToken = (req.headers['x-rh-token'] as string) || '';

        if (!token || !headerToken || token !== headerToken) {
          res.statusCode = 403;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Forbidden' }));
          return;
        }

        const xUser = (req.headers['x-user'] as string) || '';
        const xSig = (req.headers['x-user-sig'] as string) || '';
        if (xUser) {
          const ok = verifySignature(token, xUser, xSig);
          if (!ok) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Invalid signature' }));
            return;
          }
        }

        next();
      });

      // --- Songs router ---
      server.middlewares.use('/api/songs', (req, res, next) => {
        if (req.method !== 'GET') {
          res.statusCode = 405;
          res.setHeader('Allow', 'GET');
          res.end();
          return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ songs: mockSongs }));
      });

      // --- Playlists router ---
      server.middlewares.use('/api/playlists', (req, res, next) => {
        if (req.method !== 'GET') {
          res.statusCode = 405;
          res.setHeader('Allow', 'GET');
          res.end();
          return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ playlists: mockPlaylists }));
      });

      // --- Importable playlists router ---
      server.middlewares.use('/api/importable-playlists', (req, res, next) => {
        if (req.method !== 'GET') {
          res.statusCode = 405;
          res.setHeader('Allow', 'GET');
          res.end();
          return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(mockImportablePlaylists));
      });
    }
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), mockApiPlugin()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
