const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function mustInclude(rel, marker) {
  if (!read(rel).includes(marker)) throw new Error(`${rel} missing marker: ${marker}`);
}

mustInclude('src/App.tsx', "import './styles/closeflow-topic-contact-picker-readable-stage169.css';");

const app = read('src/App.tsx');
if (app.includes("closeflow-modal-footer-in-flow-no-overlay-stage166.css")) {
  if (app.indexOf("closeflow-topic-contact-picker-readable-stage169.css") < app.indexOf("closeflow-modal-footer-in-flow-no-overlay-stage166.css")) {
    throw new Error('Stage169 CSS import must be after Stage166 CSS import.');
  }
}

[
  'data-topic-contact-picker="true"',
  'data-topic-contact-picker-input="true"',
  'data-topic-contact-picker-dropdown="true"',
  'data-topic-contact-picker-option="true"',
  'data-topic-contact-picker-option-title="true"',
  'cf-topic-contact-picker-input',
  'cf-topic-contact-picker-dropdown',
  'cf-topic-contact-picker-option',
].forEach((marker) => mustInclude('src/components/topic-contact-picker.tsx', marker));

const css = 'src/styles/closeflow-topic-contact-picker-readable-stage169.css';
[
  'CLOSEFLOW_STAGE169_TOPIC_CONTACT_PICKER_READABLE_AND_TASK_GUARD',
  '--closeflow-stage169-topic-contact-picker-readable-and-task-guard: "active"',
  '[data-topic-contact-picker-dropdown="true"]',
  '[data-topic-contact-picker-option="true"]',
  'background: var(--cf169-picker-bg) !important',
  'color: var(--cf169-picker-fg) !important',
  'select option',
  '-webkit-text-fill-color'
].forEach((marker) => mustInclude(css, marker));

const tasks = read('src/pages/Tasks.tsx');
const topicPickerCount = (tasks.match(/<TopicContactPicker/g) || []).length;
if (topicPickerCount < 2) {
  throw new Error(`Stage169 guard failed: Tasks.tsx should keep TopicContactPicker in new/edit task forms. Found ${topicPickerCount}.`);
}

mustInclude('src/pages/Tasks.tsx', 'handleSelectNewTaskRelation');
mustInclude('src/pages/Tasks.tsx', 'handleSelectEditTaskRelation');

[
  'docs/ui/CLOSEFLOW_STAGE169_TOPIC_CONTACT_PICKER_READABLE_AND_TASK_GUARD.md',
  '_project/STAGE169_TOPIC_CONTACT_PICKER_READABLE_AND_TASK_GUARD_REPORT.md',
  'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage169 topic contact picker readable and task guard.md',
].forEach((rel) => {
  if (!fs.existsSync(path.join(root, rel))) throw new Error(`Missing Stage169 file: ${rel}`);
});

console.log('OK: Stage169 topic/contact picker readable and task relation guard passed.');
