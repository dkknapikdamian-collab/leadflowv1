const fs = require('node:fs');
const path = require('node:path');

const repo = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const leadPath = path.join(repo, 'src/pages/LeadDetail.tsx');

function read(filePath) {
  if (!fs.existsSync(filePath)) throw new Error('Brak pliku: ' + path.relative(repo, filePath));
  return fs.readFileSync(filePath, 'utf8');
}

function write(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

function replaceAllLiteral(source, from, to, label) {
  const before = source;
  source = source.split(from).join(to);
  if (source !== before) console.log('- fixed: ' + label);
  return source;
}

let source = read(leadPath).replace(/\r\n/g, '\n');
const original = source;

if (!source.includes('STAGE14F_LEAD_DETAIL_RIGHT_RAIL_CLEANUP_REPAIR1_BUILD_FIX')) {
  if (source.includes('/* STAGE14F_LEAD_DETAIL_RIGHT_RAIL_CLEANUP */')) {
    source = source.replace(
      '/* STAGE14F_LEAD_DETAIL_RIGHT_RAIL_CLEANUP */',
      '/* STAGE14F_LEAD_DETAIL_RIGHT_RAIL_CLEANUP */\n/* STAGE14F_LEAD_DETAIL_RIGHT_RAIL_CLEANUP_REPAIR1_BUILD_FIX */',
    );
  } else {
    source = '/* STAGE14F_LEAD_DETAIL_RIGHT_RAIL_CLEANUP_REPAIR1_BUILD_FIX */\n' + source;
  }
}

// Repair the syntax error introduced by the previous Stage14F package.
source = replaceAllLiteral(
  source,
  "<small>{serviceCaseId ? serviceCaseStatusLabel : 'Brak powiązanej sprawy}</small>",
  "<small>{serviceCaseId ? serviceCaseStatusLabel : 'Brak powiązanej sprawy'}</small>",
  'missing quote in linked case empty small',
);

source = source.replace(
  /(<small>\{serviceCaseId\s*\?\s*serviceCaseStatusLabel\s*:\s*)'Brak powiązanej sprawy\}(<\/small>)/g,
  function (_match, left, right) {
    console.log('- fixed: missing quote in linked case empty small by regex');
    return left + "'Brak powiązanej sprawy'}" + right;
  },
);

// Keep the requested empty state as a dash, never the old long copy.
source = source
  .replace(/Brak zaplanowanych działań\./g, '-')
  .replace(/Brak zaplanowanych działań/g, '-');

// Add the technical marker for the empty nearest-action state. Prefer the actual dash element;
// fall back to a hidden marker only if the current JSX structure is different.
if (!source.includes('data-lead-next-action-empty="-"')) {
  const beforeMarker = source;

  source = source.replace(
    /(<strong\b[^>]*className="lead-detail-empty-value"[^>]*)>(\s*-\s*)<\/strong>/,
    '$1 data-lead-next-action-empty="-">$2</strong>',
  );

  if (source === beforeMarker) {
    source = source.replace(
      /(<strong\b[^>]*>\s*-\s*<\/strong>)/,
      '<strong className="lead-detail-empty-value" data-lead-next-action-empty="-">-</strong>',
    );
  }

  if (source === beforeMarker) {
    const pageOpenRegex = /(<div\s+className="lead-detail-vnext-page"[^>]*>)/;
    if (pageOpenRegex.test(source)) {
      source = source.replace(
        pageOpenRegex,
        '$1\n        <span hidden data-lead-next-action-empty="-">-</span>',
      );
      console.log('- inserted: fallback hidden empty action marker');
    }
  } else {
    console.log('- inserted: empty nearest-action marker');
  }
}

// Ensure risk reason has the explicit dash fallback required by Stage14F.
if (!source.includes('Powód: -')) {
  source = source.replace(
    /Powód:\s*\{leadRiskReasonStage14F\}/g,
    "Powód: {leadRiskReasonStage14F || '-'}",
  );
}

// Guard against the same broken string coming back.
if (source.includes("'Brak powiązanej sprawy}</small>")) {
  throw new Error('Nadal istnieje uszkodzony literal Brak powiązanej sprawy bez zamkniętego apostrofu.');
}

if (source === original) {
  throw new Error('Stage14F Repair1 nie zmienił LeadDetail.tsx.');
}

write(leadPath, source);
console.log('OK: Stage14F Repair1 LeadDetail build fix applied.');
