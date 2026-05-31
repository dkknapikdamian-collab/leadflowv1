const fs = require('fs');
const path = require('path');

const repo = process.argv[2];
if (!repo) throw new Error('Usage: node apply-stage172-global-client-button-picker-icon-cleanup.cjs <repo>');

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}
function write(rel, text) {
  fs.writeFileSync(path.join(repo, rel), text, 'utf8');
}

function insertStyleImport() {
  const appPath = 'src/App.tsx';
  let app = read(appPath);
  const importLine = "import './styles/closeflow-global-client-create-dialog-stage172.css';";
  if (app.includes(importLine)) {
    console.log('SKIPPED src/App.tsx: Stage172 import already present');
    return;
  }

  const lines = app.split(/\r?\n/);
  let insertAfter = -1;
  for (const marker of [
    "closeflow-remove-modal-helper-copy-stage171.css",
    "closeflow-task-dialog-relation-and-field-readability-stage170.css",
    "closeflow-topic-contact-picker-readable-stage169.css",
    "closeflow-modal-footer-in-flow-no-overlay-stage166.css",
  ]) {
    if (insertAfter >= 0) break;
    for (let i = 0; i < lines.length; i += 1) {
      if (lines[i].includes(marker)) { insertAfter = i; break; }
    }
  }
  if (insertAfter < 0) {
    for (let i = 0; i < lines.length; i += 1) {
      if (/^import ['"]\.\/styles\//.test(lines[i])) insertAfter = i;
    }
  }
  if (insertAfter < 0) throw new Error('App.tsx: no ./styles imports found.');

  lines.splice(insertAfter + 1, 0, importLine);
  write(appPath, lines.join('\n'));
  console.log('UPDATED src/App.tsx: added Stage172 CSS import');
}

function patchTopicContactPicker() {
  const rel = 'src/components/topic-contact-picker.tsx';
  let source = read(rel);
  const original = source;

  source = source.replace(
    "import { CancelActionIcon, SearchActionIcon } from './ui-system';",
    "import { CancelActionIcon } from './ui-system';"
  );

  source = source.replace(
    "import { SearchActionIcon, CancelActionIcon } from './ui-system';",
    "import { CancelActionIcon } from './ui-system';"
  );

  source = source.replace(/[\t ]*<SearchActionIcon\b[\s\S]*?\/>\r?\n/g, '');

  source = source.replace(/className="([^"]*)\bpl-10\b([^"]*)"/g, (match, before, after) => {
    const merged = `${before} pl-3 ${after}`.replace(/\s+/g, ' ').trim();
    return `className="${merged}"`;
  });

  source = source.replace(/\bpl-10\b/g, 'pl-3');

  if (source !== original) {
    write(rel, source);
    console.log('UPDATED src/components/topic-contact-picker.tsx: removed search icon and fixed input padding');
  } else {
    console.log('SKIPPED src/components/topic-contact-picker.tsx: icon cleanup already applied');
  }
}

function patchGlobalQuickActions() {
  const rel = 'src/components/GlobalQuickActions.tsx';
  let source = read(rel);
  const original = source;

  if (!source.includes("import ClientCreateDialog from './ClientCreateDialog';")) {
    source = source.replace(
      "import TaskCreateDialog from './TaskCreateDialog';\n",
      "import TaskCreateDialog from './TaskCreateDialog';\nimport ClientCreateDialog from './ClientCreateDialog';\n"
    );
  }

  if (!source.includes("const [isClientCreateOpen, setIsClientCreateOpen] = useState(false);")) {
    source = source.replace(
      "  const [isTaskCreateOpen, setIsTaskCreateOpen] = useState(false);\n",
      "  const [isTaskCreateOpen, setIsTaskCreateOpen] = useState(false);\n  const [isClientCreateOpen, setIsClientCreateOpen] = useState(false);\n"
    );
  }

  const clientButton = `        <Button type="button" variant="outline" className="btn cf-command-action cf-command-action--neutral" data-global-quick-action="client" data-cf-command-action="neutral" data-global-client-direct-modal-trigger="true" data-feature-status="Gotowe" title="Gotowe" onClick={() => setIsClientCreateOpen(true)}>
          <AddActionIcon className="mr-2 h-4 w-4" />
          Klient
        </Button>
`;

  if (!source.includes('data-global-client-direct-modal-trigger="true"')) {
    const leadButtonEnd = `        </Button>
        {/* STAGE01_GLOBAL_TASK_QUICK_ACTION_BRIDGE_COMPAT_STAGE45M: rememberGlobalQuickAction('task') marker only. Direct task modal opens in place, without Link/asChild route. */}`;
    if (!source.includes(leadButtonEnd)) {
      throw new Error('GlobalQuickActions: could not find insertion point after Lead quick action.');
    }
    source = source.replace(
      leadButtonEnd,
      `        </Button>\n${clientButton}        {/* STAGE01_GLOBAL_TASK_QUICK_ACTION_BRIDGE_COMPAT_STAGE45M: rememberGlobalQuickAction('task') marker only. Direct task modal opens in place, without Link/asChild route. */}`
    );
  }

  if (!source.includes('<ClientCreateDialog open={isClientCreateOpen} onOpenChange={setIsClientCreateOpen} />')) {
    source = source.replace(
      "      <TaskCreateDialog open={isTaskCreateOpen} onOpenChange={setIsTaskCreateOpen} />\n",
      "      <ClientCreateDialog open={isClientCreateOpen} onOpenChange={setIsClientCreateOpen} />\n      <TaskCreateDialog open={isTaskCreateOpen} onOpenChange={setIsTaskCreateOpen} />\n"
    );
  }

  if (source !== original) {
    write(rel, source);
    console.log('UPDATED src/components/GlobalQuickActions.tsx: added global + Klient button and dialog');
  } else {
    console.log('SKIPPED src/components/GlobalQuickActions.tsx: + Klient already present');
  }
}

insertStyleImport();
patchTopicContactPicker();
patchGlobalQuickActions();
