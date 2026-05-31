# STAGE137 Desktop Content Shell Fix — raport

Data: 2026-05-22  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / desktop shell / szerokość głównych kontenerów

## Cel

Naprawić problem, którego nie rozwiązał Stage136: główne okna aplikacji dalej są zbyt wąsko wyśrodkowane na desktopie.

## FAKTY

- Damian wskazał na screenie `/clients`, że po Stage136 główna zawartość nadal jest wyspą na środku.
- Feedback `closeflow_admin_feedback_2026-05-22_22-09.json` wskazuje całe główne kontenery, nie pojedynczy kafelek.
- `Layout.tsx` opakowuje każdą stronę w `main.main` oraz `div.view.active`, więc samo poszerzenie route-roota nie wystarcza.
- `Clients.tsx` ma root `.cf-html-view.main-clients-html`, a pod nim `.layout-list w-full max-w-none`; jeśli rodzic jest wąski, lista też pozostaje wąska.
- Istnieją stare source truthy z mocnymi selektorami i `!important`, więc Stage137 musi mieć silniejszy i późniejszy CSS.

## Dlaczego Stage136 nie wystarczył

Stage136 poszerzał wybrane dzieci, ale realny limit siedzi równocześnie:
- wyżej: `[data-shell-main]`, `[data-shell-content]`, `.view.active`,
- na route-rootach: `.main-clients-html`, `.main-leads-html`, itd.,
- w utility klasach Tailwind: `mx-auto`, `max-w-5xl`, `max-w-7xl`,
- w route-specific layoutach: `.activity-vnext-shell`, `.layout-list`.

## Decyzja

Dodać nowy CSS source truth:

```text
src/styles/closeflow-desktop-content-shell-stage137.css
```

Importowany po Stage136/135/134, żeby wygrał z wcześniejszymi regułami.

## Zakres route

- `/clients`
- `/leads`
- `/cases`
- `/tasks`
- `/calendar`
- `/templates`
- `/response-templates`
- `/activity`

## Parametry

- max desktop width: `1560px`
- max od 1680px viewport: `1620px`
- gutter: `24px` / `28px`
- right rail: `340px` / `348px`
- aktywne tylko od `1280px`

## Testy

```powershell
node scripts/check-stage137-desktop-content-shell.cjs
npm.cmd run build
```

## Test ręczny

Sprawdzić:
- `/clients` — lista i prawy rail powinny być wyraźnie szersze, nie środkowa wyspa
- `/leads`
- `/cases`
- `/tasks`
- `/calendar`
- `/templates`
- `/response-templates`
- `/activity`

## Czego nie ruszano

- mobile/tablet
- dane
- routing
- Supabase/Auth/Google
- Stripe
- AI
- przyciski
- logika list
- Vercel deploy
- push

## Następny krok

Jeżeli po Stage137 jeden route nadal zostanie wąski, sprawdzić DevTools computed width dla:
- `[data-shell-content]`
- route root, np. `.main-clients-html`
- `.layout-list`
- właściwy route-specific wrapper.
