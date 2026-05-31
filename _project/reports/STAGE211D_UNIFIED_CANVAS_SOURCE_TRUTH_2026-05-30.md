# STAGE211D_UNIFIED_CANVAS_SOURCE_TRUTH_2026-05-30

## Cel

Ujednolicenie tla/canvasu calej aplikacji operatora do wzoru z zakladki Dzis.

## Fakty

- W feedbacku admin wskazano jako wzor route / i wrapper cf-route-work-root.
- Problem dotyczy warstwy canvasu widocznej miedzy kafelkami, pod kafelkami i za wrapperami stron.
- Poprzedni etap Stage211A byl za waski, bo czyscil tylko wybrane page CSS.

## Zmiany

- Dodano src/styles/closeflow-canvas-source-truth-stage211d.css jako jedno zrodlo prawdy dla tla.
- Podpieto ten sam plik przez Layout oraz glowne route pages.
- Dodano fallback import w src/index.css.
- Znormalizowano znane stare gradienty radial/linear do tokenu --cf-canvas-bg tam, gdzie wystepowaly.

## Zasada wizualna

- Canvas: var(--cf-canvas-bg, #f8fafc).
- Karty/listy/formularze: pozostaja na warstwie surface, glownie biale.
- Nie zmieniano logiki danych, routingu, Supabase, RLS ani formularzy.

## Importy dodane

- brak nowych importow, juz istnialy

## CSS znormalizowane

- brak bezposrednich starych gradientow do zamiany
