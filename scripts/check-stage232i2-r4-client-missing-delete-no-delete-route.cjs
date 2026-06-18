const fs = require('fs');
const assert = require('assert');

const stage = 'STAGE232I2_R4_CLIENT_MISSING_DELETE_NO_DELETE_ROUTE';
const client = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');

const marker = 'data-stage232i2-delete-source-item="true"';
const idx = client.indexOf(marker);
assert.ok(idx >= 0, 'delete source item marker missing');

const start = client.lastIndexOf('<Button', idx);
const end = client.indexOf('</Button>', idx);
assert.ok(start >= 0 && end > start, 'delete source item button range missing');

const block = client.slice(start, end + '</Button>'.length);

assert.ok(client.includes(stage), 'R4 marker missing');
assert.ok(block.includes('handleResolveClientMissingItemStage228R13(item)'), 'delete button must close through resolve/update flow');
assert.ok(!block.includes('handleDeleteClientMissingItemStage228R15(item)'), 'delete button must not call delete handler/METHOD_NOT_ALLOWED route');
assert.ok(!/deleteTaskFromSupabase\s*\(/.test(block), 'delete button must not call physical delete');
assert.ok(client.includes('STAGE232I2_R3_CLIENT_MISSING_DELETE_SOFT_DELETE'), 'R3 soft delete marker should remain as fallback');

console.log(JSON.stringify({ ok: true, stage, guard: 'check-stage232i2-r4-client-missing-delete-no-delete-route' }, null, 2));
