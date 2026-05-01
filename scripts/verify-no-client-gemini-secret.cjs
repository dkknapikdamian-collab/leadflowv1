#!/usr/bin/env node
/*
  CloseFlow security guard: Gemini secret must never reach the client bundle.

  This script intentionally allows server-side Gemini usage in:
  - api/**
  - src/server/**

  It blocks Gemini secrets/providers in:
  - vite.config.ts
  - client-side src/** files
  - dist/build output after npm run build
*/

const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();
const failures = [];

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
  'temp'
]);

const TEXT_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', '.html', '.css', '.map', '.txt'
]);

const CLIENT_FORBIDDEN = [
  { pattern: /GEMINI_API_KEY/g, label: 'GEMINI_API_KEY' },
  { pattern: /process\.env\.GEMINI/g, label: 'process.env.GEMINI*' },
  { pattern: /import\.meta\.env\.[A-Z0-9_]*GEMINI/g, label: 'import.meta.env.*GEMINI*' },
  { pattern: /VITE_[A-Z0-9_]*GEMINI/g, label: 'VITE_*GEMINI*' },
  { pattern: /@google\/genai/g, label: '@google/genai' },
  { pattern: /GoogleGenAI/g, label: 'GoogleGenAI' }
];

const DIST_FORBIDDEN = [
  ...CLIENT_FORBIDDEN,
  { pattern: /__GEMINI_API_KEY__/g, label: '__GEMINI_API_KEY__' }
];

const SERVER_IMPORT_FROM_CLIENT = [
  { pattern: /from\s+['\"][^'\"]*\/server\/[^'\"]*['\"]/g, label: 'client import from /server/' },
  { pattern: /from\s+['\"]src\/server\/[^'\"]*['\"]/g, label: 'client import from src/server/' },
  { pattern: /import\(['\"][^'\"]*\/server\/[^'\"]*['\"]\)/g, label: 'dynamic client import from /server/' }
];

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function exists(relPath) {
  return fs.existsSync(path.join(repoRoot, relPath));
}

function read(relPath) {
  return fs.readFileSync(path.join(repoRoot, relPath), 'utf8');
}

function isTextFile(filePath) {
  return TEXT_EXTENSIONS.has(path.extname(filePath));
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

function addMatches(relPath, content, rules, reason) {
  for (const rule of rules) {
    rule.pattern.lastIndex = 0;
    const match = rule.pattern.exec(content);
    if (match) {
      failures.push(`${relPath}: forbidden ${rule.label} in ${reason}`);
    }
  }
}

function scanViteConfig() {
  const relPath = 'vite.config.ts';
  if (!exists(relPath)) return;
  const content = read(relPath);
  addMatches(relPath, content, [
    { pattern: /GEMINI_API_KEY/g, label: 'GEMINI_API_KEY' },
    { pattern: /process\.env\.GEMINI/g, label: 'process.env.GEMINI*' },
    { pattern: /__GEMINI_API_KEY__/g, label: '__GEMINI_API_KEY__' },
    { pattern: /@google\/genai/g, label: '@google/genai' },
    { pattern: /GoogleGenAI/g, label: 'GoogleGenAI' }
  ], 'Vite config');
}

function scanClientSource() {
  const srcAbs = path.join(repoRoot, 'src');
  walk(srcAbs, (abs) => {
    if (!isTextFile(abs)) return;
    const rel = toPosix(path.relative(repoRoot, abs));
    if (rel.startsWith('src/server/')) return;
    const content = fs.readFileSync(abs, 'utf8');
    addMatches(rel, content, CLIENT_FORBIDDEN, 'client source');
    addMatches(rel, content, SERVER_IMPORT_FROM_CLIENT, 'client source');
  });
}

function scanDist() {
  const distCandidates = ['dist', 'build'];
  const secretValue = process.env.GEMINI_API_KEY ? String(process.env.GEMINI_API_KEY) : '';
  const rules = [...DIST_FORBIDDEN];
  if (secretValue.length >= 8) {
    rules.push({ pattern: new RegExp(escapeRegExp(secretValue), 'g'), label: 'actual GEMINI_API_KEY value' });
  }

  for (const dir of distCandidates) {
    const absDir = path.join(repoRoot, dir);
    if (!fs.existsSync(absDir)) continue;
    walk(absDir, (abs) => {
      if (!isTextFile(abs)) return;
      const rel = toPosix(path.relative(repoRoot, abs));
      const content = fs.readFileSync(abs, 'utf8');
      addMatches(rel, content, rules, `${dir} output`);
    });
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

scanViteConfig();
scanClientSource();
scanDist();

if (failures.length > 0) {
  console.error('ERROR: Gemini secret/provider is still exposed to client-side code or build output.');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('OK: no Gemini secret/provider exposure found in Vite config, client source, or build output.');
