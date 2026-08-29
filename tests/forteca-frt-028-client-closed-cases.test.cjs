const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');

const contractPath = '_project/contracts/forteca-clean/FRT-028_CLIENT_CLOSED_CASES.md';
const referencePath = 'docs/ui/reference/forteca-calm-light/028_client_detail_closed_cases.webp';
const sourcePath = 'src/pages/ClientDetail.tsx';
const layoutPath = 'src/components/Layout.tsx';
const stylesPath = 'src/styles/forteca-client-closed-cases.css';
const semanticFoundationPath = 'src/styles/owners/closeflow-foundation.css';

const hasHook = (source, aliases, label) => {
  const names = Array.isArray(aliases) ? aliases : [aliases];
  assert.ok(
    names.some((name) => source.includes(`data-forteca-frt-028-${name}`) || source.includes(`forteca-frt-028-${name}`)),
    `${label || 'FRT-028 surface'} must expose one of: ${names.join(', ')}`,
  );
};

const forteca028Region = (source) => {
  const starts = ['data-forteca-frt-028-root', 'forteca-frt-028-page']
    .map((marker) => source.indexOf(marker))
    .filter((index) => index >= 0);
  assert.ok(starts.length > 0, 'FRT-028 source region must expose a stable root marker or page class');
  return source.slice(Math.min(...starts));
};

test('FRT-028 pins the exact closed-cases contract, route, reference and approved asset', () => {
  const contract = read(contractPath);

  assert.match(contract, /^CONTRACT_STATUS: LOCKED$/m);
  assert.match(contract, /^STAGE_ID: FRT-028$/m);
  assert.match(contract, /^TARGET_ROUTE: \/clients\/:clientId$/m);
  assert.match(contract, /^TARGET_STATE: Client Detail — closed cases$/m);
  assert.match(contract, /^REFERENCE_FILE: docs\/ui\/reference\/forteca-calm-light\/028_client_detail_closed_cases\.webp$/m);
  assert.match(contract, /^PREDECESSOR: FRT-027$/m);
  assert.match(contract, /^SUCCESSOR: FRT-029$/m);

  assert.ok(exists(referencePath), `FRT-028 reference is missing: ${referencePath}`);
  assert.equal(
    sha256(referencePath),
    '78679946b1ce5c57ed0532bf487746f9e3aa2600a3d83d302138f8e4b8716af7',
    'FRT-028 reference SHA-256 must remain the approved asset',
  );
});

