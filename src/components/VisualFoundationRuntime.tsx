import { useEffect } from 'react';

const VISUAL_FOUNDATION_STYLE_ID = 'closeflow-visual-foundation-source-truth-stage212a';

const VISUAL_FOUNDATION_CSS = `
:root,
html,
body,
#root,
[data-skin="forteca-light"] {
  --cf-canvas: #f1f5f9;
  --cf-surface: #ffffff;
  --cf-surface-soft: #f8fafc;
  --cf-border: #e2e8f0;
  --app-bg: var(--cf-canvas);
  --app-surface: var(--cf-canvas);
  --app-surface-strong: var(--cf-surface);
  --cf-operator-bg: var(--cf-canvas);
  --cf-operator-bg-soft: var(--cf-canvas);
}

@media (min-width: 901px) and (hover: hover) and (pointer: fine) {
  html,
  body,
  #root,
  #root .app.closeflow-visual-stage01,
  #root .app.closeflow-visual-stage01.cf-html-shell,
  #root .cf-html-shell,
  #root .cf-html-shell .main,
  #root .cf-html-shell [data-shell-main="true"],
  #root .cf-html-shell .view.active,
  #root .cf-html-shell [data-shell-content="true"],
  #root .cf-html-shell .cf-route-work-root,
  #root .cf-html-shell .cf-html-view,
  #root .cf-html-shell .main-calendar-html,
  #root .cf-html-shell .main-leads-html,
  #root .cf-html-shell .main-clients-html,
  #root .cf-html-shell .main-cases-html,
  #root .cf-html-shell .main-today-html,
  #root .cf-html-shell .calendar-week-layout,
  #root .cf-html-shell .activity-vnext-page,
  #root .cf-html-shell .ai-drafts-vnext-page,
  #root .cf-html-shell .notifications-vnext-page,
  #root .cf-html-shell .billing-vnext-page,
  #root .cf-html-shell .support-vnext-page,
  #root .cf-html-shell .settings-vnext-page,
  #root .cf-html-shell [class*="vnext-page"],
  #root .cf-html-shell [class*="vnext-shell"],
  #root .cf-html-shell [class*="vnext-layout"] {
    background: var(--cf-canvas) !important;
    background-color: var(--cf-canvas) !important;
    background-image: none !important;
  }

  #root .cf-html-shell [data-stage16ai-today-tiles-match-lists="true"],
  #root .cf-html-shell .cf-route-work-root > section.grid,
  #root .cf-html-shell .cf-route-work-root > div.grid,
  #root .cf-html-shell [class*="vnext-page"] > section.grid,
  #root .cf-html-shell [class*="vnext-page"] > div.grid,
  #root .cf-html-shell [class*="vnext-shell"],
  #root .cf-html-shell [class*="-layout"] {
    background-image: none !important;
  }

  #root .cf-html-shell :is(.bg-card, .card, [data-card], .right-card, .rounded-xl.border.bg-card, .rounded-2xl.border.bg-card, .rounded-xl.border.bg-white, .rounded-2xl.border.bg-white, .rounded-xl.border[class*="shadow"], .rounded-2xl.border[class*="shadow"]) {
    background-color: var(--cf-surface) !important;
    background-image: none !important;
  }

  #root .cf-html-shell :is(input:not([type="checkbox"]):not([type="radio"]):not([type="range"]), textarea, select, .empty-state, [class*="empty"], [class*="toolbar-card"]) {
    background-color: var(--cf-surface) !important;
    background-image: none !important;
  }

  #root .cf-html-shell .global-bar,
  #root .cf-html-shell .mobile-top,
  #root .cf-html-shell .global-actions {
    background-color: rgba(255, 255, 255, 0.97) !important;
    background-image: none !important;
  }

  #root .cf-html-shell .sidebar,
  #root .cf-html-shell [data-shell-sidebar="true"] {
    background-color: #0f1b31 !important;
  }

  #root .cf-html-shell .sidebar .nav-btn .nav-ico {
    background: rgba(255, 255, 255, 0.08) !important;
    color: #cbd5e1 !important;
    border-color: rgba(255, 255, 255, 0.10) !important;
  }

  #root .cf-html-shell .sidebar .nav-btn.active .nav-ico,
  #root .cf-html-shell .sidebar .nav-btn[aria-current="page"] .nav-ico {
    background: rgba(255, 255, 255, 0.16) !important;
    color: #ffffff !important;
    border-color: rgba(255, 255, 255, 0.22) !important;
  }

  #root .cf-html-shell .sidebar .nav-btn .nav-ico svg,
  #root .cf-html-shell .sidebar .nav-btn.active .nav-ico svg,
  #root .cf-html-shell .sidebar .nav-btn[aria-current="page"] .nav-ico svg {
    color: currentColor !important;
    stroke: currentColor !important;
    fill: none !important;
  }
}
`;

export default function VisualFoundationRuntime() {
  useEffect(() => {
    const head = document.head || document.getElementsByTagName('head')[0];
    if (!head) return;

    let style = document.getElementById(VISUAL_FOUNDATION_STYLE_ID) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement('style');
      style.id = VISUAL_FOUNDATION_STYLE_ID;
      style.setAttribute('data-closeflow-source-truth', 'visual-foundation-stage212a');
      head.appendChild(style);
    }

    if (style.textContent !== VISUAL_FOUNDATION_CSS) {
      style.textContent = VISUAL_FOUNDATION_CSS;
    }
  }, []);

  return null;
}
