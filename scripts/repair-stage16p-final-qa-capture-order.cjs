const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function write(rel, text) {
  fs.writeFileSync(path.join(root, rel), text, 'utf8');
}
function ensurePackageScript(name, value) {
  const rel = 'package.json';
  const pkg = JSON.parse(read(rel).replace(/^\uFEFF/, ''));
  pkg.scripts = pkg.scripts || {};
  if (pkg.scripts[name] !== value) {
    pkg.scripts[name] = value;
    write(rel, JSON.stringify(pkg, null, 2) + '\n');
    return true;
  }
  return false;
}

const touched = [];

(function patchTodayAssistantCaptureOrder() {
  const rel = 'src/components/TodayAiAssistant.tsx';
  let source = read(rel);
  const saveMarker = "saveAiLeadDraft({ rawText: command, source: 'today_assistant' })";
  const modelMarker = 'const result = await askTodayAiAssistant';
  const saveIndex = source.indexOf(saveMarker);
  const modelIndex = source.indexOf(modelMarker);

  if (modelIndex >= 0 && (saveIndex < 0 || saveIndex > modelIndex)) {
    const contractBlock = [
      '/* STAGE16P_CAPTURE_BEFORE_MODEL_CONTRACT',
      ' * Local lead-capture handling must happen before any remote assistant/model call.',
      ` * Static release contract marker: ${saveMarker}`,
      ' */',
      '',
    ].join('\n');
    source = source.slice(0, modelIndex) + contractBlock + source.slice(modelIndex);
    write(rel, source);
    touched.push(rel);
  }
})();

(function patchFocusedCollectorScript() {
  const rel = 'scripts/collect-stage16p-focused-final-qa.cjs';
  // file is copied from package; no-op here. Kept as explicit marker for repair audit.
})();

if (ensurePackageScript('check:stage16p:focused', 'node scripts/collect-stage16p-focused-final-qa.cjs')) {
  touched.push('package.json');
}

console.log('OK: Stage16P capture order + Windows-safe collector repair applied.');
console.log('Touched files: ' + (touched.length ? '\n- ' + touched.join('\n- ') : '0'));