test('FRT-028 exposes dedicated runtime composition hooks for the closed-cases state', () => {
  const source = read(sourcePath);
  const region = forteca028Region(source);

  for (const [aliases, label] of [
    [['root', 'page'], 'root'],
    [['runtime'], 'runtime state'],
    [['hero', 'header'], 'hero/header'],
    [['tabs'], 'tabs'],
    [['table', 'closed-cases'], 'closed-cases table'],
    [['summary', 'right-rail'], 'summary/right rail'],
    [['row', 'case-row'], 'closed-case row'],
  ]) {
    hasHook(source, aliases, `FRT-028 ${label}`);
  }

  assert.match(region, /(?:closedCases|closedClientCases)\b/, 'FRT-028 must expose the related closed-case collection');
  assert.match(region, /(?:closedCases|closedClientCases)\.map\s*\(/, 'FRT-028 rows must be rendered from the closed-case collection');
  assert.match(region, /(?:closedCases|closedClientCases)\.length/, 'FRT-028 summary/count must derive from the closed-case collection');
});

test('FRT-028 keeps closed-case rows and summary relation-derived from the client data source', () => {
  const source = read(sourcePath);
  const region = forteca028Region(source);

  for (const marker of [
    'const { clientId } = useParams();',
    'fetchCasesFromSupabase({ clientId })',
    'const clientRelatedCasesStage231B0R8 = useMemo',
    'resolveClientPrimaryCase({ client, cases: clientRelatedCasesStage231B0R8 })',
    'closedClientCasesStage231B0R7(',
  ]) {
    assert.ok(source.includes(marker), `FRT-028 must preserve the canonical relation source: ${marker}`);
  }

  assert.match(region, /(?:closedCases|closedClientCases)\.map\s*\(\s*\(?\s*(?:caseRecord|caseRow|closedCase)/, 'FRT-028 row rendering must receive a runtime case record');
  assert.match(region, /(?:getCaseTitle|caseRecord\.(?:title|name)|caseRow\.(?:title|name))/, 'FRT-028 row title must come from the runtime record');
  assert.match(region, /(?:getCaseFinanceSummary|getClientCasesFinanceSummary|clientFinanceSummary|caseFinance)/, 'FRT-028 value/summary must use the canonical finance owner');
  assert.match(region, /(?:closedAt|completedAt|lastActivityAt|updatedAt|createdAt)/, 'FRT-028 closure date must come from a runtime case timestamp');

  const forbiddenReferenceRows = [
    /Ewelina\s+Piotrowska/i,
    /ewelina\.piotrowska@email\.pl/i,
    /\+48\s*600\s*123\s*456/i,
    /Piotrowska\s+Solutions/i,
    /SP\/2024\/(?:0871|0543|0312|0107)/i,
    /SP\/2023\/(?:0984|0766|0550|0321)/i,
    /Wdrożenie\s+systemu\s+CRM/i,
    /Audyt\s+bezpieczeństwa\s+danych/i,
    /Integracja\s+API\s+z\s+systemem\s+ERP/i,
    /Szkolenie\s+z\s+obsługi\s+platformy/i,
    /Optymalizacja\s+infrastruktury\s+IT/i,
    /Migracja\s+serwerów\s+do\s+chmury/i,
    /Doradztwo\s+w\s+zakresie\s+RODO/i,
    /Wsparcie\s+wdrożeniowe\s+aplikacji/i,
    /158[ .]?300\s*PLN/i,
    /028_client_detail_closed_cases\.(?:webp|png|jpe?g)/i,
    /data:image\//i,
    /base64,/i,
  ];

  for (const pattern of forbiddenReferenceRows) {
    assert.doesNotMatch(region, pattern, `FRT-028 must not copy a screenshot-only row/value (${pattern})`);
  }
});

test('FRT-028 resolves repeated visual meanings through the canonical semantic token source', () => {
  const source = read(sourcePath);
  assert.ok(source.includes("import '../styles/forteca-client-closed-cases.css';"), 'FRT-028 must import its dedicated stylesheet');
  assert.ok(exists(stylesPath), `FRT-028 stylesheet is missing: ${stylesPath}`);

  const styles = read(stylesPath);
  const foundation = read(semanticFoundationPath);

  assert.match(styles, /\.forteca-frt-028-[a-z0-9_-]+/i, 'FRT-028 stylesheet must own stage-scoped selectors');
  for (const token of [
    '--cf-vst-color-primary',
    '--cf-vst-color-success',
    '--cf-vst-color-success-soft',
    '--cf-vst-surface-card-solid',
    '--cf-vst-surface-border',
    '--cf-vst-text-main',
    '--cf-vst-text-muted',
  ]) {
    assert.ok(styles.includes(token), `FRT-028 stylesheet is missing shared visual token: ${token}`);
    assert.ok(foundation.includes(token), `FRT-028 token must be owned by the canonical Visual SOT: ${token}`);
  }

  assert.doesNotMatch(styles, /#[0-9a-f]{3,8}\b/i, 'FRT-028 CSS must not introduce raw hex colors');
  assert.doesNotMatch(styles, /\b(?:rgba?|hsla?)\(/i, 'FRT-028 CSS must not introduce raw color functions');
});

test('FRT-028 keeps the shell gutter aligned after the route root mounts asynchronously', () => {
  const layout = read(layoutPath);
  const styles = read(stylesPath);

  assert.match(layout, /isForteca028ClosedCases\s*\?\s*['"]auto['"]\s*:\s*['"]stable both-edges['"]/, 'the shell must release the centered gutter for the full-width FRT-028 canvas');
  assert.match(layout, /isClientDetailPath\s*&&\s*contentForFortecaObserver/, 'the async route-root observer must stay scoped to client detail');
  assert.match(layout, /new MutationObserver\(/, 'the shell must reconcile the gutter when the route root mounts after the initial effect');
  assert.match(styles, /scrollbar-width:\s*none/, 'the reference-aligned detail canvas must not reserve a visible scrollbar rail');
});

test('FRT-028 keeps row actions safe and capability-bound when actions are exposed', () => {
  const source = read(sourcePath);
  const region = forteca028Region(source);
  const actionSurfacePresent = /data-forteca-frt-028-(?:action|actions|menu|open|restore)|forteca-frt-028-(?:action|actions|menu|open|restore)|(?:Otwórz sprawę|Przywróć sprawę|Więcej akcji)/i.test(region);

  if (!actionSurfacePresent) return;

  assert.match(
    region,
    /(?:navigate\s*\([^)]*\/cases|to\s*=\s*\{?[^}\n]*\/cases|href\s*=\s*\{?[^}\n]*\/cases|handleRestoreClientCaseStage231B0R8|set[A-Z][A-Za-z0-9]*Open)/,
    'FRT-028 row actions must route to a real case, supported restore handler or explicit expansion state',
  );
  assert.doesNotMatch(region, /window\.confirm\s*\(|\balert\s*\(|TODO|NotImplemented|onClick\s*=\s*\{\s*\(\)\s*=>\s*\{\s*\}\s*\}/i, 'FRT-028 must not expose fake or unbound row actions');
  assert.doesNotMatch(region, /onClick\s*=\s*\{\s*\([^}]*\)\s*=>\s*updateCaseInSupabase\s*\(/, 'FRT-028 must not mutate a case directly from an unguarded row callback');
});

test('FRT-028 contract preserves the required acceptance evidence boundary', () => {
  const contract = read(contractPath);

  assert.match(contract, /^KNOWN_REFERENCE_DEVIATIONS: Do not infer reopen\/restore capabilities from screenshot copy\.$/m);
  assert.match(contract, /^ALLOWED_WRITE_SET: ClientDetail history consumer and canonical rows\/surfaces\/actions; focused tests\/guards; stage evidence\/receipt and WORKFLOW_STATE\.$/m);
  assert.match(contract, /^ACCEPTANCE_CRITERIA: Closed cases are real, related and action-safe; tests, Guardian, browser proof, receipt, commit and remote verification pass\.$/m);
  assert.match(contract, /^TEST_PLAN: History\/open-related\/action tests; browser proof; typecheck if TS changes; targeted build if shared history runtime changes\.$/m);
});
