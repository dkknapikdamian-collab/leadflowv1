const fs = require('fs');
function read(file) { return fs.readFileSync(file, 'utf8'); }
function ch(...codes) { return String.fromCharCode(...codes); }
const badTokens = [ch(0x0102), ch(0x0139), ch(0x00c4), ch(0x00c5), ch(0x00c2), ch(0xfffd), ch(0x010f,0x017c,0x02dd), ch(0x00e2,0x20ac)];
const errors = [];
function fail(msg) { errors.push(msg); }
function assertNoMojibake(file, text) { for (const token of badTokens) if (text.includes(token)) fail('Mojibake detected in ' + file); }
const clients = read('src/pages/Clients.tsx');
const css = read('src/styles/closeflow-record-list-source-truth.css');
const layout = fs.existsSync('src/components/Layout.tsx') ? read('src/components/Layout.tsx') : '';
const pkg = read('package.json');
for (const [file, text] of [['src/pages/Clients.tsx', clients], ['src/styles/closeflow-record-list-source-truth.css', css], ['src/components/Layout.tsx', layout], ['package.json', pkg]]) assertNoMojibake(file, text);
for (const needle of ['data-stage231d0c-r4-live-layout="true"', 'clients-layout-r4', 'data-stage231d0c-r4-centered-filters="true"', 'clients-filters-r4-center']) if (!clients.includes(needle)) fail('Clients.tsx missing R4 marker: ' + needle);
for (const needle of ['STAGE231D0C-R4 EFFECTIVE VISUAL LAYOUT RESCUE START', 'grid-template-columns: minmax(0, 1080px) minmax(280px, 330px)', 'transform: translateX(-56px)', 'trial-banner-r4-top-card']) if (!css.includes(needle)) fail('CSS missing R4 effective visual rule: ' + needle);
if (layout.includes('Twój okres próbny') || layout.includes('Niektóre funkcje są zablokowane') || layout.includes('Aktywuj plan')) {
  if (!layout.includes('data-stage231d0c-r4-trial-top-card="true"') && !layout.includes('trial-banner-r4-top-card')) fail('Layout contains trial copy but lacks R4 top-card marker.');
}
if (clients.includes('Leady:')) fail('Client card must not reintroduce Leady:');
if (clients.includes('Aktywna sprawa')) fail('Client card must not reintroduce Aktywna sprawa');
if (!clients.includes('Zarobione łącznie')) fail('Client card contract missing Zarobione łącznie');
if (errors.length) { console.error('STAGE231D0C-R4 effective visual layout rescue guard: FAIL'); for (const e of errors) console.error('- ' + e); process.exit(1); }
console.log('STAGE231D0C-R4 effective visual layout rescue guard: PASS');

// STAGE231D0C-R5 invalid JSX closing tag marker check
{
  const layout = fs.readFileSync('src/components/Layout.tsx', 'utf8');
  if (/<\/p\s+className=/.test(layout)) {
    console.error('STAGE231D0C-R4 effective visual layout rescue guard: FAIL');
    console.error('- Invalid JSX: closing p tag contains className.');
    process.exit(1);
  }
}
