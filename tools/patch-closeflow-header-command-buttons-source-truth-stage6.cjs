const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();

function file(rel) {
  return path.join(repo, rel);
}

function read(rel) {
  const full = file(rel);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : '';
}

function write(rel, text) {
  fs.writeFileSync(file(rel), text, 'utf8');
}

function ensureImportInApp() {
  const rel = 'src/App.tsx';
  let text = read(rel);
  if (!text) throw new Error('src/App.tsx not found');
  if (text.includes("closeflow-command-actions-source-truth.css")) return false;

  const importLine = "import './styles/closeflow-command-actions-source-truth.css';";
  const cssImports = [...text.matchAll(/^import\s+['"][^'"]+\.css['"];\s*$/gm)];
  if (cssImports.length) {
    const last = cssImports[cssImports.length - 1];
    const insertAt = last.index + last[0].length;
    text = text.slice(0, insertAt) + "\n" + importLine + text.slice(insertAt);
  } else {
    const imports = [...text.matchAll(/^import[\s\S]*?;\s*$/gm)];
    if (!imports.length) throw new Error('No imports found in src/App.tsx');
    const last = imports[imports.length - 1];
    const insertAt = last.index + last[0].length;
    text = text.slice(0, insertAt) + "\n" + importLine + text.slice(insertAt);
  }

  write(rel, text);
  return true;
}

function ensureImportInEmergency() {
  const rel = 'src/styles/emergency/emergency-hotfixes.css';
  const full = file(rel);
  if (!fs.existsSync(full)) return false;

  let text = read(rel);
  const before = text;
  text = text
    .split(/\r?\n/)
    .filter((line) => !line.includes("closeflow-command-actions-source-truth.css"))
    .join('\n')
    .trimEnd();

  text += "\n\n/* CLOSEFLOW_COMMAND_ACTIONS_SOURCE_TRUTH_STAGE6_ENTRY\n   Final button/action source-of-truth import. Must stay after legacy hotfixes.\n*/\n@import '../closeflow-command-actions-source-truth.css';\n";

  if (text !== before) {
    write(rel, text);
    return true;
  }

  return false;
}

function patchGlobalQuickActions() {
  const rel = 'src/components/GlobalQuickActions.tsx';
  let text = read(rel);
  if (!text) throw new Error('src/components/GlobalQuickActions.tsx not found');
  const before = text;

  if (!text.includes("closeflow-command-actions-source-truth.css")) {
    const marker = "import { useWorkspace } from '../hooks/useWorkspace';";
    text = text.replace(marker, marker + "\nimport '../styles/closeflow-command-actions-source-truth.css';");
  }

  text = text.replace(
    'className="global-actions sticky top-16 z-20 overflow-x-auto"',
    'className="global-actions sticky top-16 z-20 overflow-x-auto"'
  );

  const replacements = [
    {
      from: 'className="btn soft-blue" data-global-quick-action="ai-drafts"',
      to: 'className="btn soft-blue cf-command-action cf-command-action--ai" data-global-quick-action="ai-drafts" data-cf-command-action="ai"',
    },
    {
      from: 'className="btn" data-global-quick-action="lead"',
      to: 'className="btn cf-command-action cf-command-action--neutral" data-global-quick-action="lead" data-cf-command-action="neutral"',
    },
    {
      from: 'className="btn" data-global-quick-action="task"',
      to: 'className="btn cf-command-action cf-command-action--neutral" data-global-quick-action="task" data-cf-command-action="neutral"',
    },
    {
      from: 'className="btn" data-global-quick-action="event"',
      to: 'className="btn cf-command-action cf-command-action--neutral" data-global-quick-action="event" data-cf-command-action="neutral"',
    },
  ];

  for (const { from, to } of replacements) {
    if (text.includes(from) && !text.includes(to)) text = text.replace(from, to);
  }

  if (text !== before) {
    write(rel, text);
    return true;
  }
  return false;
}

function patchQuickAiCapture() {
  const rel = 'src/components/QuickAiCapture.tsx';
  let text = read(rel);
  if (!text) throw new Error('src/components/QuickAiCapture.tsx not found');
  const before = text;

  if (!text.includes("closeflow-command-actions-source-truth.css")) {
    const marker = "import { Button } from './ui/button';";
    text = text.replace(marker, marker + "\nimport '../styles/closeflow-command-actions-source-truth.css';");
  }

  const from = 'className="rounded-xl" disabled={!workspaceReady}';
  const to = 'className="rounded-xl cf-command-action cf-command-action--ai" data-cf-command-action="ai" disabled={!workspaceReady}';
  if (text.includes(from) && !text.includes(to)) text = text.replace(from, to);

  if (text !== before) {
    write(rel, text);
    return true;
  }
  return false;
}

const result = {
  appImport: ensureImportInApp(),
  emergencyImport: ensureImportInEmergency(),
  globalQuickActions: patchGlobalQuickActions(),
  quickAiCapture: patchQuickAiCapture(),
};

console.log('CLOSEFLOW_HEADER_COMMAND_BUTTONS_SOURCE_TRUTH_STAGE6_PATCH_OK');
console.log(JSON.stringify(result, null, 2));
