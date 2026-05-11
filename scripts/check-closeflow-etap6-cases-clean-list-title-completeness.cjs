#!/usr/bin/env node
/* CLOSEFLOW_ETAP6_CASES_CLEAN_LIST_TITLE_COMPLETENESS_GUARD */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const fail = (message) => {
  console.error('✖ ' + message);
  process.exit(1);
};

const cases = read('src/pages/Cases.tsx');

[
  'function cleanCaseListTitle(value: unknown): string',
  "cleanCaseListTitle(record.title || record.clientName || 'Sprawa bez nazwy')",
  "title: prev.title.trim() ? cleanCaseListTitle(prev.title) : String(client?.name || client?.company || 'Sprawa bez nazwy'),",
  "title: prev.title.trim() ? cleanCaseListTitle(prev.title) : option.name || 'Sprawa bez nazwy',",
  'lifecycle.missingRequiredCount > 0 ? `brakuje ${lifecycle.missingRequiredCount} elementów` : null,',
].forEach((needle) => {
  if (!cases.includes(needle)) fail('Cases.tsx missing ETAP6 contract: ' + needle);
});

[
  "`${String(client?.name || client?.company || 'Klient')} - obsługa`",
  "`${option.name} - obsługa`",
  "`${percent}% kompletności`",
  'obs┼éuga',
  'obsĹ‚uga',
].forEach((forbidden) => {
  if (cases.includes(forbidden)) fail('Cases.tsx still contains forbidden ETAP6 fragment: ' + forbidden);
});

if (!cases.includes('completenessPercent?: number;')) {
  fail('completenessPercent was removed from model, which is forbidden');
}

console.log('✔ CLOSEFLOW_ETAP6_CASES_CLEAN_LIST_TITLE_COMPLETENESS guard passed');
