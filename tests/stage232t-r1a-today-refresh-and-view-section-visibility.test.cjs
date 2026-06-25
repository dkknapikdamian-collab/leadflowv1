const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = process.cwd();
const today = fs.readFileSync(path.join(root, 'src/pages/TodayStable.tsx'), 'utf8');
const card = fs.readFileSync(path.join(root, 'src/components/ui/card.tsx'), 'utf8');

test('Today manual refresh uses force/manual reason and visible loading state', () => {
  assert.match(today, /manualRefreshing/);
  assert.match(today, /refreshData\(\{\s*manual:\s*true,\s*force:\s*true,\s*reason:\s*'manual'\s*\}\)/);
  assert.ok(today.includes('Odświeżanie...') || today.includes('Odswiezanie...'));
});

test('Today view customizer still filters metric tiles from the same section source', () => {
  assert.match(today, /const visibleTodayTiles = todayTiles\.filter/);
  assert.match(today, /visibleTodaySectionSet\.has\(tile\.key\)/);
  assert.match(today, /writeTodayVisibleSections\(next\)/);
});

test('Shared Card bridge hides complete Today section cards when their section is disabled', () => {
  assert.match(card, /STAGE232T_R1A_TODAY_VIEW_SECTION_CARD_VISIBILITY/);
  assert.match(card, /closeflow:today:view-sections:v1/);
  assert.match(card, /data-p0-today-stable-rebuild="true"/);
  assert.match(card, /button\[aria-expanded\] h2/);
  assert.match(card, /node\.style\.display\s*=\s*visible \? "" : "none"/);
  assert.match(card, /stage232tR1aTodayViewVisibility/);
});

test('Bridge is bounded to Today and does not touch finance, SQL or calendar runtime files', () => {
  assert.doesNotMatch(card, /commission|finance|ALTER TABLE|CREATE POLICY/i);
  assert.match(card, /closest\('\[data-p0-today-stable-rebuild="true"\]'\)/);
});
