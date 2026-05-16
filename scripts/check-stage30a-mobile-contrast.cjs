const fs = require('fs');
const path = require('path');

const root = process.cwd();

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    console.error(`[stage30a-mobile-contrast] ${message}`);
    process.exit(1);
  }
}

const indexCss = read('src/index.css');
const contrastCssPath = 'src/styles/stage30a-mobile-contrast-lock.css';

assert(
  indexCss.includes("@import './styles/stage30a-mobile-contrast-lock.css';"),
  'src/index.css musi importowa\u0107 stage30a-mobile-contrast-lock.css jako ostatni\u0105 warstw\u0119 kontrastu.',
);

assert(
  fs.existsSync(path.join(root, contrastCssPath)),
  'Brakuje src/styles/stage30a-mobile-contrast-lock.css.',
);

const css = read(contrastCssPath);

const requiredMarkers = [
  'STAGE30A_MOBILE_CONTRAST_LOCK',
  '[data-global-quick-actions="true"] button',
  '.mobile-drawer-panel',
  '.mobile-nav-btn.active',
  '.main-today .metric strong',
  '[data-radix-popper-content-wrapper] [role="menu"]',
  '@media (max-width: 760px)',
  '-webkit-text-fill-color',
];

for (const marker of requiredMarkers) {
  assert(css.includes(marker), `Brakuje wymaganego selektora/markera: ${marker}`);
}

assert(
  /background:\s*#ffffff\s*!important/.test(css) || /background-color:\s*#ffffff\s*!important/.test(css),
  'CSS musi wymusza\u0107 jasne t\u0142o dla mobilnych paneli i menu.',
);

assert(
  /color:\s*var\(--cf30a-text\)\s*!important/.test(css),
  'CSS musi wymusza\u0107 ciemny tekst dla jasnych paneli.',
);

assert(
  /color:\s*var\(--cf30a-blue-strong\)\s*!important/.test(css),
  'CSS musi wymusza\u0107 niebieski tekst dla globalnych akcji.',
);

console.log('stage30a-mobile-contrast: PASS');
