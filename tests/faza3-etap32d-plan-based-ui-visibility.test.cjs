const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8').replace(/^\uFEFF/, '');
}

test('Faza 3 Etap 3.2D hides AI navigation and global actions by plan', () => {
  const layout = read('src/components/Layout.tsx');
  const globalActions = read('src/components/GlobalQuickActions.tsx');
  const quickAi = read('src/components/QuickAiCapture.tsx');

  assert.match(layout, /canUseAiDraftsByPlan\s*=\s*Boolean\([\s\S]*lightDrafts[\s\S]*fullAi[\s\S]*\)/);
  assert.match(layout, /\.\.\.\(canUseAiDraftsByPlan\s*\?\s*\[\{ icon: CheckCircle2, label: 'Inbox szkiców', path: '\/ai-drafts' \}\]\s*:\s*\[\]\)/);

  assert.match(globalActions, /canUseFullAiAssistantByPlan\s*=\s*Boolean\([\s\S]*fullAi[\s\S]*\)/);
  assert.match(globalActions, /\{canUseFullAiAssistantByPlan \? \([\s\S]*<GlobalAiAssistant \/>[\s\S]*\) : null\}/);
  assert.match(globalActions, /\{canUseQuickAiCaptureByPlan \? <QuickAiCapture \/> : null\}/);
  assert.match(globalActions, /\{canUseAiDraftsByPlan \? \([\s\S]*to="\/ai-drafts"[\s\S]*\) : null\}/);
  assert.doesNotMatch(globalActions, /data-global-quick-action="ai-locked"/);
  assert.ok(globalActions.includes('Asystent AI jest w planie AI') || globalActions.includes('canUseFullAiAssistantByPlan'));

  assert.match(quickAi, /quickAiVisibleByPlan\s*=\s*Boolean\([\s\S]*lightDrafts[\s\S]*lightParser[\s\S]*fullAi[\s\S]*\)/);
  assert.match(quickAi, /if \(!quickAiVisibleByPlan\) return null;/);
});

test('Faza 3 Etap 3.2D blocks /ai-drafts direct route for plans without drafts', () => {
  const aiDrafts = read('src/pages/AiDrafts.tsx');
  const pkg = JSON.parse(read('package.json'));
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');

  assert.match(aiDrafts, /function AiDraftsInner\(\)/);
  assert.match(aiDrafts, /export default function AiDrafts\(\)/);
  assert.match(aiDrafts, /data-plan-route-blocker="ai-drafts"/);
  assert.match(aiDrafts, /canUseAiDraftsByPlan\s*=\s*Boolean\([\s\S]*lightDrafts[\s\S]*fullAi[\s\S]*\)/);
  assert.match(aiDrafts, /Dostępne od planu Basic/);
  assert.match(aiDrafts, /href="\/billing"/);

  assert.equal(pkg.scripts['check:faza3-etap32d-plan-based-ui-visibility'], 'node scripts/check-faza3-etap32d-plan-based-ui-visibility.cjs');
  assert.equal(pkg.scripts['test:faza3-etap32d-plan-based-ui-visibility'], 'node --test tests/faza3-etap32d-plan-based-ui-visibility.test.cjs');
  assert.match(quiet, /tests\/faza3-etap32d-plan-based-ui-visibility\.test\.cjs/);
});
