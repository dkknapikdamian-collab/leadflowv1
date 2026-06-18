const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const src = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');

function body(name) {
  const idx = src.indexOf(name);
  assert.ok(idx >= 0, name + ' missing');
  const arrow = src.indexOf('=>', idx);
  const open = src.indexOf('{', arrow);
  let depth = 0, quote = null, escaped = false;
  for (let i = open; i < src.length; i++) {
    const ch = src[i];
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
      if (depth === 0) return src.slice(open + 1, i);
    }
  }
  throw new Error('handler end missing');
}

test('R3 client missing delete uses soft delete update', () => {
  const h = body('handleDeleteClientMissingItemStage228R15');
  assert.match(h, /updateTaskInSupabase\(\{/);
  assert.match(h, /status: 'deleted'/);
  assert.match(h, /stage232i2DeleteMode: 'soft_delete_no_method_delete'/);
  assert.doesNotMatch(h, /deleteTaskFromSupabase\s*\(/);
});

test('R3 keeps I2 source delete action marker', () => {
  assert.match(src, /data-stage232i2-delete-source-item="true"/);
});
