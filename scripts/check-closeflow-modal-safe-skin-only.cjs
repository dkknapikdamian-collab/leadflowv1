#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const cssPath = path.join(process.cwd(), 'src', 'styles', 'closeflow-modal-visual-system.css');
const css = fs.readFileSync(cssPath, 'utf8');
const required = [
  'CLOSEFLOW_MODAL_SAFE_SKIN_ONLY_ROLLBACK_POSITION_V4',
  '[data-closeflow-modal-visual-system="true"].lead-form-vnext-content',
  '[data-closeflow-modal-visual-system="true"].client-case-form-content',
  '.lead-form-planning-note',
  '.client-case-form-disabled-note'
];
for (const needle of required) {
  if (!css.includes(needle)) throw new Error(`Missing modal safe skin selector: ${needle}`);
}
const forbidden = [
  'translate(calc',
  'top: calc',
  'left: calc'
];
for (const needle of forbidden) {
  if (css.includes(needle)) throw new Error(`Forbidden layout/position override in skin-only CSS: ${needle}`);
}
console.log('✔ closeflow modal safe skin-only CSS keeps position and covers lead/client/case form local skins');
