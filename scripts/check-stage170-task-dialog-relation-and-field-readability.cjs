const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function mustInclude(rel, marker) {
  if (!read(rel).includes(marker)) throw new Error(`${rel} missing marker: ${marker}`);
}

mustInclude('src/App.tsx', "import './styles/closeflow-task-dialog-relation-and-field-readability-stage170.css';");

const app = read('src/App.tsx');
if (app.includes("closeflow-topic-contact-picker-readable-stage169.css")) {
  if (app.indexOf("closeflow-task-dialog-relation-and-field-readability-stage170.css") < app.indexOf("closeflow-topic-contact-picker-readable-stage169.css")) {
    throw new Error('Stage170 CSS import must be after Stage169 CSS import.');
  }
}

[
  "import { TopicContactPicker } from './topic-contact-picker';",
  "fetchLeadsFromSupabase",
  "fetchClientsFromSupabase",
  "fetchCasesFromSupabase",
  "buildTopicContactOptions",
  "findTopicContactOption",
  "resolveTopicContactLink",
  "type TopicContactOption",
  "relationQuery: string;",
  "data-task-create-dialog-stage170=\"true\"",
  "data-task-create-dialog-relation-picker=\"true\"",
  "Powiąż z leadem, klientem albo sprawą",
  "selectedTaskRelationOption",
  "handleSelectTaskRelation",
  "leadId: relation.leadId || form.leadId || context?.leadId || undefined",
  "clientId: relation.clientId || form.clientId || context?.clientId || undefined",
].forEach((marker) => mustInclude('src/components/TaskCreateDialog.tsx', marker));

const css = 'src/styles/closeflow-task-dialog-relation-and-field-readability-stage170.css';
[
  'CLOSEFLOW_STAGE170_TASK_DIALOG_RELATION_AND_FIELD_READABILITY',
  '--closeflow-stage170-task-dialog-relation-and-field-readability: "active"',
  '--cf170-control-fg: #0f172a',
  'height: auto !important',
  '[data-task-create-dialog-stage170="true"]',
  '-webkit-text-fill-color: var(--cf170-control-fg) !important',
  'select option',
  'data-task-create-dialog-relation-picker'
].forEach((marker) => mustInclude(css, marker));

[
  'scripts/apply-stage170-task-dialog-relation-and-field-readability.cjs',
  'scripts/check-stage170-task-dialog-relation-and-field-readability.cjs',
  'docs/ui/CLOSEFLOW_STAGE170_TASK_DIALOG_RELATION_AND_FIELD_READABILITY.md',
  'docs/ui/CLOSEFLOW_STAGE170_RUNTIME_TASK_DIALOG_AUDIT.js',
  '_project/STAGE170_TASK_DIALOG_RELATION_AND_FIELD_READABILITY_REPORT.md',
  'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage170 task dialog relation and field readability.md',
].forEach((rel) => {
  if (!fs.existsSync(path.join(root, rel))) throw new Error(`Missing Stage170 file: ${rel}`);
});

console.log('OK: Stage170 task dialog relation + field readability guard passed.');
