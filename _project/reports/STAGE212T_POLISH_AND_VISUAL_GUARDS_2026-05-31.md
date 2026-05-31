# STAGE212T - Polish signs and visual guards

## FAKTY
- Naprawiono mojibake w plikach: Layout.tsx, TasksStable.tsx, Today.tsx oraz skanowanych plikach src.
- Ikona Dziś w sidebarze została przełączona z LayoutDashboard na Home.
- Dodano/utrzymano visual source truth dla:
  - aktywnej ikonki sidebaru,
  - filtrów zadań,
  - tasks-stage178-filter-label,
  - tasks-stage178-filter-count.
- Dodano guard: scripts/check-stage212t-polish-and-visual-source-truth.cjs.

## TESTY
- node scripts/local-stage212t-polish-and-visual-fix.cjs
- node scripts/check-stage212t-polish-and-visual-source-truth.cjs
- npm run build

## CZEGO NIE RUSZANO
- Supabase
- RLS
- dane
- routing biznesowy
- deployment
- push do GitHub

## BACKUP
_project\backups\stage212t_polish_and_visual_guards_20260531_143315
