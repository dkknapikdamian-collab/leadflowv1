#!/usr/bin/env node
/*
 * LF-UI-SOT-007 repair migration.
 *
 * This is intentionally deterministic: it only splits the already committed
 * visual runtime in source order, renames active path-only patch layers, and
 * adds non-rendering ownership metadata. It does not change selectors or
 * declarations.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const styles = path.join(root, 'src', 'styles');
const canonical = path.join(styles, 'closeflow-visual-source-truth.css');
const owners = path.join(styles, 'owners');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content.endsWith('\n') ? content : `${content}\n`, 'utf8');
}

function rel(file) {
  return path.relative(root, file).replace(/\\/g, '/');
}

function json(value) {
  return JSON.stringify(value);
}

function ownerHeader(ownerId, concerns, scope, consumerRoots) {
  return `/* LF-UI-SOT-007_OWNER ${json({ schema: 'LF-UI-SOT-007.owner.v1', ownerId, concerns, scope, consumerRoots })} */\n`;
}

const modulePlan = [
  { file: 'closeflow-foundation.css', start: 1, end: 0, ownerId: 'foundation', concerns: ['TOKENS', 'SEMANTIC_COLORS', 'TYPOGRAPHY', 'SPACING'], scope: 'global' },
  { file: 'closeflow-actions.css', start: 1, end: 3, ownerId: 'actions', concerns: ['BUTTONS_ACTIONS'], scope: 'global' },
  { file: 'closeflow-surfaces-and-cards.css', start: 4, end: 5, ownerId: 'surfaces-cards', concerns: ['SURFACES', 'RADII', 'SHADOWS'], scope: 'global' },
  { file: 'closeflow-dialogs.css', start: 6, end: 6, ownerId: 'dialogs', concerns: ['FORMS', 'MODALS'], scope: 'global' },
  { file: 'closeflow-metrics.css', start: 7, end: 7, ownerId: 'metrics', concerns: ['CARDS_TILES'], scope: 'global' },
  { file: 'closeflow-page-shell.css', start: 8, end: 8, ownerId: 'page-shell', concerns: ['PAGE_SHELL'], scope: 'global' },
  { file: 'closeflow-records-and-rails.css', start: 9, end: 15, ownerId: 'records-rails', concerns: ['LIST_ROWS', 'BADGES', 'RIGHT_RAIL'], scope: 'global' },
  { file: 'closeflow-search-and-density.css', start: 16, end: 43, ownerId: 'search-density', concerns: ['SEARCH'], scope: 'route-scoped' },
  { file: 'closeflow-calendar.css', start: 44, end: 55, ownerId: 'calendar', concerns: ['CALENDAR'], scope: 'route-scoped' },
  { file: 'closeflow-page-header-responsive.css', start: 56, end: 60, ownerId: 'page-header-responsive', concerns: [], scope: 'route-scoped' },
  { file: 'closeflow-foundation-operator.css', start: 61, end: 72, ownerId: 'foundation-operator', concerns: [], scope: 'route-scoped' },
  { file: 'closeflow-rails-and-detail.css', start: 73, end: 89, ownerId: 'rails-detail', concerns: [], scope: 'route-scoped' },
  { file: 'closeflow-shell-and-badges.css', start: 90, end: 100, ownerId: 'shell-badges', concerns: [], scope: 'route-scoped' },
  { file: 'closeflow-client-detail.css', start: 101, end: 120, ownerId: 'client-detail', concerns: [], scope: 'route-scoped' },
  { file: 'closeflow-responsive-adapters.css', start: 121, end: 136, ownerId: 'responsive-adapters', concerns: ['RESPONSIVE_DENSITY'], scope: 'route-scoped' },
  { file: 'closeflow-page-adapters.css', start: 137, end: 159, ownerId: 'page-adapters', concerns: [], scope: 'route-scoped' },
  { file: 'closeflow-client-notes.css', start: 160, end: 164, ownerId: 'client-notes', concerns: [], scope: 'component-scoped' },
];

function parseCanonical(source) {
  const blocks = [];
  const re = /\/\* LF-UI-SOT-007_CANONICAL_CSS_OWNER_BEGIN: ([^*]+) \*\/([\s\S]*?)\/\* LF-UI-SOT-007_CANONICAL_CSS_OWNER_END: ([^*]+) \*\//g;
  let match;
  while ((match = re.exec(source))) {
    if (match[1] !== match[3]) throw new Error(`marker source mismatch: ${match[1]} !== ${match[3]}`);
    blocks.push({ source: match[1], body: match[2] });
  }
  if (blocks.length !== 164) throw new Error(`expected 164 marker blocks, found ${blocks.length}`);
  return { base: source.slice(0, source.indexOf('/* LF-UI-SOT-007_CANONICAL_CSS_OWNER_BEGIN:')), blocks };
}

function cleanExtractedBody(body) {
  return body
    .replace(/^\s+/, '')
    .replace(/^[ \t]*\/\* LF-UI-SOT-007_CANONICAL_CSS_OWNER_(?:BEGIN|END):[^\n]*\*\/[ \t]*\r?\n?/gm, '')
    .trimEnd();
}

function cleanFoundation(base) {
  return base
    .replace(/^\/\*[\s\S]*?\*\/\s*/, '')
    .replace(/^[ \t]*\/\* LF-UI-SOT-007_CANONICAL_CSS_OWNER_(?:BEGIN|END):[^\n]*\*\/[ \t]*\r?\n?/gm, '')
    .trim();
}

function renameActiveStyles() {
  const map = {
    'closeflow-activity-rail-force-colors-stage181v.css': 'closeflow-activity-rail.css',
    'closeflow-ai-drafts-rail-force-colors-stage181w.css': 'closeflow-ai-drafts-rail.css',
    'closeflow-billing-visual-taxonomy-stage181z.css': 'closeflow-billing-taxonomy.css',
    'closeflow-canvas-runtime-source-truth-stage211j.css': 'closeflow-canvas-runtime.css',
    'closeflow-case-detail-stage220a10-tabs-layout-repair.css': 'closeflow-case-detail-tabs.css',
    'case-detail-stage228r9-shell-rail-lift.css': 'closeflow-case-detail-shell-rail.css',
    'closeflow-notifications-conflict-card-stage181aj.css': 'closeflow-notification-conflict-card.css',
    'closeflow-notifications-rail-force-colors-stage181x.css': 'closeflow-notifications-rail.css',
    'closeflow-page-header-v2.css': 'closeflow-page-header-runtime.css',
    'closeflow-response-template-modal-source-truth-stage181r.css': 'closeflow-response-template-modal.css',
    'closeflow-settings-form-control-readability-stage179.css': 'closeflow-settings-form-controls.css',
    'closeflow-settings-profile-readability-stage181af.css': 'closeflow-settings-profile.css',
    'closeflow-settings-safe-copy-cleanup-stage181ai.css': 'closeflow-settings-copy.css',
    'closeflow-settings-summary-right-rail-stage181ae.css': 'closeflow-settings-summary-rail.css',
    'closeflow-settings-tabs-stage181ac.css': 'closeflow-settings-tabs.css',
    'closeflow-shared-quick-actions-bar-stage227e3.css': 'closeflow-quick-actions.css',
    'closeflow-template-modal-source-truth-stage181l.css': 'closeflow-template-modal-layout.css',
    'closeflow-template-modal-source-truth-stage181n.css': 'closeflow-template-modal-actions.css',
    'closeflow-toast-source-truth-stage220a33.css': 'closeflow-toast.css',
    'sales-funnel-stage231d0f-visual-alignment.css': 'closeflow-sales-funnel.css',
    'stage216m-r7-entity-data-card-source-truth.css': 'closeflow-entity-data-card.css',
    'visual-stage10-notifications-vnext.css': 'closeflow-notifications.css',
    'visual-stage16-billing-vnext.css': 'closeflow-billing.css',
    'visual-stage17-support-vnext.css': 'closeflow-support.css',
    'visual-stage19-settings-vnext.css': 'closeflow-settings.css',
    'visual-stage22-event-form-vnext.css': 'closeflow-event-form.css',
    'visual-stage9-ai-drafts-vnext.css': 'closeflow-ai-drafts.css',
    'hotfix-right-rail-dark-wrappers.css': 'closeflow-right-rail-wrappers.css',
  };

  const files = [];
  for (const [from, to] of Object.entries(map)) {
    const source = path.join(styles, from);
    const target = path.join(styles, to);
    if (!fs.existsSync(source)) continue;
    if (fs.existsSync(target)) throw new Error(`rename target already exists: ${rel(target)}`);
    fs.renameSync(source, target);
    files.push([from, to]);
  }

  const sourceRoot = path.join(root, 'src');
  const visit = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === '.codex' || entry.name === '.stversions') continue;
        visit(file);
        continue;
      }
      if (!/\.(?:css|ts|tsx|js|jsx)$/.test(entry.name)) continue;
      let content = read(file);
      let changed = false;
      for (const [from, to] of files) {
        if (content.includes(from)) {
          content = content.split(from).join(to);
          changed = true;
        }
      }
      if (changed) write(file, content);
    }
  };
  visit(sourceRoot);
  return files;
}

function annotateReachableCss() {
  const entry = path.join(root, 'src', 'main.tsx');
  const extensions = ['.ts', '.tsx', '.js', '.jsx', '.css'];
  const strip = (value) => value.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1');
  const resolve = (from, spec) => {
    if (!spec.startsWith('.')) return null;
    const candidate = path.resolve(path.dirname(from), spec);
    for (const extension of extensions) {
      const file = candidate.endsWith(extension) ? candidate : `${candidate}${extension}`;
      if (fs.existsSync(file) && fs.statSync(file).isFile()) return file;
    }
    for (const extension of extensions) {
      const file = path.join(candidate, `index${extension}`);
      if (fs.existsSync(file)) return file;
    }
    return null;
  };
  const seen = new Set();
  const queue = [entry];
  while (queue.length) {
    const file = queue.shift();
    if (!file || seen.has(file) || !fs.existsSync(file)) continue;
    seen.add(file);
    const source = strip(read(file));
    for (const match of source.matchAll(/(?:import|export)\s+(?:[^'";]*?from\s+)?['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)/g)) {
      const child = resolve(file, match[1] || match[2]);
      if (child && !seen.has(child)) queue.push(child);
    }
  }
  for (const file of [...seen].filter((value) => value.endsWith('.css'))) {
    const source = read(file);
    if (source.includes('LF-UI-SOT-007_OWNER')) continue;
    const relative = rel(file);
    const kind = /(?:^|\/)(?:index|core-contracts|page-adapters|closeflow-visual-source-truth)\.css$/.test(relative)
      ? 'entry'
      : 'scoped';
    const scope = kind === 'entry' ? 'entry' : relative.includes('/pages/') ? 'route' : 'component';
    const header = ownerHeader(`runtime:${relative}`, [], scope, [relative]);
    write(file, `${header}${source}`);
  }
  return [...seen].filter((value) => value.endsWith('.css')).map(rel);
}

function main() {
  const source = read(canonical);
  const parsed = parseCanonical(source);
  fs.mkdirSync(owners, { recursive: true });
  const imports = [];
  for (const plan of modulePlan) {
    const body = plan.start === 1 && plan.end === 0
      ? cleanFoundation(parsed.base)
      : parsed.blocks.slice(plan.start - 1, plan.end).map((block) => cleanExtractedBody(block.body)).join('\n\n');
    const target = path.join(owners, plan.file);
    write(target, `${ownerHeader(`semantic:${plan.ownerId}`, plan.concerns, plan.scope, ['src/styles/closeflow-visual-source-truth.css'])}${body}`);
    imports.push(`@import './owners/${plan.file}';`);
  }
  write(canonical, `${ownerHeader('entry:visual-runtime', [], 'entry', ['src/App.tsx', 'src/index.css'])}${imports.join('\n')}\n`);
  const renamed = renameActiveStyles();
  const reachable = annotateReachableCss();
  const index = path.join(root, 'src', 'index.css');
  write(index, read(index).replace(/^[ \t]*@import ['"]\.\/styles\/(?:legacy\/legacy-imports|temporary\/temporary-overrides)\.css['"];?\r?\n/gm, ''));
  console.log(JSON.stringify({
    markerBlocksSplit: parsed.blocks.length,
    semanticModules: modulePlan.map((plan) => rel(path.join(owners, plan.file))),
    renamedActiveStyles: renamed,
    reachableCssAnnotated: reachable.length,
  }, null, 2));
}

main();
