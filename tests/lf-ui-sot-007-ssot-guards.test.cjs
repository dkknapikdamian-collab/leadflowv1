const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const guardPath = path.join(root, 'scripts', 'check-closeflow-ui-ssot.cjs');
const { validateCssArchitecture } = require(guardPath);

function metadata({ ownerId, concerns = [], scope = 'global', role, boundary, whyNotGlobal, whyNotDuplicate, consumerRoots = ['src/consumer.ts'] }) {
  return `/* LF-UI-SOT-007_OWNER ${JSON.stringify({
    schema: 'LF-UI-SOT-007.owner.v1',
    ownerId,
    concerns,
    scope,
    consumerRoots,
    role,
    boundary,
    whyNotGlobal,
    whyNotDuplicate,
    activePatchLayer: false,
    historicalImplementationHooks: [],
  })} */`;
}

function fixture({ ownerSource, extraFiles = {}, extraEdges = [], concerns = ['TYPOGRAPHY'], forbiddenRuntimeTokens = ['LF-UI-SOT-007_CANONICAL_CSS_OWNER_BEGIN', 'LF-UI-SOT-007_CANONICAL_CSS_OWNER_END'], ownerPath = 'src/owners/typography.css', registryOverrides = {} }) {
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'lf-ui-sot-007-semantic-'));
  const files = {
    [ownerPath]: ownerSource,
    'src/consumer.ts': "export const consumer = 'dialog-local';",
    ...extraFiles,
  };
  for (const [relative, source] of Object.entries(files)) {
    const absolute = path.join(fixtureRoot, relative);
    fs.mkdirSync(path.dirname(absolute), { recursive: true });
    fs.writeFileSync(absolute, source, 'utf8');
  }
  const graphFiles = new Set(Object.keys(files).map((relative) => path.join(fixtureRoot, relative)));
  const consumerAbsolute = path.join(fixtureRoot, 'src/consumer.ts');
  const graph = {
    files: graphFiles,
    edges: [...graphFiles]
      .filter((file) => file.endsWith('.css'))
      .map((file) => ({ from: 'src/consumer.ts', to: path.relative(fixtureRoot, file).replaceAll('\\', '/'), specifier: `./${path.relative(path.dirname(consumerAbsolute), file).replaceAll('\\', '/')}` })),
  };
  graph.edges.push(...extraEdges.map(({ from, to, specifier = `./${path.basename(to)}` }) => ({ from, to, specifier })));
  const registry = {
    schema: 'LF-UI-SOT-007.semantic-visual-owner-registry.test.v1',
    visualEntry: 'src/styles/closeflow-visual-source-truth.css',
    requiredConcerns: concerns,
    concerns: Object.fromEntries(concerns.map((concern) => [concern, {
      owner: concern === 'MODALS' ? 'src/owners/modals.css' : ownerPath,
      scope: 'global',
      consumerRoots: ['src/consumer.ts'],
    }])),
    entryOnly: [],
    ownerModel: {
      canonicalRole: 'canonical-owner',
      scopedRole: 'scoped-adapter',
      entryRole: 'entrypoint',
      metadataEvidenceRequired: ['role', 'boundary', 'whyNotGlobal', 'whyNotDuplicate'],
    },
    scopedOwnerPolicy: { allowedScopes: ['global', 'component-scoped', 'route-scoped', 'entry'] },
    forbiddenRuntimeTokens,
    ...registryOverrides,
  };
  if (concerns.includes('MODALS') && !files['src/owners/modals.css']) {
    const absolute = path.join(fixtureRoot, 'src/owners/modals.css');
    fs.mkdirSync(path.dirname(absolute), { recursive: true });
    fs.writeFileSync(absolute, metadata({ ownerId: 'semantic:modals', concerns: ['MODALS'], role: 'canonical-owner', boundary: 'global-semantic', whyNotGlobal: 'Registered modal owner.', whyNotDuplicate: 'Only modal owner.' }), 'utf8');
    graph.files.add(absolute);
    graph.edges.push({ from: 'src/consumer.ts', to: 'src/owners/modals.css', specifier: './owners/modals.css' });
  }
  const result = validateCssArchitecture({ rootDir: fixtureRoot, registry, graph });
  fs.rmSync(fixtureRoot, { recursive: true, force: true });
  return result;
}

