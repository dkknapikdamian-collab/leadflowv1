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

const portalToken = read('src/server/_portal-token.ts');
const envExample = read('.env.example');
const readme = read('README.md');
const pkg = JSON.parse(read('package.json'));

expect(portalToken.includes("RequestAuthError"), '_portal-token.ts must use RequestAuthError for config failures');
expect(portalToken.includes('PORTAL_SECRET_CONFIG_MISSING'), '_portal-token.ts must expose PORTAL_SECRET_CONFIG_MISSING');
expect(portalToken.includes('NODE_ENV'), '_portal-token.ts must check NODE_ENV');
expect(portalToken.includes('VERCEL_ENV'), '_portal-token.ts must check VERCEL_ENV');
expect(portalToken.includes("requirePortalSecret('PORTAL_TOKEN_PEPPER')"), '_portal-token.ts must require PORTAL_TOKEN_PEPPER through helper');
expect(portalToken.includes("requirePortalSecret('PORTAL_SESSION_SECRET')"), '_portal-token.ts must require PORTAL_SESSION_SECRET through helper');
expect(!portalToken.includes("'closeflow-portal-v1'"), '_portal-token.ts must not contain old literal token secret fallback');
expect(!portalToken.includes('"closeflow-portal-v1"'), '_portal-token.ts must not contain old literal token secret fallback');
expect(!portalToken.includes("'closeflow-portal-session-v1'"), '_portal-token.ts must not contain old literal session secret fallback');
expect(!portalToken.includes('"closeflow-portal-session-v1"'), '_portal-token.ts must not contain old literal session secret fallback');
expect(!/PORTAL_TOKEN_PEPPER\s*\|\|\s*process\.env\.SUPABASE_SERVICE_ROLE_KEY\s*\|\|\s*['"]closeflow-portal-v1['"]/.test(portalToken), 'production token pepper must not fall back to default literal');
expect(!/PORTAL_SESSION_SECRET\s*\|\|\s*process\.env\.SUPABASE_SERVICE_ROLE_KEY\s*\|\|\s*['"]closeflow-portal-session-v1['"]/.test(portalToken), 'production session secret must not fall back to default literal');

expect(envExample.includes('PORTAL_TOKEN_PEPPER='), '.env.example must document PORTAL_TOKEN_PEPPER');
expect(envExample.includes('PORTAL_SESSION_SECRET='), '.env.example must document PORTAL_SESSION_SECRET');
expect(readme.includes('Portal klienta: wymagane sekrety'), 'README must document portal secrets');
expect(readme.includes('PORTAL_SECRET_CONFIG_MISSING'), 'README must document missing secret error');
expect(pkg.scripts && pkg.scripts['check:p8-portal-secrets-hardening'], 'package.json missing check:p8-portal-secrets-hardening');

if (fail.length) {
  console.error('P8 portal secrets hardening guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}

console.log('OK: P8 portal secrets hardening guard passed.');
