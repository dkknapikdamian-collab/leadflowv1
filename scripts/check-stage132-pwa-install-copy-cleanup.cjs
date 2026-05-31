/* CLOSEFLOW_STAGE132_PWA_INSTALL_COPY_CLEANUP_GUARD */
const fs = require('fs');
const path = require('path');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function mustInclude(file, marker) {
  const content = read(file);
  if (!content.includes(marker)) {
    throw new Error(`${file} missing required marker: ${marker}`);
  }
}

function mustNotInclude(file, marker) {
  const content = read(file);
  if (content.includes(marker)) {
    throw new Error(`${file} contains forbidden copy/code marker: ${marker}`);
  }
}

const pwa = 'src/components/PwaInstallPrompt.tsx';

mustInclude(pwa, 'Dodaj CloseFlow do ekranu głównego telefonu');
mustInclude(pwa, 'Otwieraj aplikację jak zwykłą apkę.');
mustInclude(pwa, 'Dodaj do ekranu');
mustInclude(pwa, 'Nie teraz');
mustInclude(pwa, 'data-pwa-mobile-simple-copy="true"');
mustInclude(pwa, 'return Boolean(installPrompt);');

[
  'Service worker',
  'cache’uje',
  'cache',
  'API, auth',
  'dane biznesowe',
  'Dane klientów',
  'sejfem offline',
  'menu przeglądarki',
  'Udostępnij',
  'Do ekranu początkowego',
  'manualPromptReady',
  'isMobileLike',
  'isIosSafariLike',
  'manualCopy',
  'ShieldCheck',
].forEach((marker) => mustNotInclude(pwa, marker));

const app = read('src/App.tsx');
[
  "UiPreviewModeBadge",
  "closeflow-ui-preview-auth-stage131.css",
].forEach((marker) => {
  if (app.includes(marker)) {
    throw new Error(`src/App.tsx still contains Stage131 leftover: ${marker}`);
  }
});

[
  'src/lib/ui-preview-auth.ts',
  'src/components/UiPreviewModeBadge.tsx',
  'src/styles/closeflow-ui-preview-auth-stage131.css',
  'scripts/check-stage131-ui-preview-auth.cjs',
].forEach((rel) => {
  if (fs.existsSync(path.join(root, rel))) {
    throw new Error(`Stage131 leftover still exists: ${rel}`);
  }
});

console.log('OK: Stage132 PWA install copy cleanup guard passed.');
