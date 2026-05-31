# STAGE211B SECONDARY PAGES UNIFIED WHITE SHELL

## Cel
Ujednolicić tło/canvas na stronach drugorzędnych: Aktywność, Inbox szkiców, Powiadomienia, Rozliczenia, Zgłoszenia i Ustawienia.

## Co zmieniono
- Dodano finalny override do `src/styles/emergency/emergency-hotfixes.css`.
- Override obejmuje nie tylko klasę strony, ale też globalny shell Layoutu: `body`, `#root`, `.app.closeflow-visual-stage01`, `[data-shell-main="true"]`, `[data-shell-content="true"]` i `.view.active`.
- Usunięto wizualnie radial/linear gradient i niebiesko-szare tło na aktywnych stronach drugorzędnych.

## Zakres stron
- /activity
- /ai-drafts
- /notifications
- /billing
- /help
- /settings

## Czego nie ruszano
- Supabase
- RLS
- routing
- logika list, filtrów, formularzy
- sidebar i topbar jako osobne komponenty

## Testy
- node scripts/check-stage211b-secondary-pages-unified-white-shell.cjs
- npm run build

## Status
Zastosowano lokalnie przez ZIP Stage211B.
