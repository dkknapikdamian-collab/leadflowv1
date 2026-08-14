#!/usr/bin/env node
/* LF-UI-SOT-007 deterministic visual ownership guards. */
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const registryPath = path.join(root, 'src', 'lib', 'source-of-truth', 'visual-owner-registry.json');

function rel(file, rootDir = root) {
  return path.relative(rootDir, file).replace(/\\/g, '/');
}

function readRepo(file, rootDir = root) {
  return fs.readFileSync(path.join(rootDir, file), 'utf8');
}

function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1');
}

function resolveImport(from, specifier, rootDir = root) {
  if (!specifier || !specifier.startsWith('.')) return null;
  const candidate = path.resolve(path.dirname(from), specifier);
  const extensions = ['.ts', '.tsx', '.js', '.jsx', '.css'];
  for (const extension of extensions) {
    const file = candidate.endsWith(extension) ? candidate : `${candidate}${extension}`;
    if (fs.existsSync(file) && fs.statSync(file).isFile()) return file;
  }
  for (const extension of extensions) {
    const file = path.join(candidate, `index${extension}`);
    if (fs.existsSync(file)) return file;
  }
  return null;
}

function runtimeGraph(rootDir = root) {
  const entry = path.join(rootDir, 'src', 'main.tsx');
  const files = new Set();
  const edges = [];
  const edgeKeys = new Set();
  const queue = [entry];
  const addEdge = (from, child, specifier) => {
    const edge = { from: rel(from, rootDir), to: rel(child, rootDir), specifier };
    const key = `${edge.from}->${edge.to}:${edge.specifier}`;
    if (!edgeKeys.has(key)) {
      edgeKeys.add(key);
      edges.push(edge);
    }
    if (!files.has(child)) queue.push(child);
  };
  const processQueue = () => {
    while (queue.length) {
      const file = queue.shift();
      if (!file || files.has(file) || !fs.existsSync(file)) continue;
      files.add(file);
      const source = stripComments(fs.readFileSync(file, 'utf8'));
      const importPattern = /(?:import|export)\s+(?:[^'";]*?from\s+)?['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)/g;
      for (const match of source.matchAll(importPattern)) {
        const child = resolveImport(file, match[1] || match[2], rootDir);
        if (child) addEdge(file, child, match[1] || match[2]);
      }
      if (file.endsWith('.css')) {
        const cssImportPattern = /@import\s+(?:url\()?\s*['"]([^'"]+)['"]\s*\)?\s*;/g;
        for (const match of source.matchAll(cssImportPattern)) {
          const child = resolveImport(file, match[1], rootDir);
          if (child) addEdge(file, child, match[1]);
        }
      }
    }
  };

  processQueue();

  // Route modules can be loaded through a dynamic registry that is not
  // statically discoverable from main.tsx. A direct CSS import in a source
  // module is still runtime evidence, so include that consumer edge without
  // promoting unrelated source modules to visual owners.
  const sourceRoot = path.join(rootDir, 'src');
  const sourceModules = [];
  const collectSourceModules = (directory) => {
    for (const entryItem of fs.readdirSync(directory, { withFileTypes: true })) {
      const candidate = path.join(directory, entryItem.name);
      if (entryItem.isDirectory()) collectSourceModules(candidate);
      else if (/\.(?:ts|tsx|js|jsx)$/.test(entryItem.name) && !entryItem.name.includes('.sync-conflict-')) sourceModules.push(candidate);
    }
  };
  collectSourceModules(sourceRoot);
  const importPattern = /(?:import|export)\s+(?:[^'";]*?from\s+)?['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)/g;
  for (const sourceModule of sourceModules) {
    const source = stripComments(fs.readFileSync(sourceModule, 'utf8'));
    for (const match of source.matchAll(importPattern)) {
      const specifier = match[1] || match[2];
      const child = resolveImport(sourceModule, specifier, rootDir);
      if (child && child.endsWith('.css')) {
        files.add(sourceModule);
        addEdge(sourceModule, child, specifier);
      }
    }
  }
  processQueue();
  return { files, edges };
}

function parseOwnerMetadata(source) {
  const match = String(source || '').match(/LF-UI-SOT-007_OWNER\s+(\{[^\n]*\})/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return { invalid: true };
  }
}

function loadRegistry(rootDir = root) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, 'src', 'lib', 'source-of-truth', 'visual-owner-registry.json'), 'utf8'));
}

function sourceReader(rootDir, sourceByFile) {
  return (relativeOrAbsolute) => {
    const absolute = path.isAbsolute(relativeOrAbsolute) ? relativeOrAbsolute : path.join(rootDir, relativeOrAbsolute);
    const relative = rel(absolute, rootDir);
    if (sourceByFile && Object.prototype.hasOwnProperty.call(sourceByFile, relative)) return sourceByFile[relative];
    if (sourceByFile && Object.prototype.hasOwnProperty.call(sourceByFile, absolute)) return sourceByFile[absolute];
    return fs.readFileSync(absolute, 'utf8');
  };
}

function normalizedGraph(graph, rootDir) {
  return graph || runtimeGraph(rootDir);
}

function addFailure(failures, message) {
  failures.push(message);
}

