import { useEffect } from 'react';

const STAGE212V_VISUAL_RUNTIME_FORCE = 'STAGE212V_NOTIFICATIONS_METRIC_WIDTH_RUNTIME_REPAIR';

const css = `
:root {
  --cf-canvas: #f1f5f9;
  --cf-surface: #ffffff;
  --cf-surface-soft: #f8fafc;
  --cf-border: #e2e8f0;
  --cf-admin-dark: rgba(15, 23, 42, 0.96);
}

html,
body,
#root,
.app,
.app.closeflow-visual-stage01,
.cf-html-shell,
main.main,
.view,
.view.active,
[data-shell-main="true"],
[data-shell-content="true"],
.cf-route-work-root,
.cf-html-view,
.main-leads-html,
.main-clients-html,
.main-cases-html,
.activity-vnext-page,
.ai-drafts-vnext-page,
.notifications-vnext-page,
.billing-vnext-page,
.support-vnext-page,
.settings-vnext-page,
.main-tasks-html,
.main-calendar-html,
.main-activity-html,
.main-notifications-html,
.main-billing-html,
.main-ai-drafts-html,
.main-support-html,
.main-settings-html {
  background: var(--cf-canvas) !important;
  background-color: var(--cf-canvas) !important;
  background-image: none !important;
}

.layout-list,
.layout-list.w-full,
.layout-list.w-full.max-w-none,
.layout-main,
.layout-content,
.content-shell,
.records-shell,
.records-layout,
.entity-list-layout,
.cf-list-layout,
.cf-record-list,
.tasks-operator-metric-grid,
.notifications-stats-grid,
.notifications-today-parity-grid,
.cf-operator-metric-grid,
main.cf-route-work-root > section.grid,
main.cf-route-work-root section.grid.gap-3,
main.cf-route-work-root section.grid.gap-4 {
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
}

.bg-card:not(section),
.card,
[data-cf-card="true"],
.cf-operator-metric-tile,
[class*="right-card"],
[class*="list-card"],
[class*="toolbar-card"],
[class*="record-card"],
[class*="entity-card"],
[class*="summary-card"] {
  background: var(--cf-surface) !important;
  background-color: var(--cf-surface) !important;
}

.admin-debug-toolbar {
  background: var(--cf-admin-dark) !important;
  color: #f8fafc !important;
  border-color: rgba(148, 163, 184, 0.42) !important;
  box-shadow: 0 12px 36px rgba(15, 23, 42, 0.28) !important;
}

.admin-debug-toolbar > button,
.admin-debug-toolbar button {
  background: rgba(255, 255, 255, 0.08) !important;
  color: #f8fafc !important;
  border-color: rgba(226, 232, 240, 0.22) !important;
}

.nav-btn.active .nav-ico,
.sidebar .nav-btn.active .nav-ico,
a[data-nav-path="/"] .nav-ico,
.sidebar a[data-nav-path="/"] .nav-ico {
  width: 16px !important;
  height: 16px !important;
  min-width: 16px !important;
  padding: 0 !important;
  margin: 0 !important;
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  border: 0 !important;
  box-shadow: none !important;
  outline: 0 !important;
  border-radius: 0 !important;
  color: currentColor !important;
}

.nav-btn.active .nav-ico svg,
.sidebar .nav-btn.active .nav-ico svg,
a[data-nav-path="/"] .nav-ico svg,
.sidebar a[data-nav-path="/"] .nav-ico svg {
  width: 15px !important;
  height: 15px !important;
  color: currentColor !important;
  stroke: currentColor !important;
  fill: none !important;
}

/* STAGE212V_NOTIFICATIONS_METRIC_WIDTH_RUNTIME_REPAIR */
body #root .notifications-vnext-page {
  width: 100% !important;
  max-width: none !important;
  box-sizing: border-box !important;
}

body #root .notifications-stats-grid {
  width: 100% !important;
  max-width: none !important;
  margin: 0 0 22px !important;
  display: grid !important;
  grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
  gap: 12px !important;
}

body #root .notifications-vnext-shell {
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
}

@media (max-width: 1180px) {
  body #root .notifications-stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }
}

@media (max-width: 640px) {
  body #root .notifications-stats-grid {
    grid-template-columns: 1fr !important;
  }
}

/* STAGE212Y_TODAY_ICON_SIZE_FINAL
   Dziś uses the same nav icon frame size as the rest of the sidebar.
   The icon itself is Home, not LayoutDashboard.
*/
body .sidebar a[data-nav-path="/"] .nav-ico,
body a[data-nav-path="/"] .nav-ico,
body .sidebar .nav-btn.active a[data-nav-path="/"] .nav-ico,
body .sidebar .nav-btn.active .nav-ico,
body .nav-btn.active .nav-ico {
  width: 28px !important;
  height: 28px !important;
  min-width: 28px !important;
  max-width: 28px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  flex-shrink: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
  background: rgba(255, 255, 255, 0.10) !important;
  background-color: rgba(255, 255, 255, 0.10) !important;
  background-image: none !important;
  border: 1px solid rgba(255, 255, 255, 0.16) !important;
  box-shadow: none !important;
  outline: 0 !important;
  border-radius: 10px !important;
  color: currentColor !important;
}

body .sidebar a[data-nav-path="/"] .nav-ico svg,
body a[data-nav-path="/"] .nav-ico svg,
body .sidebar .nav-btn.active .nav-ico svg,
body .nav-btn.active .nav-ico svg {
  width: 16px !important;
  height: 16px !important;
  min-width: 16px !important;
  color: currentColor !important;
  stroke: currentColor !important;
  fill: none !important;
}
`;

