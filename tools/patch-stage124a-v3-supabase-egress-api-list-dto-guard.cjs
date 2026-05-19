#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const backupRoot = path.join(root, '_backup_local', '2026-05-19_stage124a_v3_supabase_egress_api_list_dto_guard');
const touched = [];

function rel(p) { return p.replace(/\\/g, '/'); }
function full(p) { return path.join(root, p); }
function read(p) { return fs.readFileSync(full(p), 'utf8'); }
function write(p, text) {
  const target = full(p);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text, 'utf8');
  if (!touched.includes(rel(p))) touched.push(rel(p));
}
function backup(p) {
  const src = full(p);
  if (!fs.existsSync(src)) return;
  const dst = path.join(backupRoot, p);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
}
function replaceOnce(text, oldText, newText, label) {
  if (text.includes(newText)) return text;
  if (!text.includes(oldText)) throw new Error(`Nie znaleziono bloku do wymiany: ${label}`);
  return text.replace(oldText, newText);
}
function insertAfterOnce(text, needle, insert, marker) {
  if (text.includes(marker)) return text;
  const index = text.indexOf(needle);
  if (index < 0) throw new Error(`Nie znaleziono miejsca do wstawienia markera: ${marker}`);
  return text.slice(0, index + needle.length) + insert + text.slice(index + needle.length);
}
function upsertMarker(p, start, end, block) {
  let text = fs.existsSync(full(p)) ? read(p) : '';
  const fullBlock = `${start}\n${block.trim()}\n${end}`;
  const startIndex = text.indexOf(start);
  const endIndex = text.indexOf(end);
  if (startIndex >= 0 && endIndex > startIndex) {
    text = text.slice(0, startIndex) + fullBlock + text.slice(endIndex + end.length);
  } else {
    text = `${text.trimEnd()}\n\n${fullBlock}\n`;
  }
  write(p, text);
}
function copyFileFromPackage(relPath) {
  // Files were copied by PowerShell, so this is only here for completeness if patcher is run manually later.
  if (!fs.existsSync(full(relPath))) throw new Error(`Brak wymaganego pliku po copy: ${relPath}`);
}

function patchPackageJson() {
  const p = 'package.json';
  backup(p);
  const json = JSON.parse(read(p));
  json.scripts = json.scripts || {};
  if (!json.scripts['check:stage124-supabase-egress-contract']) {
    const nextScripts = { 'check:stage124-supabase-egress-contract': 'node scripts/check-stage124-supabase-egress-contract.cjs', ...json.scripts };
    json.scripts = nextScripts;
    write(p, JSON.stringify(json, null, 2) + '\n');
  }
}

function patchSupabaseFallback() {
  const p = 'src/lib/supabase-fallback.ts';
  backup(p);
  let text = read(p);
  if (!text.includes('STAGE124_SUPABASE_EGRESS_CACHE_CONTRACT')) {
    text = replaceOnce(text, 'const API_GET_CACHE_TTL_MS = 10_000;', "const STAGE124_SUPABASE_EGRESS_CACHE_CONTRACT = 'GET cache dedupes API reads and is cleared after mutations';\nconst API_GET_CACHE_TTL_MS = 30_000;", 'supabase fallback cache ttl');
  } else {
    text = text.replace(/const API_GET_CACHE_TTL_MS\s*=\s*10_000;/, 'const API_GET_CACHE_TTL_MS = 30_000;');
  }
  write(p, text);
}

function patchLeadsApi() {
  const p = 'api/leads.ts';
  backup(p);
  let text = read(p);
  const needle = "const CLOSEFLOW_A2_ALLOW_DUPLICATE_API_OVERRIDE = 'allowDuplicate is the API duplicate override flag';";
  const insert = `\n\nconst STAGE124_SUPABASE_EGRESS_P0_CONTRACT = 'Stage124A: API lists use explicit ListDTO select columns; detail routes may use full detail payload';\nconst LEAD_LIST_SELECT_STAGE124 = [\n  'id',\n  'workspace_id',\n  'client_id',\n  'linked_case_id',\n  'name',\n  'company',\n  'email',\n  'phone',\n  'source',\n  'status',\n  'value',\n  'deal_value',\n  'currency',\n  'priority',\n  'created_at',\n  'updated_at',\n  'moved_to_service_at',\n  'case_started_at',\n  'next_action_at',\n  'next_action_item_id',\n  'lead_visibility',\n  'sales_outcome',\n].join(',');\nconst LEAD_DETAIL_SELECT_STAGE124 = '*';`;
  text = insertAfterOnce(text, needle, insert, 'LEAD_LIST_SELECT_STAGE124');
  const oldBlock = `      const leadLimit = requestedId ? 1 : 300;\n      const base = withWorkspaceFilter(\`leads?select=*&\${leadFilters}order=updated_at.desc.nullslast&limit=\${leadLimit}\`, workspaceId);\n      const fallback = withWorkspaceFilter(\`leads?select=*&\${leadFilters}order=created_at.desc.nullslast&limit=\${leadLimit}\`, workspaceId);`;
  const newBlock = `      const leadLimit = requestedId ? 1 : 300;\n      const leadSelect = requestedId ? LEAD_DETAIL_SELECT_STAGE124 : LEAD_LIST_SELECT_STAGE124;\n      const base = withWorkspaceFilter(\`leads?select=\${leadSelect}&\${leadFilters}order=updated_at.desc.nullslast&limit=\${leadLimit}\`, workspaceId);\n      const fallback = withWorkspaceFilter(\`leads?select=\${leadSelect}&\${leadFilters}order=created_at.desc.nullslast&limit=\${leadLimit}\`, workspaceId);`;
  text = replaceOnce(text, oldBlock, newBlock, 'leads GET list select');
  write(p, text);
}

