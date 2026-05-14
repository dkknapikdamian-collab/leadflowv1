const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const clientsPath = path.join(root, 'src', 'pages', 'Clients.tsx');
const guardPath = path.join(root, 'scripts', 'check-stage74-clients-leads-to-link-panel.cjs');

function readClients() {
  return fs.readFileSync(clientsPath, 'utf8');
}

test('Stage74 guard and this test file are syntactically valid', () => {
  execFileSync(process.execPath, ['--check', guardPath], { cwd: root, stdio: 'pipe' });
  execFileSync(process.execPath, ['--check', __filename], { cwd: root, stdio: 'pipe' });
});

test('Stage74 clients rail uses lead-only source and final copy', () => {
  const text = readClients();
  assert.ok(text.includes('const leadsNeedingClientOrCaseLink = useMemo'), 'missing lead-only source name');
  assert.ok(text.includes('Leady do spięcia'), 'missing final title');
  assert.ok(text.includes('Brak klienta albo sprawy przy aktywnym temacie.'), 'missing final subtitle');
  assert.ok(text.includes('Brak leadów wymagających spięcia.'), 'missing final empty state');
  assert.equal(text.includes('Klienci do uwagi'), false, 'legacy client title still present');
  assert.equal(text.includes('Relacje bez pełnego spięcia lead/sprawa.'), false, 'legacy misleading subtitle still present');
  assert.equal(text.includes('Leady do uwagi'), false, 'old vague lead title still present');
});

test('Stage74 candidate source iterates leads, not clients', () => {
  const text = readClients();
  const start = text.indexOf('const leadsNeedingClientOrCaseLink = useMemo');
  const end = text.indexOf('const resetNewClientForm', start);
  assert.ok(start >= 0 && end > start, 'source block exists');
  const block = text.slice(start, end);
  assert.ok(block.includes('(leads as Record<string, unknown>[])'), 'candidate source must iterate leads');
  assert.equal(/clients\.filter\s*\(/.test(block), false, 'candidate source must not filter clients');
  assert.match(block, /status\s*===\s*['"]archived['"]/);
  assert.match(block, /visibility\s*===\s*['"]trash['"]/);
  assert.match(block, /return\s+!clientId\s*\|\|\s*!hasCase/);
});

test('Stage74 render block links rows to lead detail', () => {
  const text = readClients();
  const start = text.indexOf('data-clients-lead-attention-rail="true"');
  const end = text.indexOf('</aside>', start);
  assert.ok(start >= 0 && end > start, 'rail render block exists');
  const block = text.slice(start, end);
  assert.ok(block.includes('leadsNeedingClientOrCaseLink.length ? leadsNeedingClientOrCaseLink.map'), 'rail must render lead-only source');
  assert.ok(block.includes("to={leadId ? '/leads/' + leadId : '/leads'}"), 'rail rows must link to lead detail');
  assert.equal(block.includes('client.name'), false, 'rail must not render client.name');
  assert.equal(block.includes('client.company'), false, 'rail must not render client.company');
});
