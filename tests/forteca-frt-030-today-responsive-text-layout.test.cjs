const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function expectPattern(source, pattern, label) {
  assert.match(source, pattern, 'Missing responsive text-layout contract: ' + label);
}

test('shared WorkItemCard keeps readable text when actions wrap', () => {
  const css = read('src/styles/work-item-card.css');

  assert.doesNotMatch(
    css,
    /grid-template-columns:\s*(?:38|34)px\s+minmax\(0,\s*1fr\)\s+auto/,
    'an auto action track must not be able to collapse the title track',
  );
  expectPattern(css, /\.cf-work-item-card-actions\s*\{[\s\S]*?grid-column:\s*1\s*\/\s*-1\s*;/, 'actions own a wrapping row');
  expectPattern(css, /\.cf-work-item-card-title\s*\{[\s\S]*?overflow-wrap:\s*break-word\s*;/, 'normal words wrap at word boundaries');
  expectPattern(css, /\.cf-work-item-card-title\s*\{[\s\S]*?word-break:\s*normal\s*;/, 'title does not break every character by default');
});

test('Today priority rail markup uses its existing semantic style source of truth', () => {
  const today = read('src/pages/TodayStable.tsx');
  const css = read('src/styles/owners/closeflow-foundation-operator.css');

  expectPattern(today, /<div className="cf-today-priority-rail-copy">/, 'rail header copy class');
  expectPattern(today, /<h2 className="cf-today-priority-rail-title">/, 'rail title class');
  expectPattern(today, /<p className="cf-today-priority-rail-subtitle">/, 'rail subtitle class');
  expectPattern(today, /<span className="cf-today-priority-item-date">\{formatDateTime\(item\.nextMoveAt\)\}<\/span>/, 'priority date class');
  expectPattern(today, /<strong className="cf-today-priority-item-title">\{item\.title\}<\/strong>/, 'priority title class');
  expectPattern(today, /<span className="cf-today-priority-item-action">\{item\.suggestedAction \|\| item\.reason\}<\/span>/, 'priority action class');
  expectPattern(css, /\.cf-today-main--forteca \.cf-today-priority-copy[\s\S]*?flex:\s*1 1 auto\s*;/, 'priority copy may shrink beside the arrow');
  expectPattern(css, /\.cf-today-main--forteca \.cf-today-priority-rail-subtitle\s*\{/, 'rail subtitle typography');
  expectPattern(css, /\.cf-today-main--forteca \.cf-today-priority-item-date\s*\{/, 'priority date typography');
  expectPattern(css, /\.cf-today-main--forteca \.cf-today-priority-rail-subtitle[\s\S]*?color:\s*var\(--cf-vst-text-muted\)\s*;/, 'rail subtitle uses the canonical muted text token');
  expectPattern(css, /\.cf-today-main--forteca \.cf-today-priority-item-date[\s\S]*?color:\s*var\(--cf-vst-text-faint\)\s*;/, 'priority date uses the canonical faint text token');
  expectPattern(css, /\.cf-today-main--forteca \.cf-today-priority-rail-subtitle[\s\S]*?font-size:\s*var\(--cf-vst-font-size-label\)\s*;/, 'rail subtitle uses the canonical label size token');
  expectPattern(css, /\.cf-today-main--forteca \.cf-today-priority-item-date[\s\S]*?font-size:\s*var\(--cf-vst-font-size-meta\)\s*;/, 'priority date uses the canonical meta size token');
  expectPattern(css, /\.cf-today-main--forteca \.cf-today-priority-item-title[\s\S]*?overflow-wrap:\s*break-word\s*;/, 'priority title wraps at word boundaries');
  expectPattern(css, /\.cf-today-main--forteca \.cf-today-priority-item-action,[\s\S]*?overflow-wrap:\s*break-word\s*;/, 'priority action wraps at word boundaries');
  assert.doesNotMatch(css, /\.cf-today-main--forteca \.cf-today-priority-item-title\s*\{[^}]*white-space:\s*nowrap/);
  assert.doesNotMatch(css, /\.cf-today-main--forteca \.cf-today-priority-item-action,\s*\.cf-today-main--forteca \.cf-today-priority-item-reason\s*\{[^}]*text-overflow:\s*ellipsis/);
});