function canonical(concerns = ['TYPOGRAPHY'], body = '') {
  return `${metadata({ ownerId: `semantic:${concerns.join('-').toLowerCase()}`, concerns, role: 'canonical-owner', boundary: 'global-semantic', whyNotGlobal: 'This file is the registered semantic owner for its declared concerns.', whyNotDuplicate: 'The registry maps each declared concern to this single reachable owner.' })}\n${body}`;
}

function scoped(body = '', consumerRoots = ['src/consumer.ts']) {
  return `${metadata({ ownerId: 'scoped:dialog-adapter', concerns: [], scope: 'component-scoped', role: 'scoped-adapter', boundary: 'component', whyNotGlobal: 'This stylesheet is limited to the dialog consumer boundary.', whyNotDuplicate: 'It claims no semantic concern.', consumerRoots })}\n${body}`;
}

test('the CSS guard is import-safe and does not execute on require', () => {
  const result = spawnSync(process.execPath, ['-e', `require(${JSON.stringify(guardPath)})`], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, '');
});

test('negative A: marker-wrapped copied stage CSS is rejected', () => {
  const result = fixture({ ownerSource: canonical(['TYPOGRAPHY'], '/* LF-UI-SOT-007_CANONICAL_CSS_OWNER_BEGIN */\n.stage-copied { font-size: 1rem; }\n/* LF-UI-SOT-007_CANONICAL_CSS_OWNER_END */') });
  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /marker text is not ownership proof/);
});

test('negative B: a renamed hotfix copied into a canonical owner is rejected', () => {
  const result = fixture({ ownerSource: canonical(['TYPOGRAPHY'], '.hotfix-copied { font-size: 1rem; }') });
  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /historical stage\/hotfix authority/);
});

test('negative C: a second conceptual typography owner is rejected', () => {
  const result = fixture({
    ownerSource: canonical(),
    extraFiles: {
      'src/scoped/duplicate.css': metadata({ ownerId: 'semantic:duplicate-typography', concerns: ['TYPOGRAPHY'], role: 'scoped-adapter', boundary: 'component', whyNotGlobal: 'duplicate', whyNotDuplicate: 'duplicate' }) + '\n.duplicate { font-size: 1rem; }',
    },
  });
  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /DUPLICATE_SEMANTIC_OWNER|competing semantic owners/);
});

test('negative D: a second conceptual modal owner is rejected', () => {
  const result = fixture({
    concerns: ['TYPOGRAPHY', 'MODALS'],
    ownerSource: canonical(),
    extraFiles: {
      'src/scoped/duplicate-modal.css': metadata({ ownerId: 'semantic:duplicate-modal', concerns: ['MODALS'], role: 'scoped-adapter', boundary: 'component', whyNotGlobal: 'duplicate', whyNotDuplicate: 'duplicate' }) + '\n.duplicate-modal { display: grid; }',
    },
  });
  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /DUPLICATE_SEMANTIC_OWNER|competing semantic owners/);
});

test('negative E control: legitimate scoped CSS with an evidence boundary passes', () => {
  const result = fixture({
    ownerSource: canonical(),
    extraFiles: {
      'src/scoped/dialog-adapter.css': scoped('.dialog-local { display: grid; }'),
    },
  });
  assert.equal(result.ok, true, result.failures.join('\n'));
  assert.equal(result.summary.ONE_OWNER_PER_VISUAL_CONCERN, 'PASS');
});

