/* CLOSEFLOW_STAGE149_CLEAN_DESKTOP_APP_SHELL_CANVAS_PATCHER */
const fs = require('fs');
const path = require('path');

const repo = process.argv[2];
if (!repo) throw new Error('Usage: node apply-stage149-clean-desktop-app-shell-canvas.cjs <repo>');

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}
function write(rel, content) {
  fs.writeFileSync(path.join(repo, rel), content, 'utf8');
}

const widthExperimentImports = [
  "import './styles/closeflow-desktop-wide-content-stage136.css';",
  "import './styles/closeflow-desktop-content-shell-stage137.css';",
  "import './styles/closeflow-desktop-left-anchor-content-stage138.css';",
  "import './styles/closeflow-unified-desktop-canvas-stage139.css';",
  "import './styles/closeflow-unified-desktop-work-width-stage140.css';",
  "import './styles/closeflow-shared-work-width-frame-stage141.css';",
  "import './styles/closeflow-repair-shared-work-width-frame-stage142.css';",
  "import './styles/closeflow-hard-work-frame-width-stage143.css';",
  "import './styles/closeflow-shell-content-width-source-truth-stage144.css';",
  "import './styles/closeflow-route-root-width-normalization-stage145.css';",
  "import './styles/closeflow-fluid-work-surface-stage146.css';",
  "import './styles/closeflow-shell-overflow-work-surface-stage147.css';",
  "import './styles/closeflow-scaled-desktop-shell-stage148.css';",
];

{
  const rel = 'src/App.tsx';
  let text = read(rel);

  for (const line of widthExperimentImports) {
    if (text.includes(line)) {
      text = text.replace(line + '\n', '').replace(line + '\r\n', '').replace(line, '');
      console.log(`REMOVED ${rel}: ${line}`);
    }
  }

  const importLine = "import './styles/closeflow-clean-desktop-app-shell-canvas-stage149.css';";
  if (!text.includes(importLine)) {
    const lines = text.split(/\r?\n/);
    let insertAfter = -1;
    for (let i = 0; i < lines.length; i += 1) {
      if (lines[i].includes("import './styles/closeflow-right-rail-heading-source-truth-stage135.css';")) {
        insertAfter = i;
      }
    }
    if (insertAfter < 0) {
      for (let i = 0; i < lines.length; i += 1) {
        if (/^import ['"]\.\/styles\//.test(lines[i])) insertAfter = i;
      }
    }
    if (insertAfter < 0) throw new Error('App.tsx: no ./styles imports found');
    lines.splice(insertAfter + 1, 0, importLine);
    text = lines.join('\n');
    console.log('UPDATED src/App.tsx: added Stage149 CSS import after stable UI imports');
  } else {
    console.log('SKIPPED src/App.tsx: Stage149 CSS import already present');
  }

  write(rel, text);
}

{
  const rel = 'src/components/Layout.tsx';
  let text = read(rel);

  const runtimeImport = "import { ShellDesktopViewportRuntime } from './ShellDesktopViewportRuntime';";
  if (text.includes(runtimeImport)) {
    text = text.replace(runtimeImport + '\n', '').replace(runtimeImport + '\r\n', '').replace(runtimeImport, '');
    console.log('REMOVED Layout.tsx: ShellDesktopViewportRuntime import');
  }

  const runtimeNode = '      <ShellDesktopViewportRuntime />\n';
  if (text.includes(runtimeNode)) {
    text = text.replace(runtimeNode, '');
    console.log('REMOVED Layout.tsx: ShellDesktopViewportRuntime render');
  } else {
    text = text.replace(/\s*<ShellDesktopViewportRuntime\s*\/>\s*/g, '\n');
  }

  // Normalize messy closing indentation left by previous patchers.
  text = text.replace(/\n\{children\}\n<\/div>/g, '\n          {children}\n        </div>');
  text = text.replace(/\n\s*\{children\}\s*\n\s*<\/div>\s*\n\s*<\/main>/g, '\n          {children}\n        </div>\n      </main>');

  write(rel, text);
}

{
  const rel = 'src/components/ui-system/PageShell.tsx';
  if (fs.existsSync(path.join(repo, rel))) {
    let text = read(rel);
    text = text.replace("  default: 'max-w-7xl',", "  default: '',");
    text = text.replace("  wide: 'max-w-[90rem]',", "  wide: '',");
    text = text.replace("  compact: 'max-w-5xl',", "  compact: '',");
    text = text.replace(
      "className={['cf-page-shell mx-auto w-full px-4 py-6 sm:px-6 lg:px-8', WIDTH_CLASS[variant], className].filter(Boolean).join(' ')}",
      "className={['cf-page-shell cf-route-work-root w-full px-4 py-6 sm:px-6 lg:px-8', WIDTH_CLASS[variant], className].filter(Boolean).join(' ')}"
    );
    write(rel, text);
    console.log('UPDATED PageShell.tsx: no PageShell width islands');
  }
}

console.log('DONE Stage149 clean desktop app shell canvas patcher.');
