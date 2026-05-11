#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const billingPath = path.join(root, 'src', 'pages', 'Billing.tsx');
const packagePath = path.join(root, 'package.json');
const checkSourcePath = path.join(root, 'scripts', 'check-closeflow-billing-cleanup-2026-05-11.cjs');
const releaseDocPath = path.join(root, 'docs', 'release', 'CLOSEFLOW_STAGE10_BILLING_CLEANUP_2026-05-11.md');

function assertFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required file: ${path.relative(root, filePath)}`);
  }
}

function mkdirp(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function backupFile(filePath, backupRoot) {
  if (!fs.existsSync(filePath)) return;
  const rel = path.relative(root, filePath);
  const dest = path.join(backupRoot, rel);
  mkdirp(path.dirname(dest));
  fs.copyFileSync(filePath, dest);
}

function findMatchingClose(src, openStart, tagName) {
  const openEnd = src.indexOf('>', openStart);
  if (openEnd === -1) return -1;

  const openTag = src.slice(openStart, openEnd + 1);
  if (/\/\s*>$/.test(openTag)) return openEnd + 1;

  const re = new RegExp(`<\\/?${tagName}\\b[^>]*>`, 'gi');
  re.lastIndex = openEnd + 1;
  let depth = 1;
  let match;
  while ((match = re.exec(src))) {
    const token = match[0];
    const isClosing = /^<\//.test(token);
    const isSelfClosing = /\/\s*>$/.test(token);
    if (isClosing) depth -= 1;
    else if (!isSelfClosing) depth += 1;
    if (depth === 0) return re.lastIndex;
  }
  return -1;
}

function findOpeningTagBefore(src, index, tagNames) {
  const tagPattern = tagNames.join('|');
  const re = new RegExp(`<(${tagPattern})\\b[^>]*>`, 'gi');
  let match;
  let best = null;
  while ((match = re.exec(src))) {
    if (match.index > index) break;
    const end = findMatchingClose(src, match.index, match[1]);
    if (end > index) {
      best = { start: match.index, end, tag: match[1], text: src.slice(match.index, end) };
    }
  }
  return best;
}

function removeBlockAt(src, block) {
  if (!block || block.start < 0 || block.end <= block.start) return { src, removed: false };
  const before = src.slice(0, block.start).replace(/[ \t]*$/u, '');
  const after = src.slice(block.end).replace(/^\s*\n?/u, '\n');
  return { src: before + after, removed: true };
}

function removeNearestBlockContainingText(src, text, preferredTags = ['section', 'article', 'button', 'aside', 'div']) {
  const index = src.indexOf(text);
  if (index === -1) return { src, removed: false };

  const block = findOpeningTagBefore(src, index, preferredTags);
  if (!block || !block.text.includes(text)) return { src, removed: false };
  return removeBlockAt(src, block);
}

function removeAllBlocksContainingText(src, text, preferredTags = ['section', 'article', 'button', 'aside', 'div']) {
  let changed = false;
  let safety = 0;
  while (src.includes(text) && safety < 20) {
    const result = removeNearestBlockContainingText(src, text, preferredTags);
    if (!result.removed) break;
    src = result.src;
    changed = true;
    safety += 1;
  }
  return { src, changed };
}

function removeBlockByClass(src, classText) {
  const index = src.indexOf(classText);
  if (index === -1) return { src, removed: false };

  const block = findOpeningTagBefore(src, index, ['section', 'article', 'aside', 'div']);
  if (!block || !block.text.includes(classText)) return { src, removed: false };
  return removeBlockAt(src, block);
}

function removeMetricCard(src, labelText, extraHints = []) {
  const gridIndex = src.indexOf('billing-metrics-grid');
  if (gridIndex === -1) return { src, removed: false, value: null };

  const gridBlock = findOpeningTagBefore(src, gridIndex, ['section', 'div']);
  if (!gridBlock) return { src, removed: false, value: null };

  const localIndex = gridBlock.text.indexOf(labelText);
  if (localIndex === -1) return { src, removed: false, value: null };
  const absoluteIndex = gridBlock.start + localIndex;

  let card = findOpeningTagBefore(src, absoluteIndex, ['article', 'div']);
  if (!card || card.start < gridBlock.start || card.end > gridBlock.end) return { src, removed: false, value: null };

  const mustRemove = extraHints.length === 0 || extraHints.some((hint) => card.text.includes(hint));
  if (!mustRemove) return { src, removed: false, value: null };

  let value = null;
  const afterLabel = card.text.slice(card.text.indexOf(labelText));
  const strongMatch = afterLabel.match(/<strong[^>]*>([\s\S]*?)<\/strong>/);
  if (strongMatch) {
    value = strongMatch[1].trim();
  }

  const result = removeBlockAt(src, card);
  return { src: result.src, removed: result.removed, value };
}

function getStatusCardBlock(src) {
  const index = src.indexOf('billing-status-card');
  if (index === -1) return null;
  return findOpeningTagBefore(src, index, ['section', 'article', 'div']);
}

function insertNextPaymentIntoStatusCard(src, nextPaymentValue) {
  const status = getStatusCardBlock(src);
  if (!status) return { src, inserted: false };
  if (status.text.includes('Następna płatność')) return { src, inserted: false };

  const value = nextPaymentValue && nextPaymentValue.length < 220
    ? nextPaymentValue
    : 'Brak zaplanowanej płatności';

  const meta = `\n        <div className="billing-status-meta">\n          <span>Następna płatność</span>\n          <strong>${value}</strong>\n        </div>`;

  const closeStart = src.lastIndexOf('</', status.end - 1);
  if (closeStart <= status.start) return { src, inserted: false };

  return {
    src: src.slice(0, closeStart) + meta + '\n      ' + src.slice(closeStart),
    inserted: true,
  };
}

function stripPlanActiveParagraphs(src) {
  let next = src;

  next = next.replace(/\n?\s*<p[^>]*>\s*Plan aktywny\.\s*<\/p>\s*/g, '\n');
  next = next.replace(/\n?\s*<span[^>]*>\s*Plan aktywny\.\s*<\/span>\s*/g, '\n');
  next = next.replace(/\n?\s*<small[^>]*>\s*Plan aktywny\.\s*<\/small>\s*/g, '\n');

  // If the old copy was embedded in a ternary or string expression, keep the status truthful but remove the exact repeated sentence.
  next = next.replace(/['"]Plan aktywny\.['"]/g, "'Plan jest aktywny'");
  next = next.replace(/Plan aktywny\./g, 'Plan jest aktywny');

  return next;
}

function removeEmptyRightRail(src) {
  const rightRailIndex = src.indexOf('billing-right-rail');
  if (rightRailIndex === -1) return src;
  const block = findOpeningTagBefore(src, rightRailIndex, ['aside', 'div']);
  if (!block) return src;

  const textWithoutTags = block.text
    .replace(/<[^>]+>/g, '')
    .replace(/[{}()&&|?:'"`.,;\s]/g, '')
    .trim();

  if (!textWithoutTags || textWithoutTags.length < 8) {
    return removeBlockAt(src, block).src;
  }
  return src;
}

