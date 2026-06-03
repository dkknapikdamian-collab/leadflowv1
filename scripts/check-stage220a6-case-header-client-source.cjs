const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const casePath = path.join(repo, 'src/pages/CaseDetail.tsx');
const cssPath = path.join(repo, 'src/styles/closeflow-detail-view-source-truth-stage219.css');

const caseText = fs.readFileSync(casePath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const errors = [];

function must(condition, message) {
  if (!condition) errors.push(message);
}

must(caseText.includes("import '../styles/visual-stage12-client-detail-vnext.css';"), 'CaseDetail does not import ClientDetail visual source CSS');
must(caseText.includes('case-detail-header client-detail-header'), 'CaseDetail header does not reuse client-detail-header class');
must(caseText.includes('case-detail-header-copy client-detail-header-copy'), 'CaseDetail copy does not reuse client-detail-header-copy class');
must(caseText.includes('case-detail-back-button client-detail-back-button'), 'CaseDetail back button does not reuse client-detail-back-button class');
must(caseText.includes('case-detail-kicker client-detail-kicker'), 'CaseDetail does not render client-like kicker');
must(caseText.includes('KARTOTEKA SPRAWY'), 'CaseDetail missing adapted case kicker text');
must(caseText.includes('data-stage220a6-client-header-source="true"'), 'CaseDetail missing Stage220A6 header marker');

must(css.includes('STAGE220A6_CASE_HEADER_CLIENT_DETAIL_SOURCE'), 'CSS missing Stage220A6 marker');
must(css.includes('max-width: 1480px'), 'CSS missing ClientDetail max width');
must(css.includes('margin: 0 auto 22px'), 'CSS missing ClientDetail header margin');
must(css.includes('grid-template-areas'), 'CSS missing client-like grid areas');
must(css.includes('"back kicker"'), 'CSS missing back/kicker row');
must(css.includes('"back title"'), 'CSS missing back/title row');
must(css.includes('content: none'), 'CSS does not disable old pseudo kicker');
must(css.includes('margin: 0 9px'), 'CSS missing stable separator spacing');
must(css.includes('text-align: left'), 'CSS missing left alignment');
must(css.includes('text-overflow: ellipsis'), 'CSS missing ellipsis protection');
must(css.includes('white-space: nowrap'), 'CSS missing nowrap protection');

if (errors.length) {
  console.error('Stage220A6 guard failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('OK Stage220A6 case header uses ClientDetail header source');
