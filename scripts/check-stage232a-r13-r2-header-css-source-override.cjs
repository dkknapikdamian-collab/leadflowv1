const fs = require('fs');
const assert = require('assert');

const css = fs.readFileSync('src/styles/stage232a-missing-item-visual-source.css', 'utf8');

function must(source, token, label) {
  assert.ok(source.includes(token), label + ' missing: ' + token);
}

must(css, 'STAGE232A_R13_R2_HEADER_CSS_SOURCE_OVERRIDE', 'R13-R2 CSS marker');
must(css, 'Brak modal top-left must match Nowy lead / Nowy klient header', 'screenshot decision');
must(css, '.lead-form-vnext-header > span', 'generic span hide');
must(css, '.lead-form-vnext-header > p', 'generic p hide');
must(css, 'display: none !important;', 'hide display');
must(css, 'visibility: hidden !important;', 'hide visibility');
must(css, 'height: 0 !important;', 'hide height');
must(css, 'font-size: 14px !important;', 'single-title font size');
must(css, 'font-weight: 900 !important;', 'single-title font weight');
must(css, 'background: #0b1220 !important;', 'dark header shell retained');

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE232A_R13_R2_HEADER_CSS_SOURCE_OVERRIDE',
  guard: 'check-stage232a-r13-r2-header-css-source-override'
}, null, 2));
