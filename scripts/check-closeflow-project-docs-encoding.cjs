const fs = require('node:fs');

const files = [
  '_project/04_ETAPY_ROZWOJU_APLIKACJI.md',
  '_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md',
  '_project/06_GUARDS_AND_TESTS.md',
  '_project/08_CHANGELOG_AI.md',
  '_project/10_PROJECT_TIMELINE.md',
  '_project/13_TEST_HISTORY.md',
];

const forbidden = /Ä‚|Ă„|Ă˘|Äą|Ä…|Ä‡|Ä™|Äł|Ä›|Ĺ|Ăł|Ăź|Ă|Â|â€|â‚¬|â„¢|Ë|�/;
let ok = true;

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  text.split(/\r?\n/).forEach((line, index) => {
    if (forbidden.test(line)) {
      console.error(`CLOSEFLOW_PROJECT_DOCS_ENCODING_FAIL: ${file}:${index + 1}: ${line.slice(0, 220)}`);
      ok = false;
    }
  });
}

if (!ok) process.exit(1);
console.log('CLOSEFLOW_PROJECT_DOCS_ENCODING_PASS: central _project files have no guarded mojibake tokens.');
