const assert = require('node:assert/strict');
const { describe, it } = require('node:test');
const path = require('node:path');
const esbuild = require('esbuild');

async function loadHelper() {
  const entry = path.join(process.cwd(), 'src/lib/owner-control/contact-cadence-grid.ts');
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
  const date = new Date(now.getTime() - days * 86_400_000);
  return date.toISOString();
}

describe('STAGE225 contact cadence grid', () => {
  it('classifies contact silence buckets with activity-truth contactSilentDays', async () => {
    const { buildContactCadenceGrid } = await loadHelper();
    const now = new Date('2026-06-05T12:00:00.000Z');
    const records = [
      { id: 'today', name: 'Today', lastContactAt: daysAgoIso(now, 0) },
      { id: 'one', name: 'One', lastContactAt: daysAgoIso(now, 1) },
      { id: 'two', name: 'Two', lastContactAt: daysAgoIso(now, 2) },
      { id: 'three', name: 'Three', lastContactAt: daysAgoIso(now, 3) },
      { id: 'five', name: 'Five', lastContactAt: daysAgoIso(now, 5) },
      { id: 'eight', name: 'Eight', lastContactAt: daysAgoIso(now, 8) },
      { id: 'twenty', name: 'Twenty', lastContactAt: daysAgoIso(now, 20) },
      { id: 'unknown', name: 'Unknown' },
    ];

    const grid = buildContactCadenceGrid({ entityType: 'lead', records, now });

    assert.deepEqual(grid.buckets.today.map((row) => row.entityId), ['today']);
    assert.deepEqual(grid.buckets.silent_1.map((row) => row.entityId), ['one']);
    assert.deepEqual(grid.buckets.silent_2.map((row) => row.entityId), ['two']);
    assert.deepEqual(grid.buckets.silent_3.map((row) => row.entityId), ['three']);
    assert.deepEqual(grid.buckets.silent_5.map((row) => row.entityId), ['five']);
    assert.deepEqual(grid.buckets.silent_7.map((row) => row.entityId), ['eight']);
    assert.deepEqual(grid.buckets.silent_14_plus.map((row) => row.entityId), ['twenty']);
    assert.deepEqual(grid.buckets.unknown.map((row) => row.entityId), ['unknown']);
  });

  it('prepares Lost Lead Rescue candidates without building Rescue UI', async () => {
    const { buildContactCadenceGrid } = await loadHelper();
    const now = new Date('2026-06-05T12:00:00.000Z');
    const related = new Map();
    related.set('silent-with-next', [{ id: 'task-1', leadId: 'silent-with-next', dueAt: '2026-06-07T12:00:00.000Z', status: 'todo' }]);

    const grid = buildContactCadenceGrid({
      entityType: 'lead',
      now,
      relatedRecordsById: related,
      records: [
        { id: 'lost', name: 'Lost', lastContactAt: daysAgoIso(now, 20) },
        { id: 'seven-no-next', name: 'Seven no next', lastContactAt: daysAgoIso(now, 7) },
        { id: 'silent-with-next', name: 'Silent with next', lastContactAt: daysAgoIso(now, 7) },
        { id: 'fresh', name: 'Fresh', lastContactAt: daysAgoIso(now, 0) },
      ],
    });

    const rows = Object.values(grid.buckets).flat();
    const byId = new Map(rows.map((row) => [row.entityId, row]));

    assert.equal(byId.get('lost').rescueCandidate, true);
    assert.equal(byId.get('seven-no-next').rescueCandidate, true);
    assert.equal(byId.get('silent-with-next').rescueCandidate, false);
    assert.equal(byId.get('fresh').rescueCandidate, false);
  });
});
