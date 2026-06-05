const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

function fail(message) {
  console.error('STAGE223_R2AF_TODAY_MOBILE_FOCUS_CONTRACT_REPAIR_FAIL: ' + message);
  process.exit(1);
}

const mobileGuard = read('scripts/check-closeflow-today-mobile-tile-focus.cjs');

if (mobileGuard.includes("assert(source.includes('moveTodaySectionToTop(sectionKey)'")) {
  fail('old mobile focus guard still requires moveTodaySectionToTop(sectionKey)');
}
if (mobileGuard.includes("assert(source.includes('scrollToTodaySection(sectionKey)'")) {
  fail('old mobile focus guard still requires scrollToTodaySection(sectionKey)');
}
if (!mobileGuard.includes('STAGE223_R2AD_TODAY_TILE_NO_SCROLL_TRAP')) {
  fail('mobile focus guard must recognize R2AD no-scroll contract');
}
if (!mobileGuard.includes('moveTodaySectionToTop nie może przestawiać DOM po R2AD')) {
  fail('mobile focus guard must forbid DOM reorder after R2AD');
}
if (!mobileGuard.includes('scrollToTodaySection nie może wywoływać scrollIntoView po R2AD')) {
  fail('mobile focus guard must forbid scrollIntoView after R2AD');
}

const pkg = JSON.parse(read('package.json'));
if (pkg.scripts['verify:closeflow:quiet'] !== 'node scripts/closeflow-release-check-quiet.cjs') {
  fail('verify:closeflow:quiet exact contract broken');
}

const quiet = read('scripts/closeflow-release-check-quiet.cjs');
for (const token of [
  "runQuiet('today mobile tile focus'",
  "scripts/check-closeflow-today-mobile-tile-focus.cjs",
  "runQuiet('today tile no-scroll trap'",
  "scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs",
]) {
  if (!quiet.includes(token)) fail('quiet gate missing token: ' + token);
}

console.log('STAGE223_R2AF_TODAY_MOBILE_FOCUS_CONTRACT_REPAIR: OK');
