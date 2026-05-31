const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const layoutPath = path.join(ROOT, "src", "components", "Layout.tsx");
const appPath = path.join(ROOT, "src", "App.tsx");
const archiveDir = path.join(ROOT, "_project", "archive", "STAGE209_CENTER_SCROLL_RUNTIME_ENFORCER");

fs.mkdirSync(archiveDir, { recursive: true });

if (!fs.existsSync(layoutPath)) throw new Error("Missing src/components/Layout.tsx");
if (!fs.existsSync(appPath)) throw new Error("Missing src/App.tsx");

const layoutBefore = fs.readFileSync(layoutPath, "utf8");
const appBefore = fs.readFileSync(appPath, "utf8");

fs.writeFileSync(path.join(archiveDir, "Layout.tsx.stage209.before"), layoutBefore, "utf8");
fs.writeFileSync(path.join(archiveDir, "App.tsx.stage209.before"), appBefore, "utf8");

let layout = layoutBefore;
let app = appBefore;

// 1. Usuń poprzedni runtime style Stage208, jeśli jest.
layout = layout.replace(/\s*<style id="closeflow-stage208-runtime-center-scroll">[\s\S]*?<\/style>\s*/g, "\n");

// 2. Upewnij się, że Layout importuje useEffect.
layout = layout.replace(
  /import\s+\{([^}]+)\}\s+from\s+'react';/,
  (match, inner) => {
    const parts = inner.split(",").map((p) => p.trim()).filter(Boolean);
    if (!parts.includes("useEffect")) parts.push("useEffect");
    return `import { ${parts.join(", ")} } from 'react';`;
  }
);

if (!layout.includes("useEffect")) {
  throw new Error("Nie udało się dodać useEffect do importu React.");
}

// 3. Usuń stare zwykłe CSS-y scrolla z App.tsx, żeby nie mieszały.
const oldScrollImports = [
  "closeflow-scroll-and-calendar-overflow-stage202.css",
  "closeflow-page-scroll-owner-stage203.css",
  "closeflow-main-only-scroll-stage205.css",
  "closeflow-content-only-scroll-stage206.css",
  "closeflow-center-content-scroll-owner-stage207.css"
];

for (const css of oldScrollImports) {
  const re = new RegExp(`^\\s*import\\s+['"]\\.\\/styles\\/${css.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}['"];\\s*\\r?\\n?`, "gm");
  app = app.replace(re, "");
}

// 4. Usuń wcześniejszy Stage209 effect, jeśli był.
layout = layout.replace(
  /\n\s*\/\* STAGE209_CENTER_SCROLL_RUNTIME_ENFORCER_START \*\/[\s\S]*?\/\* STAGE209_CENTER_SCROLL_RUNTIME_ENFORCER_END \*\/\s*\n/g,
  "\n"
);

