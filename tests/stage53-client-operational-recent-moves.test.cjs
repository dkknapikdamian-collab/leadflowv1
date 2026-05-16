const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const marker = 'STAGE53_CLIENT_OPERATIONAL_RECENT_MOVES';
test(marker, () => {
  const tsx = fs.readFileSync(path.join(process.cwd(), 'src/pages/ClientDetail.tsx'), 'utf8');
  const css = fs.readFileSync(path.join(process.cwd(), 'src/styles/visual-stage12-client-detail-vnext.css'), 'utf8');
  assert.ok(tsx.includes(marker));
  assert.ok(!tsx.includes('Klient jako centrum relacji'));
  assert.ok(tsx.includes('recentClientMovements'));
  assert.ok(tsx.includes('data-client-recent-moves-panel="true"'));
  assert.ok(tsx.includes('Zobacz ca\u0142\u0105 aktywno\u015B\u0107'));
  assert.ok(css.includes(marker));
});
