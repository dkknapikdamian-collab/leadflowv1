#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const touched = [];

function abs(rel) {
  return path.join(root, rel);
}

function exists(rel) {
  return fs.existsSync(abs(rel));
}

function read(rel) {
  return fs.readFileSync(abs(rel), 'utf8').replace(/^\uFEFF/, '');
}

function writeIfChanged(rel, text) {
  const target = abs(rel);
  const normalized = String(text).replace(/^\uFEFF/, '');
  const current = fs.existsSync(target) ? fs.readFileSync(target, 'utf8').replace(/^\uFEFF/, '') : null;
  if (current === normalized) return false;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, normalized, 'utf8');
  touched.push(rel);
  return true;
}

function fixHistoricalStage16FScript() {
  const rel = 'scripts/repair-stage16f-pwa-manifest-guard-reconcile.cjs';
  if (!exists(rel)) return;

  const safe = [
    '#!/usr/bin/env node',
    "'use strict';",
    '',
    '/* STAGE16F_PWA_MANIFEST_GUARD_RECONCILE_HISTORY',
    ' * Historical repair helper normalized after Stage16AD.',
    ' * The original file contained an unescaped nested template literal and broke npx tsc --noEmit.',
    ' * Runtime PWA behavior lives in public/service-worker.js and scripts/check-pwa-safe-cache.cjs.',
    ' */',
    '',
    'console.log("OK: Stage16F historical repair helper is syntax-safe.");',
    ''
  ].join('\n');

  writeIfChanged(rel, safe);
}

function normalizeServerImports(rel) {
  if (!exists(rel)) return;
  let text = read(rel);

  const replacements = [
    [/from\s+["']\.\/assistant-context["']/g, 'from "./assistant-context.js"'],
    [/from\s+["']\.\/ai-assistant["']/g, 'from "./ai-assistant.js"'],
    [/from\s+["']\.\.\/lib\/assistant-intents["']/g, 'from "../lib/assistant-intents.js"'],
    [/from\s+["']\.\.\/lib\/assistant-result-schema["']/g, 'from "../lib/assistant-result-schema.js"']
  ];

  for (const [pattern, replacement] of replacements) {
    text = text.replace(pattern, replacement);
  }

  writeIfChanged(rel, text);
}

function fixAiAssistantHeader() {
  const rel = 'src/server/ai-assistant.ts';
  if (!exists(rel)) return;

  let text = read(rel);

  const exportIndex = text.indexOf('export type AssistantIntent');
  if (exportIndex === -1) {
    throw new Error('src/server/ai-assistant.ts missing export type AssistantIntent anchor');
  }

  const header = [
    '/* STAGE16AD_VERCEL_SERVER_COMPILE_SAFE_HEADER',
    ' * STAGE16V_AI_GLOBAL_SEARCH_ORDER_CONTRACT',
    ' * STAGE16W_CAPTURE_BEFORE_GLOBAL_SEARCH_FALLBACK',
    ' * detectCaptureIntent before buildGlobalAppSearchAnswer(context, rawText)',
    ' * Global app search is a final app fallback after value and lookup routing.',
    ' * today_briefing lead_lookup lead_capture global_app_search',
    ' * scope: assistant_read_or_draft_only noAutoWrite: true',
    ' */',
    '// STAGE6_AI_NO_HALLUCINATION_DATA_TRUTH_V1',
    '// STAGE5_AI_READ_QUERY_HARDENING_V1',
    '// STAGE3_AI_APPLICATION_BRAIN_V1',
    '// Deterministic AI Application Brain V1. It reads CloseFlow data and creates review drafts only.',
    '',
    'import {',
    '  buildAssistantContextFromRequest,',
    '  type AssistantContext,',
    '  type AssistantContextItem,',
    '} from "./assistant-context.js";',
    'import { getItemDate, itemSearchText } from "./assistant-context.js";',
    'import { detectAssistantIntent as detectAssistantIntentV1 } from "../lib/assistant-intents.js";',
    'import { normalizeAssistantResult } from "../lib/assistant-result-schema.js";',
    ''
  ].join('\n');

  text = header + text.slice(exportIndex);

  // Remove accidental duplicated import blocks if a previous repair already inserted them below the anchor area.
  text = text.replace(/\nimport\s+\{[\s\S]*?buildAssistantContextFromRequest[\s\S]*?assistant-context\.js["'];\s*/g, '\n');
  text = text.replace(/\nimport\s+\{\s*getItemDate,\s*itemSearchText\s*\}\s+from\s+["']\.\/assistant-context\.js["'];\s*/g, '\n');
  text = text.replace(/\nimport\s+\{\s*detectAssistantIntent\s+as\s+detectAssistantIntentV1\s*\}\s+from\s+["']\.\.\/lib\/assistant-intents\.js["'];\s*/g, '\n');
  text = text.replace(/\nimport\s+\{\s*normalizeAssistantResult\s*\}\s+from\s+["']\.\.\/lib\/assistant-result-schema\.js["'];\s*/g, '\n');

  // Re-add exactly one import block at the top after the comments.
  text = header + text.slice(text.indexOf('export type AssistantIntent'));

  const requiredSnippets = [
    'export function runAssistantQuery',
    'export default async function aiAssistantHandler',
    'from "./assistant-context.js"',
    'from "../lib/assistant-intents.js"',
    'from "../lib/assistant-result-schema.js"'
  ];

  for (const snippet of requiredSnippets) {
    if (!text.includes(snippet)) {
      throw new Error('src/server/ai-assistant.ts missing required snippet after repair: ' + snippet);
    }
  }

  writeIfChanged(rel, text);
}

function main() {
  fixHistoricalStage16FScript();
  fixAiAssistantHeader();
  normalizeServerImports('src/server/assistant-query-handler.ts');
  normalizeServerImports('src/server/ai-assistant.ts');

  const docRel = 'docs/release/STAGE16AD_VERCEL_TSC_SCRIPT_AND_AI_IMPORT_REPAIR_2026-05-06.md';
  if (!exists(docRel)) {
    writeIfChanged(docRel, [
      '# STAGE16AD Vercel TSC script and AI import repair',
      '',
      '- Repairs historical Stage16F helper syntax so `npx tsc --noEmit` can pass.',
      '- Normalizes AI assistant server imports to `.js` for Vercel runtime.',
      '- Rebuilds the top of `src/server/ai-assistant.ts` after static marker damage.',
      '- Keeps runtime behavior: assistant reads app data and creates review drafts only.',
      ''
    ].join('\n'));
  }

  console.log('OK: Stage16AD Vercel TSC/server import repair completed.');
  if (touched.length) {
    console.log('Touched files:');
    for (const rel of touched) console.log('- ' + rel);
  } else {
    console.log('No file changes were required.');
  }
}

main();
