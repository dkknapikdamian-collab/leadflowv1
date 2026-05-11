const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}

function write(rel, value) {
  fs.writeFileSync(path.join(repo, rel), value, 'utf8');
}

function ensureAppRuntime() {
  const rel = 'src/App.tsx';
  let content = read(rel);

  if (!content.includes("CloseFlowPageHeaderRuntime")) {
    const anchor = "import { PwaInstallPrompt } from './components/PwaInstallPrompt';";
    if (!content.includes(anchor)) {
      throw new Error('APP_IMPORT_ANCHOR_NOT_FOUND');
    }
    content = content.replace(anchor, `${anchor}\nimport CloseFlowPageHeaderRuntime from './components/CloseFlowPageHeaderRuntime';`);
  }

  if (!content.includes('<CloseFlowPageHeaderRuntime enabled={isLoggedIn} />')) {
    const anchor = '        <NotificationRuntime enabled={isLoggedIn} />';
    if (!content.includes(anchor)) {
      throw new Error('APP_RENDER_ANCHOR_NOT_FOUND');
    }
    content = content.replace(anchor, `        <CloseFlowPageHeaderRuntime enabled={isLoggedIn} />\n${anchor}`);
  }

  write(rel, content);
}

function ensureCssBlock(rel, marker, block) {
  let content = read(rel);
  const start = `/* ${marker}_START */`;
  const end = `/* ${marker}_END */`;
  const nextBlock = `${start}\n${block.trim()}\n${end}`;

  const pattern = new RegExp(`/\\* ${marker}_START \\*/[\\s\\S]*?/\\* ${marker}_END \\*/`, 'm');
  if (pattern.test(content)) {
    content = content.replace(pattern, nextBlock);
  } else {
    content = content.trimEnd() + '\n\n' + nextBlock + '\n';
  }

  write(rel, content);
}

function ensureHeaderCss() {
  ensureCssBlock(
    'src/styles/closeflow-page-header.css',
    'CLOSEFLOW_PAGE_HEADER_SOURCE_OF_TRUTH_2026_05_11',
    `
:root {
  --cf-page-header-bg: #ffffff;
  --cf-page-header-bg-soft: #f8fafc;
  --cf-page-header-border: #e2e8f0;
  --cf-page-header-title: #0f172a;
  --cf-page-header-muted: #64748b;
  --cf-page-header-kicker-bg: #eef2ff;
  --cf-page-header-kicker-border: #c7d2fe;
  --cf-page-header-kicker-text: #3730a3;
  --cf-page-header-radius: 28px;
  --cf-page-header-shadow: 0 14px 36px rgba(15, 23, 42, 0.055);
}

[data-closeflow-page-header-system="true"] {
  border: 1px solid var(--cf-page-header-border) !important;
  border-radius: var(--cf-page-header-radius) !important;
  background:
    radial-gradient(circle at 0% 0%, rgba(79, 70, 229, 0.055), transparent 28%),
    linear-gradient(180deg, var(--cf-page-header-bg) 0%, var(--cf-page-header-bg-soft) 100%) !important;
  box-shadow: var(--cf-page-header-shadow) !important;
}

[data-closeflow-page-header-copy-host="true"] {
  min-width: 0;
  max-width: 760px;
}

.cf-page-header-kicker,
[data-closeflow-page-header-system="true"] .kicker,
[data-closeflow-page-header-system="true"] .ai-drafts-kicker,
[data-closeflow-page-header-system="true"] .activity-kicker,
[data-closeflow-page-header-system="true"] .notifications-kicker,
[data-closeflow-page-header-system="true"] .cf-page-hero-kicker {
  display: inline-flex !important;
  width: fit-content !important;
  align-items: center !important;
  border: 1px solid var(--cf-page-header-kicker-border) !important;
  border-radius: 999px !important;
  background: var(--cf-page-header-kicker-bg) !important;
  color: var(--cf-page-header-kicker-text) !important;
  -webkit-text-fill-color: var(--cf-page-header-kicker-text) !important;
  padding: 7px 10px !important;
  font-size: 11px !important;
  font-weight: 850 !important;
  letter-spacing: 0.035em !important;
  line-height: 1 !important;
  text-transform: uppercase !important;
}

[data-closeflow-page-header-system="true"] h1 {
  color: var(--cf-page-header-title) !important;
  -webkit-text-fill-color: var(--cf-page-header-title) !important;
}

.cf-page-header-description {
  margin: 8px 0 0 !important;
  max-width: 760px;
  color: var(--cf-page-header-muted) !important;
  -webkit-text-fill-color: var(--cf-page-header-muted) !important;
  font-size: 14px !important;
  line-height: 1.55 !important;
  font-weight: 520 !important;
}

[data-closeflow-page-header-system="true"] .head-actions,
[data-closeflow-page-header-system="true"] .ai-drafts-header-actions,
[data-closeflow-page-header-system="true"] .activity-header-actions,
[data-closeflow-page-header-system="true"] .notifications-header-actions,
[data-closeflow-page-header-system="true"] .cf-page-hero-actions {
  gap: 8px !important;
}

@media (max-width: 720px) {
  [data-closeflow-page-header-system="true"] {
    align-items: stretch !important;
  }

  [data-closeflow-page-header-copy-host="true"] {
    max-width: 100%;
  }

  .cf-page-header-description {
    font-size: 13px !important;
  }
}
`
  );
}

