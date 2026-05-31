const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function mustInclude(rel, marker) {
  if (!read(rel).includes(marker)) throw new Error(`${rel} missing marker: ${marker}`);
}
function mustNotInclude(rel, marker) {
  if (read(rel).includes(marker)) throw new Error(`${rel} must not contain marker: ${marker}`);
}

mustInclude('src/App.tsx', "import './styles/closeflow-global-client-create-dialog-stage172.css';");

const app = read('src/App.tsx');
if (app.includes("closeflow-remove-modal-helper-copy-stage171.css")) {
  if (app.indexOf("closeflow-global-client-create-dialog-stage172.css") < app.indexOf("closeflow-remove-modal-helper-copy-stage171.css")) {
    throw new Error('Stage172 CSS import must be after Stage171 CSS import.');
  }
}

[
  "import ClientCreateDialog from './ClientCreateDialog';",
  'data-global-client-direct-modal-trigger="true"',
  'data-global-quick-action="client"',
  '<ClientCreateDialog open={isClientCreateOpen} onOpenChange={setIsClientCreateOpen} />',
  'const [isClientCreateOpen, setIsClientCreateOpen] = useState(false);',
  'Klient',
].forEach((marker) => mustInclude('src/components/GlobalQuickActions.tsx', marker));

[
  "import { CancelActionIcon } from './ui-system';",
  'pl-3',
].forEach((marker) => mustInclude('src/components/topic-contact-picker.tsx', marker));

mustNotInclude('src/components/topic-contact-picker.tsx', 'SearchActionIcon');
mustNotInclude('src/components/topic-contact-picker.tsx', 'pl-10');

[
  'createClientInSupabase',
  'createCaseInSupabase',
  'fetchClientsFromSupabase',
  'data-client-create-dialog-stage172="true"',
  'lead-form-vnext-content',
  'Dodaj sprawę od razu',
  'data-client-create-case-option-stage172="true"',
  'Zapisz klienta i sprawę',
].forEach((marker) => mustInclude('src/components/ClientCreateDialog.tsx', marker));

[
  '--closeflow-stage172-global-client-button-picker-icon-cleanup: "active"',
  '[data-client-create-dialog-stage172="true"]',
  '[data-topic-contact-picker-input="true"]',
  'padding-left: 12px !important',
].forEach((marker) => mustInclude('src/styles/closeflow-global-client-create-dialog-stage172.css', marker));

[
  'scripts/apply-stage172-global-client-button-picker-icon-cleanup.cjs',
  'scripts/check-stage172-global-client-button-picker-icon-cleanup.cjs',
  'docs/ui/CLOSEFLOW_STAGE172_GLOBAL_CLIENT_BUTTON_PICKER_ICON_CLEANUP.md',
  'docs/ui/CLOSEFLOW_STAGE172_RUNTIME_GLOBAL_CLIENT_AND_PICKER_AUDIT.js',
  '_project/STAGE172_GLOBAL_CLIENT_BUTTON_PICKER_ICON_CLEANUP_REPORT.md',
  'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage172 global client button and picker icon cleanup.md',
].forEach((rel) => {
  if (!fs.existsSync(path.join(root, rel))) throw new Error(`Missing Stage172 file: ${rel}`);
});

console.log('OK: Stage172 global +Klient button, client dialog, and picker icon cleanup guard passed.');
