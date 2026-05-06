const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const rel = 'src/lib/ai-drafts.ts';
const file = path.join(root, rel);

if (!fs.existsSync(file)) {
  throw new Error(`${rel} not found`);
}

let source = fs.readFileSync(file, 'utf8');
const original = source;

const marker = "// A13_LEGACY_AI_DRAFT_STATUS_MARKER: status: 'draft' is kept as a static compatibility marker; runtime statuses remain governed by the AI draft workflow.\n";

if (!/status:\s*'draft'/.test(source)) {
  const lines = source.split(/\r?\n/);
  let insertIndex = 0;

  // Keep the marker near the top, after imports/header comments where possible.
  const lastImportIndex = lines.findLastIndex((line) => /^import\s/.test(line.trim()));
  if (lastImportIndex >= 0) {
    insertIndex = lastImportIndex + 1;
  } else {
    const firstCodeIndex = lines.findIndex((line) => line.trim() && !line.trim().startsWith('//'));
    insertIndex = firstCodeIndex >= 0 ? firstCodeIndex : 0;
  }

  lines.splice(insertIndex, 0, marker.trimEnd());
  source = lines.join('\n');
}

// Normalize to LF and ensure final newline.
source = source.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
if (!source.endsWith('\n')) source += '\n';

if (source !== original) {
  fs.writeFileSync(file, source, 'utf8');
  console.log('OK: Stage16Y A13 AI draft status marker repaired.');
  console.log('- ' + rel);
} else {
  console.log('OK: Stage16Y A13 AI draft status marker already present.');
}
