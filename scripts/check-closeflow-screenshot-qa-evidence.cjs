const fs = require('fs');
const path = require('path');

const root = process.cwd();
const args = new Set(process.argv.slice(2));
const contractOnly = args.has('--contract-only') || process.env.CLOSEFLOW_SCREENSHOT_QA_CONTRACT_ONLY === '1';
const manifestArg = process.argv.find((arg) => arg.startsWith('--manifest='));
const manifestRel = manifestArg
  ? manifestArg.slice('--manifest='.length)
  : (process.env.CLOSEFLOW_SCREENSHOT_QA_MANIFEST || 'docs/ui/screenshot-qa/CLOSEFLOW_SCREENSHOT_QA_EVIDENCE_2026-05-09.json');

const DOC_REL = 'docs/ui/CLOSEFLOW_SCREENSHOT_QA_2026-05-09.md';
const SCRIPT_REL = 'scripts/check-closeflow-screenshot-qa-evidence.cjs';

const VIEWPORTS = [
  { id: 'desktop-1440', width: 1440, minHeight: 800 },
  { id: 'desktop-1280', width: 1280, minHeight: 720 },
  { id: 'mobile-390', width: 390, minHeight: 700 },
];

const ROUTES = [
  { screenId: 'today', routeTemplate: '/today', dynamic: false },
  { screenId: 'tasks', routeTemplate: '/tasks', dynamic: false },
  { screenId: 'leads', routeTemplate: '/leads', dynamic: false },
  { screenId: 'clients', routeTemplate: '/clients', dynamic: false },
  { screenId: 'cases', routeTemplate: '/cases', dynamic: false },
  { screenId: 'calendar', routeTemplate: '/calendar', dynamic: false },
  { screenId: 'ai-drafts', routeTemplate: '/ai-drafts', dynamic: false },
  { screenId: 'notifications', routeTemplate: '/notifications', dynamic: false },
  { screenId: 'templates', routeTemplate: '/templates', dynamic: false },
  { screenId: 'activity', routeTemplate: '/activity', dynamic: false },
  { screenId: 'lead-detail', routeTemplate: '/leads/:id', dynamic: true },
  { screenId: 'client-detail', routeTemplate: '/clients/:id', dynamic: true },
  { screenId: 'case-detail', routeTemplate: '/cases/:id', dynamic: true },
];

function fail(message) {
  throw new Error(message);
}

function abs(rel) {
  return path.join(root, rel);
}

function exists(rel) {
  return fs.existsSync(abs(rel));
}

function read(rel) {
  return fs.readFileSync(abs(rel), 'utf8');
}

function mustExist(rel) {
  if (!exists(rel)) fail(`Missing required file: ${rel}`);
}

function mustInclude(rel, needle) {
  const text = read(rel);
  if (!text.includes(needle)) fail(`${rel} missing required marker: ${needle}`);
}

function readJson(rel) {
  try {
    return JSON.parse(read(rel));
  } catch (error) {
    fail(`Invalid JSON in ${rel}: ${error.message}`);
  }
}

function readPngSize(fileAbs) {
  const buffer = fs.readFileSync(fileAbs);
  const pngSignature = '89504e470d0a1a0a';
  if (buffer.length < 33 || buffer.subarray(0, 8).toString('hex') !== pngSignature) {
    fail(`Screenshot must be a real PNG file: ${path.relative(root, fileAbs)}`);
  }
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  return { width, height };
}

