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

describe('STAGE226R7 lost lead rescue runtime behavior', () => {
  it('classifies 14+ day silence without next move as critical', async () => {
    const { buildLostLeadRescue } = await loadHelper();
    const now = new Date('2026-06-05T12:00:00.000Z');
    const summary = buildLostLeadRescue({
      now,
      leads: [
        { id: 'silent-14', name: 'Silent 14', lastContactAt: daysAgoIso(now, 15), dealValue: 1000, status: 'new' },
      ],
      relatedRecordsById: new Map(),
    });

    assert.equal(summary.total, 1);
    assert.equal(summary.rows[0].leadId, 'silent-14');
    assert.equal(summary.rows[0].severity, 'critical');
    assert.equal(summary.rows[0].reasonKey, 'silent_14_plus');
  });

  it('classifies high value without next move as rescue candidate', async () => {
    const { buildLostLeadRescue } = await loadHelper();
    const now = new Date('2026-06-05T12:00:00.000Z');
    const summary = buildLostLeadRescue({
      now,
      leads: [
        { id: 'high-value', name: 'High value', lastContactAt: daysAgoIso(now, 0), dealValue: 12000, status: 'new' },
      ],
      relatedRecordsById: new Map(),
    });

    assert.equal(summary.total, 1);
    assert.equal(summary.rows[0].leadId, 'high-value');
    assert.equal(summary.rows[0].severity, 'critical');
    assert.equal(summary.rows[0].reasonKey, 'high_value_no_next_move');
  });

  it('classifies missing contact date as medium without pretending 14+ day silence', async () => {
    const { buildLostLeadRescue } = await loadHelper();
    const now = new Date('2026-06-05T12:00:00.000Z');
    const summary = buildLostLeadRescue({
      now,
      leads: [
        { id: 'missing-date', name: 'Missing date', dealValue: 1000, status: 'new' },
      ],
      relatedRecordsById: new Map(),
    });

    assert.equal(summary.total, 1);
    assert.equal(summary.rows[0].leadId, 'missing-date');
    assert.equal(summary.rows[0].severity, 'medium');
    assert.equal(summary.rows[0].reasonKey, 'missing_contact_date');
    assert.equal(summary.rows[0].contactSilentDays, null);
    assert.equal(summary.rows[0].reasonLabel.includes('14+'), false);
  });

  it('does not falsely mark a lead with a planned move as missing next step', async () => {
    const { buildLostLeadRescue } = await loadHelper();
    const now = new Date('2026-06-05T12:00:00.000Z');
    const related = new Map([
      ['planned', [
        { id: 'task-1', leadId: 'planned', title: 'Oddzwonić', dueAt: '2026-06-06T12:00:00.000Z', status: 'todo' },
      ]],
    ]);
    const summary = buildLostLeadRescue({
      now,
      relatedRecordsById: related,
      leads: [
        { id: 'planned', name: 'Planned', lastContactAt: daysAgoIso(now, 3), dealValue: 1000, status: 'new' },
      ],
    });

    assert.equal(summary.total, 0);
  });

  it('sorts critical before high before medium', async () => {
    const { buildLostLeadRescue } = await loadHelper();
    const now = new Date('2026-06-05T12:00:00.000Z');
    const summary = buildLostLeadRescue({
      now,
      leads: [
        { id: 'medium-missing-date', name: 'Medium', dealValue: 1000, status: 'new' },
        { id: 'high-waiting', name: 'High', lastContactAt: daysAgoIso(now, 0), dealValue: 1000, status: 'waiting_response' },
        { id: 'critical-silent', name: 'Critical', lastContactAt: daysAgoIso(now, 20), dealValue: 1000, status: 'new' },
      ],
      relatedRecordsById: new Map(),
    });

    assert.deepEqual(summary.rows.map((row) => row.leadId), [
      'critical-silent',
      'high-waiting',
      'medium-missing-date',
    ]);
    assert.deepEqual(summary.rows.map((row) => row.severity), ['critical', 'high', 'medium']);
  });
});
