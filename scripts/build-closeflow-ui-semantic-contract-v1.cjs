#!/usr/bin/env node
/* CLOSEFLOW_UI_SEMANTIC_CONTRACT_V1_BUILD
   Builds a semantic UI contract from CLOSEFLOW_UI_MAP.generated.json.
   Inventory/contract only. No runtime UI changes.
*/
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const mapPath = path.join(root, 'docs', 'ui', 'CLOSEFLOW_UI_MAP.generated.json');
const outJson = path.join(root, 'docs', 'ui', 'CLOSEFLOW_UI_SEMANTIC_CONTRACT.generated.json');
const outMd = path.join(root, 'docs', 'ui', 'CLOSEFLOW_UI_SEMANTIC_CONTRACT.generated.md');

function fail(message) {
  console.error('CLOSEFLOW_UI_SEMANTIC_CONTRACT_V1_BUILD_FAIL: ' + message);
  process.exit(1);
}
function asArray(value) { return Array.isArray(value) ? value : []; }
function mdEscape(value) { return String(value == null ? '' : value).replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>'); }
function roleEntries(map, role) { return asArray((map.semanticIconRoles || {})[role]); }

if (!fs.existsSync(mapPath)) fail('Brak docs/ui/CLOSEFLOW_UI_MAP.generated.json. Uruchom najpierw audit mapy UI.');
let uiMap;
try { uiMap = JSON.parse(fs.readFileSync(mapPath, 'utf8')); } catch (error) { fail('Nie można odczytać mapy UI: ' + error.message); }
if (uiMap.inventoryVersion !== 'CLOSEFLOW_UI_MAP_INVENTORY_V1') fail('Mapa UI ma niepoprawną inventoryVersion.');
if (uiMap.scannerVersion !== 'CLEAN_SCANNER_V4') fail('Mapa UI musi pochodzić ze skanera CLEAN_SCANNER_V4.');

const canonicalIconRoles = {
  add: { component: 'SemanticIcon', tone: 'primary', targetIcon: 'Plus', migration: 'UI-2' },
  ai: { component: 'SemanticIcon', tone: 'ai', targetIcon: 'Sparkles', migration: 'UI-2' },
  auth: { component: 'SemanticIcon', tone: 'neutral', targetIcon: 'LogOut/LogIn', migration: 'later' },
  case: { component: 'SemanticIcon', tone: 'case', targetIcon: 'Briefcase', migration: 'UI-2' },
  close: { component: 'SemanticIcon', tone: 'neutral', targetIcon: 'X', migration: 'later' },
  company_property: { component: 'SemanticIcon', tone: 'neutral', targetIcon: 'Building2', migration: 'later' },
  copy: { component: 'SemanticIcon', tone: 'neutral', targetIcon: 'Copy', migration: 'UI-2' },
  delete: { component: 'SemanticIcon', tone: 'danger', targetIcon: 'Trash2', migration: 'UI-2' },
  edit: { component: 'SemanticIcon', tone: 'neutral', targetIcon: 'Pencil', migration: 'UI-2' },
  email: { component: 'SemanticIcon', tone: 'contact', targetIcon: 'Mail', migration: 'UI-3' },
  event: { component: 'SemanticIcon', tone: 'event', targetIcon: 'CalendarClock', migration: 'UI-2' },
  filter: { component: 'SemanticIcon', tone: 'neutral', targetIcon: 'Filter', migration: 'later' },
  finance: { component: 'SemanticIcon', tone: 'finance', targetIcon: 'DollarSign/Wallet/CreditCard', migration: 'Finance V1' },
  goal: { component: 'SemanticIcon', tone: 'primary', targetIcon: 'Target', migration: 'later' },
  loading: { component: 'LoadingSpinner', tone: 'neutral', targetIcon: 'Loader2', migration: 'later' },
  navigation: { component: 'SemanticIcon', tone: 'neutral', targetIcon: 'Arrow/Chevron/ExternalLink', migration: 'later' },
  note: { component: 'SemanticIcon', tone: 'note', targetIcon: 'FileText', migration: 'UI-4' },
  notification: { component: 'SemanticIcon', tone: 'notification', targetIcon: 'Bell', migration: 'later' },
  person: { component: 'SemanticIcon', tone: 'person', targetIcon: 'UserRound', migration: 'UI-3' },
  phone: { component: 'SemanticIcon', tone: 'contact', targetIcon: 'Phone', migration: 'UI-3' },
  pin: { component: 'SemanticIcon', tone: 'neutral', targetIcon: 'Pin', migration: 'later' },
  refresh: { component: 'SemanticIcon', tone: 'neutral', targetIcon: 'RefreshCw/RotateCcw', migration: 'later' },
  risk_alert: { component: 'SemanticIcon', tone: 'danger', targetIcon: 'AlertTriangle', migration: 'UI-2' },
  search: { component: 'SemanticIcon', tone: 'neutral', targetIcon: 'Search', migration: 'later' },
  send: { component: 'SemanticIcon', tone: 'primary', targetIcon: 'Send', migration: 'later' },
  settings: { component: 'SemanticIcon', tone: 'neutral', targetIcon: 'Settings', migration: 'later' },
  task_status: { component: 'SemanticIcon', tone: 'task', targetIcon: 'CheckCircle2', migration: 'UI-2' },
  time: { component: 'SemanticIcon', tone: 'time', targetIcon: 'Clock', migration: 'UI-2' },
  view: { component: 'SemanticIcon', tone: 'neutral', targetIcon: 'Eye', migration: 'later' },
};

const criticalRoles = ['delete', 'phone', 'email', 'copy', 'edit', 'add', 'note', 'event', 'finance', 'task_status', 'time', 'risk_alert'];
const iconRoles = Object.keys(uiMap.semanticIconRoles || {}).sort().map((role) => {
  const entries = roleEntries(uiMap, role);
  const canonical = canonicalIconRoles[role] || { component: 'SemanticIcon', tone: 'neutral', targetIcon: 'TBD', migration: role === 'unclassified' ? 'manual_review' : 'later' };
  return {
    role,
    importCount: entries.length,
    usageCount: entries.reduce((sum, entry) => sum + Number(entry.usageCount || 0), 0),
    component: canonical.component,
    tone: canonical.tone,
    targetIcon: canonical.targetIcon,
    migration: canonical.migration,
    isCritical: criticalRoles.includes(role),
    examples: entries.slice(0, 10),
  };
});

const tileUsageByFile = {};
for (const item of asArray(uiMap.metricTileUsages)) {
  tileUsageByFile[item.file] = (tileUsageByFile[item.file] || 0) + 1;
}

const contract = {
  version: 'CLOSEFLOW_UI_SEMANTIC_CONTRACT_V1',
  generatedAt: new Date().toISOString(),
  source: {
    inventoryVersion: uiMap.inventoryVersion,
    scannerVersion: uiMap.scannerVersion,
    generatedAt: uiMap.generatedAt,
    filesScanned: uiMap.filesScanned,
    directLucideIconImports: asArray(uiMap.directLucideIconImports).length,
    metricTileUsages: asArray(uiMap.metricTileUsages).length,
    infoRowImplementations: asArray(uiMap.infoRowImplementations).length,
    entityActionContracts: asArray(uiMap.entityActionContracts).length,
    layoutEvidence: asArray(uiMap.layoutEvidence).length,
  },
  decision: 'Inventory first, contract second, runtime migration third. No visual hotfixes without semantic owner.',
  canonicalComponents: {
    icons: 'src/ui-system/icons/SemanticIcon.tsx',
    metricTiles: 'src/components/StatShortcutCard.tsx',
    infoRows: 'src/ui-system/entity/EntityInfoRow.tsx',
    notes: ['src/ui-system/entity/EntityNoteCard.tsx', 'src/ui-system/entity/EntityNoteComposer.tsx', 'src/ui-system/entity/EntityNoteList.tsx'],
    shell: 'src/ui-system/entity/EntityDetailShell.tsx',
  },
  criticalRoles,
  iconRoles,
  metricTileContract: {
    currentCanonicalComponent: 'StatShortcutCard',
    currentUsageCount: asArray(uiMap.metricTileUsages).length,
    usageByFile: tileUsageByFile,
    ruleNow: 'Nie dodawać nowych lokalnych kafelków metryk. Istniejące użycia StatShortcutCard zostają bazą.',
    ruleAfterUI2: 'Nowe kafelki metryk tylko przez StatShortcutCard lub jawnie zatwierdzony wrapper w ui-system.',
  },
  localImplementationsToMigrate: asArray(uiMap.infoRowImplementations),
  entityActionContracts: asArray(uiMap.entityActionContracts),
  detailRegionContract: {
    requiredOrderForLeadAndClient: [
      'entity-header',
      'entity-top-tiles',
      'entity-nearest-action',
      'entity-contact',
      'entity-notes',
      'entity-history',
      'entity-relations',
      'entity-right-rail',
    ],
    rule: 'LeadDetail i ClientDetail mają mieć te same regiony logiczne. Mobile może układać je w jedną kolumnę, desktop może mieć rail, ale semantyczne regiony muszą zostać wspólne.',
  },
  migrationStages: [
    { stage: 'UI-2', name: 'SemanticIcon + first guard', scope: 'critical icon roles only' },
    { stage: 'UI-3', name: 'EntityInfoRow', scope: 'phone, email, contact/source rows in LeadDetail and ClientDetail' },
    { stage: 'UI-4', name: 'EntityNoteCard / Composer / List', scope: 'notes in LeadDetail and ClientDetail' },
    { stage: 'UI-5', name: 'EntityDetailShell', scope: 'LeadDetail and ClientDetail desktop/mobile region parity' },
    { stage: 'UI-6', name: 'CaseDetail extension', scope: 'extend same contract to CaseDetail after lead/client parity' },
  ],
  guardPolicy: {
    now: 'Check verifies map cleanliness and semantic contract completeness. Runtime direct icon imports are allowed until migration begins.',
    afterUI2: 'No new direct imports for critical standard icons in pages/* without semantic exception.',
    afterUI3: 'No new local phone/email/contact rows in detail pages.',
    afterUI4: 'No new local note cards/composers/lists in detail pages.',
    afterUI5: 'LeadDetail and ClientDetail must expose shared data-ui-region contract.',
  },
};

fs.mkdirSync(path.dirname(outJson), { recursive: true });
fs.writeFileSync(outJson, JSON.stringify(contract, null, 2) + '\n', 'utf8');

const roleRows = contract.iconRoles.map((entry) => {
  return '| ' + mdEscape(entry.role) + ' | ' + entry.importCount + ' | ' + entry.usageCount + ' | ' + mdEscape(entry.component) + ' | ' + mdEscape(entry.tone) + ' | ' + mdEscape(entry.targetIcon) + ' | ' + mdEscape(entry.migration) + ' |';
});
const tileRows = Object.entries(tileUsageByFile).sort(([a], [b]) => a.localeCompare(b)).map(([file, count]) => '| ' + mdEscape(file) + ' | ' + count + ' | StatShortcutCard |');
const localRows = contract.localImplementationsToMigrate.map((entry) => '| ' + mdEscape(entry.name) + ' | ' + mdEscape(entry.file) + ' | ' + Number(entry.line || 0) + ' | EntityInfoRow / EntityNote / EntityActionButton candidate |');
const stageRows = contract.migrationStages.map((entry) => '| ' + mdEscape(entry.stage) + ' | ' + mdEscape(entry.name) + ' | ' + mdEscape(entry.scope) + ' |');

const md = [
  '# CloseFlow UI Semantic Contract v1',
  '',
  'Generated: ' + contract.generatedAt,
  '',
  'Source scanner: **' + contract.source.scannerVersion + '**',
  '',
  'Status: **kontrakt semantyczny, nie refactor runtime UI**.',
  '',
  '## Wynik źródłowej mapy UI',
  '',
  '- Pliki przeskanowane: **' + contract.source.filesScanned + '**',
  '- Bezpośrednie importy ikon z lucide-react: **' + contract.source.directLucideIconImports + '**',
  '- Użycia StatShortcutCard: **' + contract.source.metricTileUsages + '**',
  '- Lokalne implementacje InfoRow/InfoLine/StatCell/ActionButton: **' + contract.source.infoRowImplementations + '**',
  '- Kontrakty akcji encji: **' + contract.source.entityActionContracts + '**',
  '- Dowody layoutu CSS: **' + contract.source.layoutEvidence + '**',
  '',
  '## Decyzja',
  '',
  contract.decision,
  '',
  '## Komponenty docelowe',
  '',
  '- Ikony: `' + contract.canonicalComponents.icons + '`',
  '- Kafelki metryk: `' + contract.canonicalComponents.metricTiles + '`',
  '- Wiersze informacji: `' + contract.canonicalComponents.infoRows + '`',
  '- Notatki: `' + contract.canonicalComponents.notes.join('`, `') + '`',
  '- Shell rekordu: `' + contract.canonicalComponents.shell + '`',
  '',
  '## Role ikon',
  '',
  '| Rola | Importy | Użycia | Komponent | Ton | Ikona docelowa | Migracja |',
  '|---|---:|---:|---|---|---|---|',
  roleRows.join('\n') || '| brak | 0 | 0 | - | - | - | - |',
  '',
  '## Kafelki / metryki',
  '',
  'Reguła teraz: ' + contract.metricTileContract.ruleNow,
  '',
  '| Plik | Liczba użyć | Standard |',
  '|---|---:|---|',
  tileRows.join('\n') || '| brak | 0 | - |',
  '',
  '## Lokalne implementacje do przepięcia',
  '',
  '| Nazwa | Plik | Linia | Docelowo |',
  '|---|---|---:|---|',
  localRows.join('\n') || '| brak | - | - | - |',
  '',
  '## Regiony detail view',
  '',
  'Wspólna kolejność dla `LeadDetail` i `ClientDetail`:',
  '',
  contract.detailRegionContract.requiredOrderForLeadAndClient.map((r, i) => String(i + 1) + '. `' + r + '`').join('\n'),
  '',
  contract.detailRegionContract.rule,
  '',
  '## Kolejność migracji',
  '',
  '| Etap | Nazwa | Zakres |',
  '|---|---|---|',
  stageRows.join('\n'),
  '',
  '## Guard policy',
  '',
  '- Teraz: ' + contract.guardPolicy.now,
  '- Po UI-2: ' + contract.guardPolicy.afterUI2,
  '- Po UI-3: ' + contract.guardPolicy.afterUI3,
  '- Po UI-4: ' + contract.guardPolicy.afterUI4,
  '- Po UI-5: ' + contract.guardPolicy.afterUI5,
  '',
].join('\n');

fs.writeFileSync(outMd, md, 'utf8');
console.log('CLOSEFLOW_UI_SEMANTIC_CONTRACT_V1_BUILD_OK');
console.log('scannerVersion=' + contract.source.scannerVersion);
console.log('directLucideIconImports=' + contract.source.directLucideIconImports);
console.log('criticalRoles=' + contract.criticalRoles.length);
console.log('iconRoles=' + contract.iconRoles.length);
console.log('written=docs/ui/CLOSEFLOW_UI_SEMANTIC_CONTRACT.generated.json docs/ui/CLOSEFLOW_UI_SEMANTIC_CONTRACT.generated.md');
