const fs = require('fs');
const path = require('path');

const source = fs.readFileSync(path.join(process.cwd(), 'src', 'pages', 'CaseDetail.tsx'), 'utf8');

function assert(condition, message) {
  if (!condition) {
    console.error('STAGE231H_R1G4 FAIL: ' + message);
    process.exit(1);
  }
}

assert(source.includes("const CASE_COST_OTHER_NOTE_PREFIX_STAGE231H_R1G = 'Nazwa kosztu:'"), 'R1G helper prefix missing');
assert(source.includes("replace(/\\r\\n/g, '\\n').trim()"), 'R1G helper does not keep escaped CRLF replacement');
assert(source.includes("withoutPrefix.split('\\n')"), 'R1G helper split newline escape missing');
assert(source.includes("rest.join('\\n').trim()"), 'R1G helper join newline escape missing');
assert(source.includes("cleanNote ? '\\n' + cleanNote : ''"), 'R1G helper stored-note newline escape missing');
assert(!/replace\(\/\s*\r?\n\s*\/g/.test(source), 'broken multiline regex literal still present');

console.log('STAGE231H_R1G4 PASS: R1G newline syntax repair is guarded.');
