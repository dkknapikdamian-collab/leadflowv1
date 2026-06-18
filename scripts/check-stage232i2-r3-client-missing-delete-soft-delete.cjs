const fs = require('fs');
const assert = require('assert');

const stage = 'STAGE232I2_R3_CLIENT_MISSING_DELETE_SOFT_DELETE';
const src = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');

function findMatchingBrace(text, open) {
  let depth = 0, quote = null, escaped = false;
  for (let i = open; i < text.length; i++) {
    const ch = text[i];
    if (quote) {
      if (escaped) { escaped = false; continue; }
      if (ch === '\\') { escaped = true; continue; }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') { quote = ch; continue; }
    if (ch === '{') depth++;
    if (ch === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

const name = 'handleDeleteClientMissingItemStage228R15';
const idx = src.indexOf(name);
assert.ok(idx >= 0, 'delete handler missing');
const arrow = src.indexOf('=>', idx);
const open = src.indexOf('{', arrow);
const close = findMatchingBrace(src, open);
assert.ok(close > open, 'delete handler body missing');
const body = src.slice(open + 1, close);

assert.ok(src.includes(stage), 'R3 marker missing');
assert.ok(body.includes('updateTaskInSupabase({'), 'delete must use updateTaskInSupabase');
assert.ok(body.includes("status: 'deleted'"), 'delete must set status deleted');
assert.ok(body.includes("stage232i2DeleteMode: 'soft_delete_no_method_delete'"), 'delete soft-delete marker missing');
assert.ok(!/deleteTaskFromSupabase\s*\(/.test(body), 'delete handler must not call physical delete');
assert.ok(src.includes('data-stage232i2-delete-source-item="true"'), 'I2 delete button marker missing');

console.log(JSON.stringify({ ok: true, stage, guard: 'check-stage232i2-r3-client-missing-delete-soft-delete' }, null, 2));
