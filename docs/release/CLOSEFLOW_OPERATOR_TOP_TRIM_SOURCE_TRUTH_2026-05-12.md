# CLOSEFLOW_OPERATOR_TOP_TRIM_SOURCE_TRUTH_2026-05-12

## Cel

Usunąć resztki dużych hero/header pasków z desktopowych zakładek po wcześniejszym schowaniu głównych kafli nagłówka.

## Problem wejściowy

Po poprzednim etapie stary `CloseFlowPageHeaderV2` nie pokazywał już pełnego tekstu, ale nadal zostawiał biały pasek albo pojedyncze piguły/kickery typu `BAZA RELACJI`, `CZAS I OBOWIĄZKI`, `Plan i dostęp`, `USTAWIENIA`.

Na części ekranów zostawały też przyciski akcji w miejscu dawnego hero, np. `Odśwież dane` i `Widok`.

## Decyzja

Na desktopie:

- nie renderujemy wizualnie starego hero/paska,
- nie zostawiamy pustej białej belki,
- nie pokazujemy kickerów/nagłówków w dawnym miejscu hero,
- jedynym dopuszczonym wyjątkiem jest akcja `Widok`, która zostaje jako mały pływający przycisk bez rezerwowania pionowej przestrzeni,
- telefon nie jest dotykany.

## Mapa źródeł problemu z tłem

Różne odcienie tła wynikały z nakładania kilku warstw:

1. `src/styles/closeflow-page-header-v2.css` — własne tło i cień karty nagłówka.
2. `src/styles/closeflow-compact-top-shell-source-truth.css` — zamiana nagłówka w pasek akcji, ale z pozostawieniem akcji w flow.
3. `src/styles/closeflow-desktop-density-source-truth.css` — globalne zagęszczenie desktopu i paddingi widoku.
4. Stare adaptery z `src/styles/page-adapters/page-adapters.css` — historyczne style stron, które nadal potrafią zostawiać lokalne hero/kickery.

## Zakres

- `src/components/OperatorTopBarRuntime.tsx`
- `src/components/Layout.tsx`
- `src/styles/closeflow-operator-top-trim-source-truth.css`
- `scripts/check-closeflow-operator-top-trim-source-truth.cjs`

## Kryterium zakończenia

- Dawny pasek/kafelek nagłówka nie zajmuje miejsca na desktopie.
- Nie ma samotnych piguł typu `BAZA RELACJI`, `CZAS I OBOWIĄZKI`, `Plan i dostęp` w miejscu dawnego hero.
- `Widok` może zostać, ale nie tworzy białego paska.
- Główne tło desktopu jest jednolite.