test('negative F control: a legitimate semantic canonical owner passes', () => {
  const result = fixture({ ownerSource: canonical(['TYPOGRAPHY'], ':root { --cf-font-body: 1rem; }') });
  assert.equal(result.ok, true, result.failures.join('\n'));
  assert.equal(result.summary.DUPLICATE_SEMANTIC_OWNERS, 0);
});

test('negative G: a scoped adapter carrying STAGE216L authority is rejected', () => {
  const result = fixture({
    ownerSource: canonical(),
    extraFiles: {
      'src/scoped/client-detail.css': scoped('/* STAGE216L copied semantic contract */\n.dialog-local { display: grid; }'),
    },
  });
  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /historical stage\/hotfix authority/);
});

test('negative H: a scoped adapter carrying a --stage216l-* token is rejected', () => {
  const result = fixture({
    ownerSource: canonical(),
    extraFiles: {
      'src/scoped/client-detail.css': scoped('.dialog-local { --stage216l-surface: #fff; }'),
    },
  });
  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /historical stage\/hotfix authority/);
});

test('negative I: a scoped adapter carrying a data-stage216m-* selector is rejected', () => {
  const result = fixture({
    ownerSource: canonical(),
    extraFiles: {
      'src/scoped/client-notes.css': scoped('.dialog-local[data-stage216m-notes-source="true"] { display: grid; }'),
    },
  });
  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /historical stage\/hotfix authority/);
});

test('negative I2: a scoped adapter carrying an equivalent numbered semantic token is rejected', () => {
  const result = fixture({
    ownerSource: canonical(),
    extraFiles: {
      'src/scoped/client-detail.css': scoped('.dialog-local { --cf216l-surface: #fff; }'),
    },
  });
  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /historical stage\/hotfix authority/);
});

test('negative J: a route-scoped owner whose only consumer is the global visual entry is rejected', () => {
  const result = fixture({
    ownerSource: canonical(),
    extraFiles: {
      'src/styles/closeflow-visual-source-truth.css': metadata({ ownerId: 'entry:visual', concerns: [], scope: 'entry', role: 'entrypoint', boundary: 'runtime-entrypoint', whyNotGlobal: 'Import boundary only.', whyNotDuplicate: 'Import boundary only.' }),
      'src/scoped/route-adapter.css': scoped('.dialog-local { display: grid; }', ['src/styles/closeflow-visual-source-truth.css']),
    },
  });
  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /real route\/component consumer|global visual entry/);
});

test('negative K: a scoped adapter defining :root/body/global shell semantics is rejected', () => {
  const result = fixture({
    ownerSource: canonical(),
    extraFiles: {
      'src/scoped/global-shell.css': scoped(':root { --shell-color: #fff; }\nbody { background: #fff; }'),
    },
  });
  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /global shell semantics/);
});

test('negative L: CALENDAR owner carrying generic metrics/cards is rejected', () => {
  const result = fixture({
    ownerPath: 'src/owners/calendar.css',
    concerns: ['CALENDAR'],
    ownerSource: canonical(['CALENDAR'], ':root { --eliteflow-metric-gap: 18px; }\n.stats-grid .metric-card { color: red; }\n.cf-top-metric-tile { background: white; }'),
  });
  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /CALENDAR_GENERIC_METRICS|generic metric/);
});

test('negative M: RESPONSIVE_DENSITY owner carrying semantic colors/actions/icons/shell is rejected', () => {
  const result = fixture({
    ownerPath: 'src/owners/responsive.css',
    concerns: ['RESPONSIVE_DENSITY'],
    ownerSource: canonical(['RESPONSIVE_DENSITY'], ':root { --responsive-bg: #fff; }\nbody .sidebar { background: #fff; color: #111; }\nbutton .icon { fill: red; }'),
  });
  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /RESPONSIVE_(?:SEMANTIC|BASE_SHELL)/);
});