function patchClientsApi() {
  const p = 'api/clients.ts';
  backup(p);
  let text = read(p);
  const needle = "const CLOSEFLOW_CLIENT_ARCHIVE_CALENDAR_CASCADE_V1 = 'client delete archives client; active cases/tasks/events hide by archived parent';";
  const insert = `\n\nconst STAGE124_SUPABASE_EGRESS_P0_CONTRACT = 'Stage124A: API lists use explicit ListDTO select columns; detail routes may use full detail payload';\nconst CLIENT_LIST_SELECT_STAGE124 = [\n  'id',\n  'workspace_id',\n  'name',\n  'company',\n  'email',\n  'phone',\n  'source_primary',\n  'created_at',\n  'updated_at',\n  'last_activity_at',\n  'archived_at',\n  'primary_case_id',\n].join(',');\nconst CLIENT_DETAIL_SELECT_STAGE124 = '*';`;
  text = insertAfterOnce(text, needle, insert, 'CLIENT_LIST_SELECT_STAGE124');
  const oldBlock = "      const base = withWorkspaceFilter(`clients?select=*&${requestedId ? `id=eq.${encodeURIComponent(requestedId)}&` : ''}${activeClientArchiveFilterForCascade}order=updated_at.desc.nullslast&limit=${requestedId ? 1 : 300}`, workspaceId);\n      const fallback = withWorkspaceFilter(`clients?select=*&${requestedId ? `id=eq.${encodeURIComponent(requestedId)}&` : ''}${activeClientArchiveFilterForCascade}order=created_at.desc.nullslast&limit=${requestedId ? 1 : 300}`, workspaceId);";
  const newBlock = "      const clientSelect = requestedId ? CLIENT_DETAIL_SELECT_STAGE124 : CLIENT_LIST_SELECT_STAGE124;\n      const base = withWorkspaceFilter(`clients?select=${clientSelect}&${requestedId ? `id=eq.${encodeURIComponent(requestedId)}&` : ''}${activeClientArchiveFilterForCascade}order=updated_at.desc.nullslast&limit=${requestedId ? 1 : 300}`, workspaceId);\n      const fallback = withWorkspaceFilter(`clients?select=${clientSelect}&${requestedId ? `id=eq.${encodeURIComponent(requestedId)}&` : ''}${activeClientArchiveFilterForCascade}order=created_at.desc.nullslast&limit=${requestedId ? 1 : 300}`, workspaceId);";
  text = replaceOnce(text, oldBlock, newBlock, 'clients GET list select');
  write(p, text);
}

function patchCasesApi() {
  const p = 'api/cases.ts';
  backup(p);
  let text = read(p);
  const needle = "const CLOSEFLOW_CLIENT_ARCHIVE_CALENDAR_CASCADE_V1 = 'case/client archive keeps calendar links and hides by parent archive';";
  const insert = `\n\nconst STAGE124_SUPABASE_EGRESS_P0_CONTRACT = 'Stage124A: API lists use explicit ListDTO select columns; detail routes may use full detail payload';\nconst CASE_LIST_SELECT_STAGE124 = [\n  'id',\n  'workspace_id',\n  'client_id',\n  'lead_id',\n  'title',\n  'client_name',\n  'status',\n  'completeness_percent',\n  'portal_ready',\n  'expected_revenue',\n  'contract_value',\n  'commission_mode',\n  'commission_base',\n  'commission_rate',\n  'commission_amount',\n  'commission_status',\n  'paid_amount',\n  'remaining_amount',\n  'currency',\n  'started_at',\n  'created_at',\n  'updated_at',\n].join(',');\nconst CASE_DETAIL_SELECT_STAGE124 = '*';`;
  text = insertAfterOnce(text, needle, insert, 'CASE_LIST_SELECT_STAGE124');
  const oldBlock = `        const result = await selectFirstAvailable([\n          withWorkspaceFilter(\`cases?select=*&\${caseFilters}order=updated_at.desc.nullslast&limit=\${caseLimit}\`, workspaceId),\n          withWorkspaceFilter(\`cases?select=*&\${caseFilters}order=created_at.desc.nullslast&limit=\${caseLimit}\`, workspaceId),\n        ]);`;
  const newBlock = `        const caseSelect = requestedId ? CASE_DETAIL_SELECT_STAGE124 : CASE_LIST_SELECT_STAGE124;\n        const result = await selectFirstAvailable([\n          withWorkspaceFilter(\`cases?select=\${caseSelect}&\${caseFilters}order=updated_at.desc.nullslast&limit=\${caseLimit}\`, workspaceId),\n          withWorkspaceFilter(\`cases?select=\${caseSelect}&\${caseFilters}order=created_at.desc.nullslast&limit=\${caseLimit}\`, workspaceId),\n        ]);`;
  text = replaceOnce(text, oldBlock, newBlock, 'cases GET list select');
  write(p, text);
}

