#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const todayPath = path.join(root, 'src/pages/TodayStable.tsx');
const cardPath = path.join(root, 'src/components/ui/card.tsx');
const today = fs.readFileSync(todayPath, 'utf8');
const card = fs.readFileSync(cardPath, 'utf8');

const checks = [];
function pass(name, ok) {
  checks.push({ name, ok: Boolean(ok) });
}

pass('Today has manualRefreshing state', /manualRefreshing/.test(today) && /setManualRefreshing/.test(today));
pass('Today refresh button uses force manual refresh', /refreshData\(\{\s*manual:\s*true,\s*force:\s*true,\s*reason:\s*'manual'\s*\}\)/.test(today));
pass('Today refresh button shows loading copy', today.includes('Odświeżanie...') || today.includes('Odswiezanie...'));
pass('Today view customizer persists visible sections', today.includes('writeTodayVisibleSections(next)'));
pass('Today tiles are filtered by visible section set', today.includes('visibleTodayTiles = todayTiles.filter'));
pass('Stage marker exists in Card visibility bridge', card.includes('STAGE232T_R1A_TODAY_VIEW_SECTION_CARD_VISIBILITY'));
pass('Card bridge reads Today view storage key', card.includes('closeflow:today:view-sections:v1'));
pass('Card bridge is gated to Today route root only', card.includes('data-p0-today-stable-rebuild="true"'));
pass('Card bridge maps section header title to section key', card.includes('getTodayCardSectionKeyStage232TR1A'));
pass('Card bridge changes whole card display, not just tile', /node\.style\.display\s*=\s*visible/.test(card));
pass('Card bridge exposes diagnostic dataset marker', card.includes('stage232tR1aTodayViewVisibility'));
pass('No SQL or migration scope touched by this guard', !today.includes('ALTER TABLE') && !card.includes('ALTER TABLE'));

let failed = false;
for (const check of checks) {
  if (check.ok) {
    console.log('PASS:', check.name);
  } else {
    failed = true;
    console.error('FAIL:', check.name);
  }
}

if (failed) {
  process.exit(1);
}

console.log('STAGE232T_R1A Today refresh/view visibility guard passed.');
