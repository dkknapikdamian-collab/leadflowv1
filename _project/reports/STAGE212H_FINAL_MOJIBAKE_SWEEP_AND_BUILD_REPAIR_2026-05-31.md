# Stage212H Final Mojibake Sweep and Build Repair

## Cel
Masowa naprawa po Stage212G: residual mojibake, index.css import order, final runtime visual source truth, sidebar active icon.

## Fakty z audytu
- Stage212G zatrzymał się na mojibake w src/pages/Today.tsx.
- Import order był uszkodzony przez komentarze przed @import.
- Sidebar active icon miał biały kwadrat przez background #fff.

## Zakres
- src/index.css
- src/components/Layout.tsx
- src/components/VisualFoundationRuntimeStage212G.tsx
- src/styles/closeflow-visual-foundation-stage212g.css
- src/styles/visual-stage01-shell.css
- src/pages/Today.tsx
- src/pages/TasksStable.tsx
- scripts/check-stage212h-final-mojibake-sweep-and-build-repair.cjs

## Testy
- node scripts/check-stage212h-final-mojibake-sweep-and-build-repair.cjs
- npm run build
