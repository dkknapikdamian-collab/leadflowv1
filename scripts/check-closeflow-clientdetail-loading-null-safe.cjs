const fs = require('fs');
const path = require('path');
const root = process.cwd();
const file = path.join(root, 'src/pages/ClientDetail.tsx');
const source = fs.readFileSync(file, 'utf8');
const loadingStart = source.indexOf('if (loading || workspaceLoading) {');
if (loadingStart < 0) throw new Error('Missing ClientDetail loading branch.');
const loadingEnd = source.indexOf('if (!client) {', loadingStart);
if (loadingEnd < 0) throw new Error('Missing ClientDetail not-found branch after loading branch.');
const branch = source.slice(loadingStart, loadingEnd);
const forbidden = ['ClientFinanceRelationSummary', 'data-fin7-client-detail-finance-summary'];
for (const token of forbidden) {
  if (branch.includes(token)) {
    throw new Error('ClientDetail loading branch still renders nullable finance summary token: ' + token);
  }
}
if (!branch.includes('client-detail-loading-card')) {
  throw new Error('ClientDetail loading card marker missing.');
}
console.log('OK closeflow-clientdetail-loading-null-safe: loading branch does not render nullable finance summary.');
