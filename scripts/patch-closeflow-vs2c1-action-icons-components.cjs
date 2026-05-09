#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repo = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}

function write(rel, text) {
  fs.writeFileSync(path.join(repo, rel), text, 'utf8');
}

function replaceAll(text, from, to, rel) {
  if (!text.includes(from)) return text;
  return text.split(from).join(to);
}

function ensurePackageScript() {
  const pkgPath = 'package.json';
  const pkg = JSON.parse(read(pkgPath));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:closeflow-vs2c1-action-icons-components'] = 'node scripts/check-closeflow-vs2c1-action-icons-components.cjs';
  write(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

function patchEntityConflictDialog() {
  const rel = 'src/components/EntityConflictDialog.tsx';
  let text = read(rel);

  text = text.replace(
    "import { AlertTriangle, ExternalLink, RotateCcw, Trash2 } from 'lucide-react';",
    "import { AlertTriangle } from 'lucide-react';\nimport { DeleteActionIcon, OpenActionIcon, RestoreActionIcon } from './ui-system';"
  );

  text = replaceAll(text, '<ExternalLink className="mr-1 h-4 w-4" />Pokaż', '<OpenActionIcon className="mr-1 h-4 w-4" />Pokaż', rel);
  text = replaceAll(text, '<RotateCcw className="mr-1 h-4 w-4" />Przywróć', '<RestoreActionIcon className="mr-1 h-4 w-4" />Przywróć', rel);
  text = replaceAll(text, '<Trash2 className="mr-1 h-4 w-4" />Usuń', '<DeleteActionIcon className="mr-1 h-4 w-4" />Usuń', rel);

  write(rel, text);
  console.log('patched:', rel);
}

function patchGlobalQuickActions() {
  const rel = 'src/components/GlobalQuickActions.tsx';
  let text = read(rel);

  text = text.replace(
    "import { ClipboardList, Plus } from 'lucide-react';",
    "import { ClipboardList } from 'lucide-react';\nimport { AddActionIcon } from './ui-system';"
  );

  text = replaceAll(text, '<Plus className="mr-2 h-4 w-4" />', '<AddActionIcon className="mr-2 h-4 w-4" />', rel);

  write(rel, text);
  console.log('patched:', rel);
}

function patchLeadPicker() {
  const rel = 'src/components/lead-picker.tsx';
  let text = read(rel);

  text = text.replace(
    "import { Check, Search, X } from 'lucide-react';",
    "import { Check } from 'lucide-react';\nimport { CancelActionIcon, SearchActionIcon } from './ui-system';"
  );

  text = replaceAll(text, '<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 app-muted" />', '<SearchActionIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 app-muted" />', rel);
  text = replaceAll(text, '<X className="h-4 w-4" />', '<CancelActionIcon className="h-4 w-4" />', rel);

  write(rel, text);
  console.log('patched:', rel);
}

function patchTopicContactPicker() {
  const rel = 'src/components/topic-contact-picker.tsx';
  let text = read(rel);

  text = text.replace(
    "import { Check, Search, X } from 'lucide-react';",
    "import { Check } from 'lucide-react';\nimport { CancelActionIcon, SearchActionIcon } from './ui-system';"
  );

  text = replaceAll(text, '<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />', '<SearchActionIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />', rel);
  text = replaceAll(text, '<X className="h-4 w-4" />', '<CancelActionIcon className="h-4 w-4" />', rel);

  write(rel, text);
  console.log('patched:', rel);
}

ensurePackageScript();
patchEntityConflictDialog();
patchGlobalQuickActions();
patchLeadPicker();
patchTopicContactPicker();

console.log('CLOSEFLOW_VS2C1_ACTION_ICONS_COMPONENTS_PATCH_OK');
