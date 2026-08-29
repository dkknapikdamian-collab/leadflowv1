const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const has = (text, snippet, label) => {
  assert.ok(text.includes(snippet), `${label || 'source'} must include: ${snippet}`);
};
const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');

const contractPath = '_project/contracts/forteca-clean/FRT-027_CLIENT_NO_ACTIVE_CASE.md';
const referencePath = 'docs/ui/reference/forteca-calm-light/027_client_detail_no_active_case.webp';
const layoutPath = 'src/components/Layout.tsx';
const sourcePath = 'src/pages/ClientDetail.tsx';
const stylesPath = 'src/styles/forteca-client-detail.css';
const semanticFoundationPath = 'src/styles/owners/closeflow-foundation.css';
const actionStylesPath = 'src/styles/owners/closeflow-actions.css';

test('FRT-027 pins the exact no-active-case contract, route, reference and stage chain', () => {
  const contract = read(contractPath);

  assert.match(contract, /^CONTRACT_STATUS: LOCKED$/m);
  assert.match(contract, /^STAGE_ID: FRT-027$/m);
  assert.match(contract, /^TARGET_ROUTE: \/clients\/:clientId$/m);
  assert.match(contract, /^TARGET_STATE: Client Detail — no active case$/m);
  assert.match(contract, /^REFERENCE_FILE: docs\/ui\/reference\/forteca-calm-light\/027_client_detail_no_active_case\.webp$/m);
  assert.match(contract, /^PREDECESSOR: FRT-026$/m);
  assert.match(contract, /^SUCCESSOR: FRT-028$/m);

  assert.ok(exists(referencePath), `FRT-027 reference is missing: ${referencePath}`);
  assert.equal(
    sha256(referencePath),
    '53a20e8b659d2fe67d696cc77793a168653c0771dbb1eb6ac f21f7dacf60eff3'.replace(/\s/g, ''),
    'FRT-027 reference SHA-256 must remain the approved asset',
  );
});

test('FRT-027 keeps the client-detail route and no-case state relation-derived', () => {
  const layout = read(layoutPath);
  const source = read(sourcePath);

  has(layout, "const isClientDetailRoute = /^\\/clients\\/[^/]+$/.test(location.pathname);", 'client-detail route guard');
  has(layout, 'const isFortecaShellRoute = isLeadDetailRoute || isFortecaClientsRoute || isClientDetailRoute;', 'Forteca shell route guard');
  has(source, 'const { clientId } = useParams();', 'client route source');
  has(source, 'fetchCasesFromSupabase({ clientId })', 'client-scoped case relation source');
  has(source, 'const clientRelatedCasesStage231B0R8 = useMemo', 'client-scoped relation derivation');
  has(source, 'resolveClientPrimaryCase({ client, cases: clientRelatedCasesStage231B0R8 })', 'primary-case relation derivation');
  has(source, 'const activeCases = useMemo', 'active-case relation derivation');
  has(source, 'const activeClientCases = activeCases;', 'active-case relation projection');

  assert.match(
    source,
    /const forteca027NoActiveCase\s*=\s*[^;\n]*(?:activeClientCases|activeCases)[^;\n]*\.length\s*===\s*0\s*;/,
    'FRT-027 no-active-case flag must be derived from related active cases',
  );
  assert.doesNotMatch(
    source,
    /const forteca027NoActiveCase\s*=\s*(?:true|false)\s*;/,
    'FRT-027 no-active-case flag must not be a static fixture branch',
  );
});

test('FRT-027 exposes the complete runtime marker set for the no-active-case composition', () => {
  const source = read(sourcePath);
  const markers = [
    'data-forteca-frt-027-root',
    'data-forteca-frt-027-runtime',
    'data-forteca-frt-027-no-active-case',
    'data-forteca-frt-027-cases',
    'data-forteca-frt-027-info',
    'data-forteca-frt-027-contact',
    'data-forteca-frt-027-history',
    'data-forteca-frt-027-notes',
  ];

  for (const marker of markers) has(source, marker, 'FRT-027 runtime marker');
  has(source, 'forteca027NoActiveCase', 'FRT-027 runtime state binding');

  const noCaseMarkerIndex = source.indexOf('data-forteca-frt-027-no-active-case');
  assert.ok(noCaseMarkerIndex >= 0, 'FRT-027 no-active-case marker must exist');
  const noCaseRegion = source.slice(Math.max(0, noCaseMarkerIndex - 4000), noCaseMarkerIndex + 5000);
  assert.match(noCaseRegion, /forteca027NoActiveCase|activeClientCases\.length|activeCases\.length/, 'no-case marker must stay tied to relation state');
  assert.match(noCaseRegion, /Brak aktywn(?:ych spraw|ej sprawy)|bez aktywnej sprawy/i, 'no-case state must expose honest empty-state copy');
});