const effect = `
  /* STAGE209_CENTER_SCROLL_RUNTIME_ENFORCER_START */
  useEffect(() => {
    const setImportant = (el: Element | null | undefined, styles: Record<string, string>) => {
      if (!el || !(el instanceof HTMLElement)) return;
      for (const [name, value] of Object.entries(styles)) {
        el.style.setProperty(name, value, 'important');
      }
    };

    const applyCenterScrollContract = () => {
      if (typeof document === 'undefined') return;

      const root = document.querySelector('#root');
      const appShell = document.querySelector('#root > .app.closeflow-visual-stage01.cf-html-shell');
      const sidebar = document.querySelector('aside.sidebar[data-shell-sidebar="true"]');
      const navScroll = document.querySelector('aside.sidebar[data-shell-sidebar="true"] .nav-scroll');
      const main = document.querySelector('main[data-shell-main="true"]');
      const globalBar = document.querySelector('[data-shell-global-bar="true"]');
      const content = document.querySelector('main[data-shell-main="true"] > div.view.active[data-shell-content="true"]');

      const scaledHeight = 'calc(100dvh * var(--cf-stage201-app-scale-inverse, 1.3333333333))';
      const scaledWidth = 'calc(100vw * var(--cf-stage201-app-scale-inverse, 1.3333333333))';

      if (window.innerWidth <= 860) {
        setImportant(document.documentElement, {
          height: 'auto',
          'min-height': '100dvh',
          'overflow-y': 'auto',
          'overflow-x': 'hidden'
        });
        setImportant(document.body, {
          height: 'auto',
          'min-height': '100dvh',
          'overflow-y': 'auto',
          'overflow-x': 'hidden'
        });
        setImportant(root, {
          height: 'auto',
          'min-height': '100dvh',
          'overflow-y': 'auto',
          'overflow-x': 'hidden'
        });
        setImportant(appShell, {
          transform: 'none',
          width: '100%',
          'min-width': '100%',
          height: 'auto',
          'min-height': '100dvh',
          'max-height': 'none',
          overflow: 'visible'
        });
        setImportant(main, {
          height: 'auto',
          'max-height': 'none',
          overflow: 'visible'
        });
        setImportant(content, {
          height: 'auto',
          'max-height': 'none',
          overflow: 'visible'
        });
        return;
      }

      setImportant(document.documentElement, {
        width: '100%',
        height: '100%',
        'min-height': '100%',
        overflow: 'hidden'
      });

      setImportant(document.body, {
        width: '100%',
        height: '100%',
        'min-height': '100%',
        overflow: 'hidden'
      });

      setImportant(root, {
        width: '100vw',
        height: '100dvh',
        'min-height': '100dvh',
        overflow: 'hidden',
        background: '#f3f6fb'
      });

      setImportant(appShell, {
        width: scaledWidth,
        'min-width': scaledWidth,
        height: scaledHeight,
        'min-height': scaledHeight,
        'max-height': scaledHeight,
        transform: 'scale(var(--cf-stage201-app-scale, 0.75))',
        'transform-origin': 'top left',
        overflow: 'hidden',
        'align-items': 'stretch'
      });

      setImportant(sidebar, {
        height: scaledHeight,
        'min-height': scaledHeight,
        'max-height': scaledHeight,
        overflow: 'hidden',
        'align-self': 'stretch'
      });

      setImportant(navScroll, {
        'min-height': '0',
        'overflow-y': 'auto',
        'overflow-x': 'hidden'
      });

      setImportant(main, {
        height: scaledHeight,
        'min-height': scaledHeight,
        'max-height': scaledHeight,
        overflow: 'hidden',
        display: 'flex',
        'flex-direction': 'column',
        'min-width': '0'
      });

      setImportant(globalBar, {
        flex: '0 0 auto',
        position: 'relative',
        'z-index': '5'
      });

      setImportant(content, {
        flex: '1 1 0',
        'min-height': '0',
        height: 'auto',
        'max-height': 'none',
        'overflow-y': 'auto',
        'overflow-x': 'hidden',
        'overscroll-behavior': 'contain',
        'scrollbar-gutter': 'stable both-edges',
        'padding-bottom': 'calc(240px * var(--cf-stage201-app-scale-inverse, 1.3333333333))'
      });

      content?.setAttribute('data-stage209-scroll-owner', 'true');
    };

    applyCenterScrollContract();

    const raf = window.requestAnimationFrame(applyCenterScrollContract);
    const t1 = window.setTimeout(applyCenterScrollContract, 0);
    const t2 = window.setTimeout(applyCenterScrollContract, 120);

    window.addEventListener('resize', applyCenterScrollContract);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener('resize', applyCenterScrollContract);
    };
  }, [location.pathname, mobileMenuOpen]);
  /* STAGE209_CENTER_SCROLL_RUNTIME_ENFORCER_END */
`;

// 5. Wstaw effect po canUseAdminDebugToolbar.
const anchor = "  const canUseAdminDebugToolbar = Boolean(isAdmin || isAppOwner);";
if (!layout.includes(anchor)) {
  throw new Error("Nie znaleziono anchor canUseAdminDebugToolbar.");
}

layout = layout.replace(anchor, `${anchor}\n${effect}`);

fs.writeFileSync(layoutPath, layout, "utf8");
fs.writeFileSync(appPath, app, "utf8");

const checks = {
  layoutHasUseEffect: /import\\s+\\{[^}]*useEffect[^}]*\\}\\s+from\\s+'react';/.test(layout),
  layoutHasStage209: layout.includes("STAGE209_CENTER_SCROLL_RUNTIME_ENFORCER_START"),
  appOldScrollImportsRemoved: !oldScrollImports.some((css) => app.includes(css))
};

console.log(JSON.stringify(checks, null, 2));

if (!checks.layoutHasUseEffect || !checks.layoutHasStage209 || !checks.appOldScrollImportsRemoved) {
  process.exit(1);
}
