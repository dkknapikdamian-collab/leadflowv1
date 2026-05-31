# STAGE211A - Secondary pages white canvas

## Cel
Usunieto niebiesko-szare tlo/gradient za kafelkami na stronach drugiego poziomu, gdzie wygladalo jak osobna plansza pod UI.

## Zakres
- Activity: src/styles/visual-stage8-activity-vnext.css
- Inbox szkicow / AI drafts: src/styles/visual-stage9-ai-drafts-vnext.css
- Powiadomienia: src/styles/visual-stage10-notifications-vnext.css
- Rozliczenia: src/styles/visual-stage16-billing-vnext.css
- Zgloszenia: src/styles/visual-stage17-support-vnext.css
- Ustawienia: src/styles/visual-stage19-settings-vnext.css

## Zmiana
Dodano lokalne override'y:
- background: #ffffff !important;
- background-image: none !important;

## Nie ruszano
- Supabase
- RLS
- routing
- logika list, filtrow i formularzy
- deployment
- push

## Testy
- node scripts/check-stage211a-secondary-pages-white-canvas.cjs
- npm run build
