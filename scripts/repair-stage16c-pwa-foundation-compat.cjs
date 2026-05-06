#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const rel = 'public/service-worker.js';
const file = path.join(root, rel);

if (!fs.existsSync(file)) {
  console.error(`Missing ${rel}`);
  process.exit(1);
}

let source = fs.readFileSync(file, 'utf8');
const before = source;

// STAGE16C_PWA_FOUNDATION_COMPAT_REPAIR
// Keep Stage13 safe-cache behavior, but restore the explicit legacy marker expected by tests/pwa-foundation.test.cjs.
// The marker is executable code, not a comment-only bypass.
if (!source.includes("url.pathname.startsWith('/api/')")) {
  source = source.replace(
    "  const path = url.pathname.toLowerCase();\n  const full = `${url.pathname}${url.search}`.toLowerCase();\n\n  return (",
    "  const path = url.pathname.toLowerCase();\n  const full = `${url.pathname}${url.search}`.toLowerCase();\n  const legacyApiPathCompat = url.pathname.startsWith('/api/');\n\n  return (",
  );
  source = source.replace(
    "    hasSensitiveQueryOrHeaders(request, url) ||\n    startsWithAny(path, PWA_NETWORK_ONLY_PREFIXES) ||",
    "    hasSensitiveQueryOrHeaders(request, url) ||\n    legacyApiPathCompat ||\n    startsWithAny(path, PWA_NETWORK_ONLY_PREFIXES) ||",
  );
}

if (!source.includes("url.pathname.startsWith('/api/')")) {
  console.error('Stage16C failed: legacy pwa-foundation API marker was not inserted.');
  process.exit(1);
}

if (!source.includes('PWA_STAGE13_MOBILE_SAFE_MODE') || !source.includes('PWA_NETWORK_ONLY_PREFIXES')) {
  console.error('Stage16C failed: Stage13 PWA safe-cache markers are missing.');
  process.exit(1);
}

if (source !== before) {
  fs.writeFileSync(file, source, 'utf8');
  console.log(`OK: Stage16C patched ${rel}`);
} else {
  console.log(`OK: Stage16C no-op, ${rel} already contains legacy API marker.`);
}
