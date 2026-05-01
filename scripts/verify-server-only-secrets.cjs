#!/usr/bin/env node
/*
  CloseFlow security guard: backend-only secrets must never use VITE_* names.

  Blocks exact unsafe public-style names:
  - VITE_SUPABASE_SERVICE_ROLE_KEY
  - VITE_STRIPE_SECRET_KEY
  - VITE_GEMINI_API_KEY
  - VITE_CLOUDFLARE_API_TOKEN

  Also scans build output for actual server-only secret values when they exist in
  the local environment. The guard excludes only this file, because it has to
  contain the blocked names to enforce them.
*/

const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();
const failures = [];

const FORBIDDEN_VITE_SECRET_NAMES = [
  'VITE_SUPABASE_SERVICE_ROLE_KEY',
  'VITE_STRIPE_SECRET_KEY',
  'VITE_GEMINI_API_KEY',
  'VITE_CLOUDFLARE_API_TOKEN',
];

const SERVER_SECRET_ENV_NAMES = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'STRIPE_SECRET_KEY',
  'GEMINI_API_KEY',
  'CLOUDFLARE_API_TOKEN',
];

const SKIP_DIRS = new Set([
  '.git',
  '.github',
  'node_modules',
  'coverage',
  '.turbo',
  '.next',
  '.vercel',
  '.firebase',
  'tmp',
  'temp',
]);

const TEXT_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.json',
  '.html',
  '.css',
  '.map',
  '.txt',
  '.md',
  '.env',
  '.example',
  '.yml',
  '.yaml',
  '',
]);

const SELF = 'scripts/verify-server-only-secrets.cjs';

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function isTextFile(filePath) {
  const ext = path.extname(filePath);
  if (TEXT_EXTENSIONS.has(ext)) return true;
  const name = path.basename(filePath);
  return name === '.env' || name.startsWith('.env.');
}

function walk(dirAbs, callback) {
  if (!fs.existsSync(dirAbs)) return;
  const entries = fs.readdirSync(dirAbs, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path.join(dirAbs, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(abs, callback);
      continue;
    }
    if (entry.isFile()) callback(abs);
  }
}

function readText(abs) {
  try {
    return fs.readFileSync(abs, 'utf8');
  } catch {
    return '';
  }
}

function lineNumber(content, index) {
  return content.slice(0, index).split(/\r?\n/).length;
}

function scanForbiddenNames() {
  walk(repoRoot, (abs) => {
    if (!isTextFile(abs)) return;
    const rel = toPosix(path.relative(repoRoot, abs));
    if (rel === SELF) return;

    const content = readText(abs);
    if (!content) return;

    for (const forbidden of FORBIDDEN_VITE_SECRET_NAMES) {
      let index = content.indexOf(forbidden);
      while (index !== -1) {
        failures.push(`${rel}:${lineNumber(content, index)} contains forbidden backend secret env name ${forbidden}`);
        index = content.indexOf(forbidden, index + forbidden.length);
      }
    }
  });
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function scanBuildOutputForActualSecretValues() {
  const buildDirs = ['dist', 'build'];
  const secretValues = [];

  for (const envName of SERVER_SECRET_ENV_NAMES) {
    const value = process.env[envName];
    if (typeof value === 'string' && value.length >= 8) {
      secretValues.push({ envName, value });
    }
  }

  if (!secretValues.length) return;

  for (const dir of buildDirs) {
    const absDir = path.join(repoRoot, dir);
    if (!fs.existsSync(absDir)) continue;

    walk(absDir, (abs) => {
      if (!isTextFile(abs)) return;
      const rel = toPosix(path.relative(repoRoot, abs));
      const content = readText(abs);
      for (const secret of secretValues) {
        const pattern = new RegExp(escapeRegExp(secret.value), 'g');
        if (pattern.test(content)) {
          failures.push(`${rel}: build output contains actual value of ${secret.envName}`);
        }
      }
    });
  }
}

function scanSupabaseServerHelper() {
  const rel = 'src/server/_supabase.ts';
  const abs = path.join(repoRoot, rel);
  if (!fs.existsSync(abs)) {
    failures.push(`${rel} is missing`);
    return;
  }

  const content = readText(abs);
  if (!content.includes('process.env.SUPABASE_SERVICE_ROLE_KEY')) {
    failures.push(`${rel} must read SUPABASE_SERVICE_ROLE_KEY`);
  }
  if (content.includes('process.env.VITE_SUPABASE_SERVICE_ROLE_KEY')) {
    failures.push(`${rel} must not read process.env.VITE_SUPABASE_SERVICE_ROLE_KEY`);
  }
}

function scanEnvExample() {
  const rel = '.env.example';
  const abs = path.join(repoRoot, rel);
  if (!fs.existsSync(abs)) return;

  const content = readText(abs);
  if (!content.includes('SUPABASE_SERVICE_ROLE_KEY=')) {
    failures.push(`${rel} must document SUPABASE_SERVICE_ROLE_KEY without VITE prefix`);
  }
}

scanForbiddenNames();
scanBuildOutputForActualSecretValues();
scanSupabaseServerHelper();
scanEnvExample();

if (failures.length > 0) {
  console.error('ERROR: backend-only secrets must not use VITE_* env names.');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('OK: backend-only secrets do not use forbidden VITE_* env names.');