function ensureActionCss() {
  ensureCssBlock(
    'src/styles/closeflow-action-tokens.css',
    'CLOSEFLOW_HEADER_ACTION_TOKENS_2026_05_11',
    `
:root {
  --cf-header-action-primary-bg: #2563eb;
  --cf-header-action-primary-bg-hover: #1d4ed8;
  --cf-header-action-primary-border: #1d4ed8;
  --cf-header-action-primary-text: #ffffff;

  --cf-header-action-ai-bg: #4f46e5;
  --cf-header-action-ai-bg-hover: #4338ca;
  --cf-header-action-ai-border: #4338ca;
  --cf-header-action-ai-text: #ffffff;

  --cf-header-action-secondary-bg: #ffffff;
  --cf-header-action-secondary-bg-hover: #f8fafc;
  --cf-header-action-secondary-border: #cbd5e1;
  --cf-header-action-secondary-text: #334155;

  --cf-header-action-danger-bg: #fff1f2;
  --cf-header-action-danger-bg-hover: #ffe4e6;
  --cf-header-action-danger-border: #fecdd3;
  --cf-header-action-danger-text: #be123c;

  --cf-header-action-focus: rgba(37, 99, 235, 0.22);
}

.cf-header-action {
  border-radius: 14px !important;
  min-height: 40px !important;
  font-weight: 820 !important;
  transition: background-color 160ms ease, border-color 160ms ease, color 160ms ease, box-shadow 160ms ease, transform 160ms ease !important;
}

.cf-header-action:hover {
  transform: translateY(-1px);
}

.cf-header-action:focus-visible {
  outline: none !important;
  box-shadow: 0 0 0 3px var(--cf-header-action-focus) !important;
}

.cf-header-action--primary {
  background: var(--cf-header-action-primary-bg) !important;
  border-color: var(--cf-header-action-primary-border) !important;
  color: var(--cf-header-action-primary-text) !important;
  -webkit-text-fill-color: var(--cf-header-action-primary-text) !important;
}

.cf-header-action--primary:hover {
  background: var(--cf-header-action-primary-bg-hover) !important;
}

.cf-header-action--ai {
  background: var(--cf-header-action-ai-bg) !important;
  border-color: var(--cf-header-action-ai-border) !important;
  color: var(--cf-header-action-ai-text) !important;
  -webkit-text-fill-color: var(--cf-header-action-ai-text) !important;
}

.cf-header-action--ai:hover {
  background: var(--cf-header-action-ai-bg-hover) !important;
}

.cf-header-action--secondary {
  background: var(--cf-header-action-secondary-bg) !important;
  border-color: var(--cf-header-action-secondary-border) !important;
  color: var(--cf-header-action-secondary-text) !important;
  -webkit-text-fill-color: var(--cf-header-action-secondary-text) !important;
}

.cf-header-action--secondary:hover {
  background: var(--cf-header-action-secondary-bg-hover) !important;
}

.cf-header-action--danger {
  background: var(--cf-header-action-danger-bg) !important;
  border-color: var(--cf-header-action-danger-border) !important;
  color: var(--cf-header-action-danger-text) !important;
  -webkit-text-fill-color: var(--cf-header-action-danger-text) !important;
}

.cf-header-action--danger:hover {
  background: var(--cf-header-action-danger-bg-hover) !important;
}
`
  );
}

ensureAppRuntime();
ensureHeaderCss();
ensureActionCss();

console.log('CLOSEFLOW_PAGE_HEADERS_SOURCE_OF_TRUTH_PATCH_OK');