function normalizeWhitespace(src) {
  return src
    .replace(/\n{4,}/g, '\n\n\n')
    .replace(/[ \t]+\n/g, '\n');
}

function updatePackageJson() {
  assertFile(packagePath);
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:billing-cleanup-2026-05-11'] = 'node scripts/check-closeflow-billing-cleanup-2026-05-11.cjs';
  fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n');
}

function writeReleaseDoc() {
  mkdirp(path.dirname(releaseDocPath));
  const body = `# CloseFlow Stage 10 — Billing cleanup — 2026-05-11\n\n## Cel\n\nZakładka \`/billing\` została ograniczona do statusu dostępu, abonamentu i najważniejszych akcji płatności. Usunięto z tego widoku elementy marketingowe planu oraz rozliczenia operacyjne lead/case.\n\n## Zakres\n\n- usunięto powtórzenie \`Plan aktywny.\`,\n- przeniesiono informację \`Następna płatność\` do górnego status card,\n- usunięto kafelek \`Plan\` z podsumowania rozliczeń,\n- usunięto sekcję \`Co masz w planie\`,\n- usunięto sekcję \`Co jest dostępne teraz\`,\n- usunięto tab \`Rozliczenia lead/case\` z \`/billing\`,\n- dodano guard \`check:billing-cleanup-2026-05-11\`.\n\n## Poza zakresem\n\n- nie usuwano API płatności,\n- nie usuwano rekordów płatności,\n- nie ruszano Stripe ani statusu dostępu,\n- nie przenoszono jeszcze mechaniki wpłat do \`/clients/:id\`, \`/case/:id\` ani \`/finance\`.\n\n## Weryfikacja\n\n\`\`\`bash\nnpm run check:billing-cleanup-2026-05-11\nnpm run build\n\`\`\`\n`;
  fs.writeFileSync(releaseDocPath, body);
}