test('FRT-027 binds the real New Case CTA to the existing openNewCase handler', () => {
  const source = read(sourcePath);

  has(source, 'const openNewCase = () => {', 'existing client case-create handler');
  has(source, 'if (!clientId) return navigate(\'/cases\');', 'existing client case-create route fallback');
  has(source, 'setClientCaseCreateOpen(true);', 'existing client case-create state transition');

  const noCaseMarkerIndex = source.indexOf('data-forteca-frt-027-no-active-case');
  const noCaseRegion = source.slice(Math.max(0, noCaseMarkerIndex - 4000), noCaseMarkerIndex + 5000);
  assert.match(noCaseRegion, /onClick=\{openNewCase\}/, 'FRT-027 no-case CTA must use the existing handler');
  assert.match(noCaseRegion, /(?:Nowa sprawa|Utwórz nową sprawę|Utwórz sprawę)/i, 'FRT-027 no-case CTA must be visible');
  assert.doesNotMatch(noCaseRegion, /onClick=\{\(\)\s*=>\s*setClientCaseCreateOpen\(/, 'FRT-027 CTA must not bypass the existing handler');
});

test('FRT-027 keeps the no-case surface on shared semantic tokens with no raw color literals', () => {
  const source = read(sourcePath);
  const importedStylePaths = [...source.matchAll(/import\s+['"](\.\.?\/styles\/[^'"]+\.css)['"]/g)].map((match) => {
    const absolute = path.resolve(root, 'src/pages', match[1]);
    return path.relative(root, absolute).split(path.sep).join('/');
  });
  const stageStylePaths = [...new Set([stylesPath, ...importedStylePaths])];
  const stageStyles = stageStylePaths.map((file) => {
    assert.ok(exists(file), `FRT-027 style owner is missing: ${file}`);
    return read(file);
  }).join('\n');

  for (const token of [
    '--cf-vst-color-primary',
    '--cf-vst-color-primary-strong',
    '--cf-vst-surface-card-solid',
    '--cf-vst-surface-border',
    '--cf-vst-text-main',
    '--cf-vst-text-muted',
  ]) {
    has(stageStyles, token, 'FRT-027 semantic style token');
  }
  assert.doesNotMatch(stageStyles, /#[0-9a-f]{3,8}\b/i, 'FRT-027 styles must not add raw hex colors');
  assert.doesNotMatch(stageStyles, /\b(?:rgba?|hsla?)\(/i, 'FRT-027 styles must not add raw color functions');

  const semanticFoundation = read(semanticFoundationPath);
  const actionStyles = read(actionStylesPath);
  has(semanticFoundation, '--cf-vst-color-primary', 'canonical Visual SOT color owner');
  has(semanticFoundation, '--cf-vst-color-delete', 'canonical delete color owner');
  has(actionStyles, 'var(--cf-vst-color-delete)', 'shared delete action token');
});

test('FRT-027 does not inject the 027 screenshot identity, fixture payload or duplicated reference data', () => {
  const source = read(sourcePath);
  const styles = read(stylesPath);
  const runtime = `${source}\n${styles}`;

  for (const fixturePattern of [
    /Łukasz\s+Mazur/i,
    /Mazur\s+Consulting/i,
    /KL-2024-0158/i,
    /lukasz\.mazur@mazurconsulting\.pl/i,
    /mazurconsulting\.pl/i,
    /\+48\s*600\s*123\s*456/i,
    /027_client_detail_no_active_case\.(?:webp|png|jpe?g)/i,
    /data:image\//i,
    /base64,/i,
    /\b(?:mock|fixture)(?:Client|Data|Name|Payload)\b/i,
  ]) {
    assert.doesNotMatch(runtime, fixturePattern, `runtime must not embed screenshot/fixture data (${fixturePattern})`);
  }
});
