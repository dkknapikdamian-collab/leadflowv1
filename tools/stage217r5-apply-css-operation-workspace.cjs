const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const cssPath = path.join(repo, 'src', 'styles', 'closeflow-case-detail-stage217-operation-workspace.css');
if (!fs.existsSync(cssPath)) {
  throw new Error(`Missing CSS file: ${cssPath}`);
}

let css = fs.readFileSync(cssPath, 'utf8').replace(/^\uFEFF/, '');
const append = `

/* STAGE217_R5_CASE_DETAIL_OPERATION_WORKSPACE_CSS_ALIAS
   Repair: guard expects the operation workspace class used by CaseDetail.tsx. */
.stage217-case-operation-workspace {
  overflow: hidden;
}

.stage217-case-operation-head {
  align-items: flex-start;
  gap: 16px;
}

.stage217-case-operation-workspace .stage217-case-service-grid {
  margin-top: 16px;
}
`;

if (!css.includes('stage217-case-operation-workspace')) {
  css = css.trimEnd() + append;
  fs.writeFileSync(cssPath, css + '\n', 'utf8');
  console.log('OK Stage217 R5 CSS operation workspace alias appended');
} else {
  console.log('OK Stage217 R5 CSS operation workspace alias already present');
}
