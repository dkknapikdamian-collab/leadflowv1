# CloseFlow — Page Header Descriptions + Text Style Stage 4

## Cel

Dodać zaproponowany opis pod tytułem w głównym kafelku zakładki i podpiąć go pod jedno źródło prawdy.

Dodatkowo ujednolicić styl tytułu na wzór `Dziś`, szczególnie napis:
`Priorytety i najbliższe ruchy`.

## Co jest źródłem prawdy

### Teksty

`src/lib/page-header-content.ts`

Tam są:
- kicker,
- title,
- description.

### Styl tekstu

`src/styles/closeflow-page-header-card-source-truth.css`

Dopisany blok:
`CLOSEFLOW_PAGE_HEADER_TITLE_COPY_PARITY_TODAY_STAGE4_2026_05_11`

## Co zmienia etap

- Dodaje opisy pod tytułem z `PAGE_HEADER_CONTENT`.
- Ustawia tytuł na styl bliższy `Dziś`:
  - większy,
  - mocniejszy,
  - ciaśniejsze letter-spacing,
  - spokojny ciemny kolor,
  - lepszy line-height.
- Ustawia opis:
  - 13px,
  - 650 font-weight,
  - #64748b,
  - odstęp 9px od tytułu.
- Oznacza części headera przez `data-cf-page-header-part`, gdzie da się to zrobić bez przebudowy całego komponentu.

## Czego nie rusza

- Tła kafelka.
- Logiki przycisków.
- Modali.
- List.
- Metryk.
- API.
- Routingu.
- Runtime/MutationObserver.

## Następny etap

Przepinać po kolei menu na docelowy komponent `CloseFlowPageHeader`, zaczynając od `Leady`.
