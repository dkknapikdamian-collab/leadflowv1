const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
const escaped = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const contractPath = '_project/contracts/forteca-clean/FRT-016_LEAD_EVENT.md';
const dialogPath = 'src/components/EventCreateDialog.tsx';
const hostPath = 'src/components/ContextActionDialogs.tsx';
const leadDetailPath = 'src/pages/LeadDetail.tsx';
const fallbackPath = 'src/lib/supabase-fallback.ts';
const eventRoutePath = 'src/server/event-route-stage124f.ts';
const systemApiPath = 'api/system.ts';
const timezonePath = 'src/lib/calendar-timezone-contract.ts';
const schedulingPath = 'src/lib/scheduling.ts';
const dialogStylesPath = 'src/styles/owners/closeflow-dialogs.css';
const foundationStylesPath = 'src/styles/owners/closeflow-foundation.css';
const actionStylesPath = 'src/styles/owners/closeflow-actions.css';
const recordListStylesPath = 'src/styles/closeflow-record-list-source-truth.css';
const recordRailsStylesPath = 'src/styles/owners/closeflow-records-and-rails.css';
const entityActionsPath = 'src/components/entity-actions.tsx';

const literalColor = /(?:#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\))/i;
const literalPaletteUtility = /\b(?:bg|text|border|ring|from|to|via)-(?:red|rose|orange|amber|yellow|green|emerald|blue|indigo|purple|violet|slate|gray|zinc|neutral)-(?:50|100|200|300|400|500|600|700|800|900|950)\b/i;

function sourceAfter(source, needle, length = 4200) {
  const start = source.indexOf(needle);
  assert.ok(start >= 0, `missing source anchor: ${needle}`);
  return source.slice(start, start + length);
}

function firstSourceAfter(source, needles, length = 4200) {
  const starts = needles.map((needle) => ({ needle, start: source.indexOf(needle) })).filter(({ start }) => start >= 0);
  assert.ok(starts.length > 0, `missing source anchors: ${needles.join(', ')}`);
  const selected = starts.sort((left, right) => left.start - right.start)[0];
  return source.slice(selected.start, selected.start + length);
}

function eventPayloadSource(source) {
  return firstSourceAfter(source, ['const eventPayload', 'insertEventToSupabase({']);
}

function eventFormStateSource(source) {
  const start = source.indexOf('type EventCreateFormState');
  assert.ok(start >= 0, 'EventCreateDialog must declare its form state owner');
  const end = source.indexOf('\n};', start);
  assert.ok(end > start, 'EventCreateFormState must have a readable boundary');
  return source.slice(start, end);
}

function eventInputSource(source) {
  return sourceAfter(source, 'type EventInsertInput', 700);
}

function eventApiSource(source) {
  const start = source.indexOf('const eventInsertBaseStageG13 = {');
  assert.ok(start >= 0, 'active event API must expose its normalized insert payload owner');
  return source.slice(start, start + 3200);
}

function eventPostSource(source) {
  const start = source.indexOf("if (req.method !== 'POST')");
  assert.ok(start >= 0, 'active event route must expose its POST payload boundary');
  return source.slice(start);
}

function customPropertyValue(source, property) {
  const match = source.match(new RegExp(`(?:^|\\n)\\s*${escaped(property)}\\s*:\\s*([^;]+);`, 'm'));
  assert.ok(match, `missing custom property declaration: ${property}`);
  return match[1].trim();
}

function customPropertyDeclarations(source) {
  const declarations = [];
  const pattern = /(?:^|\n)\s*(--[a-z0-9-]+)\s*:\s*([^;]+);/gi;
  for (const match of source.matchAll(pattern)) {
    declarations.push({ property: match[1], value: match[2].trim() });
  }
  return declarations;
}

function fortecaDialogSource(source) {
  const start = source.indexOf('if (isFortecaLeadEvent)');
  assert.ok(start >= 0, 'EventCreateDialog must expose the FRT-016 branch');
  const end = source.indexOf('\n  return (', start);
  assert.ok(end > start, 'FRT-016 branch must end before the generic event dialog');
  return source.slice(start, end);
}

function stageCssBlock(source) {
  const start = source.search(/\/\*\s*FRT-016\b/);
  assert.ok(start >= 0, 'FRT-016 must have a canonical dialog style block');
  const rest = source.slice(start + 1);
  const nextStage = rest.search(/\n\/\*\s*FRT-\d+\b/);
  return source.slice(start, nextStage >= 0 ? start + 1 + nextStage : source.length);
}

function findAssignment(source, aliases) {
  for (const alias of aliases) {
    const match = source.match(new RegExp(`\\b${escaped(alias)}\\s*:\\s*([^,\\n}]+)`));
    if (match) return { alias, value: match[1].trim() };
    const shorthand = source.match(new RegExp(`(?:^|[,{]\\s*)${escaped(alias)}\\s*(?=,|})`, 'm'));
    if (shorthand) return { alias, value: alias };
  }
  return null;
}

function assertDynamicAssignment(source, field, expressionPattern, owner) {
  const assignment = findAssignment(source, [field]);
  assert.ok(assignment, `${owner} must assign ${field}`);
  assert.match(assignment.value, expressionPattern, `${owner}.${field} must come from live state/context`);
  assert.doesNotMatch(assignment.value, /^['"`]/, `${owner}.${field} must not be a fixture literal`);
}

test('FRT-016 pins the Lead Event contract, reference path and immutable visual SHA', () => {
  const contract = read(contractPath);
  const referenceMatch = contract.match(/^REFERENCE_FILE:\s*(.+)$/m);

  assert.match(contract, /CONTRACT_STATUS: LOCKED/);
  assert.match(contract, /STAGE_ID: FRT-016/);
  assert.match(contract, /TARGET_ROUTE: \/leads\/:leadId/);
  assert.match(contract, /TARGET_STATE: Lead Detail — add event modal/);
  assert.match(contract, /BEHAVIOR_TO_PRESERVE: Event persistence, timezone\/date semantics, lead relation, workspace scope and calendar refresh/);
  assert.ok(referenceMatch, 'FRT-016 must declare a reference file');

  const referenceFile = referenceMatch[1].trim();
  const referencePath = path.join(root, referenceFile);
  assert.ok(fs.existsSync(referencePath), `FRT-016 reference is missing: ${referenceFile}`);
  assert.equal(
    sha256(referencePath),
    'D723815A76A7455463E04CB073965203520A0979629E69FF54011F4815AA7A9D',
    'FRT-016 reference changed without an explicit SOT update',
  );
});

test('FRT-016 exposes the real reference-shaped event drawer and stable browser markers', () => {
  const dialog = read(dialogPath);
  const host = read(hostPath);
  const expectedMarkers = [
    'data-forteca-frt-016-lead-event="true"',
    'data-forteca-frt-016-form="true"',
    'data-forteca-frt-016-relation="true"',
    'data-forteca-frt-016-save="true"',
    'data-forteca-frt-016-cancel="true"',
  ];
  const expectedCopy = [
    'Zaplanuj spotkanie',
    'Tytuł',
    'Typ spotkania',
    'Online',
    'Telefon',
    'Na miejscu',
    'Data',
    'Dzień tygodnia',
    'Godzina rozpoczęcia',
    'Godzina zakończenia',
    'Lokalizacja / link online',
    'Uczestnicy',
    'Notatka',
    'Przypomnienie',
    'Cykliczność',
    'Anuluj',
    'Dodaj do kalendarza',
  ];

  assert.match(dialog, /<Dialog\b/);
  assert.match(dialog, /<DialogContent\b/);
  assert.match(dialog, /<DialogTitle\b/);
  assert.match(dialog, /<form\b/);
  assert.match(dialog, /type="date"/);
  assert.match(dialog, /type="time"/);
  for (const marker of expectedMarkers) assert.match(dialog, new RegExp(escaped(marker)), `missing FRT-016 marker: ${marker}`);
  for (const copy of expectedCopy) assert.ok(dialog.includes(copy), `FRT-016 reference copy is missing: ${copy}`);

  assert.match(dialog, /data-forteca-frt-016-capability="location-not-persisted"/);
  assert.match(dialog, /Brak zapisu lokalizacji i linku w bieżącym kontrakcie wydarzenia/);
  assert.match(dialog, /data-forteca-frt-016-relation-kind="lead"/);
  assert.match(dialog, /data-forteca-frt-016-relation="true"/);

  assert.match(dialog, /context\?\.recordLabel/);
  assert.match(dialog, /context\?\.leadId/);
  assert.match(host, /<EventCreateDialog\s/);
  assert.equal((host.match(/<EventCreateDialog\s/g) || []).length, 1, 'the shared host must keep one event dialog owner');
  assert.match(host, /onSaved=\{handleSaved\}/);
  assert.match(host, /context=\{context \|\| undefined\}/);
 });

test('FRT-016 checks the active /api/events handler owner', () => {
  const activeRoute = read(eventRoutePath);
  const systemApi = read(systemApiPath);

  assert.match(systemApi, /eventRouteStage124FHandler/);
  assert.match(systemApi, /if \(apiRoute === 'events'\)\s*\{[\s\S]*await eventRouteStage124FHandler\(req, res\)/);
  assert.match(activeRoute, /export default async function eventRouteStage124FHandler\(/);
  assert.match(activeRoute, /if \(req\.method !== 'POST'\)/);
  assert.match(activeRoute, /const result = await insertWithVariants\(\['work_items'\], \[payload\]\)/);
  assert.doesNotMatch(activeRoute, /asNullableUuid\(body\.(?:lead|case|client)Id\)/, 'FRT-016 must not silently fall back to the legacy api/work-items.ts owner');
});

function assertActiveEventRelationScope({ table, field, label }) {
  const activeRoute = read(eventRoutePath);
  const post = eventPostSource(activeRoute);
  const insertIndex = post.indexOf('const result = await insertWithVariants');
  assert.ok(insertIndex >= 0, 'active event POST must have a visible insert boundary');
  const preInsert = post.slice(0, insertIndex);

  assert.match(activeRoute, /import \{[^}]*requireScopedRow[^}]*\} from ['"]\.\/\_request-scope\.js['"]/s, 'active event route must use the canonical scoped-row owner');
  assert.match(
    activeRoute,
    new RegExp(`\\[\\s*['"]${field}['"]\\s*,\\s*['"]${table}['"]\\s*,`),
    `${label} relation must have an explicit field-to-table workspace rule`,
  );
  assert.match(activeRoute, /await requireScopedRow\(table, relationId, workspaceId, errorCode\)/, 'linked relation validation must use the canonical scoped-row workspace filter');
  assert.match(preInsert, /await [A-Za-z0-9_]*EventRelations[A-Za-z0-9_]*\(body, workspaceId\)/, `${label} relation validator must run before event insert`);
  assert.match(preInsert, new RegExp(`validated[A-Za-z0-9_]*\\.${field}\\s*\\|\\|\\s*null`), `${label} relation must use the validated workspace-scoped value in the event payload`);
}

test('FRT-016 enforces workspace ownership for the linked lead', () => {
  assertActiveEventRelationScope({ table: 'leads', field: 'leadId', label: 'lead' });
});

test('FRT-016 enforces workspace ownership for the linked case', () => {
  assertActiveEventRelationScope({ table: 'cases', field: 'caseId', label: 'case' });
});

test('FRT-016 enforces workspace ownership for the linked client', () => {
  assertActiveEventRelationScope({ table: 'clients', field: 'clientId', label: 'client' });
});

test('FRT-016 does not optimistically accept malformed LeadDetail saved records', () => {
  const leadDetail = read(leadDetailPath);
  const savedRecordSource = sourceAfter(leadDetail, 'const savedRecord =', 1500);

  assert.match(savedRecordSource, /const savedLeadId = String\(savedRecord\.leadId \|\| savedRecord\.lead_id \|\| ''\)\.trim\(\)/);
  assert.match(savedRecordSource, /const savedWorkspaceId = String\(savedRecord\.workspaceId \|\| savedRecord\.workspace_id \|\| ''\)\.trim\(\)/);
  assert.match(savedRecordSource, /const belongsToLead = Boolean\(savedLeadId\)\s*&&\s*savedLeadId === String\(leadId\)/, 'missing lead relation must fail closed');
  assert.match(savedRecordSource, /const belongsToWorkspace = Boolean\(savedWorkspaceId\)\s*&&\s*savedWorkspaceId === workspaceId/, 'missing workspace relation must fail closed');
  assert.doesNotMatch(savedRecordSource, /const belongsToLead = !savedLeadId \|\|/);
  assert.doesNotMatch(savedRecordSource, /const belongsToWorkspace = !savedWorkspaceId \|\|/);
});

test('FRT-016 carries the supported note and live lead relation without dead persistence', () => {
  const dialog = read(dialogPath);
  const fallback = read(fallbackPath);
  const api = read(eventRoutePath);
  const leadDetail = read(leadDetailPath);
  const dialogPayload = eventPayloadSource(dialog);
  const dialogFormState = eventFormStateSource(dialog);
  const eventInput = eventInputSource(fallback);
  const eventApi = eventApiSource(api);

  const dialogFields = [
    ['title', /form\.title/],
    ['type', /form\.type/],
    ['startAt', /form\.startAt|startAtUtc|normalizeCloseFlowDateTimeToUtcIso|localDateTimeInputToUtcIso/],
    ['scheduledAt', /form\.startAt|startAtUtc|normalizeCloseFlowDateTimeToUtcIso|localDateTimeInputToUtcIso/],
    ['endAt', /form\.endAt|endAtUtc|normalizeCloseFlowDateTimeToUtcIso|localDateTimeInputToUtcIso/],
    ['status', /form\.status/],
    ['reminderAt', /calculateReminderAt|localDateTimeInputToReminderUtcIso/],
    ['recurrenceRule', /buildRecurrenceRule|form\.recurrence/],
    ['leadId', /context\?\.leadId/],
    ['caseId', /context\?\.caseId/],
    ['clientId', /context\?\.clientId/],
    ['workspaceId', /workspaceId/],
  ];
  for (const [field, expression] of dialogFields) assertDynamicAssignment(dialogPayload, field, expression, 'EventCreateDialog payload');

  assert.match(leadDetail, /openContextQuickAction\(\{/);
  assert.match(leadDetail, /recordType:\s*'lead'/);
  assert.match(leadDetail, /recordId:\s*leadId/);
  assert.match(leadDetail, /leadId[,\s}]/);
  assert.match(leadDetail, /clientId:\s*lead\?\.clientId/);
  assert.match(leadDetail, /caseId:\s*associatedCase\?\.id/);
  assert.match(leadDetail, /recordLabel:\s*getLeadName\(lead\)/);

  assert.match(fallback, /type EventInsertInput\s*=\s*\{[\s\S]*leadId\?:[\s\S]*workspaceId\?:/);
  assert.match(fallback, /type EventInsertInput\s*=\s*\{[\s\S]*description\?:\s*string/);
  assert.match(fallback, /export async function insertEventToSupabase\(/);
  assert.match(fallback, /callApi<[^>]+>\('\/api\/events',\s*\{\s*method:\s*'POST'/);
  assert.match(fallback, /JSON\.stringify\(input/);

  assert.match(eventApi, /lead_id:\s*(?:body\.leadId|validated[A-Za-z0-9_]*\.leadId)\s*\|\|\s*null/);
  assert.match(eventApi, /case_id:\s*(?:body\.caseId|validated[A-Za-z0-9_]*\.caseId)\s*\|\|\s*null/);
  assert.match(eventApi, /client_id:\s*(?:body\.clientId|validated[A-Za-z0-9_]*\.clientId)\s*\|\|\s*null/);
  const descriptionApiAssignment = findAssignment(eventApi, ['description']);
  assert.ok(descriptionApiAssignment, 'event API must assign the supported note description');
  assert.match(descriptionApiAssignment.value, /body\??\.description|payload|input/, 'event API description must use request data');
  assert.doesNotMatch(descriptionApiAssignment.value, /^['"]/, 'event API description must not be a fake constant');
  assert.match(eventApi, /scheduled_at:\s*[^,\n]+/);
  assert.match(eventApi, /start_at:\s*[^,\n]+/);
  assert.match(eventApi, /end_at:\s*[^,\n]+/);
  assert.match(eventApi, /recurrence:\s*[^,\n]+/);
  assert.match(eventApi, /reminder:\s*[^,\n]+/);

  const persistedReferenceFields = [
    {
      label: 'notatka',
      aliases: ['description', 'note', 'notes'],
    },
  ];

  for (const { label, aliases } of persistedReferenceFields) {
    const stateField = aliases.find((alias) => new RegExp(`\\b${escaped(alias)}\\b`).test(dialogFormState));
    assert.ok(stateField, `FRT-016 ${label} must have live form state`);

    const payloadField = aliases.find((alias) => new RegExp(`\\b${escaped(alias)}\\s*:`).test(dialogPayload));
    assert.ok(payloadField, `FRT-016 ${label} must be forwarded in the event payload`);
    const payloadAssignment = findAssignment(dialogPayload, [payloadField]);
    assert.ok(payloadAssignment, `FRT-016 ${label} payload assignment is missing`);
    assert.match(payloadAssignment.value, new RegExp(`\\b${escaped(stateField)}\\b`), `FRT-016 ${label} payload must use live form state`);
    assert.doesNotMatch(payloadAssignment.value, /^['"`]/, `FRT-016 ${label} must not use a fixture literal`);

    const fallbackField = aliases.find((alias) => new RegExp(`\\b${escaped(alias)}\\??\\s*:`).test(eventInput));
    assert.ok(fallbackField, `FRT-016 ${label} must exist in the shared event input owner`);

    const apiField = aliases.find((alias) => new RegExp(`\\b${escaped(alias)}\\s*:`).test(eventApi));
    assert.ok(apiField, `FRT-016 ${label} must be mapped by the event API`);
    const apiAssignment = findAssignment(eventApi, [apiField]);
    assert.ok(apiAssignment, `FRT-016 ${label} API assignment is missing`);
    assert.match(apiAssignment.value, /body\??\.|payload|input|metadata|details/, `FRT-016 ${label} API mapping must use request data`);
    assert.doesNotMatch(apiAssignment.value, /^['"`]/, `FRT-016 ${label} API mapping must not be a fake constant`);
  }

  assert.doesNotMatch(
    dialogPayload,
    /\b(?:location|meetingLocation|onlineLink|meetingLink|participants|attendees|invitees)\s*:/,
    'FRT-016 must not pretend to persist unsupported location or participant fields',
  );
});

test('FRT-016 uses the canonical date, weekday and timezone owners', () => {
  const dialog = read(dialogPath);
  const api = read(eventRoutePath);
  const timezone = read(timezonePath);
  const scheduling = read(schedulingPath);
  const googleSync = read('src/server/google-calendar-sync.ts');

  assert.match(timezone, /CLOSEFLOW_DEFAULT_TIMEZONE\s*=\s*['"]Europe\/Warsaw['"]/);
  for (const helper of [
    'localDateTimeInputToUtcIso',
    'normalizeCloseFlowDateTimeToUtcIso',
    'localDateTimeInputToReminderUtcIso',
    'utcIsoToGoogleDateTimeInDefaultZone',
    'assertNoCalendarTimeShift',
  ]) {
    assert.match(timezone, new RegExp(`export function ${helper}\\b`), `missing canonical timezone helper: ${helper}`);
  }
  assert.match(scheduling, /buildStartEndPair/);
  assert.match(scheduling, /toDateTimeLocalValue/);
  assert.match(googleSync, /utcIsoToGoogleDateTimeInDefaultZone/);

  assert.match(dialog, /type="date"/);
  assert.match(dialog, /type="time"/);
  assert.match(dialog, /(?:dayOfWeek|weekday|getDay\(\)|Intl\.DateTimeFormat|format[^\n]*(?:EEEE|weekday))/i, 'weekday must be derived from the selected date, not fixture text');
  assert.match(dialog, /(?:localDateTimeInputToUtcIso|normalizeCloseFlowDateTimeToUtcIso)\(/, 'event start/end must use the canonical local-to-UTC helper');
  assert.match(dialog, /startAt:\s*normalizeEventDateTime\(form\.startAt\)/);
  assert.match(dialog, /scheduledAt:\s*normalizeEventDateTime\(form\.startAt\)/);
  assert.match(dialog, /endAt:\s*normalizeEventDateTime\(form\.endAt\)/);
  assert.match(dialog, /localDateTimeInputToReminderUtcIso\(/);
  assert.match(api, /const startAt = body\.startAt \? normalizeCloseFlowDateTimeToUtcIso\(body\.startAt\)\s*\|\|\s*nowIso : nowIso/, 'the active route must normalize the event start in the canonical timezone owner');
  assert.match(api, /end_at: body\.endAt \? normalizeCloseFlowDateTimeToUtcIso\(body\.endAt\)/, 'the active route must normalize the event end in the canonical timezone owner');
});

test('FRT-016 does not copy reference-only fixture values into runtime owners', () => {
  const sources = {
    EventCreateDialog: read(dialogPath),
    ContextActionDialogs: read(hostPath),
    LeadDetail: read(leadDetailPath),
  };
  const forbiddenFixtureValues = [
    'ACME Logistics',
    'ACME Sp. z o.o.',
    'Jan Kowalski',
    'Damian Knapik',
    'jan.kowalski@acme.pl',
    '16.05.2025',
    '2025-05-16',
    '11:00',
    '12:00',
    'meet.google.com',
  ];

  for (const [owner, source] of Object.entries(sources)) {
    for (const value of forbiddenFixtureValues) {
      assert.equal(source.includes(value), false, `${owner} must not contain reference fixture value: ${value}`);
    }
  }
});

test('FRT-016 binds stage colors to the canonical token source and rejects literal stage colors', () => {
  const dialog = read(dialogPath);
  const dialogCss = read(dialogStylesPath);
  const foundationCss = read(foundationStylesPath);
  const fortecaDialog = fortecaDialogSource(dialog);
  const stageCss = stageCssBlock(dialogCss);

  assert.match(stageCss, /data-forteca-frt-016-lead-event="true"/);
  assert.match(stageCss, /var\(--cf-vst-[^)]+\)/, 'FRT-016 styles must resolve through canonical VST tokens');
  assert.match(stageCss, /var\(--cf-vst-color-(?:event|primary|delete)[^) ]*\)/, 'FRT-016 needs a semantic canonical token, not a local color');
  assert.doesNotMatch(stageCss, literalColor, 'FRT-016 CSS must not contain literal color values');
  assert.doesNotMatch(stageCss, literalPaletteUtility, 'FRT-016 CSS must not use raw palette utility colors');
  assert.doesNotMatch(fortecaDialog, literalColor, 'FRT-016 component must not contain literal color values');
  assert.doesNotMatch(fortecaDialog, literalPaletteUtility, 'FRT-016 component must not use raw stage palette utility colors');

  for (const token of ['--cf-vst-color-event', '--cf-vst-color-primary', '--cf-vst-color-delete']) {
    assert.match(foundationCss, new RegExp(`${escaped(token)}\\s*:`), `canonical token is missing: ${token}`);
  }

  if (/(?:Trash|trash|delete|Delete|usuń|usun|wyczyść|wyczysc)/.test(dialog)) {
    assert.match(`${dialog}\n${stageCss}`, /--cf-vst-color-delete|data-cf-vst-kind="delete"|cf-vst-button-delete/, 'destructive controls must use the shared destructive token owner');
  }
});

test('FRT-016 keeps the canonical delete variants on the base VST delete owner', () => {
  const foundationStyles = read(foundationStylesPath);

  assert.match(foundationStyles, /--cf-vst-color-delete:\s*#[0-9a-f]{6}/i);
  for (const variant of ['--cf-vst-color-delete-strong', '--cf-vst-color-delete-soft', '--cf-vst-color-delete-border']) {
    assert.match(
      customPropertyValue(foundationStyles, variant),
      /var\(\s*--cf-vst-color-delete\s*\)/,
      `${variant} must derive from --cf-vst-color-delete rather than define an independent literal`,
    );
  }
});

test('FRT-016 keeps every trash icon alias on the VST delete family', () => {
  const actionStyles = read(actionStylesPath);
  const entityActions = read(entityActionsPath);
  const aliasExpectations = [
    ['--cf-trash-icon-color', /var\(\s*--cf-vst-color-delete\s*\)/],
    ['--cf-trash-icon-hover-color', /var\(\s*--cf-vst-color-delete\s*\)/],
    ['--cf-trash-icon-bg', /var\(\s*--cf-vst-color-delete-soft\s*\)/],
    ['--cf-trash-icon-hover-bg', /var\(\s*--cf-vst-color-delete-soft\s*\)/],
    ['--cf-trash-icon-border', /var\(\s*--cf-vst-color-delete-border\s*\)/],
    ['--cf-trash-icon-hover-border', /var\(\s*--cf-vst-color-delete-border\s*\)/],
    ['--cf-trash-border-color', /var\(\s*--cf-vst-color-delete-border\s*\)/],
    ['--cf-trash-border-hover-color', /var\(\s*--cf-vst-color-delete-border\s*\)/],
    ['--cf-trash-bg', /var\(\s*--cf-vst-color-delete-soft\s*\)/],
    ['--cf-trash-bg-hover', /var\(\s*--cf-vst-color-delete-soft\s*\)/],
    ['--cf-trash-text-color', /var\(\s*--cf-vst-color-delete\s*\)/],
  ];

  for (const [alias, expectedFamilyToken] of aliasExpectations) {
    assert.match(customPropertyValue(actionStyles, alias), expectedFamilyToken, `${alias} must resolve through the VST delete family`);
  }
  assert.match(entityActions, /tokenColor:\s*'--cf-vst-color-delete'/);
});

test('FRT-016 removes unresolved trash/delete fallbacks from every consumer adapter', () => {
  const sources = [
    ['closeflow-actions.css', read(actionStylesPath)],
    ['closeflow-record-list-source-truth.css', read(recordListStylesPath)],
    ['closeflow-records-and-rails.css', read(recordRailsStylesPath)],
  ];
  const declarations = sources.flatMap(([file, source]) => customPropertyDeclarations(source).map((entry) => ({ file, ...entry })));
  const declaredProperties = new Set(declarations.map(({ property }) => property));
  const violations = [];
  const canonicalRoot = '--cf-vst-color-delete';
  const legacyVariable = /var\(\s*(--cf-(?:trash|delete)-[a-z0-9-]+)\s*(?:,\s*([^)]*))?\)/gi;

  for (const { file, property, value } of declarations) {
    if (!/(?:trash|delete)/i.test(property) || property === canonicalRoot) continue;
    if (!/var\(\s*--cf-vst-color-delete(?:-(?:strong|soft|border))?\s*\)/i.test(value)) {
      violations.push(`${file}:${property} => ${value}`);
    }
  }

  for (const [file, source] of sources) {
    for (const match of source.matchAll(legacyVariable)) {
      const alias = match[1];
      const fallback = match[2];
      const fallbackResolvesToVst = fallback && /--cf-vst-(?:color-delete(?:-[a-z0-9-]+)?|surface-card-solid)/i.test(fallback);
      if (!declaredProperties.has(alias) && !fallbackResolvesToVst) {
        violations.push(`${file}:${alias} is used without a canonical declaration or VST fallback`);
      }
      if (fallback !== undefined && !fallbackResolvesToVst) {
        violations.push(`${file}:${match[0]} contains a non-VST color fallback`);
      }
    }
  }

  assert.deepEqual(violations, [], 'all trash/delete adapters must resolve through --cf-vst-color-delete family: ' + violations.join('; '));
});

test('FRT-016 preserves the authenticated mutation boundary and lead/calendar refresh handoff', () => {
  const dialog = read(dialogPath);
  const host = read(hostPath);
  const leadDetail = read(leadDetailPath);
  const fallback = read(fallbackPath);
  const api = read(eventRoutePath);
  const insertIndex = dialog.indexOf('insertEventToSupabase(');
  const successIndex = dialog.indexOf('toast.success', insertIndex);

  assert.match(dialog, /if \(!hasAccess\)/);
  assert.match(dialog, /requireWorkspaceId\(workspace\)/);
  assert.match(dialog, /setSaving\(true\)/);
  assert.ok(successIndex > insertIndex, 'success feedback must follow the real event insert');
  assert.match(dialog, /try\s*\{[\s\S]*await insertEventToSupabase\(/);
  assert.match(dialog, /onSaved\?\.\(createdEvent\)/);
  assert.match(dialog, /finally\s*\{[\s\S]*setSaving\(false\)/);
  assert.match(dialog, /onOpenChange\(false\)/);

  assert.match(fallback, /const result = await callApi<[^>]+>\('\/api\/events'/);
  assert.match(fallback, /emitCloseflowWorkItemNoFlickerMutation\(\{\s*action:\s*'create',\s*kind:\s*'event',\s*record:\s*result/);
  assert.match(api, /insertWithVariants\(\['work_items'\],\s*\[payload\]\)/);

  assert.match(host, /const savedRequest = request \? \{ \.\.\.request \} : null/);
  assert.match(host, /if \(typeof window !== 'undefined' && savedRequest\)/);
  assert.match(host, /window\.dispatchEvent\(new CustomEvent\(CONTEXT_ACTION_SAVED_EVENT/);
  assert.match(host, /savedRecord:\s*savedRecord \?\? null/);

  assert.match(leadDetail, /fetchEventsFromSupabase\(\)/);
  assert.match(leadDetail, /isLinkedThroughLeadOrCase\(/);
  assert.match(leadDetail, /if \(!detail\?\.recordType \|\| !detail\?\.recordId\) return/);
  assert.match(leadDetail, /detail\.recordType === 'lead'[\s\S]*String\(detail\.recordId\)[\s\S]*leadId/);
  assert.match(leadDetail, /detail\.leadId[\s\S]*String\(detail\.leadId\)[\s\S]*leadId/);
  assert.match(leadDetail, /detailWorkspaceId[\s\S]*workspaceId/);
  assert.match(leadDetail, /setLinkedEvents\(\(currentEvents/);
  assert.match(leadDetail, /dedupeById\(\[savedRecord, \.\.\.currentEvents\]\)/);
  assert.match(leadDetail, /loadLead\(\{ silent: true \}\)/);
});
