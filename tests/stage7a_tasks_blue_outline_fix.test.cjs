const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = process.cwd();
const tasksPath = path.join(root, 'src/pages/Tasks.tsx');
const indexPath = path.join(root, 'src/index.css');
const cssPath = path.join(root, 'src/styles/stage7a-tasks-blue-outline-fix.css');

const tasks = fs.readFileSync(tasksPath, 'utf8');
const indexCss = fs.readFileSync(indexPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

const { markerChars: mojibake } = require('../scripts/mojibake-markers.cjs');

test('Tasks ma kafelki statystyk i aktywacja widoku dalej działa', () => {
  assert.ok(tasks.includes('StatShortcutCard'), 'Tasks nie używa kafelków StatShortcutCard');
  assert.ok(tasks.includes('const statCards = ['), 'brak listy statCards');
  for (const label of ['Aktywne', 'Dziś', 'Ten tydzień', 'Zaległe', 'Zrobione']) {
    assert.ok(tasks.includes(label), `brak kafelka: ${label}`);
  }
  assert.ok(tasks.includes('const activateScope = (scope: TaskScope) =>'), 'brak handlera activateScope');
  assert.ok(tasks.includes('setTaskScope(scope)'), 'activateScope nie zmienia taskScope');
  assert.ok(/onClick=\{[\s\S]{0,800}activateScope[\s\S]{0,800}\}/.test(tasks) || tasks.includes('activateScope(card.id)'), 'kafelki nie mają podpiętej aktywacji widoku');
});

test('Tasks ma podpięty scoped CSS hotfix Stage 7A po stylu Stage 30', () => {
  const stage30 = "@import './styles/visual-stage30-tasks-compact-after-calendar.css';";
  const stage7a = "@import './styles/stage7a-tasks-blue-outline-fix.css';";
  assert.ok(indexCss.includes(stage30), 'brak importu Stage 30');
  assert.ok(indexCss.includes(stage7a), 'brak importu Stage 7A');
  assert.ok(indexCss.indexOf(stage7a) > indexCss.indexOf(stage30), 'Stage 7A musi być po Stage 30, żeby przykrywał wcześniejsze style');
});

test('Aktywny kafelek Tasks ma neutralny styl bez kolorowej ramki i poświaty', () => {
  assert.match(css, /\.cf-html-view\.main-tasks-html \.grid-5 > a/);
  assert.match(css, /\.cf-html-view\.main-tasks-html \.grid-5 > button/);
  assert.match(css, /outline:\s*none\s*!important/);
  assert.match(css, /border:\s*1px solid #e4e7ec\s*!important/);
  assert.match(css, /border-color:\s*#e4e7ec\s*!important/);
  assert.match(css, /box-shadow:\s*0 8px 22px rgba\(16,\s*24,\s*40,\s*\.05\)\s*!important/);
  assert.doesNotMatch(css, /ring-primary|#2563eb|rgba\(37,\s*99,\s*235/i);
});

test('Stage 7A nie wprowadza mojibake', () => {
  for (const bad of mojibake) {
    assert.ok(!tasks.includes(bad), `Tasks.tsx zawiera podejrzany znak: ${bad}`);
    assert.ok(!indexCss.includes(bad), `index.css zawiera podejrzany znak: ${bad}`);
    assert.ok(!css.includes(bad), `CSS zawiera podejrzany znak: ${bad}`);
  }
});
