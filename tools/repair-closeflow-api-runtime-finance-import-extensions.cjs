#!/usr/bin/env node
const fs = require('fs');

const replacements = [
  {
    file: 'src/lib/finance/finance-normalize.ts',
    from: "from './finance-types';",
    to: "from './finance-types.js';",
  },
  {
    file: 'src/lib/finance/finance-normalize.ts',
    from: "from './finance-calculations';",
    to: "from './finance-calculations.js';",
  },
  {
    file: 'src/lib/finance/finance-calculations.ts',
    from: "from './finance-types';",
    to: "from './finance-types.js';",
  },
];

for (const item of replacements) {
  if (!fs.existsSync(item.file)) throw new Error(`Missing file: ${item.file}`);
  let text = fs.readFileSync(item.file, 'utf8').replace(/^\uFEFF/, '');
  if (text.includes(item.from)) {
    text = text.split(item.from).join(item.to);
    fs.writeFileSync(item.file, text, 'utf8');
    console.log(`patched: ${item.file} :: ${item.from} -> ${item.to}`);
  } else if (text.includes(item.to)) {
    console.log(`already patched: ${item.file} :: ${item.to}`);
  } else {
    throw new Error(`${item.file}: neither source nor target import found for ${item.from}`);
  }
}

console.log('CLOSEFLOW_API_RUNTIME_FINANCE_IMPORT_EXTENSIONS_PATCH_OK');
