import { useEffect } from 'react';

const STYLE_ID = 'closeflow-visual-foundation-stage212g-runtime';

const css = String.raw`
:root {
  --cf-canvas: #f1f5f9;
  --cf-surface: #ffffff;
  --cf-surface-soft: #f8fafc;
  --cf-border: #e2e8f0;
  --cf-operator-bg: var(--cf-canvas);
  --cf-operator-bg-soft: var(--cf-canvas);
  --cf-vs-bg: var(--cf-canvas);
  --cf-vs-bg-2: var(--cf-canvas);
  --app-bg: var(--cf-canvas);
  --app-surface: var(--cf-surface-soft);
  --app-surface-strong: var(--cf-surface);
  --app-surface-muted: var(--cf-surface-soft);
  --app-border: var(--cf-border);
}

html,
body,
#root,
#root .app.closeflow-visual-stage01,
#root .cf-html-shell,
#root main.main,
#root [data-shell-main="true"],
#root .view.active,
#root [data-shell-content="true"],
#root .cf-html-shell .cf-route-work-root,
#root .cf-html-shell .cf-html-view,
#root .cf-html-shell .main-leads-html,
#root .cf-html-shell .main-clients-html,
#root .cf-html-shell .main-cases-html,
#root .cf-html-shell .main-today-html,
#root .cf-html-shell .main-calendar-html,
#root .cf-html-shell .main-templates-html,
#root .cf-html-shell .activity-vnext-page,
#root .cf-html-shell .ai-drafts-vnext-page,
#root .cf-html-shell .notifications-vnext-page,
#root .cf-html-shell .billing-vnext-page,
#root .cf-html-shell .support-vnext-page,
#root .cf-html-shell .settings-vnext-page,
#root .cf-html-shell [class*="vnext-page"] {
  background: var(--cf-canvas) !important;
  background-color: var(--cf-canvas) !important;
  background-image: none !important;
}

#root .cf-html-shell :is(.activity-stats-grid, .tasks-operator-metric-grid, .cf-operator-metric-grid, .layout-list, .tasks-stage178-workspace, .tasks-stage178-main-stack, .calendar-week-layout, [class*="stats-grid"], [class*="toolbar"], [class*="vnext-shell"], [class*="layout"]) {
  background-color: transparent !important;
  background-image: none !important;
}

#root .cf-html-shell :is(.bg-card, .rounded-xl.border.bg-card, .card, .right-card, [class*="right-card"], [data-cf-semantic-section-card="true"], .cf-operator-metric-tile, .tasks-stage178-grouped-list) {
  background: var(--cf-surface) !important;
  background-color: var(--cf-surface) !important;
  background-image: none !important;
}

#root .closeflow-visual-stage01 .nav-btn.active .nav-ico {
  background: rgba(96, 165, 250, 0.18) !important;
  background-color: rgba(96, 165, 250, 0.18) !important;
  background-image: none !important;
  color: #bfdbfe !important;
  box-shadow: none !important;
}

#root .closeflow-visual-stage01 .nav-btn.active .nav-ico svg,
#root .closeflow-visual-stage01 .nav-ico svg {
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  color: currentColor !important;
  fill: none !important;
}
`;

export default function VisualFoundationRuntimeStage212G() {
  useEffect(() => {
    const existing = document.getElementById(STYLE_ID);
    if (existing) existing.remove();
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.setAttribute('data-stage212j-visual-foundation-runtime', 'true');
    style.textContent = css;
    document.head.appendChild(style);
    return () => {
      const current = document.getElementById(STYLE_ID);
      if (current) current.remove();
    };
  }, []);

  return null;
}
