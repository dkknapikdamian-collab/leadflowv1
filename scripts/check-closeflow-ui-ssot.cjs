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

const HISTORICAL_OWNER_PATTERN = /(?:^|[^a-z])(?:stage\d+[a-z0-9_-]*|hotfix[a-z0-9_-]*|final[-_]?lock|packet\d+)(?:$|[^a-z])/i;
const EXPLICIT_PATCH_PATTERN = /(?:activePatchLayer\s*:\s*true|PATCH_LAYER|specificity[-_ ]patch|runtime[-_ ]hotfix)/i;

/**
 * Validate the semantic owner registry against the active import graph.
 * Ownership is proven by registry + metadata + reachable consumers. Marker text
 * is intentionally never treated as proof and historical semantic authorities
 * are rejected for canonical owners.
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
    if (markerTokens.some((token) => read(file).includes(token))) {
      addFailure(failures, `marker text is not ownership proof: ${file}`);
      historicalOwners.add(file);
    }
    if ((policy.historicalRuntimePatterns || []).some((expression) => new RegExp(expression, 'i').test(file))) {
      addFailure(failures, `historical runtime path is reachable: ${file}`);
      historicalOwners.add(file);
    }
    if (metadata.role === ownerModel.canonicalRole) {
      if (!allCanonicalPaths.has(file)) {
        addFailure(failures, `canonical role is not registered: ${file}`);
        unknownOwners.add(file);
      }
      const source = read(file);
      if (HISTORICAL_OWNER_PATTERN.test(source)) {
        addFailure(failures, `historical stage/hotfix authority remains in canonical owner: ${file}`);
        historicalOwners.add(file);
      }
      if (EXPLICIT_PATCH_PATTERN.test(source) || metadata.activePatchLayer === true) {
        addFailure(failures, `active runtime patch layer remains in canonical owner: ${file}`);
        activePatchLayers.add(file);
      }
    } else if (metadata.role === ownerModel.scopedRole || metadata.role === ownerModel.entryRole) {
      if (metadata.concerns && metadata.concerns.length) {
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
      if (metadata.activePatchLayer === true || EXPLICIT_PATCH_PATTERN.test(read(file))) activePatchLayers.add(file);
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

  const importantDeclarationsAudited = reachableCss.reduce((count, file) => count + (read(file).match(/!important\b/g) || []).length, 0);
  const specificityPatchDeclarations = reachableCss.reduce((count, file) => count + (read(file).match(/!important\b/g) || []).filter(() => EXPLICIT_PATCH_PATTERN.test(read(file))).length, 0);
  const summary = {
    activeCssFiles: reachableCss.length,
    ACTIVE_RUNTIME_PATCH_LAYERS: activePatchLayers.size,
    HISTORICAL_STAGE_RUNTIME_OWNERS: historicalOwners.size,
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
    importantDeclarationsAudited,
    specificityPatchDeclarations,
  };
  return { ok: failures.length === 0, failures, summary, reachableCss, metadataByFile };
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
