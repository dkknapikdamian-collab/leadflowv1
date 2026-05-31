# STAGE211C - unified app canvas

## Cel

Ujednolicić tło każdej zakładki operatora: za kafelkami, między kafelkami, za shellami i w pustych przestrzeniach.

## Fakty

- Stage211A usunął część gradientów w konkretnych stronach, ale screen z Inboxa szkiców nadal pokazał różne warstwy tła.
- Problem nie siedzi tylko w pojedynczych stronach, ale także w globalnym shellu Layoutu i wrapperach contentu.
- Ten etap dodaje jeden globalny CSS source of truth dla canvasu aplikacji.

## Zakres

- Dodano: src/styles/closeflow-unified-page-canvas-stage211c.css
- Dodano import globalnego canvasu do Layout.tsx i stron korzystających z Layout.
- Dodano guard: scripts/check-stage211c-unified-app-canvas.cjs

## Nie ruszano

- Supabase
- RLS
- Routing
- Formularze
- Listy
- Logika biznesowa
- Deployment
- Push do GitHuba

## Testy

- node scripts/check-stage211c-unified-app-canvas.cjs
- npm run build

## Backup

_project/backups/stage211c_unified_app_canvas_2026-05-30

## Następny krok

Restart dev servera, Ctrl+F5 i kontrola wizualna zakładek: Dziś, Leady, Klienci, Sprawy, Zadania, Kalendarz, Szablony, Odpowiedzi, Aktywność, Inbox szkiców, Powiadomienia, Rozliczenia, Zgłoszenia, Ustawienia.
