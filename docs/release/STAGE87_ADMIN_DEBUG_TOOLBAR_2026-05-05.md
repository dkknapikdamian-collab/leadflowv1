# Stage87 — Admin Debug Toolbar V1

Data: 2026-05-05  
Branch: dev-rollout-freeze

## Cel

Wdrożyć lokalny Admin Debug Toolbar zgodnie z paczką `closeflow_admin_debug_toolbar_full_spec_2026-05-05`.

## Zakres wdrożony w V1

- toolbar w globalnym górnym pasku Layout
- widoczny tylko dla `isAdmin || isAppOwner`
- localStorage only
- bez backendu
- bez Supabase tabel
- Review Mode: OFF / Collect / Browse
- Collect blokuje klik i otwiera formularz uwagi
- Copy Review Mode
- Bug Note Recorder
- Button Matrix Scanner
- Export Center JSON/Markdown
- DOM targeting na bazie `event.composedPath()`, scoringu i listy kandydatów
- każdy element toolbaru ma `data-admin-tool-ui="true"`
- plik root `00_READ_FIRST_STRIPE_SANDBOX_NAME_TODO.md`

## Nowe skrypty

- `check:admin-debug-toolbar`
- `check:admin-review-mode`
- `check:admin-button-matrix`
- `check:admin-feedback-export`
- `test:admin-tools`
- `verify:admin-tools`

## Kryterium zakończenia

- build PASS
- wszystkie guardy Admin Tools PASS
- test:admin-tools PASS
- zwykły user nie widzi toolbaru
- admin/app owner widzi toolbar