const canvasSelectors = [
  'html',
  'body',
  '#root',
  '.app',
  '.app.closeflow-visual-stage01',
  '.cf-html-shell',
  'main.main',
  '.view',
  '.view.active',
  '[data-shell-main="true"]',
  '[data-shell-content="true"]',
  '.cf-route-work-root',
  '.cf-html-view',
  '.main-leads-html',
  '.main-clients-html',
  '.main-cases-html',
  '.activity-vnext-page',
  '.ai-drafts-vnext-page',
  '.notifications-vnext-page',
  '.billing-vnext-page',
  '.support-vnext-page',
  '.settings-vnext-page',
  '.main-tasks-html',
  '.main-calendar-html',
  '.main-activity-html',
  '.main-notifications-html',
  '.main-billing-html',
  '.main-ai-drafts-html',
  '.main-support-html',
  '.main-settings-html',
];

const transparentSelectors = [
  '.layout-list',
  '.layout-list.w-full',
  '.layout-list.w-full.max-w-none',
  '.layout-main',
  '.layout-content',
  '.content-shell',
  '.records-shell',
  '.records-layout',
  '.entity-list-layout',
  '.cf-list-layout',
  '.cf-record-list',
  '.tasks-operator-metric-grid',
  '.notifications-today-parity-grid',
  '.cf-operator-metric-grid',
  'main.cf-route-work-root > section.grid',
  'main.cf-route-work-root section.grid.gap-3',
  'main.cf-route-work-root section.grid.gap-4',
];

function forceCanvas(el: Element) {
  const node = el as HTMLElement;
  node.style.setProperty('background', '#f1f5f9', 'important');
  node.style.setProperty('background-color', '#f1f5f9', 'important');
  node.style.setProperty('background-image', 'none', 'important');
}

function forceTransparent(el: Element) {
  const node = el as HTMLElement;
  node.style.setProperty('background', 'transparent', 'important');
  node.style.setProperty('background-color', 'transparent', 'important');
  node.style.setProperty('background-image', 'none', 'important');
}

