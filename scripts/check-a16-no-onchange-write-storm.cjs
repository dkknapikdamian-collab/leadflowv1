#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const failures = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function walk(dir, acc = []) {
  const fullDir = path.join(root, dir);
  if (!fs.existsSync(fullDir)) return acc;

  for (const entry of fs.readdirSync(fullDir, { withFileTypes: true })) {
    const rel = path.join(dir, entry.name).replace(/\\/g, '/');
    if (entry.isDirectory()) {
      walk(rel, acc);
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      acc.push(rel);
    }
  }

  return acc;
}

const checkedFiles = [
  'src/pages/LeadDetail.tsx',
  'src/pages/ClientDetail.tsx',
  'src/pages/CaseDetail.tsx',
  'src/pages/Settings.tsx',
  'api/leads.ts',
  'api/clients.ts',
  'api/cases.ts',
  'api/settings.ts',
  ...walk('src/components/forms'),
].filter((file, index, all) => exists(file) && all.indexOf(file) === index);

const mutationNames = [
  'insertLeadToSupabase',
  'updateLeadInSupabase',
  'deleteLeadFromSupabase',
  'createClientInSupabase',
  'updateClientInSupabase',
  'deleteClientFromSupabase',
  'createCaseInSupabase',
  'updateCaseInSupabase',
  'deleteCaseInSupabase',
  'updateProfileSettingsInSupabase',
  'updateWorkspaceSettingsInSupabase',
  'setDoc(',
  'updateDoc(',
  'addDoc(',
  'writeBatch(',
  'runTransaction(',
];

for (const file of checkedFiles) {
  const source = read(file);

  if (/from\s+['\"]firebase\/firestore['\"]/.test(source) || /firebase\/firestore/.test(source)) {
    failures.push(`${file}: Firestore write layer is not allowed in A16`);
  }

  const lines = source.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (!line.includes('onChange')) return;
    for (const mutationName of mutationNames) {
      if (line.includes(mutationName)) {
        failures.push(`${file}:${index + 1}: onChange must not call mutation ${mutationName}`);
      }
    }
  });

  const compact = source.replace(/\s+/g, ' ');
  const suspiciousOnChangeBlock = /onChange\s*=\s*\{[^}]{0,500}(update[A-Za-z0-9_]*InSupabase|insert[A-Za-z0-9_]*ToSupabase|create[A-Za-z0-9_]*InSupabase|delete[A-Za-z0-9_]*FromSupabase|updateProfileSettingsInSupabase|updateWorkspaceSettingsInSupabase|setDoc\(|updateDoc\(|addDoc\()/g;
  if (suspiciousOnChangeBlock.test(compact)) {
    failures.push(`${file}: mutation detected inside onChange block`);
  }
}

if (exists('src/pages/LeadDetail.tsx')) {
  const leadDetail = read('src/pages/LeadDetail.tsx');
  const requiredVoiceNoteMarkers = [
    'noteVoiceDirtyRef.current',
    'handleAddNote(undefined, { silent: true })',
    'setTimeout',
  ];
  for (const marker of requiredVoiceNoteMarkers) {
    if (!leadDetail.includes(marker)) {
      failures.push(`src/pages/LeadDetail.tsx: voice note autosave must stay preserved (${marker})`);
    }
  }
}

const guardBytes = fs.readFileSync(__filename);
if (guardBytes[0] === 0xef && guardBytes[1] === 0xbb && guardBytes[2] === 0xbf) {
  failures.push('scripts/check-a16-no-onchange-write-storm.cjs: file must not have BOM');
}

if (failures.length) {
  console.error('A16 no-onChange write storm guard failed.');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('OK: A16 no-onChange write storm guard passed.');
