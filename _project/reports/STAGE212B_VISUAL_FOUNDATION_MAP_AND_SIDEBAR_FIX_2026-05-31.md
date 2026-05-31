# STAGE212B Visual Foundation Map and Sidebar Fix

## Cel
Ujednolicić warstwy canvasu i powierzchni aplikacji oraz naprawić biały kwadrat aktywnej ikony w sidebarze.

## Warstwy objęte source truth
- L0: html, body, #root
- L1: .app.closeflow-visual-stage01, .cf-html-shell
- L2: .main, [data-shell-main="true"], .view.active, [data-shell-content="true"]
- L3: route root: .cf-route-work-root, .cf-html-view, .main-*-html, *-vnext-page
- L4: layout/grid wrappers: *-vnext-shell, *-layout, metric grids, list layouts, toolbar/search wrappers
- L5: surface/card: bg-card, rounded-xl.bg-card, right-card, cf-operator-metric-tile, semantic section cards

## Kolory
- canvas: #f1f5f9
- surface: #ffffff
- surface soft: #f8fafc
- border: #e2e8f0

## Pliki
- src/styles/closeflow-visual-foundation-stage212b.css
- src/components/VisualFoundationRuntimeStage212B.tsx
- src/components/Layout.tsx
- src/index.css

## Guardy
- scripts/check-stage212b-visual-foundation-map-and-sidebar.cjs
- npm run build

## Uwagi
Sidebar zostaje ciemny. Naprawiony jest tylko aktywny kontener ikony, żeby nie robił białego kwadratu.
