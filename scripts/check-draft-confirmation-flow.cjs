const fs = require('fs');
const path = require('path');
const assert = require('assert');

function read(file) {
  return fs.readFileSync(path.resolve(file), 'utf8');
}

function mustInclude(content, fragment, label) {
  assert.ok(content.includes(fragment), `${label}: missing \"${fragment}\"`);
}

const draftsLib = read('src/lib/drafts.ts');
mustInclude(draftsLib, 'export type AppDraft = {', 'src/lib/drafts.ts');
mustInclude(draftsLib, 'export type AppDraftStatus = "pending" | "confirmed" | "cancelled" | "expired" | "failed";', 'src/lib/drafts.ts');
mustInclude(draftsLib, 'confirmAppDraft', 'src/lib/drafts.ts');
mustInclude(draftsLib, 'cancelAppDraft', 'src/lib/drafts.ts');

const draftsServer = read('src/server/drafts.ts');
mustInclude(draftsServer, "action === 'confirm'", 'src/server/drafts.ts');
mustInclude(draftsServer, "createFinalRecordFromDraft", 'src/server/drafts.ts');
mustInclude(draftsServer, "raw_text: null", 'src/server/drafts.ts');
mustInclude(draftsServer, "action === 'cancel'", 'src/server/drafts.ts');
mustInclude(draftsServer, "action === 'expire'", 'src/server/drafts.ts');

const systemApi = read('api/system.ts');
mustInclude(systemApi, "kind === 'drafts'", 'api/system.ts');
mustInclude(systemApi, 'draftsHandler', 'api/system.ts');

const quickCapture = read('src/components/QuickAiCapture.tsx');
mustInclude(quickCapture, 'saveAiLeadDraft', 'src/components/QuickAiCapture.tsx');
mustInclude(quickCapture, 'Tryb: szkic do potwierdzenia', 'src/components/QuickAiCapture.tsx');

const todayAiAssistant = read('src/components/TodayAiAssistant.tsx');
mustInclude(todayAiAssistant, 'saveAiLeadDraftAsync', 'src/components/TodayAiAssistant.tsx');
mustInclude(todayAiAssistant, 'Finalny rekord nie został utworzony', 'src/components/TodayAiAssistant.tsx');

const todayPage = read('src/pages/Today.tsx');
mustInclude(todayPage, 'title="Do sprawdzenia"', 'src/pages/Today.tsx');

console.log('PASS check-draft-confirmation-flow');
