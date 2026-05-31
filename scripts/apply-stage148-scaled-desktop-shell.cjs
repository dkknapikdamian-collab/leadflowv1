/* CLOSEFLOW_STAGE148_SCALED_DESKTOP_SHELL_PATCHER */
const fs = require('fs');
const path = require('path');

const repo = process.argv[2];
if (!repo) throw new Error('Usage: node apply-stage148-scaled-desktop-shell.cjs <repo>');

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}
function write(rel, content) {
  fs.writeFileSync(path.join(repo, rel), content, 'utf8');
}

{
  const rel = 'src/App.tsx';
  let text = read(rel);
  const importLine = "import './styles/closeflow-scaled-desktop-shell-stage148.css';";
  if (!text.includes(importLine)) {
    const lines = text.split(/\r?\n/);
    let lastStyleImport = -1;
    for (let i = 0; i < lines.length; i += 1) {
      if (/^import ['"]\.\/styles\//.test(lines[i])) lastStyleImport = i;
    }
    if (lastStyleImport < 0) throw new Error('App.tsx: no ./styles imports found');
    lines.splice(lastStyleImport + 1, 0, importLine);
    text = lines.join('\n');
    write(rel, text);
    console.log('UPDATED src/App.tsx: inserted Stage148 CSS import after last ./styles import');
  } else {
    console.log('SKIPPED src/App.tsx: Stage148 CSS import already present');
  }
}

{
  const rel = 'src/components/Layout.tsx';
  let text = read(rel);

  const importLine = "import { ShellDesktopViewportRuntime } from './ShellDesktopViewportRuntime';";
  if (!text.includes(importLine)) {
    const anchor = "import OperatorTopBarRuntime from './OperatorTopBarRuntime';";
    if (!text.includes(anchor)) throw new Error('Layout.tsx: import anchor not found');
    text = text.replace(anchor, `${anchor}\n${importLine}`);
    console.log('UPDATED src/components/Layout.tsx: added ShellDesktopViewportRuntime import');
  } else {
    console.log('SKIPPED src/components/Layout.tsx: runtime import already present');
  }

  const runtimeNode = '      <ShellDesktopViewportRuntime />';
  if (!text.includes(runtimeNode)) {
    const anchor = '      <OperatorMetricToneRuntime />';
    if (!text.includes(anchor)) throw new Error('Layout.tsx: render anchor not found');
    text = text.replace(anchor, `${runtimeNode}\n${anchor}`);
    console.log('UPDATED src/components/Layout.tsx: added ShellDesktopViewportRuntime render');
  } else {
    console.log('SKIPPED src/components/Layout.tsx: runtime render already present');
  }

  write(rel, text);
}

console.log('DONE Stage148 scaled desktop shell patcher.');
