#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repo = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}

function fail(message) {
  console.error('CLOSEFLOW_VS2C1_ACTION_ICONS_COMPONENTS_FAIL: ' + message);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

const files = {
  'src/components/EntityConflictDialog.tsx': {
    mustContain: ['OpenActionIcon', 'RestoreActionIcon', 'DeleteActionIcon'],
    forbiddenLucide: ['ExternalLink', 'RotateCcw', 'Trash2'],
  },
  'src/components/GlobalQuickActions.tsx': {
    mustContain: ['AddActionIcon'],
    forbiddenLucide: ['Plus'],
  },
  'src/components/lead-picker.tsx': {
    mustContain: ['SearchActionIcon', 'CancelActionIcon'],
    forbiddenLucide: ['Search', 'X'],
  },
  'src/components/topic-contact-picker.tsx': {
    mustContain: ['SearchActionIcon', 'CancelActionIcon'],
    forbiddenLucide: ['Search', 'X'],
  },
};

for (const [rel, config] of Object.entries(files)) {
  const text = read(rel);

  for (const needle of config.mustContain) {
    assert(text.includes(needle), rel + ' missing ' + needle);
  }

  const lucideImport = text.match(/import\s*\{([\s\S]*?)\}\s*from\s*['"]lucide-react['"]/);
  const body = lucideImport ? lucideImport[1] : '';

  for (const icon of config.forbiddenLucide) {
    const iconRegex = new RegExp('(^|[\\s,{])' + icon + '([\\s,}]|$)');
    assert(!iconRegex.test(body), rel + ' still imports action icon from lucide-react: ' + icon);
  }
}

const pkg = JSON.parse(read('package.json'));
assert(pkg.scripts && pkg.scripts['check:closeflow-vs2c1-action-icons-components'], 'package script missing');

const docs = read('docs/ui/CLOSEFLOW_VS2C1_ACTION_ICONS_COMPONENTS_2026-05-09.md');
assert(docs.includes('VS-2C-1'), 'docs missing VS-2C-1 marker');

console.log('CLOSEFLOW_VS2C1_ACTION_ICONS_COMPONENTS_CHECK_OK');
console.log('files_checked=' + Object.keys(files).length);
