const fs = require('fs');

const rel = 'src/lib/finance/finance-payment-labels.ts';
if (!fs.existsSync(rel)) {
  throw new Error(`${rel}: missing`);
}

let text = fs.readFileSync(rel, 'utf8').replace(/^\uFEFF/, '');
const before = text;

const replacements = [
  ["planned: 'planowana'", "planned: 'Planowana'"],
  ["due: 'należna'", "due: 'Należna'"],
  ["paid: 'zapłacona'", "paid: 'Zapłacona'"],
  ["cancelled: 'anulowana'", "cancelled: 'Anulowana'"],
  ['planned: "planowana"', 'planned: "Planowana"'],
  ['due: "należna"', 'due: "Należna"'],
  ['paid: "zapłacona"', 'paid: "Zapłacona"'],
  ['cancelled: "anulowana"', 'cancelled: "Anulowana"'],
];

for (const [from, to] of replacements) {
  text = text.split(from).join(to);
}

const required = [
  "planned: 'Planowana'",
  "due: 'Należna'",
  "paid: 'Zapłacona'",
  "cancelled: 'Anulowana'",
];
for (const needle of required) {
  if (!text.includes(needle)) {
    throw new Error(`${rel}: missing required status label ${needle}`);
  }
}

const forbidden = ['planowana', 'należna', 'zapłacona', 'anulowana'];
for (const needle of forbidden) {
  if (text.includes(`'${needle}'`) || text.includes(`"${needle}"`)) {
    throw new Error(`${rel}: lowercase status label remains ${needle}`);
  }
}

if (text !== before) {
  fs.writeFileSync(rel, text);
  console.log(`patched: ${rel}`);
} else {
  console.log(`already ok: ${rel}`);
}
console.log('CLOSEFLOW_FIN10_PAYMENT_STATUS_LABEL_REPAIR_OK');
