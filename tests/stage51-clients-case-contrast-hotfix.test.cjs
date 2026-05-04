const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const marker = 'STAGE51_CLIENTS_CASE_CONTRAST_HOTFIX';

test('STAGE51_CLIENTS_CASE_CONTRAST_HOTFIX', () => {
  const files = [
    'src/pages/ClientDetail.tsx',
    'src/styles/visual-stage12-client-detail-vnext.css',
    'src/styles/visual-stage05-clients.css',
    'src/styles/visual-stage08-case-detail.css',
  ];
  for (const file of files) {
    const value = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
    assert.ok(value.includes(marker), file + ' should include marker');
  }
});
