# CloseFlow Stage158 — Overlay Portal Density Source Truth

## Problem

Stage157 scales the app shell/content so browser 100% looks like browser 80%.

But dialogs, modals, popovers and dropdowns are often rendered in portals directly under `body`, outside `#root > .app`. Those overlays do not inherit Stage157 zoom, so they remain too large.

## Decision

Stage158 applies the same density source truth to portaled overlays.

Scope:
- dialogs,
- modals,
- sheets,
- drawers,
- popovers,
- dropdowns,
- selects,
- tooltips,
- command palette,
- toasts,
- PWA prompt,
- bug recorder.

## Source truth

Stage157 = app/page visual zoom.  
Stage158 = overlay/portal visual zoom.

Stage158 uses Stage157 variables by default:

```css
--cf158-overlay-scale: var(--cf157-page-zoom, 0.80);
--cf158-overlay-inverse-scale: var(--cf157-page-zoom-inverse, 1.25);
```

## Guard rule

Every visual correction must have its own guard.
