const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();
const leadPath = path.join(repoRoot, 'src', 'pages', 'LeadDetail.tsx');

function source() {
  return fs.readFileSync(leadPath, 'utf8').replace(/^\uFEFF/, '');
}
function extractFunction(text, functionName) {
  const marker = 'function ' + functionName + '(';
  const start = text.indexOf(marker);
  assert.ok(start >= 0, 'missing function: ' + functionName);
  const open = text.indexOf('{', start);
  assert.ok(open >= 0, 'missing opening brace');
  let depth = 0;
  for (let i = open; i < text.length; i += 1) {
    if (text[i] === '{') depth += 1;
    if (text[i] === '}') {
      depth -= 1;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  assert.fail('unterminated function: ' + functionName);
}
function extractTopCards(text) {
  const marker = 'data-stage227e2-top-cards="true"';
  const markerIndex = text.indexOf(marker);
  assert.ok(markerIndex >= 0, 'missing stage227e2 top cards marker');
  const start = text.lastIndexOf('<section', markerIndex);
  const end = text.indexOf('</section>', markerIndex);
  assert.ok(start >= 0 && end >= 0, 'cannot extract top cards section');
  return text.slice(start, end + '</section>'.length);
}

test('Stage227E2 top cards expose decision labels and remove decorative active lead card', () => {
  const text = source();
  const topCards = extractTopCards(text);
  assert.ok(text.includes('STAGE227E2_LEAD_DETAIL_TOP_CARDS_POLISH'));
  assert.ok(topCards.includes('Nast\u0119pny krok'));
  assert.ok(topCards.includes('Potencja\u0142'));
  assert.ok(topCards.includes('Cisza / ryzyko'));
  assert.ok(!topCards.includes('Aktywny lead'));
  assert.ok(!topCards.includes('<h2>Warto\u015b\u0107</h2>'));
  assert.ok(!topCards.includes('sortedLinkedTasks.length + sortedLinkedEvents.length'));
});

test('Stage227E2 contact silence source excludes update timestamps', () => {
  const fn = extractFunction(source(), 'getLeadSilenceRisk');
  assert.ok(!fn.includes('updatedAt'));
  assert.ok(!fn.includes('updated_at'));
});