function patchTasksApiIfPresent() {
  const p = 'api/tasks.ts';
  if (!fs.existsSync(full(p))) return;
  backup(p);
  let text = read(p);
  const importNeedle = "import { deleteById, findWorkspaceId, insertWithVariants, selectFirstAvailable, updateById } from './_supabase.js';";
  const taskConst = "\n\nconst TASK_LIST_SELECT_STAGE124 = 'id,workspace_id,title,type,task_type,record_type,status,priority,scheduled_at,due_at,date,start_at,created_at,updated_at,lead_id,case_id,client_id,reminder_at,reminder,recurrence_rule,recurrence,show_in_tasks';";
  text = insertAfterOnce(text, importNeedle, taskConst, 'TASK_LIST_SELECT_STAGE124');
  const pairs = [
    ["'work_items?select=*&show_in_tasks=is.true&order=created_at.desc.nullslast&limit=200'", "`work_items?select=${TASK_LIST_SELECT_STAGE124}&show_in_tasks=is.true&order=created_at.desc.nullslast&limit=200`"],
    ["'work_items?select=*&record_type=eq.task&order=created_at.desc.nullslast&limit=200'", "`work_items?select=${TASK_LIST_SELECT_STAGE124}&record_type=eq.task&order=created_at.desc.nullslast&limit=200`"],
    ["'work_items?select=*&type=eq.task&order=created_at.desc.nullslast&limit=200'", "`work_items?select=${TASK_LIST_SELECT_STAGE124}&type=eq.task&order=created_at.desc.nullslast&limit=200`"],
    ["'work_items?select=*&order=created_at.desc.nullslast&limit=200'", "`work_items?select=${TASK_LIST_SELECT_STAGE124}&order=created_at.desc.nullslast&limit=200`"],
  ];
  for (const [oldText, newText] of pairs) text = text.replaceAll(oldText, newText);
  write(p, text);
}

function patchEventsApiIfPresent() {
  const p = 'api/events.ts';
  if (!fs.existsSync(full(p))) return;
  backup(p);
  let text = read(p);
  if (!text.includes('EVENT_LIST_SELECT_STAGE124')) {
    text = "const EVENT_LIST_SELECT_STAGE124 = 'id,workspace_id,title,type,event_type,record_type,status,scheduled_at,start_at,end_at,date,created_at,updated_at,lead_id,case_id,client_id,reminder_at,reminder,recurrence_rule,recurrence,show_in_calendar';\n" + text;
  }
  const pairs = [
    ['work_items?select=*&record_type=eq.event&order=start_at.asc.nullslast&limit=200', 'work_items?select=${EVENT_LIST_SELECT_STAGE124}&record_type=eq.event&order=start_at.asc.nullslast&limit=200'],
    ['work_items?select=*&type=eq.event&order=start_at.asc.nullslast&limit=200', 'work_items?select=${EVENT_LIST_SELECT_STAGE124}&type=eq.event&order=start_at.asc.nullslast&limit=200'],
    ['work_items?select=*&show_in_calendar=is.true&order=start_at.asc.nullslast&limit=200', 'work_items?select=${EVENT_LIST_SELECT_STAGE124}&show_in_calendar=is.true&order=start_at.asc.nullslast&limit=200'],
  ];
  for (const [oldText, newText] of pairs) text = text.replaceAll(oldText, newText);
  write(p, text);
}

