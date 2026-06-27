const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { spawnSync } = require('node:child_process');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

test('central status config files expose required sources of truth', () => {
  assert.match(read('src/lib/config/lead-status.ts'), /LEAD_STATUS_CONFIG/);
  assert.match(read('src/lib/config/case-status.ts'), /CASE_STATUS_CONFIG/);
  assert.match(read('src/lib/config/client-status.ts'), /CLIENT_STATUS_CONFIG/);
  assert.match(read('src/lib/config/funnel-stages.ts'), /FUNNEL_OWNER_TILE_CONFIG/);
  assert.match(read('src/lib/config/badges.ts'), /OWNER_SILENCE_BADGE_LABELS/);
  assert.match(read('src/lib/config/calendar-status.ts'), /CALENDAR_EVENT_STATUS_LABELS/);
});

test('active pages import status config instead of declaring local status maps', () => {
  for (const file of [
    'src/pages/Leads.tsx',
    'src/pages/LeadDetail.tsx',
    'src/pages/Cases.tsx',
    'src/pages/ClientDetail.tsx',
    'src/pages/CaseDetail.tsx',
    'src/pages/SalesFunnel.tsx',
  ]) {
    const source = read(file);
    assert.match(source, /\.\.\/lib\/config\//, `${file} should import central config`);
    assert.doesNotMatch(source, /const\s+STATUS_OPTIONS\s*=\s*\[/, `${file} must not declare local STATUS_OPTIONS`);
    assert.doesNotMatch(source, /const\s+(?:LEAD_STATUS_LABELS|CASE_STATUS_LABELS|CASE_STATUS_HINTS|ITEM_STATUS_LABELS|TASK_STATUS_LABELS|EVENT_STATUS_LABELS)\b/, `${file} must not declare local status label maps`);
  }
});

test('guard:config:status-source-of-truth passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-config-status-source-of-truth.cjs'], {
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /"ok": true/);
});
