#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repo = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}

function write(rel, text) {
  fs.writeFileSync(path.join(repo, rel), text, 'utf8');
}

const indexPath = 'src/components/ui-system/index.ts';
let index = read(indexPath);

if (!index.includes("export * from './ActionIcon';")) {
  index += "export * from './ActionIcon';\n";
}
if (!index.includes("export * from './action-icon-registry';")) {
  index += "export * from './action-icon-registry';\n";
}
write(indexPath, index);

const pkgPath = 'package.json';
const pkg = JSON.parse(read(pkgPath));
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:closeflow-action-icon-registry'] = 'node scripts/check-closeflow-action-icon-registry.cjs';
write(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

console.log('CLOSEFLOW_VS2C_MINI_ACTION_ICON_REGISTRY_PACKAGE_PATCH_OK');
