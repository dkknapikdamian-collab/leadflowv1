const fs = require('fs');
function fail(message) { console.error('STAGE231B0_R14_CLIENT_DETAIL_FULL_WIDTH_LAYOUT_LOCK FAIL: ' + message); process.exit(1); }
const client = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');
const css = fs.readFileSync('src/styles/visual-stage12-client-detail-vnext.css', 'utf8');
for (const token of ['STAGE231B0_R14_CLIENT_DETAIL_FULL_WIDTH_LAYOUT_LOCK','data-stage231b0-r14-client-detail-full-width-lock="true"','cf-client-detail-full-width-stage231b0-r14']) {
  if (!client.includes(token)) fail('ClientDetail missing token: ' + token);
}
for (const token of ['STAGE231B0_R14_CLIENT_DETAIL_FULL_WIDTH_LAYOUT_LOCK','body:has([data-stage231b0-r14-client-detail-full-width-lock="true"])','.cf-client-detail-full-width-stage231b0-r14','width: 100% !important;','max-width: none !important;','margin-left: 0 !important;','margin-right: 0 !important;','align-self: stretch !important;','justify-self: stretch !important;','box-sizing: border-box !important;']) {
  if (!css.includes(token)) fail('CSS missing token: ' + token);
}
const markerCount = (client.match(/data-stage231b0-r14-client-detail-full-width-lock="true"/g) || []).length;
if (markerCount !== 1) fail('ClientDetail marker count=' + markerCount);
console.log('STAGE231B0_R14_CLIENT_DETAIL_FULL_WIDTH_LAYOUT_LOCK PASS');