test('negative N: a scoped adapter with global shell and generic semantic selectors is rejected', () => {
  const result = fixture({
    ownerSource: canonical(),
    extraFiles: {
      'src/scoped/global-authority.css': scoped(':root { --shell-bg: #fff; }\nbody { background: #fff; }\n.sidebar { color: red; }\n.card { padding: 1rem; }\n.button { color: blue; }\n.metric { font-size: 2rem; }'),
    },
  });
  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /SCOPED_GLOBAL_AUTHORITY|SCOPED_GENERIC_SEMANTIC_AUTHORITY/);
});

test('negative O: BUTTONS_ACTIONS owner carrying modal/form-footer authority is rejected', () => {
  const result = fixture({
    ownerPath: 'src/owners/actions.css',
    concerns: ['BUTTONS_ACTIONS'],
    ownerSource: canonical(['BUTTONS_ACTIONS'], '.modal { display: grid; }\n.form-footer { display: flex; }\nbutton { color: red; }'),
  });
  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /ACTIONS_MODAL_AUTHORITY/);
});

test('negative P: foundation/token owner carrying generic card/dialog/button authority is rejected', () => {
  const result = fixture({
    ownerPath: 'src/owners/foundation.css',
    concerns: ['TOKENS'],
    ownerSource: canonical(['TOKENS'], '.cf-vst-card { display: grid; }\n.cf-vst-dialog { display: grid; }\n.cf-vst-button-primary { color: white; }'),
  });
  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /FOUNDATION_COMPONENT_AUTHORITY/);
});

test('negative Q: neutral filename with high-specificity !important and no boundary is rejected', () => {
  const result = fixture({
    ownerSource: canonical(['TYPOGRAPHY'], 'html body #root .neutral .button { color: red !important; }'),
  });
  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /SPECIFICITY_PATCH_IMPORTANT|UNCLASSIFIED_IMPORTANT/);
});

test('negative R: SEARCH owner carrying right-rail authority is rejected', () => {
  const result = fixture({
    ownerPath: 'src/owners/search.css',
    concerns: ['SEARCH'],
    ownerSource: canonical(['SEARCH'], '.clients-right-rail { background: white; }\n.cf-main-search { display: flex; }'),
  });
  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /SEARCH_UNRELATED_AUTHORITY/);
});

test('negative S: SURFACES owner carrying route rail authority is rejected', () => {
  const result = fixture({
    ownerPath: 'src/owners/surfaces.css',
    concerns: ['SURFACES'],
    ownerSource: canonical(['SURFACES'], '.calendar-week-plan { background: white; }\n.cf-vst-card { display: grid; }'),
  });
  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /SURFACES_ROUTE_AUTHORITY/);
});

test('negative T: a scoped owner omitting a direct runtime consumer is rejected', () => {
  const result = fixture({
    ownerSource: canonical(),
    extraFiles: {
      'src/scoped/dialog-adapter.css': scoped('.dialog-local { display: grid; }', ['src/consumer.ts']),
      'src/route.ts': "import './scoped/dialog-adapter.css';",
    },
    extraEdges: [
      { from: 'src/route.ts', to: 'src/scoped/dialog-adapter.css' },
    ],
  });
  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /consumerRoots omit direct runtime consumer/);
});

test('active AI header actions use the canonical EntityIcon source', () => {
  const activeAiHeaderFiles = [
    'src/pages/Clients.tsx',
    'src/pages/Leads.tsx',
    'src/pages/Cases.tsx',
    'src/pages/Calendar.tsx',
    'src/pages/LeadDetail.tsx',
    'src/pages/ClientDetail.tsx',
  ];
  for (const relative of activeAiHeaderFiles) {
    const source = fs.readFileSync(path.join(root, relative), 'utf8');
    const labels = source.match(/Zapytaj AI/g) || [];
    const canonicalIcons = source.match(/<EntityIcon\s+entity=["']ai["']/g) || [];
    assert.equal(/[?✦]\s*Zapytaj AI/.test(source), false, `${relative} contains a non-canonical AI icon placeholder`);
    assert.ok(canonicalIcons.length >= labels.length, `${relative} must render every AI label through EntityIcon(entity="ai")`);
  }
});
