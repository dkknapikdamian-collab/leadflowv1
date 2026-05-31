# STAGE138 Desktop Left Anchor Content — raport

Data: 2026-05-22  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / desktop shell / wyrównanie do panelu bocznego

## Cel

Po Stage137 układ jest lepszy, ale Damian chce, żeby główne okna były przesunięte bliżej panelu bocznego, a nie centrowane w obszarze roboczym.

## FAKTY

- Stage137 poszerzył shell, ale nadal używał centrowania `margin-left: auto; margin-right: auto`.
- Layout aplikacji opakowuje widoki w `main.main`, `global-bar` i `div.view.active`.
- Główne route-rooty siedzą jako dzieci `[data-shell-content]`.
- Damian chce wykorzystać przestrzeń od panelu bocznego, szczególnie na desktopie.

## DECYZJA

Dodać Stage138 jako override po Stage137:

```text
src/styles/closeflow-desktop-left-anchor-content-stage138.css
```

Zmiana:
- zamiast centrować content, ustawiamy `margin-left: 16px` od panelu bocznego,
- szerokość liczona jest jako `100vw - sidebar - lewy gutter - prawy gutter`,
- aktywne tylko na desktopie `min-width: 1280px` oraz urządzeniach z myszką.

## Zakres

- `/clients`
- `/leads`
- `/cases`
- `/tasks`
- `/calendar`
- `/templates`
- `/response-templates`
- `/activity`

## Parametry

- sidebar width: `240px`
- left gutter: `16px` / `18px`
- right gutter: `22px` / `24px`
- right rail: `348px` / `356px`
- content max: `1680px` / `1760px`

## Testy

```powershell
node scripts/check-stage138-desktop-left-anchor-content.cjs
npm.cmd run build
```

## Test ręczny

Sprawdzić:
- `/clients`: czy lewa krawędź głównych kafelków/list jest bliżej sidebara
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

Jeżeli po Stage138 content będzie za blisko sidebara, zwiększyć `--cf138-left-gutter` z `16px` do `22px`. Jeśli nadal za daleko, zmniejszyć do `8px`.
