const fs = require('fs');

function fail(message) {
  console.error('STAGE220A19_CARDS_BADGES_METRICS_VST_GUARD: FAIL');
  console.error(message);
  process.exit(1);
}

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

const card = read('src/components/ui/card.tsx');
const badge = read('src/components/ui/badge.tsx');
const css = read('src/styles/closeflow-visual-source-truth.css');
const doc = read('docs/visual/CLOSEFLOW_VISUAL_SOURCE_OF_TRUTH.md');
const pkg = JSON.parse(read('package.json'));

function requireText(text, needle, label) {
  if (!text.includes(needle)) fail(label + ' missing: ' + needle);
}

requireText(card, 'STAGE220A19_CARDS_BADGES_METRICS_VST', 'card marker');
requireText(card, 'data-cf-vst-card="true"', 'Card data marker');
requireText(card, 'cf-vst-card rounded-xl', 'Card VST class');
requireText(card, 'cf-vst-card-header', 'CardHeader VST class');
requireText(card, 'cf-vst-card-title cf-vst-text-card-title', 'CardTitle VST class');
requireText(card, 'cf-vst-card-description cf-vst-text-meta', 'CardDescription VST class');
requireText(card, 'cf-vst-card-content', 'CardContent VST class');
requireText(card, 'cf-vst-card-footer', 'CardFooter VST class');

requireText(badge, 'STAGE220A19_CARDS_BADGES_METRICS_VST', 'badge marker');
requireText(badge, 'cf-vst-badge cf-vst-pill', 'Badge base VST class');
requireText(badge, 'data-cf-vst-badge="true"', 'Badge data marker');
requireText(badge, 'cf-vst-kind-primary', 'Badge primary kind');
requireText(badge, 'cf-vst-kind-status', 'Badge status kind');
requireText(badge, 'cf-vst-kind-delete', 'Badge delete kind');

for (const token of [
  'STAGE220A19_CARDS_BADGES_METRICS_VST',
  '.cf-vst-kind-primary',
  '.cf-vst-card',
  '.cf-vst-card-header',
  '.cf-vst-badge',
  '.cf-vst-chip',
  '.cf-vst-metric-card',
  '.cf-vst-metric-label',
  '.cf-vst-metric-number',
]) {
  requireText(css, token, 'CSS ' + token);
}

requireText(doc, 'STAGE220A19 - kafelki, liczby i pigułki statusów', 'doc A19 section');

const prebuild = String(pkg.scripts && pkg.scripts.prebuild || '');
requireText(prebuild, 'node scripts/check-stage220a19-cards-badges-metrics-vst.cjs', 'prebuild A19 guard');

console.log('STAGE220A19_CARDS_BADGES_METRICS_VST_GUARD: OK');
