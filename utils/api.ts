// Lightweight API helper to protect dev mock API and pass user info safely
// In development, the Vite dev server sets a short-lived token cookie (`rh_token`).
// The client mirrors this token via `x-rh-token` and signs the optional `x-user` header
// using HMAC-SHA-256 with the token as the key. The server verifies both.

import type { User } from '../types';

const TOKEN_COOKIE = 'rh_token';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
}

async function ensureSession(): Promise<string> {
  // Hit session to get/set the cookie
  try {
    await fetch('/api/session', { method: 'POST', credentials: 'include' });
  } catch {}
  const token = getCookie(TOKEN_COOKIE) || '';
  return token;
}

async function hmacSHA256Base64Url(key: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(data));
  const b64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export type ApiFetchOptions = RequestInit & {
  user?: User | null;
};

export async function apiFetch(input: RequestInfo | URL, init: ApiFetchOptions = {}): Promise<Response> {
  const token = await ensureSession();
  const headers = new Headers(init.headers || {});
  headers.set('x-rh-token', token);

  if (init.user) {
    // Only include non-sensitive, minimal user info
    const safeUser = {
      name: init.user.name,
      picture: init.user.avatarUrl,
      title: init.user.title,
    };
    // Use base64url for payload to avoid '+' and '/' issues in headers
    const json = JSON.stringify(safeUser);
    const payload = btoa(unescape(encodeURIComponent(json))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    headers.set('x-user', payload);
    try {
      const sig = await hmacSHA256Base64Url(token, payload);
      headers.set('x-user-sig', sig);
    } catch (e) {
      // If HMAC fails for any reason, still send request without user info
      headers.delete('x-user');
      headers.delete('x-user-sig');
    }
  }

  return fetch(input, {
    ...init,
    headers,
    credentials: 'include',
  });
}
