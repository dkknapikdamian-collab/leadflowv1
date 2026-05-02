#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function expect(condition, message) {
  if (!condition) fail.push(message);
}

const system = read('api/system.ts');
const portalApi = read('api/portal.ts');
const portalTokens = read('src/server/portal-tokens-handler.ts');
const portalTokenCore = read('src/server/_portal-token.ts');
const vercel = read('vercel.json');
const pkg = JSON.parse(read('package.json'));

expect(!system.includes('handleClientPortalTokens'), 'api/system.ts must not contain legacy handleClientPortalTokens');
expect(!system.includes('createToken()'), 'api/system.ts must not contain legacy portal createToken helper');
expect(!system.includes('client_portal_tokens?select=*&case_id=eq.'), 'api/system.ts must not query client_portal_tokens directly');
expect(!system.includes('&token=eq.'), 'api/system.ts must not filter portal tokens by plaintext token=eq');
expect(!/client_portal_tokens[\s\S]{0,300}\btoken\s*:/.test(system), 'api/system.ts must not write plaintext token payloads');

expect(portalApi.includes('portalTokensHandler'), 'api/portal.ts must still route tokens through portalTokensHandler');
expect(portalApi.includes("route === 'tokens'"), 'api/portal.ts must keep route=tokens');
expect(vercel.includes('"source": "/api/client-portal-tokens"'), 'vercel.json must expose /api/client-portal-tokens rewrite');
expect(vercel.includes('"/api/portal?route=tokens"'), 'vercel.json must route client portal tokens to /api/portal');

expect(!portalTokens.includes('&token=eq.'), 'portal-tokens-handler must not filter by plaintext token=eq');
expect(portalTokens.includes('createPortalToken'), 'portal-tokens-handler must create plaintext token only for one-time response');
expect(portalTokens.includes('upsertPortalTokenForCase'), 'portal-tokens-handler must store through hashed token flow');

expect(portalTokenCore.includes('token_hash'), '_portal-token.ts must use token_hash');
expect(portalTokenCore.includes('hashPortalToken'), '_portal-token.ts must hash portal tokens');
expect(!/client_portal_tokens[\s\S]{0,300}\btoken\s*:/.test(portalTokenCore), '_portal-token.ts must not write plaintext token payloads');

expect(pkg.scripts && pkg.scripts['check:p9-portal-plaintext-legacy-removed'], 'package.json missing check:p9-portal-plaintext-legacy-removed');

if (fail.length) {
  console.error('P9 portal plaintext legacy cleanup guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}

console.log('OK: P9 portal plaintext legacy cleanup guard passed.');
