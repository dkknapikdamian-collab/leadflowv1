#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const leadsPath = path.join(root, 'src', 'pages', 'Leads.tsx');
if (!fs.existsSync(leadsPath)) {
  throw new Error('Missing src/pages/Leads.tsx');
}

const original = fs.readFileSync(leadsPath, 'utf8');
const eol = original.includes('\r\n') ? '\r\n' : '\n';
let lines = original.split(/\r?\n/);

const metaNeedle = 'buildLeadCompactMeta(lead, linkedCase, sourceLabel, leadValueLabel)';
const declNeedle = 'const leadValueLabel =';

if (!original.includes(metaNeedle)) {
  throw new Error('Missing Stage31 lead value meta call: ' + metaNeedle);
}

const toRemove = new Set();
for (let i = 0; i < lines.length; i += 1) {
  if (!lines[i].includes(metaNeedle)) continue;

  const start = Math.max(0, i - 80);
  const declIndexes = [];
  for (let j = start; j < i; j += 1) {
    if (lines[j].includes(declNeedle)) declIndexes.push(j);
  }

  if (declIndexes.length > 1) {
    // Keep the declaration closest to the meta call. Earlier duplicates in the same local block break esbuild.
    for (const duplicateIndex of declIndexes.slice(0, -1)) {
      toRemove.add(duplicateIndex);
    }
  }
}

if (toRemove.size > 0) {
  lines = lines.filter((_, index) => !toRemove.has(index));
}

let next = lines.join(eol);

// Safety pass for accidental adjacent duplicate declarations left by prior repair scripts.
next = next.replace(
  /(\n\s*const leadValueLabel = [^\n;]+;)(\n\s*const leadValueLabel = [^\n;]+;)/g,
  '$2',
);

if (!next.includes(metaNeedle)) {
  throw new Error('Repair removed required Stage31 meta call');
}

const aroundMeta = next.slice(Math.max(0, next.indexOf(metaNeedle) - 2500), next.indexOf(metaNeedle));
const localDeclCount = (aroundMeta.match(/const leadValueLabel =/g) || []).length;
if (localDeclCount !== 1) {
  throw new Error('Expected exactly one local leadValueLabel declaration before Stage31 meta call, got ' + localDeclCount);
}

if (next !== original) {
  fs.writeFileSync(leadsPath, next, 'utf8');
}

console.log('CLOSEFLOW_VS7_REPAIR10_STAGE31_DEDUPE_LEAD_VALUE_LABEL_PATCHED');
console.log('removed_duplicate_leadValueLabel_declarations=' + toRemove.size);
