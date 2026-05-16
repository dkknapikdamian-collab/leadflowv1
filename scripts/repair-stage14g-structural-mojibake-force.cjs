#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();

function filePath(rel) {
  return path.join(root, rel);
}

function read(rel) {
  const full = filePath(rel);
  if (!fs.existsSync(full)) {
    console.error(`Missing required file: ${rel}`);
    process.exit(1);
  }
  return fs.readFileSync(full, 'utf8');
}

function write(rel, text) {
  fs.writeFileSync(filePath(rel), text, 'utf8');
}

function rewriteLines(rel, transform) {
  const before = read(rel);
  const lines = before.split(/\r?\n/);
  let changes = 0;
  const afterLines = lines.map((line, index) => {
    const next = transform(line, index + 1);
    if (next !== line) changes += 1;
    return next;
  });
  const after = afterLines.join('\n');
  if (after !== before) write(rel, after);
  return changes;
}

function patchAiDrafts() {
  const rel = 'src/pages/AiDrafts.tsx';
  return rewriteLines(rel, (line) => {
    const indent = line.match(/^\s*/)?.[0] || '';

    if (line.includes('ai-drafts-relation-empty')) {
      return line.replace(/(<p className="ai-drafts-relation-empty">)[^<]*(<\/p>)/, '$1\u0141aduj\u0119 dane z bazy...$2');
    }

    if (line.includes('<p>') && line.includes('szkic') && line.includes('...</p>')) {
      return line.replace(/<p>[^<]*szkic[^<]*<\/p>/, '<p>\u0141adowanie szkic\u00F3w...</p>');
    }

    if (line.includes('dost') && line.includes('...') && /[\u0141L]adowanie|dost[e\u0119]p/.test(line)) {
      return `${indent}\u0141adowanie dost\u0119pu...`;
    }

    return line;
  });
}

function patchTemplates() {
  const rel = 'src/pages/Templates.tsx';
  return rewriteLines(rel, (line) => {
    const indent = line.match(/^\s*/)?.[0] || '';
    if (!line.includes('toast.error') || !line.includes('szablon')) return line;

    const suffix = "${error?.message || 'REQUEST_FAILED'}";

    if (line.includes('pobra')) {
      return `${indent}toast.error(\`Nie uda\u0142o si\u0119 pobra\u0107 szablon\u00F3w: ${suffix}\`);`;
    }
    if (line.includes('zapisa')) {
      return `${indent}toast.error(\`Nie uda\u0142o si\u0119 zapisa\u0107 szablonu: ${suffix}\`);`;
    }
    if (line.includes('skopiowa')) {
      return `${indent}toast.error(\`Nie uda\u0142o si\u0119 skopiowa\u0107 szablonu: ${suffix}\`);`;
    }
    if (line.includes('usun') || line.includes('usu')) {
      return `${indent}toast.error(\`Nie uda\u0142o si\u0119 usun\u0105\u0107 szablonu: ${suffix}\`);`;
    }

    return line;
  });
}

function patchGenericLeftovers() {
  const targets = [
    'src/pages/AiDrafts.tsx',
    'src/pages/Templates.tsx',
  ];

  let changes = 0;
  for (const rel of targets) {
    let text = read(rel);
    const before = text;

    // Structural residue cleanups that do not rely on broken characters being encoded consistently.
    text = text.replace(/<p className="ai-drafts-relation-empty">[^<]*<\/p>/g, '<p className="ai-drafts-relation-empty">\u0141aduj\u0119 dane z bazy...</p>');
    text = text.replace(/<p>[^<]*szkic\u00F3w\.\.\.<\/p>/g, '<p>\u0141adowanie szkic\u00F3w...</p>');
    text = text.replace(/(^\s*)[^\r\n<>{}]*dost\u0119pu\.\.\./gm, '$1\u0141adowanie dost\u0119pu...');

    if (text !== before) {
      write(rel, text);
      changes += 1;
    }
  }
  return changes;
}

function findKnownLeftovers() {
  const checks = [
    ['src/pages/AiDrafts.tsx', ['ai-drafts-relation-empty', 'szkic\u00F3w...', 'dost\u0119pu...']],
    ['src/pages/Templates.tsx', ['Nie udaBo', 'pobra szablon\u00F3w', 'zapisa szablonu', 'skopiowa szablonu', 'usun szablonu']],
  ];

  const leftovers = [];
  for (const [rel] of checks) {
    const text = read(rel);
    const lines = text.split(/\r?\n/);
    lines.forEach((line, index) => {
      if (rel.endsWith('AiDrafts.tsx')) {
        if (line.includes('ai-drafts-relation-empty') && !line.includes('\u0141aduj\u0119 dane z bazy')) leftovers.push(`${rel}:${index + 1}: relation loading copy not repaired: ${line.trim()}`);
        if (line.includes('szkic\u00F3w...') && !line.includes('\u0141adowanie szkic\u00F3w')) leftovers.push(`${rel}:${index + 1}: draft loading copy not repaired: ${line.trim()}`);
        if (line.includes('dost\u0119pu...') && !line.includes('\u0141adowanie dost\u0119pu')) leftovers.push(`${rel}:${index + 1}: access loading copy not repaired: ${line.trim()}`);
      }
      if (rel.endsWith('Templates.tsx')) {
        if (line.includes('Nie udaBo') || line.includes('pobra szablon\u00F3w') || line.includes('zapisa szablonu') || line.includes('skopiowa szablonu') || line.includes('usun szablonu')) {
          leftovers.push(`${rel}:${index + 1}: template toast copy not repaired: ${line.trim()}`);
        }
      }
    });
  }
  return leftovers;
}

const changes = [];
const aiChanges = patchAiDrafts();
if (aiChanges) changes.push(`src/pages/AiDrafts.tsx lines=${aiChanges}`);
const tplChanges = patchTemplates();
if (tplChanges) changes.push(`src/pages/Templates.tsx lines=${tplChanges}`);
const genericChanges = patchGenericLeftovers();
if (genericChanges) changes.push(`generic structural passes=${genericChanges}`);

const leftovers = findKnownLeftovers();
if (leftovers.length) {
  console.error('Stage14G structural repair still sees leftovers.');
  for (const item of leftovers) console.error('- ' + item);
  process.exit(1);
}

console.log('OK: Stage14G structural leftover mojibake repair completed.');
console.log(`Touched groups: ${changes.length}`);
for (const item of changes) console.log('- ' + item);