function main() {
  assertFile(billingPath);
  assertFile(checkSourcePath);

  const backupRoot = path.join(root, '.closeflow-recovery-backups', `stage10-billing-cleanup-${new Date().toISOString().replace(/[:.]/g, '-')}`);
  backupFile(billingPath, backupRoot);
  backupFile(packagePath, backupRoot);
  backupFile(releaseDocPath, backupRoot);

  let billing = fs.readFileSync(billingPath, 'utf8');
  let changed = false;

  const before = billing;
  billing = stripPlanActiveParagraphs(billing);
  changed = changed || billing !== before;

  let nextPaymentValue = null;
  const nextPaymentRemoval = removeMetricCard(billing, 'Następna płatność');
  if (nextPaymentRemoval.removed) {
    billing = nextPaymentRemoval.src;
    nextPaymentValue = nextPaymentRemoval.value;
    changed = true;
  }

  const insertResult = insertNextPaymentIntoStatusCard(billing, nextPaymentValue);
  if (insertResult.inserted) {
    billing = insertResult.src;
    changed = true;
  }

  const planMetricRemoval = removeMetricCard(billing, 'Plan', ['Pro', 'Dostęp aktywny', 'aktywny']);
  if (planMetricRemoval.removed) {
    billing = planMetricRemoval.src;
    changed = true;
  }

  for (const className of ['billing-limits-card']) {
    let safety = 0;
    while (billing.includes(className) && safety < 10) {
      const result = removeBlockByClass(billing, className);
      if (!result.removed) break;
      billing = result.src;
      changed = true;
      safety += 1;
    }
  }

  for (const text of ['Co masz w planie', 'Co jest dostępne teraz', 'Rozliczenia lead/case']) {
    const result = removeAllBlocksContainingText(billing, text, text === 'Rozliczenia lead/case'
      ? ['button', 'section', 'article', 'div']
      : ['section', 'article', 'aside', 'div']);
    if (result.changed) {
      billing = result.src;
      changed = true;
    }
  }

  billing = removeEmptyRightRail(billing);
  billing = normalizeWhitespace(billing);

  fs.writeFileSync(billingPath, billing);
  updatePackageJson();
  writeReleaseDoc();

  const finalBilling = fs.readFileSync(billingPath, 'utf8');
  const forbidden = ['Plan aktywny.', 'Co masz w planie', 'Co jest dostępne teraz', 'Rozliczenia lead/case', 'billing-limits-card'];
  const stillForbidden = forbidden.filter((text) => finalBilling.includes(text));
  const missingRequired = ['Następna płatność', 'billing-status-card'].filter((text) => !finalBilling.includes(text));

  if (stillForbidden.length || missingRequired.length) {
    console.error('Stage 10 automated patch needs manual attention.');
    if (stillForbidden.length) console.error(`Forbidden leftovers: ${stillForbidden.join(', ')}`);
    if (missingRequired.length) console.error(`Missing required markers: ${missingRequired.join(', ')}`);
    console.error(`Backups saved in: ${path.relative(root, backupRoot)}`);
    process.exit(1);
  }

  console.log('✔ Stage 10 billing cleanup patch applied');
  console.log(`✔ Backups saved in ${path.relative(root, backupRoot)}`);
  console.log('✔ Added npm script check:billing-cleanup-2026-05-11');
  console.log('✔ Added release evidence doc');
}

try {
  main();
} catch (error) {
  console.error(`✘ ${error.message}`);
  process.exit(1);
}
