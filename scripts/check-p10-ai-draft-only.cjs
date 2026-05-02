#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function expect(condition, message) {
  if (!condition) fail.push(message);
}

const today = read('src/components/TodayAiAssistant.tsx');
const assistantLib = read('src/lib/ai-assistant.ts');
const directGuard = read('src/lib/ai-direct-write-guard.ts');
const aiDrafts = read('src/lib/ai-drafts.ts');
const serverAssistant = read('src/server/ai-assistant.ts');
const serverDrafts = read('src/server/ai-drafts.ts');
const pkg = JSON.parse(read('package.json'));

const forbiddenToday = [
  'Jasne rekordy od razu',
  'Możesz pozwolić na natychmiastowy zapis',
  'AI_DIRECT_WRITE_TASK_EVENT_BRANCH',
  'AI_DIRECT_WRITE_LEAD_BRANCH',
  'insertTaskToSupabase',
  'insertEventToSupabase',
  'createLeadFromAiDraftApprovalInSupabase',
  'noAutoWrite: false',
  'directWriteMode',
  'handleDirectWriteModeChange',
  'parseAiDirectWriteCommand',
  'AiDirectWriteMode',
  'persistAiDirectWriteMode',
  'getStoredAiDirectWriteMode'
];

for (const needle of forbiddenToday) {
  expect(!today.includes(needle), 'TodayAiAssistant must not contain ' + needle);
}

expect(!/<Badge[^>]*>\s*<\/Badge>/.test(today), 'TodayAiAssistant must not render empty badges');
expect(today.includes('AI przygotowuje szkic. Ty zatwierdzasz zapis.'), 'TodayAiAssistant must show draft-only safety copy');
expect(today.includes('getAiDraftTypeForWriteCommand'), 'TodayAiAssistant must route write commands into AI drafts');
expect(today.includes("saveAiLeadDraft({ rawText: command, source: 'today_assistant', type"), 'write commands must save AI drafts with type');
expect(today.includes("type AiDraftCommandType = 'lead' | 'task' | 'event' | 'note'"), 'TodayAiAssistant draft answer must support lead/task/event/note');
expect(today.includes('Bez zapisz = szukanie'), 'TodayAiAssistant must keep read-only query explanation');

// P10C_SYNTAX_SEAM_GUARD: previous patch versions could glue repeated fragments together.
expect(!today.includes('const EXAMPLES = [const EXAMPLES = ['), 'TodayAiAssistant must not contain duplicated EXAMPLES seam');
expect(!today.includes('if (!latestUsage.canUse && !latestUsage.adminExempt) {    if (!latestUsage.canUse && !latestUsage.adminExempt) {'), 'TodayAiAssistant must not contain duplicated latestUsage seam');

expect(directGuard.includes('AI_DIRECT_WRITE_ENABLED = false'), 'ai-direct-write-guard must hard-disable direct write');
expect(directGuard.includes('if (!AI_DIRECT_WRITE_ENABLED) return null;'), 'direct write parser must return null when disabled');
expect(assistantLib.includes('AI_DRAFT_ONLY_POLICY_STAGE10_CLIENT_NORMALIZE'), 'ai-assistant client must normalize noAutoWrite true');
expect(assistantLib.includes('noAutoWrite: true'), 'ai-assistant client must force noAutoWrite true');

expect(aiDrafts.includes("type?: 'lead' | 'task' | 'event' | 'note'"), 'ai-drafts must support draft types lead/task/event/note');
expect(serverAssistant.includes("scope: 'assistant_read_or_draft_only'"), 'server ai-assistant must keep read-or-draft scope');
expect(!serverAssistant.includes('noAutoWrite: false'), 'server ai-assistant must not return direct write');
expect(serverDrafts.includes('ai_drafts') || serverDrafts.includes('ai_draft'), 'server ai-drafts endpoint must remain present');

expect(pkg.scripts && pkg.scripts['check:p10-ai-draft-only'], 'package.json missing check:p10-ai-draft-only');

if (fail.length) {
  console.error('P10 AI draft-only guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}

console.log('OK: P10 AI draft-only guard passed.');