function forceActiveIcon(el: Element) {
  const node = el as HTMLElement;
  node.style.setProperty('width', '28px', 'important');
  node.style.setProperty('height', '28px', 'important');
  node.style.setProperty('min-width', '28px', 'important');
  node.style.setProperty('max-width', '28px', 'important');
  node.style.setProperty('display', 'inline-flex', 'important');
  node.style.setProperty('align-items', 'center', 'important');
  node.style.setProperty('justify-content', 'center', 'important');
  node.style.setProperty('flex-shrink', '0', 'important');
  node.style.setProperty('padding', '0', 'important');
  node.style.setProperty('margin', '0', 'important');
  node.style.setProperty('background', 'rgba(255, 255, 255, 0.10)', 'important');
  node.style.setProperty('background-color', 'rgba(255, 255, 255, 0.10)', 'important');
  node.style.setProperty('background-image', 'none', 'important');
  node.style.setProperty('border', '1px solid rgba(255, 255, 255, 0.16)', 'important');
  node.style.setProperty('box-shadow', 'none', 'important');
  node.style.setProperty('outline', '0', 'important');
  node.style.setProperty('border-radius', '10px', 'important');

  node.querySelectorAll('svg').forEach((svg) => {
    const icon = svg as SVGElement;
    icon.style.setProperty('width', '16px', 'important');
    icon.style.setProperty('height', '16px', 'important');
    icon.style.setProperty('min-width', '16px', 'important');
    icon.style.setProperty('stroke', 'currentColor', 'important');
    icon.style.setProperty('fill', 'none', 'important');
  });
}

function forceNotificationsWidth() {
  document.querySelectorAll('.notifications-vnext-page, .notifications-stats-grid, .notifications-vnext-shell').forEach((el) => {
    const node = el as HTMLElement;
    node.style.setProperty('width', '100%', 'important');
    node.style.setProperty('max-width', 'none', 'important');
    node.style.setProperty('margin-left', '0', 'important');
    node.style.setProperty('margin-right', '0', 'important');
  });

  document.querySelectorAll('.notifications-stats-grid').forEach((el) => {
    const node = el as HTMLElement;
    node.style.setProperty('display', 'grid', 'important');
    node.style.setProperty('grid-template-columns', 'repeat(4, minmax(0, 1fr))', 'important');
    node.style.setProperty('gap', '12px', 'important');
    node.style.setProperty('margin-bottom', '22px', 'important');
  });
}

function applyInlineSourceTruth() {
  document.documentElement.style.setProperty('--cf-canvas', '#f1f5f9');
  document.documentElement.style.setProperty('--cf-surface', '#ffffff');
  document.documentElement.style.setProperty('--cf-surface-soft', '#f8fafc');
  document.documentElement.style.setProperty('--cf-border', '#e2e8f0');

  for (const selector of canvasSelectors) {
    document.querySelectorAll(selector).forEach(forceCanvas);
  }

  for (const selector of transparentSelectors) {
    document.querySelectorAll(selector).forEach(forceTransparent);
  }

  document.querySelectorAll('.nav-btn.active .nav-ico, .sidebar .nav-btn.active .nav-ico, a[data-nav-path="/"] .nav-ico, .sidebar a[data-nav-path="/"] .nav-ico').forEach(forceActiveIcon);

  forceNotificationsWidth();
}

export default function VisualFoundationRuntimeStage212M() {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    let style = document.querySelector('style[data-stage212m-visual-foundation-runtime="true"]') as HTMLStyleElement | null;

    if (!style) {
      style = document.createElement('style');
      style.setAttribute('data-stage212m-visual-foundation-runtime', 'true');
      document.head.appendChild(style);
    }

    style.setAttribute('data-stage212v-runtime-force', STAGE212V_VISUAL_RUNTIME_FORCE);
    style.textContent = css;

    applyInlineSourceTruth();

    const observer = new MutationObserver(() => applyInlineSourceTruth());

    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class'],
      });
    }

    const tick = window.setInterval(applyInlineSourceTruth, 700);

    return () => {
      observer.disconnect();
      window.clearInterval(tick);
    };
  }, []);

  return null;
}
