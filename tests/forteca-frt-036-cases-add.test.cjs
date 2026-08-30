const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function readRepoFile(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function stripCssComments(value) {
  return value.replace(/\/\*[\s\S]*?\*\//g, '');
}

const casesSource = readRepoFile('src/pages/Cases.tsx');
const sidecarSource = readRepoFile('src/styles/forteca-cases-add.css');
const casesApiSource = readRepoFile('api/cases.ts');

test('FRT-036 keeps the locked reference and route contract discoverable', () => {
  const contract = readRepoFile('_project/contracts/forteca-clean/FRT-036_CASE_ADD.md');

  assert.match(contract, /STAGE_ID:\s*FRT-036/);
  assert.match(contract, /REFERENCE_FILE:\s*docs\/ui\/reference\/forteca-calm-light\/036_case_add_modal\.webp/);
  assert.match(contract, /TARGET_ROUTE:\s*\/cases/);
  assert.match(contract, /TARGET_STATE:\s*Add Case modal/);
  assert.match(contract, /VISUAL_SOT_OWNERS:\s*MODALS;\s*FORMS;\s*BUTTONS_ACTIONS;\s*ICONS;\s*SURFACES/);
  assert.ok(fs.existsSync(path.join(repoRoot, 'docs/ui/reference/forteca-calm-light', '036_case_add_modal.webp')));
});

test('generic Cases Add Case markup exposes the real create contract', () => {
  assert.match(casesSource, /pageKey="cases"/);
  assert.match(casesSource, /data-forteca-frt-036-root="true"/);
  assert.match(casesSource, /data-forteca-frt-036-runtime="true"/);
  assert.match(casesSource, /<form onSubmit=\{handleCreateCase\} className="forteca-frt-036-form"/);

  for (const marker of [
    'Dodaj sprawę',
    'Klient',
    'Nazwa sprawy',
    'Typ sprawy',
    'Priorytet',
    'Wartość (PLN)',
    'Etap operacyjny',
    'Termin',
    'Opiekun',
    'Krótki opis',
    'Szablon checklisty',
    'Wyślij link do portalu po utworzeniu',
    'Anuluj',
    'Utwórz sprawę',
  ]) {
    assert.ok(casesSource.includes(marker), 'missing FRT-036 marker: ' + marker);
  }

  const modalStart = casesSource.indexOf('data-forteca-frt-036-root="true"');
  const modalEnd = casesSource.indexOf('</DialogContent>', modalStart);
  assert.ok(modalStart >= 0 && modalEnd > modalStart, 'FRT-036 modal must be present');
  const modalMarkup = casesSource.slice(modalStart, modalEnd);

  for (const marker of [
    'id="forteca-frt-036-client"',
    'id="forteca-frt-036-title"',
    'id="forteca-frt-036-type"',
    'id="forteca-frt-036-priority"',
    'id="forteca-frt-036-value"',
    'id="forteca-frt-036-status"',
    'id="forteca-frt-036-date"',
    'id="forteca-frt-036-owner"',
    'id="forteca-frt-036-description"',
    'id="forteca-frt-036-template"',
  ]) {
    assert.ok(modalMarkup.includes(marker), 'missing FRT-036 control: ' + marker);
  }
});

test('FRT-036 keeps write behavior on the existing scoped create path', () => {
  assert.match(casesSource, /createStarterCaseForClient\(/);
  assert.match(casesSource, /workspaceId,/);
  assert.match(casesSource, /primaryForClient:/);
  assert.match(casesSource, /serviceProfileId:/);
  assert.match(casesSource, /sendClientLink:/);
  assert.match(casesSource, /checklistTemplateId:/);
  assert.match(casesSource, /await refreshCases\(\)/);
  assert.match(casesSource, /setIsCreateCaseOpen\(false\)/);
  assert.match(casesSource, /createdCaseId/);
});

test('FRT-036 portal switch uses the real token and mail path without exposing plaintext tokens', () => {
  assert.match(casesApiSource, /createPortalToken/);
  assert.match(casesApiSource, /upsertPortalTokenForCase/);
  assert.match(casesApiSource, /sendResendEmail/);
  assert.match(casesApiSource, /CLIENT_EMAIL_REQUIRED_FOR_PORTAL_LINK/);
  assert.match(casesApiSource, /CLIENT_PORTAL_EMAIL_NOT_CONFIGURED/);
  assert.match(casesApiSource, /portalLink:\s*\{/);
  assert.match(casesApiSource, /status:\s*portalLinkStatus/);
  assert.doesNotMatch(casesApiSource, /plaintextToken\s*:\s*plaintextToken/);
});

test('FRT-036 sidecar has one route-scoped owner and uses Visual SOT tokens', () => {
  const ownerMatch = sidecarSource.match(/LF-UI-SOT-007_OWNER\s+(\{[^\n]*\})/);
  assert.ok(ownerMatch, 'sidecar must declare its Visual SOT owner');
  const owner = JSON.parse(ownerMatch[1]);

  assert.equal(owner.schema, 'LF-UI-SOT-007.owner.v1');
  assert.equal(owner.ownerId, 'route:cases:add-modal');
  assert.equal(owner.scope, 'route-scoped');
  assert.deepEqual(owner.consumerRoots, ['src/pages/Cases.tsx']);

  for (const selector of [
    '[data-forteca-frt-036-root]',
    '.forteca-frt-036-form-grid',
    '.forteca-frt-036-field',
    '.forteca-frt-036-dialog-footer',
    '.forteca-frt-036-switch',
  ]) {
    assert.ok(sidecarSource.includes(selector), 'missing sidecar selector: ' + selector);
  }
  assert.match(
    sidecarSource,
    /\[data-forteca-frt-036-root\]\[data-closeflow-modal-visual-system="true"\]\.forteca-frt-036-case-add \.forteca-frt-036-switch--on/,
    'on-state switch rule must outrank the shared dialog button reset',
  );

  const css = stripCssComments(sidecarSource);
  const foundation = readRepoFile('src/styles/owners/closeflow-foundation.css');
  const definedTokens = new Set(
    [...foundation.matchAll(/(--cf-vst-[a-z0-9-]+)\s*:/gi)].map((match) => match[1]),
  );
  const referencedTokens = [...css.matchAll(/var\(\s*(--[a-z0-9-]+)/gi)].map((match) => match[1]);

  assert.ok(referencedTokens.length > 0, 'sidecar must consume existing Visual SOT tokens');
  for (const token of referencedTokens) {
    assert.ok(token.startsWith('--cf-vst-'), 'non-Visual SOT token referenced: ' + token);
    assert.ok(definedTokens.has(token), 'undefined Visual SOT token referenced: ' + token);
  }
  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b/i, 'sidecar must not add literal colors');
  assert.doesNotMatch(css, /\b(?:rgba?|hsla?)\s*\(/i, 'sidecar must not add literal colors');
});

test('FRT-036 keeps normal wrapping and a bounded compact viewport adapter', () => {
  assert.match(sidecarSource, /@media\s*\(max-width:\s*720px\)/);
  assert.match(sidecarSource, /grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.match(sidecarSource, /white-space:\s*normal/);
  assert.match(sidecarSource, /overflow-wrap:\s*normal/);
  assert.match(sidecarSource, /word-break:\s*normal/);
  assert.doesNotMatch(sidecarSource, /text-overflow\s*:/i);
  assert.match(sidecarSource, /\.forteca-frt-036-form-body\s*\{[\s\S]*overflow-x\s*:\s*hidden/i);
});
