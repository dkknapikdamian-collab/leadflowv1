const fs = require('fs');
const path = require('path');

const root = process.cwd();
const appPath = path.join(root, 'src', 'App.tsx');
const previewPath = path.join(root, 'src', 'pages', 'UiPreviewVNext.tsx');
const previewFullPath = path.join(root, 'src', 'pages', 'UiPreviewVNextFull.tsx');

const fail = (message) => {
  console.error(`[STAGE232A FAIL] ${message}`);
  process.exitCode = 1;
};

const read = (filePath) => {
  if (!fs.existsSync(filePath)) {
    fail(`Missing file: ${path.relative(root, filePath)}`);
    return '';
  }
  return fs.readFileSync(filePath, 'utf8');
};

const app = read(appPath);
const preview = read(previewPath);
const previewFull = read(previewFullPath);

const requireMatch = (condition, message) => {
  if (!condition) fail(message);
};

requireMatch(
  /const\s+isDevelopmentPreviewEnabled\s*=\s*import\.meta\.env\.DEV\s*;/.test(app),
  'App.tsx must define isDevelopmentPreviewEnabled from import.meta.env.DEV.'
);

const previewRoutePattern = /<Route\s+path="\/ui-preview-vnext"\s+element=\{isDevelopmentPreviewEnabled\s*\?\s*<UiPreviewVNext\s*\/>\s*:\s*<Navigate\s+to="\/login"\s+replace\s*\/>\}\s*\/>/s;
const previewFullRoutePattern = /<Route\s+path="\/ui-preview-vnext-full"\s+element=\{isDevelopmentPreviewEnabled\s*\?\s*<UiPreviewVNextFull\s*\/>\s*:\s*<Navigate\s+to="\/login"\s+replace\s*\/>\}\s*\/>/s;

requireMatch(
  previewRoutePattern.test(app),
  '/ui-preview-vnext must be gated by isDevelopmentPreviewEnabled and redirect to /login in production.'
);

requireMatch(
  previewFullRoutePattern.test(app),
  '/ui-preview-vnext-full must be gated by isDevelopmentPreviewEnabled and redirect to /login in production.'
);

requireMatch(
  !/<Route\s+path="\/ui-preview-vnext"\s+element=\{<UiPreviewVNext\s*\/>\}\s*\/>/.test(app),
  '/ui-preview-vnext must not directly render UiPreviewVNext publicly.'
);

requireMatch(
  !/<Route\s+path="\/ui-preview-vnext-full"\s+element=\{<UiPreviewVNextFull\s*\/>\}\s*\/>/.test(app),
  '/ui-preview-vnext-full must not directly render UiPreviewVNextFull publicly.'
);

const realLookingFixturePatterns = [
  /Alfred\s+Panek/i,
  /Damian\s+Maciejczyk/i,
  /00\s+1\s+813-812-7000/i,
  /791785879/i,
  /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
];

const previewHasRealLookingFixtures = realLookingFixturePatterns.some((pattern) => pattern.test(preview) || pattern.test(previewFull));
if (previewHasRealLookingFixtures) {
  requireMatch(
    previewRoutePattern.test(app) && previewFullRoutePattern.test(app),
    'Real-looking preview fixture data exists, so both preview routes must stay dev-only.'
  );
}

const directPreviewRouteCount = (app.match(/path="\/ui-preview-vnext(?:-full)?"/g) || []).length;
requireMatch(
  directPreviewRouteCount === 2,
  `Expected exactly two STAGE232A preview routes, found ${directPreviewRouteCount}.`
);

if (process.exitCode) {
  process.exit();
}

console.log('[STAGE232A PASS] Public preview routes are locked to import.meta.env.DEV and production redirects to /login.');
