const test = require('node:test');
const assert = require('node:assert/strict');
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

test('Stage223 final next move contract is the one runtime source for movement state', () => {
  const { buildNextMoveContract } = loadTs('src/lib/owner-control/next-move-contract.ts');
  const now = new Date('2026-06-05T12:00:00.000Z');

  const missingLead = buildNextMoveContract({
    entityType: 'lead',
    entityId: 'lead-missing',
    nearestAction: null,
    now,
  });
  assert.equal(missingLead.status, 'missing');
  assert.equal(missingLead.label, 'Brak następnej akcji');
  assert.equal(missingLead.isMissing, true);

  const missingCase = buildNextMoveContract({
    entityType: 'case',
    entityId: 'case-missing',
    nearestAction: null,
    now,
  });
  assert.equal(missingCase.status, 'missing');
  assert.equal(missingCase.label, 'Brak następnego ruchu');

  assert.equal(buildNextMoveContract({
    entityType: 'lead',
    entityId: 'lead-overdue',
    nearestAction: { when: '2026-06-04T09:00:00.000Z', title: 'Oddzwonić', type: 'task' },
    now,
  }).status, 'overdue');

  assert.equal(buildNextMoveContract({
    entityType: 'lead',
    entityId: 'lead-today',
    nearestAction: { when: '2026-06-05T18:00:00.000Z', title: 'Spotkanie', type: 'event' },
    now,
  }).status, 'today');

  assert.equal(buildNextMoveContract({
    entityType: 'lead',
    entityId: 'lead-planned',
    nearestAction: { when: '2026-06-08T10:00:00.000Z', title: 'Follow-up', type: 'task' },
    now,
  }).status, 'planned');

  assert.equal(buildNextMoveContract({
    entityType: 'case',
    entityId: 'case-closed',
    status: 'closed',
    nearestAction: null,
    now,
  }).status, 'closed');
});

test('Stage223 final activity truth separates real contact silence from fallback activity silence', () => {
  const { buildActivityTruth } = loadTs('src/lib/owner-control/activity-truth.ts');
  const now = new Date('2026-06-05T12:00:00.000Z');

  const contactTruth = buildActivityTruth({
    entityType: 'lead',
    entityId: 'lead-contact',
    record: { id: 'lead-contact', updatedAt: '2026-06-04T12:00:00.000Z' },
    activities: [{ type: 'phone', createdAt: '2026-05-28T12:00:00.000Z' }],
    now,
  });

  assert.equal(contactTruth.lastContactSource, 'activity');
  assert.equal(contactTruth.contactSilentDays, 8);
  assert.equal(contactTruth.activitySilentDays, 8);
  assert.equal(contactTruth.lastActivityIsFallback, false);

  const fallbackTruth = buildActivityTruth({
    entityType: 'lead',
    entityId: 'lead-fallback',
    record: { id: 'lead-fallback', updatedAt: '2026-05-21T12:00:00.000Z' },
    now,
  });

  assert.equal(fallbackTruth.lastContactAt, null);
  assert.equal(fallbackTruth.contactSilentDays, null);
  assert.equal(fallbackTruth.activitySilentDays, 15);
  assert.equal(fallbackTruth.lastActivityIsFallback, true);
});

test('Stage223 final owner risk uses nextMove and activityTruth instead of local badge logic', () => {
  const {
    getLeadOwnerRiskBadges,
    getCaseOwnerRiskBadges,
    getMoneyOwnerRiskBadges,
    normalizeOwnerRiskSettings,
  } = loadTs('src/lib/owner-control/owner-risk-rules.ts');
  const { buildActivityTruth } = loadTs('src/lib/owner-control/activity-truth.ts');
  const { buildNextMoveContract } = loadTs('src/lib/owner-control/next-move-contract.ts');

  const now = new Date('2026-06-05T12:00:00.000Z');
  const highThreshold = normalizeOwnerRiskSettings({ highValueThresholdPln: 5000 });
  const lowThreshold = normalizeOwnerRiskSettings({ highValueThresholdPln: 3000 });

  const leadContactTruth = buildActivityTruth({
    entityType: 'lead',
    entityId: 'lead-a',
    record: { id: 'lead-a', dealValue: 4000 },
    activities: [{ type: 'email', createdAt: '2026-05-28T12:00:00.000Z' }],
    now,
  });

  const leadNextMove = buildNextMoveContract({
    entityType: 'lead',
    entityId: 'lead-a',
    nearestAction: null,
    now,
  });

  const leadBelowThreshold = getLeadOwnerRiskBadges(
    { id: 'lead-a', dealValue: 4000 },
    { settings: highThreshold, activityTruth: leadContactTruth, nextMove: leadNextMove, now },
  );
  assert.equal(leadBelowThreshold.some((badge) => badge.label === 'Wysoka wartość'), false);
  assert.ok(leadBelowThreshold.some((badge) => badge.label === 'Cisza 7+ dni'));
  assert.ok(leadBelowThreshold.some((badge) => badge.label === 'Brak następnej akcji'));

  const leadAboveThreshold = getLeadOwnerRiskBadges(
    { id: 'lead-a', dealValue: 4000 },
    { settings: lowThreshold, activityTruth: leadContactTruth, nextMove: leadNextMove, now },
  );
  assert.ok(leadAboveThreshold.some((badge) => badge.label === 'Wysoka wartość'));

  const fallbackTruth = buildActivityTruth({
    entityType: 'lead',
    entityId: 'lead-fallback',
    record: { id: 'lead-fallback', updatedAt: '2026-05-21T12:00:00.000Z' },
    now,
  });

  const fallbackLeadBadges = getLeadOwnerRiskBadges(
    { id: 'lead-fallback' },
    {
      settings: highThreshold,
      activityTruth: fallbackTruth,
      nextMove: buildNextMoveContract({
        entityType: 'lead',
        entityId: 'lead-fallback',
        nearestAction: { when: '2026-06-08T12:00:00.000Z', title: 'Follow-up', type: 'task' },
        now,
      }),
      now,
    },
  );
  assert.ok(fallbackLeadBadges.some((badge) => badge.label === 'Brak świeżego ruchu 14+ dni'));
  assert.equal(fallbackLeadBadges.some((badge) => badge.label === 'Cisza 14+ dni'), false);

  const caseBadges = getCaseOwnerRiskBadges(
    { id: 'case-a', contractValue: 12000 },
    {
      settings: highThreshold,
      activityTruth: buildActivityTruth({
        entityType: 'case',
        entityId: 'case-a',
        record: { id: 'case-a', updatedAt: '2026-05-20T12:00:00.000Z' },
        now,
      }),
      nextMove: buildNextMoveContract({
        entityType: 'case',
        entityId: 'case-a',
        nearestAction: null,
        now,
      }),
      now,
    },
  );

  assert.ok(caseBadges.some((badge) => badge.label === 'Brak następnego ruchu'));
  assert.ok(caseBadges.some((badge) => badge.label === 'Sprawa bez ruchu 14+ dni'));
  assert.ok(caseBadges.some((badge) => badge.label === 'Pieniądze bez ruchu'));

  const moneyBadges = getMoneyOwnerRiskBadges(
    { id: 'money-a', amount: 12000 },
    {
      settings: highThreshold,
      nextMove: buildNextMoveContract({
        entityType: 'case',
        entityId: 'money-a',
        nearestAction: null,
        now,
      }),
      now,
    },
  );

  assert.ok(moneyBadges.some((badge) => badge.label === 'Pieniądze bez ruchu'));
});
