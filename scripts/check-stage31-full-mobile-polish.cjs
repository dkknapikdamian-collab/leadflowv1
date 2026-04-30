#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function read(relativePath) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required file: ${relativePath}`);
  }
  return fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
}

function expect(file, body, text, label = text) {
  if (!body.includes(text)) {
    throw new Error(`${file}: missing ${label}`);
  }
  console.log(`OK: ${file} contains ${label}`);
}

function reject(file, body, regex, label) {
  if (regex.test(body)) {
    throw new Error(`${file}: forbidden ${label}`);
  }
  console.log(`OK: ${file} does not contain ${label}`);
}

const indexPath = 'src/index.css';
const cssPath = 'src/styles/stage31-full-mobile-polish.css';
const index = read(indexPath);
const css = read(cssPath);

expect(indexPath, index, "@import './styles/stage31-full-mobile-polish.css';", 'Stage31 mobile polish import');
expect(cssPath, css, 'STAGE31_FULL_MOBILE_POLISH', 'Stage31 marker');
expect(cssPath, css, '@media (max-width: 900px)', '900px mobile QA scope');
expect(cssPath, css, '@media (max-width: 768px)', '768px mobile QA scope');
expect(cssPath, css, '@media (max-width: 430px)', '430px mobile QA scope');
expect(cssPath, css, '@media (max-width: 390px)', '390px mobile QA scope');
expect(cssPath, css, '.main-today', 'Today route scope');
expect(cssPath, css, '.main-leads', 'Leads route scope');
expect(cssPath, css, '.main-lead-detail', 'LeadDetail route scope');
expect(cssPath, css, '.main-clients', 'Clients route scope');
expect(cssPath, css, '.main-client-detail', 'ClientDetail route scope');
expect(cssPath, css, '.main-cases', 'Cases route scope');
expect(cssPath, css, '.main-case-detail', 'CaseDetail route scope');
expect(cssPath, css, '.settings-vnext-page', 'Settings route scope');
expect(cssPath, css, '.notifications-vnext-page', 'Notifications route scope');
expect(cssPath, css, '.activity-vnext-page', 'Activity route scope');
expect(cssPath, css, '.ai-drafts-page', 'AI Drafts route scope');
expect(cssPath, css, '.billing-page', 'Billing route scope');
expect(cssPath, css, '.support-page', 'Support route scope');
expect(cssPath, css, '.calendar-vnext-page', 'Calendar route scope');
expect(cssPath, css, '[data-visual-right-rail]', 'right rail selector');
expect(cssPath, css, 'background: #ffffff !important;', 'light right rail / wrapper background');
expect(cssPath, css, 'grid-template-columns: 1fr !important;', 'mobile single-column grids');
expect(cssPath, css, 'max-height: calc(100dvh - 24px) !important;', 'dialog max height guard');
expect(cssPath, css, 'overflow-y: auto !important;', 'dialog internal scroll guard');
expect(cssPath, css, '[role="tablist"]', 'tabs mobile horizontal scroll selector');
expect(cssPath, css, '.calendar-day-selected', 'calendar selected day readability');
expect(cssPath, css, '.mobile-drawer-panel', 'mobile drawer width guard');
expect(cssPath, css, '.global-actions', 'global action mobile guard');

reject(cssPath, css, /\.closeflow-visual-stage01\s+\.main[^{]*\{[^}]*overflow-x:\s*(auto|scroll)/s, 'main layout forced horizontal scroll');
reject(cssPath, css, /\.main-(today|leads|lead-detail|clients|client-detail|cases|case-detail)[^{]*\{[^}]*overflow-x:\s*(auto|scroll)/s, 'route layout forced horizontal scroll');
reject(cssPath, css, /\.settings-vnext-page[^{]*\{[^}]*overflow-x:\s*(auto|scroll)/s, 'settings forced horizontal scroll');
reject(cssPath, css, /\.notifications-vnext-page[^{]*\{[^}]*overflow-x:\s*(auto|scroll)/s, 'notifications forced horizontal scroll');
reject(cssPath, css, /\.calendar-vnext-page[^{]*\{[^}]*overflow-x:\s*(auto|scroll)/s, 'calendar page forced horizontal scroll');
reject(cssPath, css, /right-rail[^{]*\{[^}]*background:\s*(#0|#1|rgb\(0|rgb\(15|rgb\(16|rgb\(17)/is, 'dark right rail wrapper background');
reject(cssPath, css, /data-visual-right-rail[^{]*\{[^}]*background:\s*(#0|#1|rgb\(0|rgb\(15|rgb\(16|rgb\(17)/is, 'dark visual right rail background');

console.log('stage31-full-mobile-polish: PASS');
