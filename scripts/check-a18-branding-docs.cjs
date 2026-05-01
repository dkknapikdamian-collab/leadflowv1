#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const requiredFiles = [
  'README.md',
  'README-WDROZENIE.md',
  'README_WDROZENIE.md',
  '.env.example',
  'index.html',
  'public/manifest.webmanifest',
  'docs/PRODUCTION_READINESS_STATUS.md',
  'docs/STAGE_A18_BRANDING_DOCUMENTATION.md',
  'src/styles/visual-stage21-task-form-vnext.css',
];

const errors = [];
function read(rel) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    errors.push(`missing file: ${rel}`);
    return '';
  }
  return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
}

for (const rel of requiredFiles) read(rel);

const indexHtml = read('index.html');
if (!/<title>CloseFlow<\/title>/.test(indexHtml)) errors.push('index.html must use title CloseFlow');
if (!/Supabase-first SaaS/.test(indexHtml)) errors.push('index.html description should mention Supabase-first SaaS');

const manifestRaw = read('public/manifest.webmanifest');
try {
  const manifest = JSON.parse(manifestRaw);
  if (manifest.name !== 'CloseFlow') errors.push('manifest name must be CloseFlow');
  if (manifest.short_name !== 'CloseFlow') errors.push('manifest short_name must be CloseFlow');
  if (!String(manifest.description || '').includes('lead')) errors.push('manifest description should describe lead/case follow-up');
} catch (error) {
  errors.push('manifest.webmanifest must be valid JSON');
}

const readme = read('README.md');
for (const needle of ['React + Vite', 'Supabase-first', 'Vercel', 'backend-only', 'legacy/decommission']) {
  if (!readme.includes(needle)) errors.push(`README.md missing: ${needle}`);
}

const deployReadme = read('README-WDROZENIE.md');
for (const needle of ['CloseFlow', 'Supabase-first', 'Vercel', 'backend-only', 'Firebase / Firestore jest tylko legacy/decommission']) {
  if (!deployReadme.includes(needle)) errors.push(`README-WDROZENIE.md missing: ${needle}`);
}

const env = read('.env.example');
for (const needle of ['Public client env', 'Server-only Supabase env', 'SUPABASE_SERVICE_ROLE_KEY=', 'GEMINI_API_KEY=']) {
  if (!env.includes(needle)) errors.push(`.env.example missing: ${needle}`);
}
if (/public-prefixed Gemini API key\s*=/.test(env)) errors.push('.env.example must not expose Gemini key as VITE_*');
if (/AI Studio automatically injects|Google AI Studio App/i.test(env)) errors.push('.env.example still contains AI Studio copy');

const prod = read('docs/PRODUCTION_READINESS_STATUS.md');
for (const needle of ['nie oznaczać jako w pełni produkcyjnie gotowe', 'Supabase-first', 'legacy/decommission', 'backend-only']) {
  if (!prod.includes(needle)) errors.push(`PRODUCTION_READINESS_STATUS.md missing: ${needle}`);
}

const canonicalFiles = [
  'README.md',
  'README-WDROZENIE.md',
  'README_WDROZENIE.md',
  '.env.example',
  'index.html',
  'public/manifest.webmanifest',
  'docs/PRODUCTION_READINESS_STATUS.md',
  'docs/STAGE_A18_BRANDING_DOCUMENTATION.md',
];
for (const rel of canonicalFiles) {
  const content = read(rel);
  if (/Google AI Studio App/i.test(content)) errors.push(`${rel} contains old brand: Google AI Studio App`);
  if (/\bCaseFlow\b/i.test(content)) errors.push(`${rel} contains old brand: CaseFlow`);
  if (/\bLeadFlow\b/.test(content)) errors.push(`${rel} contains old main brand: LeadFlow`);
}

const css = read('src/styles/visual-stage21-task-form-vnext.css');
if (!css.includes('STAGE_A18_TASK_ACTION_CONTRAST')) errors.push('task contrast CSS marker missing');
if (!/\.task-row[\s\S]*color:\s*#334155/.test(css)) errors.push('task row actions should get stronger text contrast');

if (errors.length) {
  console.error('A18 branding/docs guard failed.');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('OK: A18 branding/docs guard passed.');
