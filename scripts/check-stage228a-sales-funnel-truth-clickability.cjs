const fs = require('node:fs');
const path = require('node:path');

const repoRoot = process.cwd();
const pagePath = path.join(repoRoot, 'src/pages/SalesFunnel.tsx');
const helperPath = path.join(repoRoot, 'src/lib/owner-control/sales-funnel-movement.ts');
const configPath = path.join(repoRoot, 'src/lib/config/funnel-stages.ts');
const releaseGatePath = path.join(repoRoot, 'scripts/closeflow-release-check-quiet.cjs');

function read(filePath) {
  if (!fs.existsSync(filePath)) throw new Error('Missing file: ' + path.relative(repoRoot, filePath));
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source, needle, label) {
  if (!source.includes(needle)) {
    console.error('Missing contract:', label || needle);
    process.exit(1);
  }
}

function assertNotIncludes(source, needle, label) {
  if (source.includes(needle)) {
    console.error('Forbidden contract:', label || needle);
    process.exit(1);
  }
}

const page = read(pagePath);
const helper = read(helperPath);
const config = read(configPath);
const releaseGate = read(releaseGatePath);

assertIncludes(page, 'STAGE228A_FUNNEL_TRUTH_CLICKABILITY', 'Stage228A page marker');
assertIncludes(helper, 'STAGE228A_FUNNEL_VALUE_SOURCE_TRUTH', 'Stage228A helper marker');
assertIncludes(page, "useState<OwnerFilter>('all')", 'funnel defaults to all records, not hidden move_now subset');
assertIncludes(page, 'resolveFunnelFilterAfterOwnerClick', 'owner filter click resolver exists');
assertIncludes(page, "return { ownerFilter, stageFilter: 'all' }", 'owner filter clears stage filter');
assertIncludes(page, "return { ownerFilter: 'all', stageFilter }", 'stage filter clears owner filter');
assertIncludes(page, "onClick={() => applyOwnerFilter('money')}", 'money tile is clickable and routes to owner money filter');
assertIncludes(config, 'Kliknij — pokaż rekordy, z których liczona jest kwota.', 'money tile explains source visibility in funnel config source');
assertIncludes(page, 'data-stage228a-money-source-card', 'cards mark money source visibility');
assertIncludes(page, 'data-stage228a-clickable-filter', 'clickable filter markers exist');
assertIncludes(page, 'data-stage228a-priority-link', 'priority link is real link');
assertIncludes(page, 'Pokazuję {filteredCards.length} z {allCards.length} rekordów', 'record count copy is explicit');
assertIncludes(page, "label={card.valueSourceLabel || 'Wartość/prowizja'}", 'card displays value source label');
assertIncludes(helper, 'valueSourceLabel: string;', 'card type contains valueSourceLabel');
assertIncludes(helper, "valueSourceLabel: valueAmount > 0 ? 'Prowizja sprawy' : 'Prowizja sprawy'", 'case money source label is explicit');
assertIncludes(helper, "valueSourceLabel: valueAmount > 0 ? 'Wartość leada' : 'Wartość/prowizja'", 'lead money source label is explicit');
assertIncludes(releaseGate, 'stage228a sales funnel truth clickability guard', 'quiet release gate includes Stage228A guard');
assertIncludes(releaseGate, 'stage228a sales funnel truth clickability test', 'quiet release gate includes Stage228A test');
assertNotIncludes(page, "href=\"#\"", 'no dead href buttons');

console.log('PASS STAGE228A sales funnel truth/clickability guard');
