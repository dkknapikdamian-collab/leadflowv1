#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = [];
const requiredDocs = [
  'docs/SUPABASE_FIRST_ARCHITECTURE.md',
  'docs/DATA_SOURCE_MAP.md',
];
const requiredScreens = [
  'Today',
  'Leads',
  'LeadDetail',
  'Tasks',
  'Calendar',
  'Cases',
  'CaseDetail',
  'Clients',
  'ClientDetail',
  'Templates',
  'AI Drafts',
  'Billing',
  'Portal',
  'ClientPortal',
  'Activity',
  'Settings',
];
const runtimeRoots = ['src', 'api'];
const allowedRuntimeFiles = new Set([
  'src/firebase.ts',
  'src/lib/firebase-utils.ts',
]);
const forbiddenRuntimePatterns = [
  /from\s+['"]firebase\/firestore['"]/,
  /from\s+['"]firebase\/compat\/firestore['"]/,
  /getFirestore\s*\(/,
  /collection\s*\(/,
  /doc\s*\([^)]*,/,
  /setDoc\s*\(/,
  /addDoc\s*\(/,
  /updateDoc\s*\(/,
  /deleteDoc\s*\(/,
  /getDoc\s*\(/,
  /getDocs\s*\(/,
  /onSnapshot\s*\(/,
  /runTransaction\s*\(/,
  /writeBatch\s*\(/,
];

function rel(p) { return p.split(path.sep).join('/'); }
function filePath(file) { return path.join(root, file); }
function exists(file) { return fs.existsSync(filePath(file)); }
function read(file) { return fs.readFileSync(filePath(file), 'utf8'); }
function push(condition, message) { if (!condition) fail.push(message); }
function normalizedText(value) {
  return String(value || '')
    .normalize('NFC')
    .replace(/\r\n/g, '\n')
    .replace(/[\u2013\u2014]/g, '-')
    .toLowerCase();
}
function walk(dir, out = []) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return out;
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    const full = path.join(abs, entry.name);
    const r = rel(path.relative(root, full));
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', 'build', '.git', '.vercel'].includes(entry.name)) continue;
      walk(r, out);
    } else if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(entry.name)) {
      out.push(r);
    }
  }
  return out;
}

for (const doc of requiredDocs) push(exists(doc), doc + ' is missing');

const architectureRaw = exists('docs/SUPABASE_FIRST_ARCHITECTURE.md') ? read('docs/SUPABASE_FIRST_ARCHITECTURE.md') : '';
const mapRaw = exists('docs/DATA_SOURCE_MAP.md') ? read('docs/DATA_SOURCE_MAP.md') : '';
const architecture = normalizedText(architectureRaw);
const map = normalizedText(mapRaw);
const readme = exists('README.md') ? read('README.md') : '';
const deployReadmeA = exists('README-WDROZENIE.md') ? read('README-WDROZENIE.md') : '';
const deployReadmeB = exists('README_WDROZENIE.md') ? read('README_WDROZENIE.md') : '';
const combinedDocs = normalizedText([readme, deployReadmeA, deployReadmeB].join('\n'));

push(architecture.includes('supabase jest docelowym \u017Ar\u00F3d\u0142em prawdy'), 'architecture doc must state Supabase as target source of truth');
push(architecture.includes('firebase / firestore jest warstw\u0105 legacy'), 'architecture doc must mark Firebase / Firestore as legacy');
push(architecture.includes('nie wolno tworzy\u0107 dw\u00F3ch r\u00F3wnoleg\u0142ych \u017Ar\u00F3de\u0142 prawdy'), 'architecture doc must forbid two sources of truth');
push(architecture.includes('ai nie mo\u017Ce zapisywa\u0107 finalnych danych bez potwierdzenia u\u017Cytkownika'), 'architecture doc must preserve AI confirmation rule');
push(architecture.includes('x-user-id') && architecture.includes('x-user-email') && architecture.includes('x-workspace-id'), 'architecture doc must forbid trusting frontend identity headers');

for (const screen of requiredScreens) push(mapRaw.includes(screen), 'DATA_SOURCE_MAP.md must include ' + screen);
push(map.includes('docelowym \u017Ar\u00F3d\u0142em prawdy jest supabase'), 'data source map must state Supabase target');
push(map.includes('legacy do migracji'), 'data source map must mark legacy paths');
push(mapRaw.includes('Supabase + Stripe'), 'data source map must include Billing as Supabase + Stripe');
push(mapRaw.includes('Supabase + Supabase Storage'), 'data source map must include Portal as Supabase + Supabase Storage');
push(combinedDocs.includes('supabase-first'), 'README/deployment docs must mention Supabase-first');
push(!combinedDocs.includes('# leadflow - wdro\u017Cenie (firebase)'), 'deployment README must not present Firebase as target deployment architecture');

for (const runtimeRoot of runtimeRoots) {
  for (const file of walk(runtimeRoot)) {
    if (allowedRuntimeFiles.has(file)) continue;
    const content = read(file);
    for (const pattern of forbiddenRuntimePatterns) {
      if (pattern.test(content)) {
        fail.push(file + ' contains forbidden Firestore runtime usage: ' + pattern.toString());
      }
    }
  }
}

if (fail.length) {
  console.error('Supabase-first architecture guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}
console.log('OK: Supabase-first architecture guard passed.');
