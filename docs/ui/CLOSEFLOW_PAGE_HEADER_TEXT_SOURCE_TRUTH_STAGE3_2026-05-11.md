# CloseFlow — Page Header Text Source Truth Stage 3

## Cel

Nie ruszać już koloru tła kafelka. Kolor jest OK.

Ten etap ustala jedno źródło prawdy dla tekstu w głównym kafelku zakładki:
- położenie kolumny tekstowej,
- styl kickera,
- kolor i rozmiar tytułu,
- kolor i rozmiar opisu,
- odstępy między kickerem, tytułem i opisem,
- wyrównanie akcji po prawej.

## Wzór

Ekran `Dziś`.

Układ:
- kicker u góry,
- tytuł pod nim,
- opis pod tytułem,
- akcje po prawej,
- całość spokojna, biała, czytelna.

## Jedno źródło prawdy

`src/styles/closeflow-page-header-card-source-truth.css`

Ten etap dopisuje do niego blok:

`CLOSEFLOW_PAGE_HEADER_TEXT_SOURCE_TRUTH_STAGE3_2026_05_11`

## Ważne

Ten etap NIE zmienia:
- tła kafelka,
- logiki ekranów,
- przycisków,
- modali,
- list,
- metryk,
- routingów,
- API.

## Docelowe data-part

Docelowo każdy header ma mieć:
- `data-cf-page-header="true"`
- `data-cf-page-header-part="copy"`
- `data-cf-page-header-part="kicker"`
- `data-cf-page-header-part="title"`
- `data-cf-page-header-part="description"`
- `data-cf-page-header-part="actions"`

Ten CSS obsługuje już te części, a także stare klasy jako przejściowy fallback.

## Następny etap

Przepinać menu po kolei na normalny komponent `CloseFlowPageHeader`, bez runtime i bez MutationObserver.
