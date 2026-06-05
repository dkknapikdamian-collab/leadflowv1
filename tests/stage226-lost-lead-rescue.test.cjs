const assert = require('node:assert/strict');
const { describe, it } = require('node:test');
const path = require('node:path');
const esbuild = require('esbuild');

async function loadHelper() {
  const entry = path.join(process.cwd(), 'src/lib/owner-control/lost-lead-rescue.ts');
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

describe('STAGE226 lost lead rescue', () => {
  it('classifies rescue rows using contact cadence truth, next move and value', async () => {
    const { buildLostLeadRescue } = await loadHelper();
    const now = new Date('2026-06-05T12:00:00.000Z');
    const related = new Map();
    related.set('silent-with-next', [{ id: 'task-1', leadId: 'silent-with-next', dueAt: '2026-06-07T12:00:00.000Z', status: 'todo', title: 'Zadzwonić' }]);
    related.set('fresh-with-next', [{ id: 'task-2', leadId: 'fresh-with-next', dueAt: '2026-06-06T12:00:00.000Z', status: 'todo', title: 'Napisać' }]);

    const summary = buildLostLeadRescue({
      now,
      relatedRecordsById: related,
      leads: [
        { id: 'lost', name: 'Lost', lastContactAt: daysAgoIso(now, 20), dealValue: 1200 },
        { id: 'silent-with-next', name: 'Silent with next', lastContactAt: daysAgoIso(now, 20), dealValue: 1200 },
        { id: 'seven-no-next', name: 'Seven no next', lastContactAt: daysAgoIso(now, 8), dealValue: 1200 },
        { id: 'fresh-with-next', name: 'Fresh with next', lastContactAt: daysAgoIso(now, 0), dealValue: 100 },
        { id: 'missing-date', name: 'Missing date', dealValue: 300 },
        { id: 'high-value', name: 'High value', lastContactAt: daysAgoIso(now, 1), dealValue: 18000 },
      ],
    });

    const byId = new Map(summary.rows.map((row) => [row.leadId, row]));

    assert.equal(byId.get('lost').severity, 'critical');
    assert.equal(byId.get('lost').reasonKey, 'silent_14_plus');
    assert.equal(byId.get('silent-with-next').severity, 'high');
    assert.equal(byId.get('silent-with-next').reasonKey, 'silent_14_plus');
    assert.equal(byId.get('seven-no-next').severity, 'high');
    assert.equal(byId.get('seven-no-next').reasonKey, 'silent_7_plus_no_next_move');
    assert.equal(byId.has('fresh-with-next'), false);
    assert.equal(byId.get('missing-date').severity, 'medium');
    assert.equal(byId.get('missing-date').reasonKey, 'missing_contact_date');
    assert.equal(byId.get('high-value').severity, 'critical');
    assert.equal(byId.get('high-value').reasonKey, 'high_value_no_next_move');
    assert.equal(summary.total, 5);
    assert.equal(summary.critical, 2);
    assert.equal(summary.high, 2);
    assert.equal(summary.medium, 1);
  });

  it('does not treat a missing contact date as fake 14+ day silence', async () => {
    const { buildLostLeadRescue } = await loadHelper();
    const summary = buildLostLeadRescue({
      now: new Date('2026-06-05T12:00:00.000Z'),
      leads: [{ id: 'unknown', name: 'Unknown contact date' }],
    });

    assert.equal(summary.rows[0].reasonKey, 'missing_contact_date');
    assert.equal(summary.rows[0].contactSilentDays, null);
    assert.equal(summary.rows[0].severity, 'medium');
  });
});
