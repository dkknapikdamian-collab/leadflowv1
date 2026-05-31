const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const settingsPath = path.join(root, 'src', 'pages', 'Settings.tsx');
const cssPath = path.join(root, 'src', 'styles', 'closeflow-settings-form-control-readability-stage179.css');

test('stage179 settings form controls are readable on visual skins', () => {
  const settings = fs.readFileSync(settingsPath, 'utf8');
  const css = fs.readFileSync(cssPath, 'utf8');

  assert.match(settings, /closeflow-settings-form-control-readability-stage179\.css/, 'Settings.tsx must import stage179 readability CSS');
  assert.match(settings, /data-google-calendar-reminder-ui="stage06"/, 'Google reminder card source marker must remain');

  assert.match(css, /STAGE179_SETTINGS_FORM_CONTROL_READABILITY_LOCAL_ONLY/, 'CSS marker missing');
  assert.match(css, /\.settings-vnext-page\s+\.settings-field\s+input,[\s\S]*?\.settings-vnext-page\s+\.settings-field\s+select,[\s\S]*?\.settings-vnext-page\s+\.settings-field\s+textarea/, 'CSS must target settings inputs/selects/textareas');
  assert.match(css, /background(?:-color)?:\s*#ffffff\s*!important/i, 'controls must force white background');
  assert.match(css, /color:\s*#0f172a\s*!important/i, 'controls must force dark readable text');
  assert.match(css, /-webkit-text-fill-color:\s*#0f172a\s*!important/i, 'webkit text fill must be fixed for Chromium/autofill/theme cases');
  assert.match(css, /select\s+option[\s\S]*?background(?:-color)?:\s*#ffffff\s*!important/i, 'select options must keep readable background');
  assert.match(css, /:disabled[\s\S]*?opacity:\s*1\s*!important/i, 'disabled controls must not become low contrast');
  assert.match(css, /:focus-visible[\s\S]*?border-color:\s*#2563eb\s*!important/i, 'focus state must remain visible');
});
