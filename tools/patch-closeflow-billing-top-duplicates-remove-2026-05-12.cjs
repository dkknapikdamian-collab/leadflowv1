const fs = require('fs');
const path = require('path');

const root = process.cwd();
const billingPath = path.join(root, 'src/pages/Billing.tsx');
const packagePath = path.join(root, 'package.json');
const checkPath = path.join(root, 'scripts/check-closeflow-billing-top-duplicates-removed.cjs');
const docPath = path.join(root, 'docs/release/CLOSEFLOW_BILLING_TOP_DUPLICATES_REMOVED_2026-05-12.md');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value, 'utf8');
}

if (!fs.existsSync(billingPath)) {
  throw new Error('Missing src/pages/Billing.tsx');
}

let billing = read(billingPath);
const originalBilling = billing;

// Marker on the active page root, so this is auditable without relying on visual screenshots.
billing = billing.replace(
  '<main className="billing-vnext-page" data-billing-stage={BILLING_VISUAL_REBUILD_STAGE16}>',
  '<main className="billing-vnext-page" data-billing-stage={BILLING_VISUAL_REBUILD_STAGE16} data-billing-top-duplicates-removed="true">',
);

// Remove the single-tab bar that created the orphan "Plan i dostęp" strip.
// The tab had no useful switching value in the current screen and duplicated the page context.
billing = billing.replace(
  /\n\s*<nav\s+className="billing-tabs"\s+aria-label="Zakładki rozliczeń">[\s\S]*?<\/nav>\s*\n/,
  '\n',
);

// Remove the duplicate mini plan summary card below the status card.
// Plan information already exists in the main status card and right rail, so this was visual duplication.
billing = billing.replace(
  /\n\s*<section\s+className="billing-metrics-grid"\s+aria-label="Podsumowanie rozliczeń">[\s\S]*?<\/section>\s*\n/,
  '\n',
);

// Clean up excessive blank lines left by staged history without reformatting the whole file.
billing = billing.replace(/\n{3,}/g, '\n\n');

if (billing === originalBilling) {
  if (!billing.includes('data-billing-top-duplicates-removed="true"')) {
    throw new Error('Billing patch did not change Billing.tsx. Check current markup manually.');
  }
} else {
  write(billingPath, billing);
}

const checkSource = `const fs = require('fs');
const path = require('path');

const root = process.cwd();
const billingPath = path.join(root, 'src/pages/Billing.tsx');
const billing = fs.readFileSync(billingPath, 'utf8');

const forbidden = [
  'className="billing-tabs"',
  'aria-label="Zakładki rozliczeń"',
  'billing-metrics-grid',
  'billing-metric-card',
  '<small>Plan</small>',
];

for (const marker of forbidden) {
  if (billing.includes(marker)) {
    throw new Error('Billing duplicate top UI still present: ' + marker);
  }
}

if (!billing.includes('data-billing-top-duplicates-removed="true"')) {
  throw new Error('Billing root missing data-billing-top-duplicates-removed marker.');
}

if (!billing.includes('billing-status-card')) {
  throw new Error('Billing status card was removed accidentally.');
}

if (!billing.includes('billing-plan-grid')) {
  throw new Error('Billing plan comparison grid was removed accidentally.');
}

console.log('OK closeflow-billing-top-duplicates-removed: removed single-tab bar and duplicate plan metric card only.');
`;
write(checkPath, checkSource);

const docSource = `# CLOSEFLOW_BILLING_TOP_DUPLICATES_REMOVED_2026-05-12

## Cel

Usunąć z ekranu rozliczeń dwa elementy wskazane na screenach:

1. samotny pasek/tab \`Plan i dostęp\`, który został po dawnym headerze,
2. duplikujący kafelek \`Plan / Pro / Dostęp aktywny\` pod główną kartą statusu.

## Decyzja

To nie jest już poprawka CSS. Te elementy są usuwane z JSX w \`src/pages/Billing.tsx\`, bo mają zniknąć z DOM, a nie tylko zostać przykryte stylem.

## Zakres

- \`src/pages/Billing.tsx\`
- \`scripts/check-closeflow-billing-top-duplicates-removed.cjs\`
- \`package.json\`

## Nie zmieniamy

- głównej karty statusu dostępu,
- prawego panelu statusu konta,
- kart planów Free/Basic/Pro/AI,
- Stripe/webhook/billing logic,
- telefonu.

## Kryterium zakończenia

Na desktopowym ekranie \`/billing\` nie ma już:

- paska \`Plan i dostęp\`,
- małego kafelka \`Plan / Pro / Dostęp aktywny\` pod statusem.
`;
write(docPath, docSource);

const pkg = JSON.parse(read(packagePath));
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:closeflow-billing-top-duplicates-removed'] = 'node scripts/check-closeflow-billing-top-duplicates-removed.cjs';
write(packagePath, JSON.stringify(pkg, null, 2) + '\n');

console.log('OK patch-closeflow-billing-top-duplicates-remove: Billing duplicate top UI removed.');
