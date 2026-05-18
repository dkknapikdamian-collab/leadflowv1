const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const leadPath = path.join(root, 'src', 'pages', 'LeadDetail.tsx');
const cssPath = path.join(root, 'src', 'styles', 'visual-stage14-lead-detail-vnext.css');
const quietPath = path.join(root, 'scripts', 'closeflow-release-check-quiet.cjs');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, text) {
  fs.writeFileSync(file, text, 'utf8');
}

function replaceBetweenMarkers(source, startMarker, endMarker, replacement) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker);
  if (start === -1 || end === -1 || end < start) return source + '\n\n' + replacement + '\n';
  return source.slice(0, start) + replacement + source.slice(end + endMarker.length);
}

let lead = read(leadPath);
if (!lead.includes('data-stage117-lead-detail-vertical-rhythm="true"')) {
  const needle = '<section className="lead-detail-main-column">';
  const replacement = '<section className="lead-detail-main-column" data-stage117-lead-detail-vertical-rhythm="true">';
  if (!lead.includes(needle)) {
    throw new Error('Stage117 cannot find LeadDetail main column marker.');
  }
  lead = lead.replace(needle, replacement);
}
write(leadPath, lead);

const startMarker = '/* STAGE117_LEAD_DETAIL_VERTICAL_RHYTHM_START */';
const endMarker = '/* STAGE117_LEAD_DETAIL_VERTICAL_RHYTHM_END */';
const cssPatch = `${startMarker}
/* Tightens vertical rhythm in LeadDetail without changing cards, data flow or selected business sections. */
#root .lead-detail-vnext-page .lead-detail-main-column[data-stage117-lead-detail-vertical-rhythm="true"] {
  gap: 12px !important;
  align-content: start !important;
}

#root .lead-detail-vnext-page .lead-detail-main-column[data-stage117-lead-detail-vertical-rhythm="true"] > .lead-detail-section-card,
#root .lead-detail-vnext-page .lead-detail-main-column[data-stage117-lead-detail-vertical-rhythm="true"] > .lead-detail-top-grid {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

#root .lead-detail-vnext-page .lead-detail-section-card {
  padding: 16px !important;
}

#root .lead-detail-vnext-page .lead-detail-section-head {
  margin-bottom: 10px !important;
}

#root .lead-detail-vnext-page .lead-detail-top-grid {
  gap: 10px !important;
}

#root .lead-detail-vnext-page .lead-detail-work-list,
#root .lead-detail-vnext-page .lead-detail-history-list,
#root .lead-detail-vnext-page .lead-detail-notes-stack {
  gap: 8px !important;
}

#root .lead-detail-vnext-page .lead-detail-light-empty {
  padding: 12px 14px !important;
}

#root .lead-detail-vnext-page .lead-detail-note-form {
  margin-bottom: 10px !important;
}
${endMarker}`;
let css = read(cssPath);
css = replaceBetweenMarkers(css, startMarker, endMarker, cssPatch);
write(cssPath, css);

if (fs.existsSync(quietPath)) {
  let quiet = read(quietPath);
  const testEntry = "  'tests/stage117-lead-detail-vertical-rhythm-contract.test.cjs',";
  if (!quiet.includes(testEntry.trim().slice(1, -2))) {
    const anchor = "  'tests/stage116-dialog-description-accessibility-contract.test.cjs',";
    if (quiet.includes(anchor)) {
      quiet = quiet.replace(anchor, anchor + '\n' + testEntry);
    } else if (quiet.includes('\n];')) {
      quiet = quiet.replace('\n];', '\n' + testEntry + '\n];');
    } else {
      throw new Error('Stage117 cannot insert quiet release gate test.');
    }
    write(quietPath, quiet);
  }
}

console.log('Stage117 LeadDetail vertical rhythm patch applied.');
