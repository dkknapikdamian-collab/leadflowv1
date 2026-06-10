const fs = require('node:fs');

const STAGE = 'STAGE231B0_CASE_CLOSE_ARCHIVE_FINANCE_TRUTH';

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

function fail(message) {
  console.error(`${STAGE} FAIL: ${message}`);
  process.exit(1);
}

function assertIncludes(source, needle, label) {
  if (!source.includes(needle)) fail(`missing ${label}: ${needle}`);
}