function normalizeRel(fileRel) {
  return String(fileRel || '').replaceAll('\\', '/').replace(/^\.\//, '');
}

function assertPackageScript() {
  mustExist('package.json');
  const pkg = readJson('package.json');
  if (!pkg.scripts || pkg.scripts['check:closeflow-screenshot-qa-evidence'] !== 'node scripts/check-closeflow-screenshot-qa-evidence.cjs') {
    fail('package.json missing script check:closeflow-screenshot-qa-evidence');
  }
}

function assertContract() {
  mustExist(DOC_REL);
  mustExist(SCRIPT_REL);
  assertPackageScript();

  for (const viewport of VIEWPORTS) {
    mustInclude(DOC_REL, viewport.id);
    mustInclude(DOC_REL, String(viewport.width));
  }

  for (const route of ROUTES) {
    mustInclude(DOC_REL, route.screenId);
    mustInclude(DOC_REL, route.routeTemplate);
  }

  mustInclude(DOC_REL, '13 ekranów x 3 viewporty = 39 screenshotów');
  mustInclude(DOC_REL, 'CLOSEFLOW_SCREENSHOT_QA_EVIDENCE_2026-05-09.json');
  mustInclude(SCRIPT_REL, 'CLOSEFLOW_SCREENSHOT_QA_EVIDENCE_CHECK_OK');
}

function assertEvidence() {
  mustExist(manifestRel);

  const manifest = readJson(manifestRel);
  if (manifest.stage !== 'VS-8') fail(`${manifestRel} must contain stage="VS-8"`);
  if (!manifest.capturedAt) fail(`${manifestRel} missing capturedAt`);
  if (!manifest.baseUrl) fail(`${manifestRel} missing baseUrl`);
  if (!Array.isArray(manifest.screenshots)) fail(`${manifestRel} missing screenshots array`);

  const expectedCount = ROUTES.length * VIEWPORTS.length;
  if (manifest.screenshots.length < expectedCount) {
    fail(`${manifestRel} has ${manifest.screenshots.length} screenshots, expected at least ${expectedCount}`);
  }

  const seenKeys = new Set();

  for (const route of ROUTES) {
    for (const viewport of VIEWPORTS) {
      const candidates = manifest.screenshots.filter((entry) =>
        entry &&
        entry.screenId === route.screenId &&
        entry.routeTemplate === route.routeTemplate &&
        entry.viewportId === viewport.id
      );

      const key = `${route.screenId}|${route.routeTemplate}|${viewport.id}`;
      if (candidates.length !== 1) {
        fail(`Expected exactly one screenshot evidence entry for ${key}, got ${candidates.length}`);
      }

      const entry = candidates[0];
      if (seenKeys.has(key)) fail(`Duplicate screenshot evidence key: ${key}`);
      seenKeys.add(key);

      if (entry.status !== 'pass') {
        fail(`Screenshot evidence ${key} must have status="pass", got "${entry.status}"`);
      }

      if (!entry.routeActual || typeof entry.routeActual !== 'string') {
        fail(`Screenshot evidence ${key} missing routeActual`);
      }

      if (route.dynamic) {
        if (entry.routeActual === route.routeTemplate || entry.routeActual.includes(':id')) {
          fail(`Dynamic route ${key} must use a real routeActual, got ${entry.routeActual}`);
        }
      } else if (entry.routeActual !== route.routeTemplate) {
        fail(`Static route ${key} must use routeActual=${route.routeTemplate}, got ${entry.routeActual}`);
      }

      if (entry.width !== viewport.width) {
        fail(`Screenshot evidence ${key} must declare width=${viewport.width}, got ${entry.width}`);
      }

      if (typeof entry.height !== 'number' || entry.height < viewport.minHeight) {
        fail(`Screenshot evidence ${key} must declare height >= ${viewport.minHeight}, got ${entry.height}`);
      }

      const fileRel = normalizeRel(entry.file);
      if (!fileRel) fail(`Screenshot evidence ${key} missing file`);
      if (!fileRel.endsWith('.png')) fail(`Screenshot evidence ${key} must point to .png file, got ${fileRel}`);
      if (fileRel.includes('placeholder') || fileRel.includes('sample')) {
        fail(`Screenshot evidence ${key} must not use placeholder/sample file: ${fileRel}`);
      }

      const fileAbs = abs(fileRel);
      if (!fs.existsSync(fileAbs)) fail(`Screenshot file missing for ${key}: ${fileRel}`);

      const stat = fs.statSync(fileAbs);
      if (stat.size < 8192) {
        fail(`Screenshot file too small for ${key}: ${fileRel} has ${stat.size} bytes`);
      }

      const png = readPngSize(fileAbs);
      if (png.width !== viewport.width) {
        fail(`Screenshot PNG width mismatch for ${key}: expected ${viewport.width}, got ${png.width}`);
      }

      if (png.height < viewport.minHeight) {
        fail(`Screenshot PNG height too small for ${key}: expected >= ${viewport.minHeight}, got ${png.height}`);
      }
    }
  }

  console.log('CLOSEFLOW_SCREENSHOT_QA_EVIDENCE_CHECK_OK');
  console.log(`screenshots=${expectedCount}`);
  console.log(`viewports=${VIEWPORTS.map((item) => item.id).join(',')}`);
  console.log(`routes=${ROUTES.length}`);
  console.log(`manifest=${manifestRel}`);
}

assertContract();

if (contractOnly) {
  console.log('CLOSEFLOW_SCREENSHOT_QA_CONTRACT_CHECK_OK');
  console.log(`viewports=${VIEWPORTS.length}`);
  console.log(`routes=${ROUTES.length}`);
  console.log(`expected_screenshots=${VIEWPORTS.length * ROUTES.length}`);
  console.log('mode=contract-only');
} else {
  assertEvidence();
}
