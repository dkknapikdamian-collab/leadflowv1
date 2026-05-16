const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const aiDrafts = read('src/pages/AiDrafts.tsx');
const quick = read('src/components/QuickAiCapture.tsx');
const pkg = JSON.parse(read('package.json').replace(/^\uFEFF/, ''));

function fail(message) {
  console.error('[ai-drafts-route-runtime-repair] FAIL: ' + message);
  process.exit(1);
}

[
  'AI_DRAFTS_METRIC_CARD_ALIAS_REPAIR_2026_05_07',
  'const MetricCard = StatShortcutCard;',
  "import { StatShortcutCard } from '../components/StatShortcutCard';",
].forEach((needle) => {
  if (!aiDrafts.includes(needle)) fail('AiDrafts missing marker: ' + needle);
});

if (!quick.includes("import { saveAiLeadDraftAsync, type AiLeadDraftSource } from '../lib/ai-drafts';")) {
  fail('QuickAiCapture must import saveAiLeadDraftAsync');
}
if (!quick.includes('await saveAiLeadDraftAsync({')) fail('QuickAiCapture must await saveAiLeadDraftAsync');
if (!quick.includes('Nie uda\u0142o si\u0119 zapisa\u0107 szkicu AI w Supabase')) fail('QuickAiCapture missing Supabase save error copy');

const runtimeBody = quick.slice(0, quick.indexOf('/*\nPHASE0_QUICK_AI_CAPTURE_GUARD'));
if (runtimeBody.includes('saveAiLeadDraft({')) {
  fail('QuickAiCapture still uses sync saveAiLeadDraft in runtime body');
}

if (pkg.scripts?.['check:ai-drafts-route-runtime-repair'] !== 'node scripts/check-ai-drafts-route-runtime-repair.cjs') {
  fail('package.json missing check:ai-drafts-route-runtime-repair');
}

console.log('[ai-drafts-route-runtime-repair] OK: /ai-drafts runtime MetricCard alias and async draft save are wired');
