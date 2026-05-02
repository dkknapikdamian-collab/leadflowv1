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

const aiDrafts = read('src/lib/ai-drafts.ts');
const today = read('src/components/TodayAiAssistant.tsx');
const page = read('src/pages/AiDrafts.tsx');
const server = read('src/server/ai-drafts.ts');
const globalAssistant = read('src/components/GlobalAiAssistant.tsx');
const pkg = JSON.parse(read('package.json'));

expect(aiDrafts.includes('AI_DRAFTS_SUPABASE_SOURCE_OF_TRUTH_STAGE11'), 'ai-drafts lib must contain P11 marker');
expect(aiDrafts.includes('isProductionRuntime'), 'ai-drafts lib must detect production runtime');
expect(aiDrafts.includes('canUseDevLocalDraftFallback'), 'ai-drafts lib must limit localStorage to dev fallback');
expect(aiDrafts.includes("throw new Error('AI_DRAFT_SUPABASE_REQUIRED_USE_ASYNC')"), 'sync save/update/delete must not be allowed as production source of truth');
expect(aiDrafts.includes('return await createAiLeadDraftInSupabaseRequired'), 'saveAiLeadDraftAsync must wait for Supabase response');
expect(aiDrafts.includes('if (canUseDevLocalDraftFallback())'), 'dev-only fallback must be explicit');
expect(aiDrafts.includes('clearProductionLocalDrafts'), 'production must clear local AI draft cache');
expect(aiDrafts.includes('clearAiDraftLocalRawText'), 'converted/archived draft rawText must be scrubbed locally');
expect(aiDrafts.includes('removeAiDraftFromLocalCache'), 'delete/cleanup must touch local cache');
expect(!aiDrafts.includes('void pushAiLeadDraftToSupabase(draft).catch(() => null);'), 'ai-drafts must not silently push after local success');

expect(today.includes("import { saveAiLeadDraftAsync } from '../lib/ai-drafts';"), 'TodayAiAssistant must import async Supabase draft save');
expect(!today.includes("import { saveAiLeadDraft } from '../lib/ai-drafts';"), 'TodayAiAssistant must not import sync local draft save');
expect(!today.includes('saveAiLeadDraft({'), 'TodayAiAssistant must not use or document sync local draft save');
expect(today.includes('await saveAiLeadDraftAsync'), 'TodayAiAssistant must await Supabase draft save');
// P11C_FINISH_GUARD
expect(!today.includes('saveAiLeadDraft({'), 'TodayAiAssistant must not contain sync saveAiLeadDraft call after Supabase-first migration');
expect(!today.includes('if (!latestUsage.canUse && !latestUsage.adminExempt) {\n    if (!latestUsage.canUse && !latestUsage.adminExempt) {'), 'TodayAiAssistant must not contain duplicated latestUsage newline seam');
expect(today.includes('Nie udało się zapisać szkicu AI w Supabase'), 'TodayAiAssistant must show Supabase save error');
expect(today.includes('Szkic zapisany w Supabase'), 'TodayAiAssistant success copy must be Supabase-backed');

expect(page.includes('Nie udało się pobrać szkiców AI z Supabase'), 'AiDrafts page must show Supabase fetch error');
expect(page.includes('await getAiLeadDraftsAsync()'), 'AiDrafts page must load drafts from async Supabase source');
expect(page.includes("rawText: ''"), 'AiDrafts approval/archive must clear rawText');

expect(server.includes('ai_drafts'), 'server ai-drafts must remain present');
expect(server.includes('workspace'), 'server ai-drafts must remain workspace-scoped');
expect(globalAssistant.includes('drafts: asRecordArray'), 'GlobalAiAssistant must continue passing Supabase drafts context');

expect(pkg.scripts && pkg.scripts['check:p11-ai-drafts-supabase-source'], 'package.json missing check:p11-ai-drafts-supabase-source');

if (fail.length) {
  console.error('P11 AI drafts Supabase source guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}

console.log('OK: P11 AI drafts Supabase source guard passed.');