function updateProjectMemory() {
  upsertMarker('_project/08_CHANGELOG_AI.md', '<!-- STAGE124A_SUPABASE_EGRESS_CHANGELOG_START -->', '<!-- STAGE124A_SUPABASE_EGRESS_CHANGELOG_END -->', `## 2026-05-19 - Stage124A V3 Supabase egress API list DTO guard\n\n- Status: ZIP/local package V3.\n- Zakres: API list endpoints dla leads/clients/cases przechodza z \`select=*\` na jawne ListDTO select columns; detail route po \`id\` pozostaje pelny.\n- Dodatkowo: cache GET w \`src/lib/supabase-fallback.ts\` zwiekszony z 10s do 30s i nadal czyszczony po mutacjach.\n- Guard: \`scripts/check-stage124-supabase-egress-contract.cjs\`.\n- V3: patch wykonywany przez Node, bez kruchych PowerShell -replace.`);
  upsertMarker('_project/12_IMPLEMENTATION_LEDGER.md', '<!-- STAGE124A_SUPABASE_EGRESS_LEDGER_START -->', '<!-- STAGE124A_SUPABASE_EGRESS_LEDGER_END -->', `## 2026-05-19 - Stage124A V3 Supabase egress P0\n\nFAKTY Z KODU:\n- \`api/leads.ts\`, \`api/clients.ts\`, \`api/cases.ts\` mialy listowe \`select=*\` z wysokimi limitami.\n- \`src/lib/supabase-fallback.ts\` mial dedupe/cache GET na 10 sekund.\n\nDECYZJA:\n- Nie ucinac funkcjonalnosci UI. Zmniejszac payload list, nie usuwac modulow.\n\nZMIANA:\n- List endpoints maja jawne kolumny ListDTO.\n- Detail endpoints po \`id\` nadal moga uzyc pelnego payloadu.\n- Guard blokuje powrot ciezkich list \`select=*\`.\n\nRYZYKO:\n- Jesli jakis ekran listowy ukrycie korzystal z pola spoza ListDTO, dopisac to pole do stalej ListDTO, a nie wracac do \`select=*\`.`);
  upsertMarker('_project/06_GUARDS_AND_TESTS.md', '<!-- STAGE124A_SUPABASE_EGRESS_GUARDS_START -->', '<!-- STAGE124A_SUPABASE_EGRESS_GUARDS_END -->', `## 2026-05-19 - Stage124A V3 Supabase egress guard\n\nGuard:\n- \`node scripts/check-stage124-supabase-egress-contract.cjs\`\n\nSprawdza:\n- brak ciezkich list \`leads?select=*&limit=300\`, \`clients?select=*&limit=300\`, \`cases?select=*&limit=250\`, \`work_items?select=*&limit=200\`,\n- obecność ListDTO constants,\n- cache GET 30s,\n- wpis w package.json.`);
  upsertMarker('_project/14_TEST_HISTORY.md', '<!-- STAGE124A_SUPABASE_EGRESS_TESTS_START -->', '<!-- STAGE124A_SUPABASE_EGRESS_TESTS_END -->', `## 2026-05-19 - Stage124A V3 Supabase egress API list DTO guard\n\nAutomatycznie:\n- \`node scripts/check-stage124-supabase-egress-contract.cjs\`\n- \`node --test tests/stage124-supabase-egress-contract.test.cjs\`\n- \`npm run build\` jeśli nie uruchomiono z \`-SkipBuild\`.\n\nManualnie do wykonania:\n- /leads lista + lead detail,\n- /clients lista + client detail,\n- /cases lista + case detail,\n- /tasks lista i status done/delete,\n- /calendar month + selected day + edit modal,\n- Supabase Usage po 1-2h normalnego klikania: sprawdzic spadek API egress / top paths.`);
  upsertMarker('_project/07_NEXT_STEPS.md', '<!-- STAGE124A_SUPABASE_EGRESS_NEXT_START -->', '<!-- STAGE124A_SUPABASE_EGRESS_NEXT_END -->', `## 2026-05-19 - Po Stage124A V3\n\n1. Test reczny UI bez utraty danych na listach i detailach.\n2. Sprawdzic Supabase Usage / Logs Top Paths po normalnej sesji.\n3. Stage124B: calendar/task date-range queries oraz dalsza deduplikacja auth/workspace, jezeli Usage dalej rosnie.\n4. Nie wracac do \`select=*\` w listach; brakujace pola dopisywac jawnie do ListDTO constants.`);
}

function main() {
  patchPackageJson();
  copyFileFromPackage('scripts/check-stage124-supabase-egress-contract.cjs');
  copyFileFromPackage('tests/stage124-supabase-egress-contract.test.cjs');
  patchSupabaseFallback();
  patchLeadsApi();
  patchClientsApi();
  patchCasesApi();
  patchTasksApiIfPresent();
  patchEventsApiIfPresent();
  updateProjectMemory();
  console.log('Stage124A V3 patched files:');
  for (const item of touched) console.log(`- ${item}`);
  console.log(`Backup root: ${backupRoot}`);
}

main();
