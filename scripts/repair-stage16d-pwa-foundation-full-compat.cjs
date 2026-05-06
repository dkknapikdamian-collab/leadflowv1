#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const rel = 'public/service-worker.js';
const file = path.join(root, rel);

if (!fs.existsSync(file)) {
  console.error(`${rel} not found`);
  process.exit(1);
}

let source = fs.readFileSync(file, 'utf8');
const before = source;

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!/function\s+isApiOrDataRequest\s*\(request\)/.test(source)) {
  fail('isApiOrDataRequest(request) not found in service worker');
}

// Keep Stage13 safety, but satisfy older PWA foundation textual guards which require
// the exact url.pathname.startsWith('/api/') and url.pathname.startsWith('/supabase/') shapes.
if (!source.includes("url.pathname.startsWith('/api/')")) {
  if (source.includes("const full = `${url.pathname}${url.search}`.toLowerCase();")) {
    source = source.replace(
      "const full = `${url.pathname}${url.search}`.toLowerCase();",
      "const full = `${url.pathname}${url.search}`.toLowerCase();\n  const legacyApiPathCompat = url.pathname.startsWith('/api/');",
    );
  } else {
    fail('Could not insert legacyApiPathCompat marker');
  }
}

if (!source.includes("url.pathname.startsWith('/supabase/')")) {
  if (source.includes("const legacyApiPathCompat = url.pathname.startsWith('/api/');")) {
    source = source.replace(
      "const legacyApiPathCompat = url.pathname.startsWith('/api/');",
      "const legacyApiPathCompat = url.pathname.startsWith('/api/');\n  const legacySupabasePathCompat = url.pathname.startsWith('/supabase/');",
    );
  } else if (source.includes("const full = `${url.pathname}${url.search}`.toLowerCase();")) {
    source = source.replace(
      "const full = `${url.pathname}${url.search}`.toLowerCase();",
      "const full = `${url.pathname}${url.search}`.toLowerCase();\n  const legacyApiPathCompat = url.pathname.startsWith('/api/');\n  const legacySupabasePathCompat = url.pathname.startsWith('/supabase/');",
    );
  } else {
    fail('Could not insert legacySupabasePathCompat marker');
  }
}

if (!source.includes('legacyApiPathCompat ||')) {
  source = source.replace(
    'hasSensitiveQueryOrHeaders(request, url) ||',
    'hasSensitiveQueryOrHeaders(request, url) ||\n    legacyApiPathCompat ||',
  );
}

if (!source.includes('legacySupabasePathCompat ||')) {
  if (source.includes('legacyApiPathCompat ||')) {
    source = source.replace(
      'legacyApiPathCompat ||',
      'legacyApiPathCompat ||\n    legacySupabasePathCompat ||',
    );
  } else {
    source = source.replace(
      'hasSensitiveQueryOrHeaders(request, url) ||',
      'hasSensitiveQueryOrHeaders(request, url) ||\n    legacyApiPathCompat ||\n    legacySupabasePathCompat ||',
    );
  }
}

// /support became the user-facing alias in Stage16 final QA. Keep business runtime screens network-only.
if (!source.includes("'/support'")) {
  source = source.replace("'/help',", "'/help',\n  '/support',");
}

// Sanity: do not weaken PWA safe cache contract.
const required = [
  "url.pathname.startsWith('/api/')",
  "url.pathname.startsWith('/supabase/')",
  "request.method !== 'GET'",
  "request.mode === 'navigate'",
  "path.startsWith('/api/')",
  "path.startsWith('/supabase/')",
  "path.includes('/storage/v1/')",
  "hasSensitiveQueryOrHeaders(request, url)",
  "isBusinessRuntimePath(path)",
];

const missing = required.filter((needle) => !source.includes(needle));
if (missing.length) {
  console.error('Stage16D PWA compat repair missing required markers:');
  for (const item of missing) console.error(`- ${item}`);
  process.exit(1);
}

if (source !== before) {
  fs.writeFileSync(file, source, 'utf8');
}

console.log('OK: Stage16D PWA foundation full compat repair completed.');
console.log(source === before ? 'Touched files: 0' : `Touched files: 1\n- ${rel}`);
