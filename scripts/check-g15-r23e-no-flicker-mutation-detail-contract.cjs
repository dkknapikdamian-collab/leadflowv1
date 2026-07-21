#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const sourcePath = path.join(root, 'src/lib/work-items/no-flicker-mutation.ts');

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(sourcePath)) fail('missing no-flicker-mutation.ts');
const source = fs.readFileSync(sourcePath, 'utf8');

function count(value) {
  return source.split(value).length - 1;
}

const required = [
  "export type CloseflowWorkItemNoFlickerAction = 'create' | 'update' | 'delete' | 'upsert';",
  '  item?: unknown;',
  '  record?: unknown;',
  '  recordType?: string | null;',
  '  recordId?: string | null;',
  '  leadId?: string | null;',
  '  clientId?: string | null;',
  '  caseId?: string | null;',
  '  displayKind?: string | null;',
  '  businessKind?: string | null;',
  'export type WorkItemNoFlickerMutationDetail = CloseflowWorkItemNoFlickerMutation;',
  "export const CLOSEFLOW_WORK_ITEM_NO_FLICKER_MUTATION = 'closeflow:work-item-no-flicker-mutation';",
  'export const CLOSEFLOW_WORK_ITEM_NO_FLICKER_MUTATION_EVENT = CLOSEFLOW_WORK_ITEM_NO_FLICKER_MUTATION;',
  'export function normalizeWorkItemMutationId(value: unknown) {',
  'id: normalizeWorkItemMutationId(input.id || input.record),',
  'window.dispatchEvent(new CustomEvent<CloseflowWorkItemNoFlickerMutation>(CLOSEFLOW_WORK_ITEM_NO_FLICKER_MUTATION, {',
  'window.addEventListener(CLOSEFLOW_WORK_ITEM_NO_FLICKER_MUTATION, listener as EventListener);',
  'return () => window.removeEventListener(CLOSEFLOW_WORK_ITEM_NO_FLICKER_MUTATION, listener as EventListener);',
];

for (const value of required) {
  if (count(value) !== 1) fail(`required contract missing or duplicated: ${value}`);
}

if (count("'closeflow:work-item-no-flicker-mutation'") !== 1) {
  fail('runtime event literal must exist exactly once');
}
if (/CLOSEFLOW_WORK_ITEM_NO_FLICKER_MUTATION_EVENT\s*=\s*['"]/.test(source)) {
  fail('event alias must reference the existing constant, not create a second runtime literal');
}
if (!source.includes('detail: {\n      ...input,\n      id: normalizeWorkItemMutationId(input.id || input.record),')) {
  fail('emitter detail and id normalization runtime changed');
}

console.log('PASS: R23E aligns the no-flicker mutation detail type and export aliases without changing runtime dispatch or subscription.');
