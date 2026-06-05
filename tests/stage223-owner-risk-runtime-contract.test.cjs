const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const { buildSync } = require('esbuild');

const root = path.resolve(__dirname, '..');

function loadTs(entry) {
  const result = buildSync({
    entryPoints: [path.join(root, entry)],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    write: false,
    logLevel: 'silent',
  });
  const code = result.outputFiles[0].text;
  const mod = new Module(entry, module);
  mod.filename = path.join(root, entry);
  mod.paths = Module._nodeModulePaths(path.dirname(mod.filename));
  mod._compile(code, mod.filename);
  return mod.exports;
}

test('Stage223 next move contract classifies missing, overdue, today, planned and closed', () => {
  const { buildNextMoveContract } = loadTs('src/lib/owner-control/next-move-contract.ts');
  const now = new Date('2026-06-05T12:00:00.000Z');

  assert.equal(buildNextMoveContract({ entityType: 'lead', entityId: 'l1', nearestAction: null, now }).status, 'missing');
  assert.equal(buildNextMoveContract({ entityType: 'case', entityId: 'c1', nearestAction: null, now }).label, 'Brak następnego ruchu');
  assert.equal(buildNextMoveContract({ entityType: 'lead', entityId: 'l1', nearestAction: { when: '2026-06-03T10:00:00.000Z', title: 'Call', type: 'task' }, now }).status, 'overdue');
  assert.equal(buildNextMoveContract({ entityType: 'lead', entityId: 'l1', nearestAction: { when: '2026-06-05T18:00:00.000Z', title: 'Call', type: 'task' }, now }).status, 'today');
  assert.equal(buildNextMoveContract({ entityType: 'lead', entityId: 'l1', nearestAction: { when: '2026-06-08T10:00:00.000Z', title: 'Call', type: 'event' }, now }).status, 'planned');
  assert.equal(buildNextMoveContract({ entityType: 'lead', entityId: 'l1', status: 'lost', nearestAction: null, now }).status, 'closed');
});

test('Stage223 activity truth separates real contact silence from updatedAt fallback activity', () => {
  const { buildActivityTruth } = loadTs('src/lib/owner-control/activity-truth.ts');
  const now = new Date('2026-06-05T12:00:00.000Z');

  const withContact = buildActivityTruth({
    entityType: 'lead',
    entityId: 'l1',
    record: { id: 'l1', updatedAt: '2026-06-04T12:00:00.000Z' },
    activities: [{ type: 'phone', createdAt: '2026-05-28T12:00:00.000Z' }],
    now,
  });

  assert.equal(withContact.lastContactSource, 'activity');
  assert.equal(withContact.contactSilentDays, 8);
  assert.equal(withContact.lastActivityIsFallback, false);

  const fallbackOnly = buildActivityTruth({
    entityType: 'lead',
    entityId: 'l2',
    record: { id: 'l2', updatedAt: '2026-05-28T12:00:00.000Z' },
    now,
  });

  assert.equal(fallbackOnly.lastContactAt, null);
  assert.equal(fallbackOnly.contactSilentDays, null);
  assert.equal(fallbackOnly.activitySilentDays, 8);
  assert.equal(fallbackOnly.lastActivityIsFallback, true);
});

test('Stage223 owner risk runtime returns real contact silence, fallback activity silence, missing move and money risk', () => {
  const { getLeadOwnerRiskBadges, getCaseOwnerRiskBadges, getMoneyOwnerRiskBadges } = loadTs('src/lib/owner-control/owner-risk-rules.ts');
  const { buildActivityTruth } = loadTs('src/lib/owner-control/activity-truth.ts');
  const { buildNextMoveContract } = loadTs('src/lib/owner-control/next-move-contract.ts');
  const now = new Date('2026-06-05T12:00:00.000Z');
  const settings = { highValueThresholdPln: 5000 };

  const leadContactTruth = buildActivityTruth({
    entityType: 'lead',
    entityId: 'l1',
    record: { id: 'l1', dealValue: 7800 },
    activities: [{ type: 'phone', createdAt: '2026-05-28T12:00:00.000Z' }],
    now,
  });
  const leadBadges = getLeadOwnerRiskBadges(
    { id: 'l1', dealValue: 7800 },
    {
      settings,
      activityTruth: leadContactTruth,
      nextMove: buildNextMoveContract({ entityType: 'lead', entityId: 'l1', nearestAction: null, now }),
      now,
    },
  );
  assert.ok(leadBadges.some((badge) => badge.label === 'Cisza 7+ dni'));
  assert.ok(leadBadges.some((badge) => badge.label === 'Brak następnej akcji'));
  assert.ok(leadBadges.some((badge) => badge.label === 'Wysoka wartość'));

  const fallbackTruth = buildActivityTruth({
    entityType: 'lead',
    entityId: 'l2',
    record: { id: 'l2', updatedAt: '2026-05-21T12:00:00.000Z' },
    now,
  });
  const fallbackBadges = getLeadOwnerRiskBadges(
    { id: 'l2' },
    { settings, activityTruth: fallbackTruth, nextMove: buildNextMoveContract({ entityType: 'lead', entityId: 'l2', nearestAction: { when: '2026-06-08T12:00:00.000Z', title: 'Follow-up', type: 'task' }, now }), now },
  );
  assert.ok(fallbackBadges.some((badge) => badge.label === 'Brak świeżego ruchu 14+ dni'));
  assert.equal(fallbackBadges.some((badge) => badge.label === 'Cisza 14+ dni'), false);

  const caseBadges = getCaseOwnerRiskBadges(
    { id: 'c1', contractValue: 10000 },
    {
      settings,
      activityTruth: buildActivityTruth({ entityType: 'case', entityId: 'c1', record: { id: 'c1', updatedAt: '2026-05-20T12:00:00.000Z' }, now }),
      nextMove: buildNextMoveContract({ entityType: 'case', entityId: 'c1', nearestAction: null, now }),
      now,
    },
  );
  assert.ok(caseBadges.some((badge) => badge.label === 'Brak następnego ruchu'));
  assert.ok(caseBadges.some((badge) => badge.label === 'Sprawa bez ruchu 14+ dni'));
  assert.ok(caseBadges.some((badge) => badge.label === 'Pieniądze bez ruchu'));

  const moneyBadges = getMoneyOwnerRiskBadges(
    { id: 'm1', amount: 12000 },
    { settings, nextMove: buildNextMoveContract({ entityType: 'case', entityId: 'm1', nearestAction: null, now }), now },
  );
  assert.ok(moneyBadges.some((badge) => badge.label === 'Pieniądze bez ruchu'));
});
