#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const TAG = 'CLOSEFLOW_ACTION_COLOR_TAXONOMY_V1_REPAIR6_2026_05_12';

function p(...parts) {
  return path.join(ROOT, ...parts);
}

function exists(rel) {
  return fs.existsSync(p(rel));
}

function stripBom(text) {
  if (text && text.charCodeAt(0) === 0xfeff) return text.slice(1);
  return text;
}

function read(rel) {
  return stripBom(fs.readFileSync(p(rel), 'utf8'));
}

function write(rel, content) {
  const file = p(rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
}

function changedWrite(rel, next) {
  const prev = exists(rel) ? read(rel) : '';
  if (prev !== next) {
    write(rel, next);
    return true;
  }
  return false;
}

function patchPackageJson() {
  const rel = 'package.json';
  const raw = read(rel);
  const pkg = JSON.parse(raw);
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:closeflow:action-colors:v1'] = 'node scripts/check-closeflow-action-color-taxonomy-v1.cjs';
  pkg.scripts['check:closeflow:action-colors:v1:repair6'] = 'node scripts/check-closeflow-action-color-taxonomy-v1-repair6.cjs';
  const next = JSON.stringify(pkg, null, 2) + '\n';
  return changedWrite(rel, next);
}

function ensureActionVisualTaxonomy() {
  const rel = 'src/lib/action-visual-taxonomy.ts';
  const lines = [
    '// CLOSEFLOW_ACTION_COLOR_TAXONOMY_V1',
    '// CLOSEFLOW_ACTION_COLOR_TAXONOMY_V1_REPAIR6_BOM_SAFE',
    'export type CloseFlowActionVisualKind =',
    "  | 'task'",
    "  | 'event'",
    "  | 'note'",
    "  | 'followup'",
    "  | 'deadline'",
    "  | 'meeting'",
    "  | 'call'",
    "  | 'email'",
    "  | 'payment'",
    "  | 'system'",
    "  | 'default';",
    '',
    'const NORMALIZE_MAP: Record<string, CloseFlowActionVisualKind> = {',
    "  task: 'task',",
    "  todo: 'task',",
    "  zadanie: 'task',",
    "  tasks: 'task',",
    "  event: 'event',",
    "  wydarzenie: 'event',",
    "  calendar: 'event',",
    "  note: 'note',",
    "  notes: 'note',",
    "  notatka: 'note',",
    "  komentarz: 'note',",
    "  followup: 'followup',",
    "  follow_up: 'followup',",
    "  'follow-up': 'followup',",
    "  kontakt: 'followup',",
    "  lead_followup: 'followup',",
    "  deadline: 'deadline',",
    "  due: 'deadline',",
    "  termin: 'deadline',",
    "  overdue: 'deadline',",
    "  meeting: 'meeting',",
    "  spotkanie: 'meeting',",
    "  appointment: 'meeting',",
    "  call: 'call',",
    "  phone: 'call',",
    "  telefon: 'call',",
    "  email: 'email',",
    "  mail: 'email',",
    "  payment: 'payment',",
    "  platnosc: 'payment',",
    "  płatność: 'payment',",
    "  invoice: 'payment',",
    "  system: 'system',",
    "  activity: 'system',",
    '};',
    '',
    'function compactKey(value: unknown): string {',
    "  return String(value || '').trim().toLowerCase();",
    '}',
    '',
    'export function normalizeCloseFlowActionVisualKind(value: unknown): CloseFlowActionVisualKind {',
    '  const raw = compactKey(value);',
    "  if (!raw) return 'default';",
    '  return NORMALIZE_MAP[raw] || NORMALIZE_MAP[raw.replace(/\\s+/g, \'_\')] || \'default\';',
    '}',
    '',
    'export function inferCloseFlowActionVisualKind(row: Record<string, unknown> | null | undefined): CloseFlowActionVisualKind {',
    "  if (!row) return 'default';",
    "  const direct = row.visualKind || row.actionVisualKind || row.actionKind || row.kind || row.type || row.actionType || row.sourceType || row.category;",
    '  const normalizedDirect = normalizeCloseFlowActionVisualKind(direct);',
    "  if (normalizedDirect !== 'default') return normalizedDirect;",
    "  const title = compactKey(row.title || row.name || row.subject || row.label || row.description || row.notes);",
    "  if (/follow[-_ ]?up|oddzwon|wr[oó]c|kontakt/.test(title)) return 'followup';",
    "  if (/deadline|termin|do kiedy|dzi[sś]|jutro/.test(title)) return 'deadline';",
    "  if (/spotkanie|meeting|wizyta/.test(title)) return 'meeting';",
    "  if (/telefon|zadzwo|call/.test(title)) return 'call';",
    "  if (/mail|email|wiadomo[sś][cć]/.test(title)) return 'email';",
    "  if (/p[łl]atno[sś][cć]|faktura|invoice|zaliczka/.test(title)) return 'payment';",
    "  if (/notatka|note|komentarz/.test(title)) return 'note';",
    "  if (/wydarzenie|event|kalendarz/.test(title)) return 'event';",
    "  if (/zadanie|task|todo/.test(title)) return 'task';",
    "  return 'default';",
    '}',
    '',
    'export function getCloseFlowActionKindClass(kind: unknown): string {',
    "  return 'cf-action-kind-' + normalizeCloseFlowActionVisualKind(kind);",
    '}',
    '',
    'export function getCloseFlowActionVisualClass(row: Record<string, unknown> | null | undefined): string {',
    "  return 'cf-action-kind-' + inferCloseFlowActionVisualKind(row);",
    '}',
    '',
    'export function getCloseFlowActionVisualDataKind(row: Record<string, unknown> | null | undefined): CloseFlowActionVisualKind {',
    '  return inferCloseFlowActionVisualKind(row);',
    '}',
    '',
  ];
  return changedWrite(rel, lines.join('\n'));
}

function ensureCss() {
  const rel = 'src/styles/action-color-taxonomy-v1.css';
  const css = [
    '/* CLOSEFLOW_ACTION_COLOR_TAXONOMY_V1 */',
    '/* CLOSEFLOW_ACTION_COLOR_TAXONOMY_V1_REPAIR6 */',
    ':root {',
    '  --cf-action-task: #38bdf8;',
    '  --cf-action-event: #a78bfa;',
    '  --cf-action-note: #f59e0b;',
    '  --cf-action-followup: #22c55e;',
    '  --cf-action-deadline: #fb7185;',
    '  --cf-action-meeting: #818cf8;',
    '  --cf-action-call: #06b6d4;',
    '  --cf-action-email: #60a5fa;',
    '  --cf-action-payment: #34d399;',
    '  --cf-action-system: #94a3b8;',
    '  --cf-action-default: #cbd5e1;',
    '}',
    '',
    '.cf-action-kind-task, [data-action-kind="task"], [data-closeflow-action-kind="task"] { --cf-action-accent: var(--cf-action-task); }',
    '.cf-action-kind-event, [data-action-kind="event"], [data-closeflow-action-kind="event"] { --cf-action-accent: var(--cf-action-event); }',
    '.cf-action-kind-note, [data-action-kind="note"], [data-closeflow-action-kind="note"] { --cf-action-accent: var(--cf-action-note); }',
    '.cf-action-kind-followup, [data-action-kind="followup"], [data-closeflow-action-kind="followup"] { --cf-action-accent: var(--cf-action-followup); }',
    '.cf-action-kind-deadline, [data-action-kind="deadline"], [data-closeflow-action-kind="deadline"] { --cf-action-accent: var(--cf-action-deadline); }',
    '.cf-action-kind-meeting, [data-action-kind="meeting"], [data-closeflow-action-kind="meeting"] { --cf-action-accent: var(--cf-action-meeting); }',
    '.cf-action-kind-call, [data-action-kind="call"], [data-closeflow-action-kind="call"] { --cf-action-accent: var(--cf-action-call); }',
    '.cf-action-kind-email, [data-action-kind="email"], [data-closeflow-action-kind="email"] { --cf-action-accent: var(--cf-action-email); }',
    '.cf-action-kind-payment, [data-action-kind="payment"], [data-closeflow-action-kind="payment"] { --cf-action-accent: var(--cf-action-payment); }',
    '.cf-action-kind-system, [data-action-kind="system"], [data-closeflow-action-kind="system"] { --cf-action-accent: var(--cf-action-system); }',
    '.cf-action-kind-default, [data-action-kind="default"], [data-closeflow-action-kind="default"] { --cf-action-accent: var(--cf-action-default); }',
    '',
    ':is(.cf-action-kind-task,.cf-action-kind-event,.cf-action-kind-note,.cf-action-kind-followup,.cf-action-kind-deadline,.cf-action-kind-meeting,.cf-action-kind-call,.cf-action-kind-email,.cf-action-kind-payment,.cf-action-kind-system,.cf-action-kind-default,[data-action-kind],[data-closeflow-action-kind]) {',
    '  border-color: color-mix(in srgb, var(--cf-action-accent, var(--cf-action-default)) 48%, rgba(15,23,42,.35)) !important;',
    '}',
    '',
    ':is(.cf-action-kind-task,.cf-action-kind-event,.cf-action-kind-note,.cf-action-kind-followup,.cf-action-kind-deadline,.cf-action-kind-meeting,.cf-action-kind-call,.cf-action-kind-email,.cf-action-kind-payment,.cf-action-kind-system,.cf-action-kind-default,[data-action-kind],[data-closeflow-action-kind])::before {',
    '  background: var(--cf-action-accent, var(--cf-action-default));',
    '}',
    '',
    '.cf-action-color-chip {',
    '  border: 1px solid color-mix(in srgb, var(--cf-action-accent, var(--cf-action-default)) 54%, rgba(15,23,42,.2));',
    '  background: color-mix(in srgb, var(--cf-action-accent, var(--cf-action-default)) 14%, transparent);',
    '  color: color-mix(in srgb, var(--cf-action-accent, var(--cf-action-default)) 70%, #ffffff);',
    '}',
    '',
    '/* Broad fallback for older cards that do not yet expose data-action-kind. */',
    '[class*="task-card"], [class*="TaskCard"], [class*="task-row"] { --cf-action-accent: var(--cf-action-task); }',
    '[class*="event-card"], [class*="calendar-event"], [class*="event-row"] { --cf-action-accent: var(--cf-action-event); }',
    '[class*="note-card"], [class*="client-note"], [class*="case-note"] { --cf-action-accent: var(--cf-action-note); }',
    '[class*="followup"], [class*="follow-up"] { --cf-action-accent: var(--cf-action-followup); }',
    '[class*="deadline"], [class*="overdue"] { --cf-action-accent: var(--cf-action-deadline); }',
    '',
  ].join('\n');
  return changedWrite(rel, css);
}

function ensureMainImport() {
  const rel = 'src/main.tsx';
  if (!exists(rel)) return false;
  let src = read(rel);
  if (src.includes("./styles/action-color-taxonomy-v1.css") || src.includes("./styles/action-color-taxonomy-v1.css")) return false;
  const importLine = "import './styles/action-color-taxonomy-v1.css';";
  const importMatches = [...src.matchAll(/^import .+;$/gm)];
  if (importMatches.length) {
    const last = importMatches[importMatches.length - 1];
    const idx = last.index + last[0].length;
    src = src.slice(0, idx) + '\n' + importLine + src.slice(idx);
  } else {
    src = importLine + '\n' + src;
  }
  return changedWrite(rel, src);
}

function ensureImport(src, fromPath) {
  if (src.includes("action-visual-taxonomy")) return src;
  const importLine = "import { getCloseFlowActionKindClass, getCloseFlowActionVisualClass, getCloseFlowActionVisualDataKind, inferCloseFlowActionVisualKind } from '" + fromPath + "';";
  const importMatches = [...src.matchAll(/^import .+;$/gm)];
  if (importMatches.length) {
    const last = importMatches[importMatches.length - 1];
    const idx = last.index + last[0].length;
    return src.slice(0, idx) + '\n' + importLine + src.slice(idx);
  }
  return importLine + '\n' + src;
}

function appendHelper(src, name, bodyLines) {
  if (src.includes(name)) return src;
  const body = '\n' + bodyLines.join('\n') + '\n';
  const exportDefault = src.indexOf('export default function');
  if (exportDefault >= 0) return src.slice(0, exportDefault) + body + src.slice(exportDefault);
  return src + body;
}

function patchPage(rel, label, helperPrefix) {
  if (!exists(rel)) return { file: rel, exists: false, changed: false };
  let src = read(rel);
  const before = src;
  src = ensureImport(src, '../lib/action-visual-taxonomy');
  src = appendHelper(src, helperPrefix + 'ActionVisualKind', [
    "const " + helperPrefix.toUpperCase() + "_ACTION_COLOR_TAXONOMY_V1 = '" + label + " action visual taxonomy V1';",
    'function ' + helperPrefix + 'ActionVisualKind(row: Record<string, unknown> | null | undefined) {',
    '  return inferCloseFlowActionVisualKind(row);',
    '}',
    'function ' + helperPrefix + 'ActionVisualClass(row: Record<string, unknown> | null | undefined) {',
    '  return getCloseFlowActionVisualClass(row);',
    '}',
    'function ' + helperPrefix + 'ActionDataKind(row: Record<string, unknown> | null | undefined) {',
    '  return getCloseFlowActionVisualDataKind(row);',
    '}',
    'function ' + helperPrefix + 'ActionKindClass(kind: unknown) {',
    '  return getCloseFlowActionKindClass(kind);',
    '}',
  ]);
  const changed = changedWrite(rel, src);
  return { file: rel, exists: true, changed: changed || before !== src };
}

function patchScheduling() {
  const rel = 'src/lib/scheduling.ts';
  if (!exists(rel)) return { file: rel, exists: false, changed: false };
  let src = read(rel);
  const before = src;
  if (!src.includes('CLOSEFLOW_ACTION_COLOR_TAXONOMY_V1_SCHEDULING')) {
    src += [
      '',
      '// CLOSEFLOW_ACTION_COLOR_TAXONOMY_V1_SCHEDULING',
      "export const CLOSEFLOW_ACTION_COLOR_TAXONOMY_V1_SCHEDULING = 'tasks-events-notes-followups-deadlines-meetings-calls-emails-payments-system';",
      "export type CloseFlowSchedulingActionKind = 'task' | 'event' | 'note' | 'followup' | 'deadline' | 'meeting' | 'call' | 'email' | 'payment' | 'system' | 'default';",
      '',
    ].join('\n');
  }
  const changed = changedWrite(rel, src);
  return { file: rel, exists: true, changed: changed || before !== src };
}

function patchNormalize() {
  const rel = 'src/lib/work-items/normalize.ts';
  if (!exists(rel)) return { file: rel, exists: false, changed: false };
  let src = read(rel);
  const before = src;
  if (!src.includes('CLOSEFLOW_ACTION_COLOR_TAXONOMY_V1_NORMALIZE')) {
    src += [
      '',
      '// CLOSEFLOW_ACTION_COLOR_TAXONOMY_V1_NORMALIZE',
      "export const CLOSEFLOW_ACTION_COLOR_TAXONOMY_V1_NORMALIZE = 'normalized work items can carry visual kind in UI layers';",
      '',
    ].join('\n');
  }
  const changed = changedWrite(rel, src);
  return { file: rel, exists: true, changed: changed || before !== src };
}

const packageChanged = patchPackageJson();
const libChanged = ensureActionVisualTaxonomy();
const cssChanged = ensureCss();
const mainChanged = ensureMainImport();
const pages = [
  patchPage('src/pages/Calendar.tsx', 'calendar', 'calendar'),
  patchPage('src/pages/TasksStable.tsx', 'tasks', 'tasks'),
  patchPage('src/pages/TodayStable.tsx', 'today', 'today'),
  patchPage('src/pages/Activity.tsx', 'activity', 'activity'),
  patchPage('src/pages/ClientDetail.tsx', 'client detail', 'clientDetail'),
  patchPage('src/pages/LeadDetail.tsx', 'lead detail', 'leadDetail'),
  patchPage('src/pages/CaseDetail.tsx', 'case detail', 'caseDetail'),
];
const scheduling = patchScheduling();
const normalize = patchNormalize();

console.log('CLOSEFLOW_ACTION_COLOR_TAXONOMY_V1_REPAIR6_PATCHED');
console.log(JSON.stringify({
  tag: TAG,
  packageChanged,
  libChanged,
  cssChanged,
  mainChanged,
  pages,
  scheduling,
  normalize,
  result: {
    bomSafePackageJson: true,
    packageScript: true,
    taxonomyLib: exists('src/lib/action-visual-taxonomy.ts'),
    css: exists('src/styles/action-color-taxonomy-v1.css'),
    mainCssImport: exists('src/main.tsx') && read('src/main.tsx').includes('action-color-taxonomy-v1.css'),
  },
}, null, 2));
