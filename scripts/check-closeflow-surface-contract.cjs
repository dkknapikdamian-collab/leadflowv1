const fs = require('fs');
const path = require('path');

const root = process.cwd();
const srcDir = path.join(root, 'src');
const stylesDir = path.join(srcDir, 'styles');
const pagesDir = path.join(srcDir, 'pages');
const appFile = path.join(srcDir, 'App.tsx');
const contractFile = path.join(stylesDir, 'closeflow-surface-tokens.css');

const targetClasses = [
  'right-card',
  'settings-right-card',
  'billing-right-card',
  'activity-right-card',
  'support-right-rail',
  'notifications-right-rail',
  'ai-drafts-right-rail',
  'lead-right-card',
  'cases-shortcuts-rail-card',
  'calendar-week-filter',
  'calendar-week-plan',
];

const targetSelectorRegex = /right-card|right-rail|settings-right-card|billing-right-card|activity-right-card|support-right-rail|notifications-right-rail|ai-drafts-right-rail|lead-right-card|cases-shortcuts-rail-card|calendar-week-filter|calendar-week-plan/;
const forbiddenBgRegex = /(bg-black|background\s*:\s*black|background-color\s*:\s*black|background\s*:\s*#000\b|background-color\s*:\s*#000\b|background\s*:\s*#000000\b|background-color\s*:\s*#000000\b)/i;
const whiteTextRegex = /text-white|(?<!-)color\s*:\s*white\b|(?<!-)color\s*:\s*#fff\b|(?<!-)color\s*:\s*#ffffff\b/i;
const darkModeContractRegex = /(^|\s)\.dark\b|\[data-theme=['"]dark['"]\]|\[data-skin=['"]forteca-dark['"]\]|\[data-skin=['"]midnight['"]\]/i;

function walkFiles(dir, extensions, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(full, extensions, out);
      continue;
    }
    if (extensions.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

function rel(file) {
  return path.relative(root, file).replace(/\\/g, '/');
}

function lineFromIndex(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

const failures = [];

if (!fs.existsSync(contractFile)) {
  failures.push('missing src/styles/closeflow-surface-tokens.css');
} else {
  const contractText = fs.readFileSync(contractFile, 'utf8');
  const requiredTokens = [
    '--cf-surface-page',
    '--cf-surface-card',
    '--cf-surface-card-muted',
    '--cf-surface-border',
    '--cf-surface-text',
    '--cf-surface-muted',
    '--cf-surface-shadow',
  ];
  for (const token of requiredTokens) {
    if (!contractText.includes(token)) failures.push(`missing token ${token} in src/styles/closeflow-surface-tokens.css`);
  }
  for (const className of targetClasses) {
    if (!contractText.includes(className)) failures.push(`missing selector ${className} in src/styles/closeflow-surface-tokens.css`);
  }
}

if (!fs.existsSync(appFile)) {
  failures.push('missing src/App.tsx');
} else {
  const appText = fs.readFileSync(appFile, 'utf8');
  if (!appText.includes("import './styles/closeflow-surface-tokens.css';")) {
    failures.push('src/App.tsx must import ./styles/closeflow-surface-tokens.css');
  }
}

const cssFiles = walkFiles(stylesDir, new Set(['.css']));
for (const file of cssFiles) {
  const text = fs.readFileSync(file, 'utf8');
  const blockRegex = /([^{}]+)\{([^{}]*)\}/g;
  let match;
  while ((match = blockRegex.exec(text))) {
    const selector = match[1];
    const body = match[2];
    if (!targetSelectorRegex.test(selector)) continue;

    if (forbiddenBgRegex.test(body)) {
      failures.push(`${rel(file)}:${lineFromIndex(text, match.index)} forbidden dark background on right-card/right-rail selector`);
    }

    if (whiteTextRegex.test(body) && !darkModeContractRegex.test(selector)) {
      failures.push(`${rel(file)}:${lineFromIndex(text, match.index)} text-white/white color on right-card/right-rail selector without dark-mode contract`);
    }
  }
}

const pageFiles = walkFiles(pagesDir, new Set(['.tsx', '.ts', '.jsx', '.js']));
const jsxDangerPattern = /className\s*=\s*["'`][^"'`]*(right-card|right-rail)[^"'`]*(bg-black|text-white)[^"'`]*["'`]/g;

for (const file of pageFiles) {
  const text = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = jsxDangerPattern.exec(text))) {
    failures.push(`${rel(file)}:${lineFromIndex(text, match.index)} local bg-black/text-white on right-card/right-rail className`);
  }
}

if (failures.length > 0) {
  console.error('FAIL: closeflow surface/right-card/right-rail contract violations found.');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('OK: closeflow surface/right-card/right-rail contract audit completed.');
