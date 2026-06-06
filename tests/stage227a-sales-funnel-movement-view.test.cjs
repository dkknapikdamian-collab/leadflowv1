const assert = require('node:assert/strict');
const { describe, it } = require('node:test');
const path = require('node:path');
const esbuild = require('esbuild');

async function loadHelper() {
  const entry = path.join(process.cwd(), 'src/lib/owner-control/sales-funnel-movement.ts');
  const result = await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    write: false,
    logLevel: 'silent',
  });
  const code = result.outputFiles[0].text;
  const module = { exports: {} };
  const fn = new Function('module', 'exports', 'require', code);
  fn(module, module.exports, require);
  return module.exports;
}

function daysAgoIso(now, days) {
  return new Date(now.getTime() - days * 86400000).toISOString();
}

function daysFromIso(now, days) {
  return new Date(now.getTime() + days * 86400000).toISOString();
}

function allCards(view) {
  return view.columns.flatMap((column) => column.cards);
}

function cardById(view, id) {
  return allCards(view).find((card) => card.id === id);
}

describe('STAGE227A sales funnel movement view runtime behavior', () => {
  it('marks a lead without next move as no-next-move risk', async () => {
    const { buildSalesFunnelMovementView } = await loadHelper();
    const now = new Date('2026-06-06T12:00:00.000Z');
    const view = buildSalesFunnelMovementView({
      now,
      leads: [{ id: 'lead-no-next', name: 'Lead no next', status: 'new', lastContactAt: daysAgoIso(now, 3), dealValue: 1000 }],
      cases: [], clients: [], tasks: [], events: [], payments: [],
    });
    const card = cardById(view, 'lead:lead-no-next');
    assert.ok(card);
    assert.equal(card.hasNextMove, false);
    assert.ok(card.riskReasons.some((reason) => reason.includes('brak następnego kroku')));
  });

  it('marks a lead with tomorrow event as having a next move', async () => {
    const { buildSalesFunnelMovementView } = await loadHelper();
    const now = new Date('2026-06-06T12:00:00.000Z');
    const view = buildSalesFunnelMovementView({
      now,
      leads: [{ id: 'lead-planned', name: 'Lead planned', status: 'contacted', lastContactAt: daysAgoIso(now, 1) }],
      cases: [], clients: [], tasks: [],
      events: [{ id: 'event-1', title: 'Spotkanie jutro', type: 'meeting', startAt: daysFromIso(now, 1), leadId: 'lead-planned' }],
      payments: [],
    });
    const card = cardById(view, 'lead:lead-planned');
    assert.ok(card);
    assert.equal(card.hasNextMove, true);
    assert.equal(card.nextMoveTitle, 'Spotkanie jutro');
  });

  it('classifies 14+ day silence as high or critical risk', async () => {
    const { buildSalesFunnelMovementView } = await loadHelper();
    const now = new Date('2026-06-06T12:00:00.000Z');
    const view = buildSalesFunnelMovementView({
      now,
      leads: [{ id: 'lead-silent', name: 'Lead silent', status: 'new', lastContactAt: daysAgoIso(now, 15), dealValue: 1000 }],
      cases: [], clients: [], tasks: [], events: [], payments: [],
    });
    const card = cardById(view, 'lead:lead-silent');
    assert.ok(card);
    assert.ok(card.riskLevel === 'high' || card.riskLevel === 'critical');
    assert.ok(card.riskReasons.some((reason) => reason.includes('14+')));
  });

  it('keeps lead and case cards as different entity types', async () => {
    const { buildSalesFunnelMovementView } = await loadHelper();
    const now = new Date('2026-06-06T12:00:00.000Z');
    const view = buildSalesFunnelMovementView({
      now,
      leads: [{ id: 'lead-1', name: 'Lead one', status: 'new', lastContactAt: daysAgoIso(now, 1) }],
      cases: [{ id: 'case-1', title: 'Case one', status: 'in_progress', commissionMode: 'fixed', commissionAmount: 500 }],
      clients: [], tasks: [], events: [], payments: [],
    });
    assert.equal(cardById(view, 'lead:lead-1').entityType, 'lead');
    assert.equal(cardById(view, 'case:case-1').entityType, 'case');
  });

  it('case card links to /cases/:id', async () => {
    const { buildSalesFunnelMovementView } = await loadHelper();
    const view = buildSalesFunnelMovementView({
      now: new Date('2026-06-06T12:00:00.000Z'),
      leads: [],
      cases: [{ id: 'case-href', title: 'Case href', status: 'in_progress' }],
      clients: [], tasks: [], events: [], payments: [],
    });
    assert.equal(cardById(view, 'case:case-href').href, '/cases/case-href');
  });

  it('lead card links to /leads/:id', async () => {
    const { buildSalesFunnelMovementView } = await loadHelper();
    const view = buildSalesFunnelMovementView({
      now: new Date('2026-06-06T12:00:00.000Z'),
      leads: [{ id: 'lead-href', name: 'Lead href', status: 'new' }],
      cases: [], clients: [], tasks: [], events: [], payments: [],
    });
    assert.equal(cardById(view, 'lead:lead-href').href, '/leads/lead-href');
  });

  it('case value/prowizja uses finance helper commission amount, not full contract value', async () => {
    const { buildSalesFunnelMovementView } = await loadHelper();
    const view = buildSalesFunnelMovementView({
      now: new Date('2026-06-06T12:00:00.000Z'),
      leads: [],
      cases: [{ id: 'case-money', title: 'Case money', status: 'in_progress', contractValue: 100000, commissionMode: 'fixed', commissionAmount: 1380, currency: 'PLN' }],
      clients: [], tasks: [], events: [], payments: [],
    });
    const card = cardById(view, 'case:case-money');
    assert.equal(card.valueAmount, 1380);
    assert.notEqual(card.valueAmount, 100000);
  });

  it('does not use updatedAt as last contact truth', async () => {
    const { buildSalesFunnelMovementView } = await loadHelper();
    const now = new Date('2026-06-06T12:00:00.000Z');
    const view = buildSalesFunnelMovementView({
      now,
      leads: [{ id: 'lead-updated-only', name: 'Updated only', status: 'new', updatedAt: now.toISOString() }],
      cases: [], clients: [], tasks: [], events: [], payments: [],
    });
    const card = cardById(view, 'lead:lead-updated-only');
    assert.equal(card.lastContactAt, null);
    assert.equal(card.silenceDays, null);
  });

  it('sorts critical before high before medium before low inside one column', async () => {
    const { buildSalesFunnelMovementView } = await loadHelper();
    const now = new Date('2026-06-06T12:00:00.000Z');
    const view = buildSalesFunnelMovementView({
      now,
      leads: [
        { id: 'lead-low', name: 'Low', status: 'new', lastContactAt: daysAgoIso(now, 0) },
        { id: 'lead-medium', name: 'Medium', status: 'new' },
        { id: 'lead-high', name: 'High', status: 'new', lastContactAt: daysAgoIso(now, 8) },
        { id: 'lead-critical', name: 'Critical', status: 'new', lastContactAt: daysAgoIso(now, 20) },
      ],
      cases: [], clients: [], tasks: [],
      events: [{ id: 'event-low', title: 'Next move', startAt: daysFromIso(now, 1), type: 'meeting', leadId: 'lead-low' }],
      payments: [],
    });
    const ids = view.columns.find((column) => column.key === 'new').cards.map((card) => card.id);
    assert.deepEqual(ids, ['lead:lead-critical', 'lead:lead-high', 'lead:lead-medium', 'lead:lead-low']);
    assert.deepEqual(view.columns.find((column) => column.key === 'new').cards.map((card) => card.riskLevel), ['critical', 'high', 'medium', 'low']);
  });
});
