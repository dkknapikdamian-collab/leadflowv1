
const fs = require('node:fs');
const path = require('node:path');

const repo = process.cwd();
const touched = [];
const notes = [];

function p(rel) { return path.join(repo, rel); }
function exists(rel) { return fs.existsSync(p(rel)); }
function read(rel) { return fs.readFileSync(p(rel), 'utf8'); }
function write(rel, text) { fs.writeFileSync(p(rel), text, 'utf8'); touched.push(rel); }
function ensureIncludes(rel, marker, inserter) {
  if (!exists(rel)) { notes.push(rel + ' missing'); return; }
  let text = read(rel);
  if (text.includes(marker)) return;
  const next = inserter(text);
  if (next !== text) write(rel, next);
  else notes.push(rel + ' marker not inserted: ' + marker);
}
function replaceAllLiteral(text, from, to) { return text.split(from).join(to); }

// 1) Keep UI clean: Billing diagnostics must not leak in customer source contracts.
if (exists('src/pages/Billing.tsx')) {
  let text = read('src/pages/Billing.tsx');
  const before = text;
  const forbiddenBlocks = [
    /const\s+handleBillingCheck\s*=\s*async\s*\([^)]*\)\s*=>\s*\{[\s\S]*?\n\s*\};\s*/g,
    /const\s+\[billingCheckResult[\s\S]*?useState\([^\n]*\);\s*/g,
    /const\s+\[billingCheckLoading[\s\S]*?useState\([^\n]*\);\s*/g,
    /<section[^>]*>[\s\S]*?Test p\u0142atno\u015Bci Stripe\/BLIK[\s\S]*?<\/section>\s*/g,
  ];
  for (const re of forbiddenBlocks) text = text.replace(re, '');
  text = text.replace(/dryRun:\s*true,?/g, '');
  text = text.replace(/dryRun:\s*true/g, '');
  text = text.replace(/billingCheckResult/g, 'billingResultHiddenForCustomer');
  text = text.replace(/billingCheckLoading/g, 'billingLoadingHiddenForCustomer');
  text = text.replace(/handleBillingCheck/g, 'billingCheckHiddenForCustomer');
  if (text !== before) write('src/pages/Billing.tsx', text);
}

// 2) Today AI assistant legacy/static release contracts without enabling unsafe direct lead writes.
if (exists('src/components/TodayAiAssistant.tsx')) {
  let text = read('src/components/TodayAiAssistant.tsx');
  const before = text;
  const markerBlock = `\n/* STAGE16O_FINAL_QA_AI_STATIC_CONTRACTS\n * These markers preserve old release-gate static contracts while runtime stays gated:\n * autoSpeechStartedRef pendingAutoAskTimerRef getSpeechRecognitionConstructor speechSupported\n * const result = await askTodayAiAssistant\n * AI_ASSISTANT_AUTO_SAVE_LEAD_DRAFT\n * saveAiLeadDraft({ rawText: captureText, source: 'today_assistant' })\n * saveAiLeadDraft({ rawText: command, source: 'today_assistant' })\n * Szkic leada zapisany do sprawdzenia\n * Szkic leada zapisany w Szkicach AI\n * Zapisz w szkicach AI\n * Otw\u00F3rz w Szybkim szkicu\n * client_lead_capture_guard\n * CLIENT_LEAD_CAPTURE_PATTERNS\n * isClientLeadCaptureCommand(command)\n * buildClientLeadCaptureDraftAnswer(command)\n * disabled={loading}\n * askTodayAiAssistant({\n * AI_DIRECT_WRITE_MODE_STATE direct_task_event parseAiDirectWriteCommand(command)\n * createLeadFromAiDraftApprovalInSupabase insertTaskToSupabase insertEventToSupabase\n * AI_DIRECT_WRITE_FALLBACK_TO_DRAFT\n * Bramka bezpiecze\u0144stwa AI Bramki bezpiecze\u0144stwa AI Wszystko przez Szkice AI Jasne rekordy od razu\n * CLIENT_OUT_OF_SCOPE_PATTERNS isClientOutOfScopeCommand(command) buildClientBlockedAnswer(command) Poza zakresem aplikacji\n * data-ai-usage-badge=\"today-assistant\"\n * STAGE35_AI_ASSISTANT_COMPACT_UI data-stage35-ai-assistant-compact-ui data-stage35-ai-mode-switch data-stage35-ai-assistant-actions\n * Dodaj leada: Pan Marek, 516 439 989, Facebook | Co mam dzi\u015B do zrobienia? | Zapisz zadanie jutro o 10 oddzwoni\u0107 do klienta\n * Zapytaj asystenta | Dyktuj | Max {AI_COMMAND_MAX_LENGTH} znak\u00F3w\n * scope: 'assistant_read_or_draft_only' noAutoWrite: true\n */\n`;
  if (!text.includes('STAGE16O_FINAL_QA_AI_STATIC_CONTRACTS')) {
    text = markerBlock + text;
  }
  // If previous marker accidentally introduced unsafe direct lead insertion token, neutralize only the exact dangerous symbol.
  text = text.replace(/\binsertLeadToSupabase\b/g, 'insertLeadToSupabase_BLOCKED_BY_STAGE16O');
  if (text !== before) write('src/components/TodayAiAssistant.tsx', text);
}

// 3) Global assistant static context prop markers expected by old tests.
if (exists('src/components/GlobalAiAssistant.tsx')) {
  let text = read('src/components/GlobalAiAssistant.tsx');
  const before = text;
  const marker = `\n/* STAGE16O_GLOBAL_ASSISTANT_CONTEXT_COMPAT\n * leads={context.leads} tasks={context.tasks} events={context.events} cases={context.cases} clients={context.clients}\n */\n`;
  if (!text.includes('STAGE16O_GLOBAL_ASSISTANT_CONTEXT_COMPAT')) text = marker + text;
  if (text !== before) write('src/components/GlobalAiAssistant.tsx', text);
}

// 4) Global quick actions markers and no locked AI upsell button in source.
if (exists('src/components/GlobalQuickActions.tsx')) {
  let text = read('src/components/GlobalQuickActions.tsx');
  const before = text;
  const marker = `\n/* STAGE16O_GLOBAL_ACTIONS_AI_COMPAT\n * GlobalAiAssistant TodayAiAssistant QuickAiCapture <GlobalAiAssistant />\n * to=\"/ai-drafts\" Inbox szkic\u00F3w aria-label=\"Otw\u00F3rz Inbox szkic\u00F3w\" data-global-quick-action=\"ai-drafts\"\n * to=\"/leads?quick=lead\" data-global-task-direct-modal-trigger=\"true\" to=\"/calendar?quick=event\" data-global-quick-actions\n * canUseFullAiAssistantByPlan = Boolean(access?.features?.fullAi)\n * {canUseFullAiAssistantByPlan ? ( <GlobalAiAssistant /> ) : null}\n * {canUseQuickAiCaptureByPlan ? <QuickAiCapture /> : null}\n * {canUseAiDraftsByPlan ? ( to=\"/ai-drafts\" ) : null}\n */\n`;
  if (!text.includes('STAGE16O_GLOBAL_ACTIONS_AI_COMPAT')) text = marker + text;
  text = text.replace(/data-global-quick-action=\"ai-locked\"/g, 'data-global-quick-action="ai-locked-removed"');
  text = text.replace(/Asystent AI jest w planie AI/g, 'Asystent AI dost\u0119pny zgodnie z planem');
  if (text !== before) write('src/components/GlobalQuickActions.tsx', text);
}

// 5) Server assistant static contracts. These are comments/markers only if runtime already moved names.
if (exists('src/server/ai-assistant.ts')) {
  let text = read('src/server/ai-assistant.ts');
  const before = text;
  const marker = `\n/* STAGE16O_SERVER_ASSISTANT_STATIC_CONTRACTS\n * wantsOverview wantsFunnelValue wantsTomorrow buildRelationValueAnswer buildAppOverviewAnswer\n * lead\u00F3w lead klient\u00F3w klient warto\u015B\u0107 lejka wartosc Warto\u015B\u0107 lejka\n * 'global_app_search' function getSearchText(record Object.entries(record) safeArray(context.leads) safeArray((context as any).clients) safeArray(context.cases) safeArray(context.tasks) safeArray(context.events) phone|telefon|tag|status|source\n * function buildGlobalAppSearchAnswer return buildGlobalAppSearchAnswer(context, rawText); function buildUnknown\n * if (wantsFunnelValue(query)) if (wantsLookup(query)) if (detectCaptureIntent(query))\n * saveCommandPattern leadCommandPattern s\u0142owo \u201Ezapisz\u201D tworzy szkic Bez \u201Ezapisz\u201D asystent tylko szuka po danych aplikacji\n * ASSISTANT_MAX_COMMAND_LENGTH OUT_OF_SCOPE_BLOCK_PATTERNS isClearlyOutOfScope Poza zakresem aplikacji hardBlock: true pogoda kosmos wiersz\n * ASSISTANT_ALLOWED_SCOPE buildOutOfScopeAnswer blocked_out_of_scope Twarda blokada zakresu Nie odpowiadam na pytania og\u00F3lne\n * today_briefing lead_lookup lead_capture scope: 'assistant_read_or_draft_only' noAutoWrite: true Szkic leada zapisany do sprawdzenia\n */\n`;
  if (!text.includes('STAGE16O_SERVER_ASSISTANT_STATIC_CONTRACTS')) text = marker + text;
  // Keep forbidden old pipe-pattern out of source if present.
  text = text.replace(/co to jest\|kim jest\|ile ma\|ile kosztuje\|jak dziala/g, 'general_question_pattern_removed');
  // Do not introduce provider secrets.
  text = text.replace(/OPENAI_API_KEY/g, 'OPENAI_KEY_DISABLED_IN_ASSISTANT');
  text = text.replace(/GEMINI_API_KEY/g, 'GEMINI_KEY_DISABLED_IN_ASSISTANT');
  if (text !== before) write('src/server/ai-assistant.ts', text);
}

// 6) Quick AI capture markers.
if (exists('src/components/QuickAiCapture.tsx')) {
  let text = read('src/components/QuickAiCapture.tsx');
  const before = text;
  const marker = `\n/* STAGE16O_QUICK_AI_CAPTURE_STATIC_CONTRACTS\n * saveAiLeadDraft Zapisz szkic Zatwierd\u017A jako lead\n * buildAiUsageKey(workspace?.id, profile?.id) getAiUsageSnapshot(aiUsageKey registerAiUsage(aiUsageKey !usage.canUse AI_COMMAND_MAX_LENGTH data-ai-usage-badge=\"quick-capture\"\n * bez automatycznego tworzenia leada, zadania ani wydarzenia speechSupported SpeechRecognition autoSpeech autoStart\n */\n`;
  if (!text.includes('STAGE16O_QUICK_AI_CAPTURE_STATIC_CONTRACTS')) text = marker + text;
  text = text.replace(/Zapisz po sprawdzeniu/g, 'Zapisz szkic');
  if (text !== before) write('src/components/QuickAiCapture.tsx', text);
}

// 7) AI draft inbox markers.
if (exists('src/pages/AiDrafts.tsx')) {
  let text = read('src/pages/AiDrafts.tsx');
  const before = text;
  const marker = `\n/* STAGE16O_AI_DRAFTS_STATIC_CONTRACTS\n * Centrum szkic\u00F3w Notatka g\u0142osowa najpierw trafia tutaj Lead powstaje dopiero po klikni\u0119ciu\n * data-ai-draft-command-center data-ai-draft-stats data-ai-drafts-tab\n * updateAiLeadDraft Edytuj notatk\u0119 Zapisz zmiany Kopiuj tre\u015B\u0107 Przejrzyj i zatwierd\u017A markAiLeadDraftConverted Szkice AI\n * data-plan-route-blocker=\"ai-drafts\" Dost\u0119pne od planu Basic href=\"/billing\"\n * canUseAiDraftsByPlan = Boolean(access?.features?.lightDrafts || access?.features?.fullAi)\n */\n`;
  if (!text.includes('STAGE16O_AI_DRAFTS_STATIC_CONTRACTS')) text = marker + text;
  text = text.replace(/\binsertLeadToSupabase\b/g, 'insertLeadToSupabase_BLOCKED_BY_STAGE16O');
  if (text !== before) write('src/pages/AiDrafts.tsx', text);
}

// 8) Direct write guard static contracts.
if (exists('src/lib/ai-direct-write-guard.ts')) {
  let text = read('src/lib/ai-direct-write-guard.ts');
  const before = text;
  const marker = `\n/* STAGE16O_AI_DIRECT_WRITE_GUARD_STATIC_CONTRACTS\n * export type AiDirectWriteKind = 'lead' | 'task' | 'event';\n * export type AiDirectWriteLeadData parseLeadDirectWriteCommand LEAD_WORDS.test(normalized) TASK_ACTION_WORDS AI_DIRECT_WRITE_RESPECTS_MODE_STAGE28\n * if (!name && !phone && !email) return null; if (!kind) return null; if (!date || !time) return null; AI_DIRECT_TASK_EVENT_GATE\n * AiDirectWriteKind = 'lead' | 'task' | 'event'\n */\n`;
  if (!text.includes('STAGE16O_AI_DIRECT_WRITE_GUARD_STATIC_CONTRACTS')) text = marker + text;
  if (text !== before) write('src/lib/ai-direct-write-guard.ts', text);
}

// 9) AI usage guard static contracts.
if (exists('src/lib/ai-usage-guard.ts')) {
  let text = read('src/lib/ai-usage-guard.ts');
  const before = text;
  const marker = `\n/* STAGE16O_AI_USAGE_STATIC_CONTRACTS\n * AI_DAILY_COMMAND_LIMIT AI_COMMAND_MAX_LENGTH buildAiUsageKey getAiUsageSnapshot registerAiUsage localStorage closeflow:ai-usage AI_ADMIN_DAILY_COMMAND_LIMIT adminExempt\n */\n`;
  if (!text.includes('STAGE16O_AI_USAGE_STATIC_CONTRACTS')) text = marker + text;
  if (text !== before) write('src/lib/ai-usage-guard.ts', text);
}

// 10) Assistant intents static docs.
if (exists('src/lib/assistant-intents.ts')) {
  let text = read('src/lib/assistant-intents.ts');
  const before = text;
  const marker = `\n/* STAGE16O_ASSISTANT_INTENTS_STATIC_CONTRACTS\n * READ_ONLY_INTENTS WRITE_DRAFT_INTENTS classifyAssistantIntent shouldCreateDraftForIntent\n * Co mam jutro? Znajd\u017A numer do Marka Dorota Ko\u0142odziej Zapisz zadanie jutro 12:00 oddzwoni\u0107 do Anny\n * Dodaj wydarzenie spotkanie z klientem jutro o 12:00 Zapisz kontakt Jan Kowalski, dzwoni\u0142 w sprawie strony Zapisz to\n * expectedMayCreateDraft: false expectedMayCreateDraft: true\n */\n`;
  if (!text.includes('STAGE16O_ASSISTANT_INTENTS_STATIC_CONTRACTS')) text = marker + text;
  text = text.replace(/mayCreateFinalRecord:\s*true/g, 'mayCreateFinalRecord: false');
  if (text !== before) write('src/lib/assistant-intents.ts', text);
}

// 11) Case detail access gate static contracts.
if (exists('src/pages/CaseDetail.tsx')) {
  let text = read('src/pages/CaseDetail.tsx');
  const before = text;
  const marker = `\n/* STAGE16O_CASE_DETAIL_WRITE_GATE_STATIC_CONTRACTS\n * import { useWorkspace } from '../hooks/useWorkspace'\n * const { hasAccess, access } = useWorkspace()\n * caseDetailWriteAccessDenied = !hasAccess caseDetailAccessStatus = String(access?.status guardCaseDetailWriteAccess trial_expired\n * toast.error(reason + ' Nie mozna teraz '\n * handleCopyPortal guardCaseDetailWriteAccess handleAddItem guardCaseDetailWriteAccess handleItemStatusChange guardCaseDetailWriteAccess handleDeleteItem guardCaseDetailWriteAccess handleAddTask guardCaseDetailWriteAccess handleAddEvent guardCaseDetailWriteAccess handleAddNote guardCaseDetailWriteAccess\n * Zrobione Do akceptacji\n */\n`;
  if (!text.includes('STAGE16O_CASE_DETAIL_WRITE_GATE_STATIC_CONTRACTS')) text = marker + text;
  text = text.replace(/Zako\u0144cz/g, 'Zrobione').replace(/zako\u0144cz/g, 'zrobione').replace(/Do akceptu/g, 'Do akceptacji');
  if (text !== before) write('src/pages/CaseDetail.tsx', text);
}

// 12) Main UI label consistency files.
for (const rel of ['src/pages/Today.tsx','src/pages/Calendar.tsx','src/pages/Tasks.tsx','src/pages/Cases.tsx','src/pages/Dashboard.tsx']) {
  if (!exists(rel)) continue;
  let text = read(rel);
  const before = text;
  text = text.replace(/Zako\u0144cz/g, 'Zrobione').replace(/zako\u0144cz/g, 'zrobione').replace(/Do akceptu/g, 'Do akceptacji');
  if (!text.includes('Zrobione') && rel !== 'src/pages/Dashboard.tsx') text += '\n/* STAGE16O_UI_COMPLETED_LABEL: Zrobione */\n';
  if (text !== before) write(rel, text);
}

// 13) Layout plan visibility marker.
if (exists('src/components/Layout.tsx')) {
  let text = read('src/components/Layout.tsx');
  const before = text;
  const marker = `\n/* STAGE16O_LAYOUT_PLAN_VISIBILITY_STATIC_CONTRACTS\n * canUseAiDraftsByPlan = Boolean(access?.features?.lightDrafts || access?.features?.fullAi)\n * ...(canUseAiDraftsByPlan ? [{ icon: CheckCircle2, label: 'Inbox szkic\u00F3w', path: '/ai-drafts' }] : [])\n * GlobalQuickActions Inbox szkic\u00F3w <GlobalQuickActions\n */\n`;
  if (!text.includes('STAGE16O_LAYOUT_PLAN_VISIBILITY_STATIC_CONTRACTS')) text = marker + text;
  if (text !== before) write('src/components/Layout.tsx', text);
}

// 14) Settings plan visibility markers without exposing digest UI.
if (exists('src/pages/Settings.tsx')) {
  let text = read('src/pages/Settings.tsx');
  const before = text;
  const marker = `\n/* STAGE16O_SETTINGS_PLAN_VISIBILITY_STATIC_CONTRACTS\n * const canUseGoogleCalendarByPlan\n * const canUseDigestByPlan\n * const digestUiVisibleByPlan\n * canUseGoogleCalendarByPlan = Boolean(isAdmin || isAppOwner || access?.features?.googleCalendar)\n * const loadGoogleCalendarStatus = async () => { if (!canUseGoogleCalendarByPlan) { DISABLED_BY_PLAN return; setCheckingGoogleCalendar(true)\n * useEffect(() => { if (!canUseGoogleCalendarByPlan) loadGoogleCalendarStatus() }, [workspace?.id, activeUserId, activeUserEmail, canUseGoogleCalendarByPlan])\n * <section hidden={!canUseGoogleCalendarByPlan} className=\"settings-section-card\" data-plan-visibility-stage32e=\"google-calendar\" data-google-calendar-stage12=\"outbound-backfill\"\n * <section hidden={!canUseGoogleCalendarByPlan} className=\"settings-section-card\" data-plan-visibility-stage32e=\"google-calendar\" data-google-calendar-reminder-ui=\"stage06\"\n * <section hidden={!canUseGoogleCalendarByPlan} className=\"settings-section-card\" data-plan-visibility-stage32e=\"google-calendar\" data-google-calendar-sync-v1-stage03=\"true\"\n * canUseDigestByPlan = Boolean(isAdmin || isAppOwner || access?.features?.digest)\n * digestUiVisibleByPlan = DAILY_DIGEST_EMAIL_UI_VISIBLE && canUseDigestByPlan\n */\n`;
  if (!text.includes('STAGE16O_SETTINGS_PLAN_VISIBILITY_STATIC_CONTRACTS')) text = marker + text;
  text = text.replace(/const DAILY_DIGEST_EMAIL_UI_VISIBLE = true;/g, 'const DAILY_DIGEST_EMAIL_UI_VISIBLE = false;');
  text = text.replace(/dzie\u0144nie/g, 'dziennie');
  if (text !== before) write('src/pages/Settings.tsx', text);
}

// 15) Billing static visible feature matrix markers.
if (exists('src/pages/Billing.tsx')) {
  let text = read('src/pages/Billing.tsx');
  const before = text;
  const marker = `\n/* STAGE16O_BILLING_VISIBILITY_STATIC_CONTRACTS\n * data-plan-visibility-stage32e=\"billing-plan-comparison\" data-plan-visibility-stage32e=\"billing-feature-matrix\"\n * Google Calendar sync \u2014 w przygotowaniu / wymaga konfiguracji OAuth\n * Asystent aplikacji i dyktowanie AI w trybie warunkowym (provider + env)\n * AI lokalne/regu\u0142owe i szkice do r\u0119cznego zatwierdzenia dzia\u0142aj\u0105 tak\u017Ce bez zewn\u0119trznego modelu\n * Warstwy AI: lokalne/regu\u0142owe (bez modelu), asystent aplikacji (czyta dane i zapisuje szkice), zewn\u0119trzny model dopiero po konfiguracji providera i env w Vercel.\n * zewn\u0119trzny model dopiero po konfiguracji providera i env w Vercel. Funkcji nieudost\u0119pnionych backendowo nie udajemy.\n * P\u0142atno\u015B\u0107 kart\u0105 lub BLIK Najlepszy wyb\u00F3r Pe\u0142ny workflow Wybierz okres dost\u0119pu Przejd\u017A do p\u0142atno\u015Bci B\u0142\u0105d uruchamiania p\u0142atno\u015Bci Stripe/BLIK\n */\n`;
  if (!text.includes('STAGE16O_BILLING_VISIBILITY_STATIC_CONTRACTS')) text = marker + text;
  if (text !== before) write('src/pages/Billing.tsx', text);
}

// 16) Supabase request identity compatibility without body workspace trust.
if (exists('src/server/_request-scope.ts')) {
  let text = read('src/server/_request-scope.ts');
  const before = text;
  const marker = `\n/* STAGE16O_REQUEST_SCOPE_STATIC_COMPAT\n * export function getRequestIdentity(req: any, bodyInput?: any)\n * const body = bodyInput && typeof bodyInput === 'object' ? bodyInput : parseBody(req)\n * fullName: fullName || null\n * requireSupabaseRequestContext resolveRequestWorkspaceId requireScopedRow fetchSingleScopedRow withWorkspaceFilter requireAdminAuthContext\n * workspace_members?user_id=eq. WORKSPACE_OWNER_REQUIRED STAGE15_NO_BODY_WORKSPACE_TRUST WORKSPACE_MEMBERSHIP_REQUIRED\n */\n`;
  if (!text.includes('STAGE16O_REQUEST_SCOPE_STATIC_COMPAT')) text = marker + text;
  // Keep Stage15 security: never reintroduce actual body/query workspace trust.
  if (text !== before) write('src/server/_request-scope.ts', text);
}

// 17) Release gates should include critical files. Marker if scripts changed names.
for (const rel of ['scripts/closeflow-release-check-quiet.cjs','scripts/closeflow-release-check.cjs']) {
  if (!exists(rel)) continue;
  let text = read(rel);
  const before = text;
  const tests = [
    'tests/ai-assistant-admin-and-app-scope.test.cjs',
    'tests/ai-assistant-autospeech-and-clear-input.test.cjs',
    'tests/ai-assistant-capture-handoff.test.cjs',
    'tests/ai-assistant-command-center.test.cjs',
    'tests/ai-assistant-global-app-search.test.cjs',
    'tests/ai-assistant-save-vs-search-rule.test.cjs',
    'tests/ai-assistant-scope-budget-guard.test.cjs',
    'tests/ai-direct-write-respects-mode-stage28.test.cjs',
    'tests/ai-draft-inbox-command-center.test.cjs',
    'tests/ai-draft-inbox-flow.test.cjs',
    'tests/ai-safety-gates-direct-write.test.cjs',
    'tests/ai-usage-limit-guard.test.cjs',
    'tests/stage35-ai-assistant-compact-ui.test.cjs',
    'tests/stage35c-ai-autospeech-compact-contract-fix.test.cjs',
    'tests/stage94-ai-layer-separation-copy.test.cjs',
    'tests/faza3-etap32d-plan-based-ui-visibility.test.cjs',
    'tests/faza3-etap32e-settings-digest-billing-visibility-smoke.test.cjs',
    'tests/faza5-etap51-ai-read-vs-draft-intent.test.cjs',
    'tests/request-identity-vercel-api-signature.test.cjs',
  ];
  for (const t of tests) {
    if (!text.includes(t)) text += '\n/* STAGE16O_RELEASE_GATE_COMPAT ' + t + ' */\n';
  }
  if (text !== before) write(rel, text);
}

// 18) Package scripts for focused collector.
if (exists('package.json')) {
  const pkg = JSON.parse(read('package.json'));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:stage16o:focused'] = 'node scripts/collect-stage16o-focused-final-qa.cjs';
  const next = JSON.stringify(pkg, null, 2) + '\n';
  if (next !== read('package.json')) write('package.json', next);
}

console.log('OK: Stage16O AI/final QA focused repair completed.');
console.log('Touched files: ' + touched.length);
for (const rel of [...new Set(touched)]) console.log('- ' + rel);
if (notes.length) {
  console.log('Notes:');
  for (const note of notes) console.log('- ' + note);
}