// Historical names are semantic authority markers, not harmless comments. Keep
// this check role-independent: an adapter can bypass SSOT just as easily as a
// canonical owner when it carries a copied stage/final-lock contract.
const HISTORICAL_OWNER_PATTERN = /(?:\bstage\d+[a-z0-9_-]*\b|\bvisual[-_]?stage[a-z0-9_-]*\b|\bhotfix[a-z0-9_-]*\b|\bfinal[-_]?lock\b|\bpacket\d+[a-z0-9_-]*\b|\bsemantic\d+[a-z0-9_-]*\b|--stage\d+[a-z0-9_-]*|data-stage\d+[a-z0-9_-]*|--(?:cf|closeflow-semantic)\d+[a-z0-9_-]*|data-cf-main-search-[a-z0-9_-]*semantic\d+[a-z0-9_-]*|data-cf-main-search-source\s*=\s*[\"']semantic\d+[a-z0-9_-]*[\"'])/i;
const RUNTIME_STYLE_INJECTION_PATTERN = /document\.createElement\(\s*[\"']style[\"']\s*\)/i;
const EXPLICIT_PATCH_PATTERN = /(?:activePatchLayer\s*:\s*true|PATCH_LAYER|specificity[-_ ]patch|runtime[-_ ]hotfix)/i;
const EXPLICIT_IMPORTANT_BOUNDARY_PATTERN = /LF-UI-IMPORTANT_BOUNDARY\s*:\s*([A-Z0-9_]+)/i;
// Match exact shell primitives only. Route classes such as `.main-clients` and
// `.app-surface-card` are legitimate scoped anchors and must not be mistaken
// for the global shell itself.
const SCOPED_GLOBAL_SELECTOR_PATTERN = /(?:^|[,{]\s*)(?::root\b|html\b|body\b|#root\s*(?:[,{]|$))|(?:^|[,{]\s*)[^{}]*(?:\.(?:app|cf-html-shell|sidebar|global-bar|nav-btn|brand|view|main)(?![-\w])|\[data-shell-[^=\]]+|\[data-visual-stage)/i;

function cssSelectors(source) {
  const withoutComments = stripComments(String(source || ''));
  return [...withoutComments.matchAll(/([^{}]+)\{/g)]
    .map((match) => match[1].trim())
    .filter((selector) => selector && !selector.startsWith('@'));
}

function scopedGlobalAuthority(source) {
  return cssSelectors(source).filter((selector) => SCOPED_GLOBAL_SELECTOR_PATTERN.test(selector));
}

function cssRuleBlocks(source) {
  const cleaned = stripComments(String(source || ''));
  const blocks = [];
  const pattern = /([^{}]+)\{([^{}]*)\}/g;
  for (const match of cleaned.matchAll(pattern)) {
    const selector = match[1].trim().replace(/\s+/g, ' ');
    if (!selector || selector.startsWith('@')) continue;
    blocks.push({
      selector,
      body: match[2],
      offset: match.index || 0,
    });
  }
  return blocks;
}

function cssDeclarations(body) {
  return [...String(body || '').matchAll(/([\w-]+)\s*:\s*([^;{}]+)/g)].map((match) => ({
    property: match[1].toLowerCase(),
    value: match[2].trim(),
  }));
}

function hasLiteralValue(value) {
  return !/var\(--[^)]+\)/i.test(value) && !/^inherit$|^initial$|^unset$|^revert$|^currentcolor$/i.test(value.trim());
}

function isGenericScopedSemanticSelector(selector) {
  const normalized = selector.trim();
  const genericClass = /(?:^|[\s>,])\.(?:button|card|metric|metrics|tile|action|sidebar|global-bar|icon)(?=$|[\s>:#.[,])/i.test(normalized);
  const bareControl = /^(?:button|input|textarea|select|form)(?=$|[\s>:#.[,])/i.test(normalized);
  const bareRole = /^\[role=["']button["']\]/i.test(normalized);
  return genericClass || bareControl || bareRole;
}

function ownerConcernMismatches({ file, metadata, source }) {
  const declared = new Set(Array.isArray(metadata.concerns) ? metadata.concerns : []);
  const rules = cssRuleBlocks(source);
  const mismatches = [];
  const add = (code, detail) => mismatches.push({ file, code, detail });
  const scoped = metadata.role === 'scoped-adapter';

  if (scoped) {
    const globalSelectors = scopedGlobalAuthority(source);
    if (globalSelectors.length) add('SCOPED_GLOBAL_AUTHORITY', `global shell semantics: ${globalSelectors.slice(0, 3).join(' | ')}`);
    const genericSelectors = rules.filter(({ selector }) => isGenericScopedSemanticSelector(selector));
    if (genericSelectors.length) add('SCOPED_GENERIC_SEMANTIC_AUTHORITY', `generic semantic selectors: ${genericSelectors.slice(0, 3).map(({ selector }) => selector).join(' | ')}`);
  }

  if (declared.has('CALENDAR')) {
    const calendarGenericRules = rules.filter(({ selector, body }) => {
      const calendarContext = /calendar|schedule|agenda|month|week|day|event/i.test(selector);
      const genericMetric = /(?:^|[\s>,.])(?:metric|metrics|metric-card|stat-card|summary-card|dashboard-stat-card|stats-grid|stat-grid|metric-grid|summary-grid|tile|card)(?=$|[\s>:#.[,])/i.test(selector);
      const declarations = cssDeclarations(body);
      const metricToken = declarations.some(({ property }) => /^(?:--eliteflow-metric-|--cf-metric-source-)/i.test(property));
      return (!calendarContext && genericMetric) || metricToken;
    });
    if (calendarGenericRules.length || /--(?:eliteflow-metric-|cf-metric-source-)/i.test(source)) {
      add('CALENDAR_GENERIC_METRICS', `CALENDAR owner contains generic metric/card authority: ${calendarGenericRules.slice(0, 3).map(({ selector }) => selector).join(' | ') || 'metric custom properties'}`);
    }
  }

  if (declared.has('RESPONSIVE_DENSITY')) {
    const semanticDeclarations = rules.filter(({ body }) => cssDeclarations(body).some(({ property }) => /^(?:color|background|background-color|border-color|fill|stroke|box-shadow)$/i.test(property)));
    const semanticSelectors = rules.filter(({ selector }) => /(?:^|[\s>,])(?:button|svg|img)(?=$|[\s>:#.[,])|(?:^|[\s>,])\.(?:icon|button|action)(?=$|[\s>:#.[,])|\[data-(?:icon|action)-/i.test(selector));
    const shellSelectors = rules.filter(({ selector }) => /(?:^|[\s>,])(?::root|html|body|#root)(?=$|[\s>:#.[,])|\.cf-html-shell|\.sidebar|\.global-bar/i.test(selector));
    if (semanticDeclarations.length) add('RESPONSIVE_SEMANTIC_PROPERTIES', `RESPONSIVE_DENSITY owns semantic properties in ${file}`);
    if (semanticSelectors.length) add('RESPONSIVE_SEMANTIC_SELECTORS', `RESPONSIVE_DENSITY owns action/icon selectors: ${semanticSelectors.slice(0, 3).map(({ selector }) => selector).join(' | ')}`);
    if (shellSelectors.length) add('RESPONSIVE_BASE_SHELL', `RESPONSIVE_DENSITY owns base shell selectors: ${shellSelectors.slice(0, 3).map(({ selector }) => selector).join(' | ')}`);
  }

  if (declared.has('BUTTONS_ACTIONS')) {
    const modalRules = rules.filter(({ selector }) => /(?:^|[\s>,])(?:\.?(?:modal|dialog)|\.form-footer|\.modal-footer)(?=$|[\s>:#.[,])|\[role=["']dialog["']\]|data-radix-dialog/i.test(selector));
    if (modalRules.length) add('ACTIONS_MODAL_AUTHORITY', `BUTTONS_ACTIONS owns modal/form-footer selectors: ${modalRules.slice(0, 3).map(({ selector }) => selector).join(' | ')}`);
  }

  if (declared.has('SEARCH')) {
    const nonSearchSelectors = rules.filter(({ selector }) => {
      const normalized = selector.toLowerCase();
      const searchContext = /search|query|suggestion|combobox/.test(normalized);
      const unrelatedAuthority = /(?:right[-_]?rail|right[-_]?card|sidebar|global-bar|html-shell|page-shell|modal|dialog|form-footer|task|notification|billing|settings|lead|client|case|activity|card|metric|tile|record|list-row)/i.test(normalized);
      return !searchContext && unrelatedAuthority;
    });
    const globalShellSelectors = rules.filter(({ selector, body }) => {
      const normalized = selector.toLowerCase();
      const declarations = cssDeclarations(body);
      const tokenOnlyRoot = /^(?::root|\[data-[^\]]+\])$/i.test(normalized)
        && declarations.length > 0
        && declarations.every(({ property }) => property.startsWith('--'));
      return !tokenOnlyRoot
        && /(?:^|[\s>,])(?::root|html|body|#root)(?=$|[\s>:#.[,])|\.cf-html-shell|\.sidebar|\.global-bar/i.test(normalized)
        && !/search|query|suggestion|combobox/.test(normalized);
    });
    if (nonSearchSelectors.length) add('SEARCH_UNRELATED_AUTHORITY', `SEARCH owner contains unrelated route/component authority: ${nonSearchSelectors.slice(0, 4).map(({ selector }) => selector).join(' | ')}`);
    if (globalShellSelectors.length) add('SEARCH_BASE_SHELL_AUTHORITY', `SEARCH owner contains base shell selectors: ${globalShellSelectors.slice(0, 3).map(({ selector }) => selector).join(' | ')}`);
  }

  if (declared.has('SURFACES') || declared.has('RADII') || declared.has('SHADOWS')) {
    const routeSurfaceRules = rules.filter(({ selector }) => /(?:right[-_]?card|right[-_]?rail|calendar[-_]?week[-_]?filter|calendar[-_]?week[-_]?plan|settings[-_]?right|billing[-_]?right|activity[-_]?right|lead[-_]?right|cases[-_]?shortcuts)/i.test(selector));
    if (routeSurfaceRules.length) add('SURFACES_ROUTE_AUTHORITY', `SURFACES owner contains route/right-rail authority: ${routeSurfaceRules.slice(0, 4).map(({ selector }) => selector).join(' | ')}`);
  }

  if (declared.has('TOKENS') || declared.has('SEMANTIC_COLORS') || declared.has('TYPOGRAPHY') || declared.has('SPACING')) {
    const componentRules = rules.filter(({ selector }) => /(?:^|[\s>,])\.cf-vst-(?:card|dialog|button|pill|icon|metric)(?:$|[-_:#.[\s>,])|(?:^|[\s>,])\.cf-confirm-dialog(?:$|[-_:#.[\s>,])/i.test(selector));
    if (componentRules.length) add('FOUNDATION_COMPONENT_AUTHORITY', `foundation owner contains generic component selectors: ${componentRules.slice(0, 5).map(({ selector }) => selector).join(' | ')}`);
  }

  return mismatches;
}

function detectActualConcerns(source) {
  const actual = new Set();
  const rules = cssRuleBlocks(source);
  const text = stripComments(String(source || ''));
  if (/:root\s*\{|--[\w-]+\s*:/i.test(text)) actual.add('TOKENS');
  if (/@media|(?:min|max)-(?:width|height)\s*:|grid-template|clamp\(/i.test(text)) actual.add('RESPONSIVE_DENSITY');
  for (const { selector, body } of rules) {
    const normalized = selector.toLowerCase();
    const declarations = cssDeclarations(body);
    if (/(?:button|action)/i.test(normalized)) actual.add('BUTTONS_ACTIONS');
    if (/(?:^|[\s>,.])(?:card|tile|metric|stats-grid|summary-grid)(?=$|[\s>:#.[,])/i.test(normalized)) actual.add('CARDS_TILES');
    if (/(?:list-row|record-row|quick-list-row|right-list-row)/i.test(normalized)) actual.add('LIST_ROWS');
    if (/(?:badge|pill|chip|status)/i.test(normalized)) actual.add('BADGES');
    if (/(?:right-rail|operator-rail|sidebar|rail)/i.test(normalized)) actual.add('RIGHT_RAIL');
    if (/(?:form|input|textarea|select|combobox)/i.test(normalized)) actual.add('FORMS');
    if (/(?:modal|dialog|role=["']dialog|data-radix-dialog)/i.test(normalized)) actual.add('MODALS');
    if (/(?:html-shell|page-shell|#root|sidebar|global-bar)/i.test(normalized)) actual.add('PAGE_SHELL');
    if (/(?:search|query)/i.test(normalized)) actual.add('SEARCH');
    if (/(?:calendar|schedule|agenda|event)/i.test(normalized)) actual.add('CALENDAR');
    if (/(?:icon|svg|stroke|fill)/i.test(normalized)) actual.add('ICONS');
    if (/(?:text-page-title|text-section-title|text-card-title|text-body|text-meta|text-label|text-metric|text-button|font)/i.test(normalized)) actual.add('TYPOGRAPHY');
    if (/:root|^html|^body|^#root/i.test(normalized)) actual.add('PAGE_SHELL');
    for (const declaration of declarations) {
      const { property, value } = declaration;
      if (property.startsWith('--cf-vst-')) {
        if (/(?:color|surface|text|kind|tone|bg|border)/i.test(property)) actual.add('SEMANTIC_COLORS');
        if (/(?:font|line-height|text-)/i.test(property)) actual.add('TYPOGRAPHY');
        if (/(?:space|padding|gap|layout)/i.test(property)) actual.add('SPACING');
        if (/radius/i.test(property)) actual.add('RADII');
        if (/shadow/i.test(property)) actual.add('SHADOWS');
      }
      if (!hasLiteralValue(value)) continue;
      if (/^(?:font-family|font-size|font-weight|line-height|letter-spacing)$/i.test(property)) actual.add('TYPOGRAPHY');
      if (/^(?:margin|padding|gap|inset)$/i.test(property)) actual.add('SPACING');
      if (/^border-radius$/i.test(property)) actual.add('RADII');
      if (/^box-shadow$/i.test(property)) actual.add('SHADOWS');
      if (/^(?:color|background|background-color|border-color|fill|stroke)$/i.test(property) && !/(?:button|action|badge|pill|status|calendar|dialog|modal)/i.test(normalized)) actual.add('SEMANTIC_COLORS');
    }
  }
  return [...actual];
}

function lineNumberAt(source, offset) {
  return String(source).slice(0, offset).split(/\r?\n/).length;
}

function consumerAnchors(source) {
  const anchors = new Set();
  for (const match of String(source || '').matchAll(/\.([A-Za-z_][A-Za-z0-9_-]{3,})/g)) anchors.add(match[1]);
  for (const match of String(source || '').matchAll(/\[(data-[A-Za-z0-9_-]+)/g)) anchors.add(match[1]);
  return [...anchors].filter((anchor) => !/^(?:app|main|view|card|button|input|textarea|select|page|root|html|body)$/i.test(anchor));
}

function consumerRootHasUsage({ ownerSource, consumerSource, ownerPath, consumerPath }) {
  if (!consumerSource) return false;
  if (consumerSource.includes(ownerPath)) return true;
  const source = String(consumerSource);
  const anchors = consumerAnchors(ownerSource);
  return anchors.some((anchor) => source.includes(anchor)) || source.includes(path.basename(ownerPath, path.extname(ownerPath)));
}

function validateConsumerRoots({
  rootDir,
  file,
  metadata,
  registry,
  entryOnly,
  reachable,
  graph,
  read,
  failures,
  invalidScopedConsumerBoundaries,
}) {
  const scoped = metadata.role === (registry.ownerModel || {}).scopedRole;
  const entry = registry.visualEntry;
  const roots = Array.isArray(metadata.consumerRoots) ? metadata.consumerRoots : [];
  if (!roots.length) return;
  const realRoots = roots.filter((rootPath) => rootPath !== entry && !entryOnly.has(rootPath) && !rootPath.endsWith('.css'));
  if (scoped && !realRoots.length) {
    addFailure(failures, `scoped owner consumerRoots must include a real route/component consumer: ${file}`);
    invalidScopedConsumerBoundaries.add(file);
  }
  for (const consumer of roots) {
    const consumerAbsolute = path.join(rootDir, consumer);
    if (!fs.existsSync(consumerAbsolute)) {
      addFailure(failures, `consumer path missing: ${consumer}`);
      if (scoped) invalidScopedConsumerBoundaries.add(file);
      continue;
    }
    if (!reachable.has(consumer)) {
      addFailure(failures, `consumer unreachable from runtime graph: ${consumer}`);
      if (scoped) invalidScopedConsumerBoundaries.add(file);
    }
    if (scoped && consumer === entry) {
      addFailure(failures, `scoped owner cannot use the global visual entry as its only consumer boundary: ${file}`);
      invalidScopedConsumerBoundaries.add(file);
      continue;
    }
    if (scoped && !consumer.endsWith('.css') && !consumerRootHasUsage({
      ownerSource: read(file),
      consumerSource: read(consumer),
      ownerPath: file,
      consumerPath: consumer,
    })) {
      addFailure(failures, `scoped owner consumer relationship is not proven by import/usage graph: ${file} -> ${consumer}`);
      invalidScopedConsumerBoundaries.add(file);
      continue;
    }
    if (scoped && !consumer.endsWith('.css')) {
      const directEdge = (graph.edges || []).some((edge) => edge.from === consumer && edge.to === file);
      const transitiveEvidence = consumerRootHasUsage({
        ownerSource: read(file),
        consumerSource: read(consumer),
        ownerPath: file,
        consumerPath: consumer,
      });
      if (!directEdge && !transitiveEvidence) {
        addFailure(failures, `scoped owner import/usage graph has no consumer edge: ${file} -> ${consumer}`);
        invalidScopedConsumerBoundaries.add(file);
      }
    }
  }
}

function normalizeSelectorFamily(selector) {
  return selector.replace(/\s+/g, ' ').trim().slice(0, 240);
}

function auditImportantDeclarations(reachableCss, read, metadataByFile = new Map()) {
  const byFile = {};
  const byFamily = {};
  const familyRows = new Map();
  const findings = [];
  for (const file of reachableCss) {
    const source = read(file);
    const fileBoundary = source.match(EXPLICIT_IMPORTANT_BOUNDARY_PATTERN);
    const metadata = metadataByFile.get(file) || parseOwnerMetadata(source) || {};
    const canUseBoundary = Boolean(fileBoundary && metadata.role === 'canonical-owner');
    for (const block of cssRuleBlocks(source)) {
      const importantMatches = [...block.body.matchAll(/!important\b/gi)];
      if (!importantMatches.length) continue;
      const selectorFamily = normalizeSelectorFamily(block.selector);
      const line = lineNumberAt(source, block.offset);
      const highSpecificity = /#[-\w]+|html\s+body|:root|\b(?:stage\d+|hotfix|final[-_]?lock|specificity|patch)\b/i.test(block.selector) || EXPLICIT_PATCH_PATTERN.test(block.body);
      const classification = canUseBoundary
        ? 'LEGITIMATE_BOUNDARY'
        : highSpecificity
          ? 'SPECIFICITY_PATCH'
          : 'UNCLASSIFIED_IMPORTANT';
      const familyKey = `${file}::${selectorFamily}`;
      const existing = familyRows.get(familyKey) || {
        FILE: file,
        SELECTOR_FAMILY: selectorFamily,
        OWNER_ROLE: metadata.role || '<missing>',
        BOUNDARY: fileBoundary ? fileBoundary[1].toUpperCase() : null,
        IMPORTANT_COUNT: 0,
        CLASSIFICATION: classification,
        WHY_IMPORTANT: canUseBoundary ? 'Explicit LF-UI-IMPORTANT_BOUNDARY on a canonical owner.' : 'No explicit justified boundary was found.',
      };
      existing.IMPORTANT_COUNT += importantMatches.length;
      if (existing.CLASSIFICATION !== classification) existing.CLASSIFICATION = 'UNCLASSIFIED_IMPORTANT';
      familyRows.set(familyKey, existing);
      byFile[file] = (byFile[file] || 0) + importantMatches.length;
      byFamily[selectorFamily] = (byFamily[selectorFamily] || 0) + importantMatches.length;
      for (let index = 0; index < importantMatches.length; index += 1) {
        findings.push({
          file,
          line,
          family: selectorFamily,
          boundary: fileBoundary ? fileBoundary[1].toUpperCase() : null,
          classification,
          text: block.body.trim().slice(0, 240),
        });
      }
    }
  }
  const counts = {
    LEGITIMATE_BOUNDARY: findings.filter((finding) => finding.classification === 'LEGITIMATE_BOUNDARY').length,
    SPECIFICITY_PATCH: findings.filter((finding) => finding.classification === 'SPECIFICITY_PATCH').length,
    UNCLASSIFIED_IMPORTANT: findings.filter((finding) => finding.classification === 'UNCLASSIFIED_IMPORTANT').length,
  };
  return {
    total: findings.length,
    byFile,
    byFamily,
    findings,
    familyRows: [...familyRows.values()],
    LEGITIMATE_BOUNDARY_IMPORTANT: counts.LEGITIMATE_BOUNDARY,
    UNCLASSIFIED_IMPORTANT: counts.UNCLASSIFIED_IMPORTANT,
    SPECIFICITY_PATCH_IMPORTANT: counts.SPECIFICITY_PATCH,
  };
}

/**
 * Validate the semantic owner registry against the active import graph.
 * Ownership is proven by registry + metadata + reachable consumers. Marker text
 * is intentionally never treated as proof and historical semantic authorities
 * are rejected for every runtime CSS role.
 */
function validateCssArchitecture({
  rootDir = root,
  registry = loadRegistry(rootDir),
  graph = normalizedGraph(null, rootDir),
  sourceByFile,
} = {}) {
  const read = sourceReader(rootDir, sourceByFile);
  const failures = [];
  const reachable = new Set([...graph.files].map((file) => rel(file, rootDir)));
  const reachableCss = [...reachable].filter((file) => file.endsWith('.css')).sort();
  const requiredConcerns = registry.requiredConcerns || Object.keys(registry.concerns || {});
  const canonicalByConcern = new Map();
  const canonicalPaths = new Set();
  const metadataByFile = new Map();
  const historicalOwners = new Set();
  const duplicateOwners = new Set();
  const unknownOwners = new Set();
  const activePatchLayers = new Set();
  const concernMismatchFiles = new Set();
  const concernMismatches = [];
  const invalidScopedConsumerBoundaries = new Set();
  const runtimeStyleOwners = new Set();
  const markerTokens = registry.forbiddenRuntimeTokens || [];
  const ownerModel = registry.ownerModel || {};
  const policy = registry.scopedOwnerPolicy || {};
  const incomingCssConsumers = new Map();
  for (const edge of graph.edges || []) {
    if (!edge.to.endsWith('.css')) continue;
    const consumers = incomingCssConsumers.get(edge.to) || new Set();
    consumers.add(edge.from);
    incomingCssConsumers.set(edge.to, consumers);
  }

  // CSS injected by a reachable runtime module is part of the visual runtime
  // contract even when it is not represented by a stylesheet import edge.
  // Historical stage/hotfix markers in such a module therefore invalidate the
  // same SSOT gate as historical CSS in any owner role.
  for (const file of reachable) {
    if (!/\.(?:ts|tsx|js|jsx)$/i.test(file)) continue;
    const source = read(file);
    if (!RUNTIME_STYLE_INJECTION_PATTERN.test(source)) continue;
    runtimeStyleOwners.add(file);
    if (HISTORICAL_OWNER_PATTERN.test(source)) {
      addFailure(failures, `historical stage/hotfix authority remains in reachable runtime style injection: ${file}`);
      historicalOwners.add(file);
    }
  }

  for (const concern of requiredConcerns) {
    const definition = registry.concerns && registry.concerns[concern];
    if (!definition || !definition.owner) {
      addFailure(failures, `missing semantic owner for concern ${concern}`);
      unknownOwners.add(`concern:${concern}`);
      continue;
    }
    if (canonicalByConcern.has(concern)) {
      addFailure(failures, `duplicate registry concern ${concern}`);
      duplicateOwners.add(`concern:${concern}`);
    }
    canonicalByConcern.set(concern, definition.owner);
    canonicalPaths.add(definition.owner);
  }

  const allCanonicalPaths = new Set(Object.values(registry.concerns || {}).map((definition) => definition.owner).filter(Boolean));
  const canonicalDefinitions = new Map();
  for (const definition of Object.values(registry.concerns || {})) {
    if (definition && definition.owner && !canonicalDefinitions.has(definition.owner)) canonicalDefinitions.set(definition.owner, definition);
  }
  for (const [owner, firstDefinition] of canonicalDefinitions) {
    const definition = firstDefinition;
    const concern = Object.entries(registry.concerns || {}).find(([, candidate]) => candidate.owner === owner)?.[0] || '<unknown>';
    const ownerAbsolute = path.join(rootDir, owner);
    if (!fs.existsSync(ownerAbsolute)) {
      addFailure(failures, `owner path missing: ${owner}`);
      unknownOwners.add(owner);
      continue;
    }
    if (!reachable.has(owner)) {
      addFailure(failures, `owner unreachable from runtime graph: ${owner}`);
      unknownOwners.add(owner);
    }
    const metadata = parseOwnerMetadata(read(owner));
    if (!metadata || metadata.invalid) {
      addFailure(failures, `canonical owner metadata missing/invalid: ${owner}`);
      unknownOwners.add(owner);
      continue;
    }
    metadataByFile.set(owner, metadata);
    if (metadata.role !== ownerModel.canonicalRole) addFailure(failures, `canonical owner role invalid: ${owner}`);
    if (!Array.isArray(metadata.concerns) || !metadata.concerns.includes(concern)) {
      addFailure(failures, `owner concern mismatch: ${owner} does not declare ${concern}`);
      duplicateOwners.add(`${owner}:${concern}`);
    }
    if (metadata.scope !== definition.scope) addFailure(failures, `owner scope mismatch: ${owner} expected ${definition.scope}`);
    for (const field of ownerModel.metadataEvidenceRequired || []) {
      if (!metadata[field] || (Array.isArray(metadata[field]) && metadata[field].length === 0)) {
        addFailure(failures, `canonical owner evidence missing (${field}): ${owner}`);
        unknownOwners.add(owner);
      }
    }
    for (const consumer of definition.consumerRoots || []) {
      const consumerAbsolute = path.join(rootDir, consumer);
      if (!fs.existsSync(consumerAbsolute)) addFailure(failures, `consumer path missing: ${consumer}`);
      if (!reachable.has(consumer)) addFailure(failures, `consumer unreachable from runtime graph: ${consumer}`);
    }
  }

  const seenConcernOwners = new Map();
  for (const [file, metadata] of metadataByFile) {
    for (const concern of metadata.concerns || []) {
      const previous = seenConcernOwners.get(concern);
      if (previous && previous !== file) {
        addFailure(failures, `competing semantic owners for ${concern}: ${previous} and ${file}`);
        duplicateOwners.add(concern);
      }
      seenConcernOwners.set(concern, file);
    }
  }
  for (const concern of requiredConcerns) {
    if (seenConcernOwners.get(concern) !== canonicalByConcern.get(concern)) {
      addFailure(failures, `one-owner registry mismatch for ${concern}`);
      duplicateOwners.add(concern);
    }
  }

  for (const file of reachableCss) {
    let metadata;
    try {
      metadata = parseOwnerMetadata(read(file));
    } catch (error) {
      addFailure(failures, `unable to read runtime CSS ${file}: ${error.message}`);
      unknownOwners.add(file);
      continue;
    }
    if (!metadata || metadata.invalid || !metadata.ownerId) {
      addFailure(failures, `UNKNOWN_VISUAL_OWNER: missing metadata for ${file}`);
      unknownOwners.add(file);
      continue;
    }
    metadataByFile.set(file, metadata);
    const source = read(file);
    if (markerTokens.some((token) => source.includes(token))) {
      addFailure(failures, `marker text is not ownership proof: ${file}`);
      historicalOwners.add(file);
    }
    if ((policy.historicalRuntimePatterns || []).some((expression) => new RegExp(expression, 'i').test(file))) {
      addFailure(failures, `historical runtime path is reachable: ${file}`);
      historicalOwners.add(file);
    }
    if (HISTORICAL_OWNER_PATTERN.test(source)) {
      addFailure(failures, `historical stage/hotfix authority remains in runtime CSS role ${metadata.role || '<missing>'}: ${file}`);
      historicalOwners.add(file);
    }
    const mismatches = ownerConcernMismatches({ file, metadata, source });
    for (const mismatch of mismatches) {
      concernMismatches.push(mismatch);
      concernMismatchFiles.add(file);
      addFailure(failures, `CONCERN_MISMATCH ${mismatch.code}: ${mismatch.detail}`);
    }
    if (metadata.role === ownerModel.canonicalRole) {
      if (!allCanonicalPaths.has(file)) {
        addFailure(failures, `canonical role is not registered: ${file}`);
        unknownOwners.add(file);
      }
      if (EXPLICIT_PATCH_PATTERN.test(source) || metadata.activePatchLayer === true) {
        addFailure(failures, `active runtime patch layer remains in canonical owner: ${file}`);
        activePatchLayers.add(file);
      }
    } else if (metadata.role === ownerModel.scopedRole || metadata.role === ownerModel.entryRole) {
      if (metadata.role === ownerModel.scopedRole && metadata.concerns && metadata.concerns.length) {
        addFailure(failures, `DUPLICATE_SEMANTIC_OWNER: scoped file claims concerns: ${file}`);
        duplicateOwners.add(file);
      }
      for (const field of ownerModel.metadataEvidenceRequired || []) {
        if (!metadata[field] || (Array.isArray(metadata[field]) && metadata[field].length === 0)) {
          addFailure(failures, `scoped owner evidence missing (${field}): ${file}`);
          unknownOwners.add(file);
        }
      }
      if (!Array.isArray(metadata.consumerRoots) || !metadata.consumerRoots.length) {
        addFailure(failures, `scoped owner has no consumer graph: ${file}`);
        unknownOwners.add(file);
      }
      if (metadata.role === ownerModel.scopedRole && scopedGlobalAuthority(source).length) {
        addFailure(failures, `scoped adapter owns global shell semantics: ${file}`);
        unknownOwners.add(file);
      }
      validateConsumerRoots({ rootDir, file, metadata, registry, entryOnly: new Set(registry.entryOnly || []), reachable, graph, read, failures, invalidScopedConsumerBoundaries });
      if (metadata.activePatchLayer === true || EXPLICIT_PATCH_PATTERN.test(source)) activePatchLayers.add(file);
    } else {
      addFailure(failures, `UNKNOWN_VISUAL_OWNER: unsupported role ${metadata.role || '<missing>'} in ${file}`);
      unknownOwners.add(file);
    }
  }

  const entryOnly = new Set(registry.entryOnly || []);
  const consumerlessRuntimeCss = reachableCss.filter((file) => {
    if (entryOnly.has(file)) return false;
    const consumers = incomingCssConsumers.get(file) || new Set();
    return ![...consumers].some((consumer) => consumer !== file);
  });
  for (const file of consumerlessRuntimeCss) {
    addFailure(failures, `CONSUMERLESS_CSS_OWNER: no runtime import edge reaches ${file}`);
    unknownOwners.add(file);
  }

  for (const entryPath of entryOnly) {
    if (!reachable.has(entryPath)) addFailure(failures, `entry-only stylesheet is not reachable: ${entryPath}`);
    const metadata = metadataByFile.get(entryPath) || (fs.existsSync(path.join(rootDir, entryPath)) ? parseOwnerMetadata(read(entryPath)) : null);
    if (metadata && metadata.role !== ownerModel.entryRole) addFailure(failures, `entry-only stylesheet must use entrypoint role: ${entryPath}`);
  }

  const importantAudit = auditImportantDeclarations(reachableCss, read, metadataByFile);
  if (importantAudit.UNCLASSIFIED_IMPORTANT > 0) {
    addFailure(failures, `UNCLASSIFIED_IMPORTANT=${importantAudit.UNCLASSIFIED_IMPORTANT}; byFile=${JSON.stringify(importantAudit.byFile)}`);
  }
  if (importantAudit.SPECIFICITY_PATCH_IMPORTANT > 0) {
    addFailure(failures, `SPECIFICITY_PATCH_IMPORTANT=${importantAudit.SPECIFICITY_PATCH_IMPORTANT}`);
  }
  const sourceCssFiles = [];
  const sourceStylesRoot = path.join(rootDir, 'src', 'styles');
  const collectSourceCss = (directory) => {
    if (!fs.existsSync(directory)) return;
    for (const entryItem of fs.readdirSync(directory, { withFileTypes: true })) {
      const candidate = path.join(directory, entryItem.name);
      if (entryItem.isDirectory()) collectSourceCss(candidate);
      else if (entryItem.name.endsWith('.css') && !entryItem.name.includes('.sync-conflict-')) sourceCssFiles.push(rel(candidate, rootDir));
    }
  };
  collectSourceCss(sourceStylesRoot);
  const ownerModuleFiles = reachableCss.filter((file) => /^src\/styles\/owners\/[^/]+\.css$/i.test(file));
  const ownerModuleAudit = ownerModuleFiles.map((file) => {
    const source = read(file);
    const metadata = metadataByFile.get(file) || parseOwnerMetadata(source) || {};
    const consumers = [...(incomingCssConsumers.get(file) || new Set())].sort();
    const selectors = cssSelectors(source);
    const globalSelectors = selectors.filter((selector) => SCOPED_GLOBAL_SELECTOR_PATTERN.test(selector));
    const routeSelectors = selectors.filter((selector) => /(?:route|page|main-|detail|calendar|leads|clients|cases|today|tasks|billing|settings)/i.test(selector));
    const componentSelectors = selectors.filter((selector) => /(?:component|dialog|modal|card|button|form|row|rail|icon|badge)/i.test(selector));
    const historicalMarkers = (source.match(new RegExp(HISTORICAL_OWNER_PATTERN.source, 'gi')) || []).length;
    const historicalCustomProperties = [...source.matchAll(/--stage\d+[a-z0-9_-]*/gi)].map((match) => match[0]);
    const historicalDataAttributes = [...source.matchAll(/data-stage\d+[a-z0-9_-]*/gi)].map((match) => match[0]);
    const importantCount = importantAudit.byFile[file] || 0;
    const mismatches = concernMismatches.filter((mismatch) => mismatch.file === file);
    const realConsumerBoundary = metadata.role === ownerModel.scopedRole
      ? !invalidScopedConsumerBoundaries.has(file)
      : consumers.length > 0;
    return {
      FILE: file,
      ROLE: metadata.role || '<missing>',
      DECLARED_CONCERNS: metadata.concerns || [],
      ACTUAL_CONCERNS: detectActualConcerns(source),
      GLOBAL_SELECTORS: globalSelectors,
      ROUTE_SELECTORS: routeSelectors,
      COMPONENT_SELECTORS: componentSelectors,
      HISTORICAL_MARKERS: historicalMarkers,
      HISTORICAL_CUSTOM_PROPERTIES: historicalCustomProperties,
      HISTORICAL_DATA_ATTRIBUTES: historicalDataAttributes,
      IMPORTANT_COUNT: importantCount,
      CONSUMERS: consumers,
      CONSUMER_BOUNDARY_PROVEN: realConsumerBoundary,
      CONCERN_MISMATCH: mismatches.length > 0,
      DISPOSITION: mismatches.length === 0 ? 'PASS' : 'FAIL',
      MISMATCHES: mismatches,
    };
  });
  const summary = {
    SOURCE_CSS_FILES: sourceCssFiles.length,
    ACTIVE_RUNTIME_CSS_FILES: reachableCss.length,
    OWNER_MODULES: ownerModuleFiles.length,
    SEMANTIC_CONCERNS: requiredConcerns.length,
    CONCERN_MISMATCH_FILES: concernMismatchFiles.size,
    INVALID_SCOPED_CONSUMER_BOUNDARIES: invalidScopedConsumerBoundaries.size,
    activeCssFiles: reachableCss.length,
    ACTIVE_RUNTIME_PATCH_LAYERS: activePatchLayers.size,
    HISTORICAL_STAGE_RUNTIME_OWNERS: historicalOwners.size,
    ACTIVE_RUNTIME_STYLE_OWNERS: runtimeStyleOwners.size,
    COMPETING_VISUAL_OWNERS: duplicateOwners.size,
    UNKNOWN_VISUAL_OWNERS: unknownOwners.size,
    DUPLICATE_SEMANTIC_OWNERS: duplicateOwners.size,
    ONE_OWNER_PER_VISUAL_CONCERN: duplicateOwners.size === 0 && requiredConcerns.every((concern) => seenConcernOwners.get(concern) === canonicalByConcern.get(concern)) ? 'PASS' : 'FAIL',
    activeHistoricalLayers: historicalOwners.size,
    canonicalMarkerTokens: reachableCss.reduce((count, file) => count + markerTokens.reduce((nested, token) => nested + (read(file).match(new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length, 0), 0),
    duplicateConceptualOwners: duplicateOwners.size,
    unknownOwners: unknownOwners.size,
    consumerlessRuntimeCss: consumerlessRuntimeCss.length,
    concerns: requiredConcerns.length,
    importantDeclarationsAudited: importantAudit.total,
    specificityPatchDeclarations: importantAudit.SPECIFICITY_PATCH_IMPORTANT,
    TOTAL_IMPORTANT: importantAudit.total,
    UNCLASSIFIED_IMPORTANT: importantAudit.UNCLASSIFIED_IMPORTANT,
    SPECIFICITY_PATCH_IMPORTANT: importantAudit.SPECIFICITY_PATCH_IMPORTANT,
    LEGITIMATE_BOUNDARY_IMPORTANT: importantAudit.LEGITIMATE_BOUNDARY_IMPORTANT,
    IMPORTANT_FAMILIES: importantAudit.byFamily,
    IMPORTANT_FAMILY_ROWS: importantAudit.familyRows,
    IMPORTANT_BY_FILE: importantAudit.byFile,
    OWNER_MODULE_AUDIT: ownerModuleAudit,
  };
  return { ok: failures.length === 0, failures, summary, reachableCss, metadataByFile, importantAudit, ownerModuleAudit, concernMismatches, invalidScopedConsumerBoundaries, runtimeStyleOwners };
}

function diffAddedLines() {
  let diff = '';
  try {
    diff = execFileSync('git', ['diff', '--unified=0', '--no-color', '--', 'src', 'scripts', 'package.json'], { cwd: root, encoding: 'utf8' });
  } catch {
    return [];
  }
  const entries = [];
  let file = '';
  for (const line of diff.split(/\r?\n/)) {
    if (line.startsWith('+++ b/')) file = line.slice(6);
    else if (line.startsWith('+') && !line.startsWith('+++')) entries.push({ file, text: line.slice(1) });
  }
  return entries;
}

function fail(message, mode) {
  console.error(`LF-UI-SOT-007_${String(mode).toUpperCase()}_FAIL: ${message}`);
  process.exitCode = 1;
}

function checkAddedOwnership(entries, allowedFiles, pattern, label, mode) {
  const findings = entries.filter((entry) => entry.file !== 'fixture' && !allowedFiles.has(entry.file)).filter((entry) => pattern.test(entry.text));
  if (findings.length) fail(`${label}: ${findings.slice(0, 8).map((entry) => `${entry.file}: ${entry.text.trim()}`).join(' | ')}`, mode);
}

function runIcons(mode) {
  const required = [
    ['src/ui-system/icons/SemanticIcon.tsx', ['SemanticIcon', 'semanticIconConfig']],
    ['src/components/ui-system/icon-registry.ts', ['ENTITY_ICON_MAP']],
    ['src/components/ui-system/action-icon-registry.ts', ['ACTION_ICON_MAP']],
    ['src/components/ui-system/ActionIcon.tsx', ['ActionIcon']],
    ['src/components/ui-system/EntityIcon.tsx', ['EntityIcon']],
  ];
  for (const [file, markers] of required) {
    const source = readRepo(file);
    for (const marker of markers) if (!source.includes(marker)) fail(`${file} nie zawiera: ${marker}`, mode);
  }
  const activeAiHeaderFiles = [
    'src/pages/Clients.tsx',
    'src/pages/Leads.tsx',
    'src/pages/Cases.tsx',
    'src/pages/Calendar.tsx',
    'src/pages/LeadDetail.tsx',
    'src/pages/ClientDetail.tsx',
  ];
  for (const file of activeAiHeaderFiles) {
    const source = readRepo(file);
    if (!source.includes('Zapytaj AI')) continue;
    if (/[?✦]\s*Zapytaj AI/.test(source)) {
      fail(`${file} zawiera niekanoniczny placeholder ikony dla „Zapytaj AI”`, mode);
    }
    const labels = source.match(/Zapytaj AI/g)?.length || 0;
    const canonicalIcons = source.match(/<EntityIcon\s+entity=["']ai["']/g)?.length || 0;
    if (canonicalIcons < labels) {
      fail(`${file} musi renderować każdą etykietę „Zapytaj AI” przez EntityIcon(entity="ai")`, mode);
    }
  }
  checkAddedOwnership(diffAddedLines(), new Set(required.map(([file]) => file).concat(['src/lib/source-of-truth/icon-registry.ts'])), /\b(?:[A-Za-z_$][\w$]*)(?:ICON|Icon|icon)(?:_?MAP|_?REGISTRY|_?CONFIG|_?DEFINITIONS?)\b\s*=/, 'nowa lokalna definicja semantic/action icon poza canonical ownerem', mode);
  console.log('LF-UI-SOT-007_SSOT_ICONS_CHECK_OK');
}

function runColors(mode) {
  const required = [
    ['src/components/ui-system/semantic-visual-registry.ts', ['SEMANTIC_VISUAL_MAP']],
    ['src/lib/closeflow-visual-source-truth.ts', ['CLOSEFLOW_VISUAL_SOURCE_TRUTH']],
    ['src/styles/owners/closeflow-foundation.css', ['cf-vst-color-primary']],
    ['src/lib/source-of-truth/visual-owner-registry.json', ['SEMANTIC_COLORS']],
  ];
  for (const [file, markers] of required) {
    const source = readRepo(file);
    for (const marker of markers) if (!source.includes(marker)) fail(`${file} nie zawiera: ${marker}`, mode);
  }
  checkAddedOwnership(diffAddedLines(), new Set(required.map(([file]) => file).concat(['src/components/ui-system/operator-metric-tone-contract.ts', 'src/components/ui-system/metric-icon-tone-registry.ts'])), /\b(?:[A-Za-z_$][\w$]*)(?:COLOR|Color|color|TONE|Tone|tone|BADGE|Badge|badge|SEVERITY|Severity|severity|STATUS|Status|status)(?:_?MAP|_?REGISTRY|_?COLORS|_?TONES)\b\s*=/, 'nowa lokalna mapa semantycznych kolorĂłw/tonĂłw poza canonical ownerem', mode);
  console.log('LF-UI-SOT-007_SSOT_COLORS_CHECK_OK');
}

function runTypography(mode) {
  const required = [
    ['src/lib/closeflow-visual-source-truth.ts', ['CloseFlowTypographyRole', 'CLOSEFLOW_VISUAL_FOUNDATION_TOKENS']],
    ['src/styles/owners/closeflow-foundation.css', ['cf-vst-text-page-title', 'cf-vst-text-label', 'cf-vst-text-metric', 'cf-vst-text-button']],
  ];
  for (const [file, markers] of required) {
    const source = readRepo(file);
    for (const marker of markers) if (!source.includes(marker)) fail(`${file} nie zawiera: ${marker}`, mode);
  }
  checkAddedOwnership(diffAddedLines(), new Set(required.map(([file]) => file)), /\b(?:[A-Za-z_$][\w$]*)(?:TYPOGRAPHY|Typography|typography|TYPE|Type|type|FONT|Font|font)(?:_?MAP|_?ROLES|_?CONFIG|_?SCALE)\b\s*=/, 'nowa lokalna definicja roli typograficznej poza canonical ownerem', mode);
  console.log('LF-UI-SOT-007_TYPOGRAPHY_CHECK_OK');
}

function runCssOwners(mode) {
  const result = validateCssArchitecture();
  if (!result.ok) {
    fail(result.failures.join(' | '), mode);
    return;
  }
  console.log('LF-UI-SOT-007_CSS_OWNERS_CHECK_OK');
  console.log(JSON.stringify(result.summary, null, 2));
}

function runComponentClones(mode) {
  const allowed = new Set(['src/components/ui/button.tsx', 'src/components/ui-system/ActionIcon.tsx', 'src/components/ui-system/MetricTile.tsx', 'src/components/ui-system/OperatorMetricTiles.tsx', 'src/components/ui-system/StatusPill.tsx', 'src/components/ui-system/SurfaceCard.tsx', 'src/components/ui-system/PageShell.tsx', 'src/components/ui-system/PageHero.tsx', 'src/components/ui-system/FormFooter.tsx', 'src/components/ui-system/ListRow.tsx', 'src/components/ui-system/EmptyState.tsx']);
  checkAddedOwnership(diffAddedLines(), allowed, /\b(?:function|const)\s+[A-Za-z_$][\w$]*(?:Button|Card|Tile|Badge|Modal|Dialog|Form|Footer)\b/, 'nowy page-local clone canonicalnego UI', mode);
  console.log('LF-UI-SOT-007_COMPONENT_CLONES_CHECK_OK');
}

function main(argv = process.argv.slice(2)) {
  const mode = argv[0] || 'all';
  if (mode === 'icons' || mode === 'all') runIcons(mode);
  if (mode === 'colors' || mode === 'all') runColors(mode);
  if (mode === 'typography' || mode === 'all') runTypography(mode);
  if (mode === 'css-owners' || mode === 'all') runCssOwners(mode);
  if (mode === 'component-clones' || mode === 'all') runComponentClones(mode);
  if (!['icons', 'colors', 'typography', 'css-owners', 'component-clones', 'all'].includes(mode)) fail(`nieznany tryb: ${mode}`, mode);
  if (process.exitCode) process.exit(process.exitCode);
}

if (require.main === module) main();

module.exports = { runtimeGraph, parseOwnerMetadata, validateCssArchitecture, loadRegistry };
