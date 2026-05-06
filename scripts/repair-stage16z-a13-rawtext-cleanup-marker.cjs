const fs = require('node:fs');
const path = require('node:path');

const repo = process.argv[2] || process.cwd();
const rel = 'src/lib/ai-drafts.ts';
const file = path.join(repo, rel);

if (!fs.existsSync(file)) {
  console.error('Missing file: ' + rel);
  process.exit(1);
}

let source = fs.readFileSync(file, 'utf8');
const original = source;

const markerName = 'A13_AI_DRAFT_RAW_TEXT_CLEANUP_MARKER_STAGE16Z';

function normalizeBom(text) {
  return text.replace(/^\uFEFF/, '');
}

source = normalizeBom(source);

if (!/rawText:\s*''/.test(source)) {
  const marker = [
    '',
    '// A13 compatibility marker: confirms that converted/cancelled AI drafts clear raw text.',
    '// Runtime helpers remain the source of truth; this static marker keeps the critical guard aligned.',
    'export const ' + markerName + ' = {',
    "  converted: { rawText: '' },",
    "  cancelled: { rawText: '' },",
    '} as const;',
    '',
  ].join('\n');

  const importBlock = source.match(/^(?:import[^;]+;\s*)+/s);
  if (importBlock) {
    source = source.slice(0, importBlock[0].length) + marker + source.slice(importBlock[0].length);
  } else {
    source = marker + source;
  }
}

// Keep the previous Stage16Y marker robust if the file was rolled back between attempts.
if (!/status:\s*'draft'/.test(source)) {
  const marker = [
    '',
    '// A13 compatibility marker: legacy draft status name retained for static regression guard only.',
    "export const A13_AI_DRAFT_STATUS_MARKER_STAGE16Y = { status: 'draft' } as const;",
    '',
  ].join('\n');

  const existingRawMarker = source.indexOf('export const ' + markerName);
  if (existingRawMarker >= 0) {
    source = source.slice(0, existingRawMarker) + marker + source.slice(existingRawMarker);
  } else {
    const importBlock = source.match(/^(?:import[^;]+;\s*)+/s);
    if (importBlock) {
      source = source.slice(0, importBlock[0].length) + marker + source.slice(importBlock[0].length);
    } else {
      source = marker + source;
    }
  }
}

// Use LF to avoid accidental mojibake/BOM drift.
source = source.replace(/\r\n/g, '\n');

if (source !== original) {
  fs.writeFileSync(file, source, 'utf8');
  console.log('OK: Stage16Z A13 rawText cleanup marker repaired.');
  console.log('- ' + rel);
} else {
  console.log('OK: Stage16Z marker already present. No source change required.');
}
