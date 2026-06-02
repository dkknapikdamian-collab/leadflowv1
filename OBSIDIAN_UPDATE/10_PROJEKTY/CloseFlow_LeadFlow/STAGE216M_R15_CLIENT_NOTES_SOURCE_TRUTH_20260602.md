# Stage216M-R15 - Client notes source truth

## Cel
Naprawić notatki klienta po Stage216M-R14: klient ma mieć tekstowe dodawanie notatki i dyktowanie w jednym centralnym miejscu, bez zapisu głosowej notatki do pola danych klienta.

## Fakty
- R14 przeszedł build i push, ale UI pokazał, że notatki klienta są niespójne z leadem.
- Głosowe dyktowanie klienta wpisywało tekst do `form.notes` i przełączało kartę danych klienta w tryb edycji.
- Brakowało normalnego tekstowego dodania notatki w centrum pracy klienta.

## Zakres
- `src/pages/ClientDetail.tsx`
- `src/styles/page-adapters/page-adapters.css`
- `src/styles/stage216m-r15-client-notes-source-truth.css`
- `tests/stage216m-r15-client-notes-source-truth-contract.test.cjs`

## Decyzje Damiana
- Notatki klienta i leada mają być spójne funkcjonalnie.
- Notatki nie mogą dublować się pod danymi klienta.
- Brak tekstowego dodawania notatki to błąd krytyczny UX.

## Testy
- `node tests/stage216m-r15-client-notes-source-truth-contract.test.cjs`
- `git diff --check`
- `npm run build`

## Czego nie ruszano
- API
- Supabase SQL
- backend płatności
- prawa szyna finansów
- Stage216D

## Następny krok
Po deployu sprawdzić klienta: wpisanie tekstu w notatkę, dodanie, dyktowanie i brak pojawiania się pola notatki w karcie danych klienta.
