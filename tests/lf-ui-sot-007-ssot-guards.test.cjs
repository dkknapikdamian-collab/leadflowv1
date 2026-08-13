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

function fixture({ ownerSource, extraFiles = {}, concerns = ['TYPOGRAPHY'], forbiddenRuntimeTokens = ['LF-UI-SOT-007_CANONICAL_CSS_OWNER_BEGIN', 'LF-UI-SOT-007_CANONICAL_CSS_OWNER_END'] }) {
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'lf-ui-sot-007-semantic-'));
  const files = {
    'src/owners/typography.css': ownerSource,
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
  const registry = {
    schema: 'LF-UI-SOT-007.semantic-visual-owner-registry.test.v1',
    visualEntry: 'src/styles/closeflow-visual-source-truth.css',
    requiredConcerns: concerns,
    concerns: Object.fromEntries(concerns.map((concern) => [concern, {
      owner: `src/owners/${concern === 'MODALS' ? 'modals' : 'typography'}.css`,
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
