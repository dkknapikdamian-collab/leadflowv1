const assert = require('node:assert/strict');
const { describe, it } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');

async function loadTsModule(relativePath) {
  const entry = path.join(process.cwd(), relativePath);
  const result = await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    write: false,
    logLevel: 'silent',
  });
  const module = { exports: {} };
  const fn = new Function('module', 'exports', 'require', result.outputFiles[0].text);
  fn(module, module.exports, require);
  return module.exports;
}

function readSource(relativePath) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8');
}

describe('STAGE228A sales funnel truth and clickability', () => {
  it('case commission money is represented by a visible money-source card', async () => {
    const { buildSalesFunnelMovementView } = await loadTsModule('src/lib/owner-control/sales-funnel-movement.ts');
    const view = buildSalesFunnelMovementView({
      now: new Date('2026-06-06T12:00:00.000Z'),
      leads: [],
      clients: [{ id: 'client-1', name: 'Paweł Gadziła' }],
      cases: [{
        id: 'case-1',
        title: 'Sprzedaż działki',
        clientId: 'client-1',
        status: 'new',
        contractValue: 69000,
        commissionMode: 'fixed',
        commissionAmount: 1380,
        currency: 'PLN',
      }],
      tasks: [],
      events: [{ id: 'event-1', caseId: 'case-1', title: 'Spotkanie o prowizje', startAt: '2026-06-08T12:41:00.000Z', status: 'scheduled' }],
      payments: [],
    });

    const cards = view.columns.flatMap((column) => column.cards);
    const moneyCards = cards.filter((item) => item.valueAmount > 0);
    assert.equal(view.summary.totalValueAmount, 1380);
    assert.equal(moneyCards.length, 1);
    assert.equal(moneyCards[0].entityType, 'case');
    assert.equal(moneyCards[0].title, 'Sprzedaż działki');
    assert.equal(moneyCards[0].subtitle, 'Paweł Gadziła');
    assert.equal(moneyCards[0].valueAmount, 1380);
    assert.equal(moneyCards[0].valueSourceLabel, 'Prowizja sprawy');
    assert.equal(moneyCards[0].href, '/cases/case-1');
  });

  it('owner filter clicks clear stage filter so money cards are not hidden by an old stage filter', () => {
    const page = readSource('src/pages/SalesFunnel.tsx');
    assert.match(page, /export function resolveFunnelFilterAfterOwnerClick/);
    assert.match(page, /return \{ ownerFilter, stageFilter: 'all' \}/);
    assert.match(page, /const next = resolveFunnelFilterAfterOwnerClick\(nextOwnerFilter\)/);
    assert.match(page, /onClick=\{\(\) => applyOwnerFilter\('money'\)\}/);
  });

  it('stage filter clicks clear owner filter so stage cards are not hidden by move_now', () => {
    const page = readSource('src/pages/SalesFunnel.tsx');
    assert.match(page, /export function resolveFunnelFilterAfterStageClick/);
    assert.match(page, /return \{ ownerFilter: 'all', stageFilter \}/);
    assert.match(page, /const next = resolveFunnelFilterAfterStageClick\(nextStageFilter\)/);
    assert.match(page, /onClick=\{\(\) => applyStageFilter\(stage\.key\)\}/);
  });

  it('money filter has source labels and explicit visible-record copy', () => {
    const page = readSource('src/pages/SalesFunnel.tsx');
    const config = readSource('src/lib/config/funnel-stages.ts');
    assert.match(page, /export function getCardsForOwnerFilter/);
    assert.match(page, /if \(filter === 'money'\) return cards\.filter\(\(card\) => \(card\.valueAmount \|\| 0\) > 0\)/);
    assert.match(page, /export function getMoneyTotalForCards/);
    assert.match(page, /data-stage228a-money-source-card/);
    assert.match(page, /label=\{card\.valueSourceLabel \|\| 'Wartość\/prowizja'\}/);
    assert.match(config, /Kliknij — pokaż rekordy, z których liczona jest kwota\./);
    assert.match(page, /Pokazuję \{filteredCards\.length\} z \{allCards\.length\} rekordów/);
  });
});
