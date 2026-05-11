# CloseFlow — Page Header Final Lock Packet 2

## Cel

Naprawić problem widoczny na screenie:
- `Aktywność` jest przesunięta w prawo,
- `Dziś` wygląda poprawnie,
- inne headerki nadal nie trzymają jednego układu.

## Faktyczna przyczyna

Poprzednie CSS-y miały selektor akcji oparty o:

`[data-cf-page-header="true"].cf-page-header > :last-child`

To jest błąd.

Na ekranach bez przycisków, np. `Aktywność`, jedyny blok tekstowy jest jednocześnie `:first-child` i `:last-child`. Stary selector uznał tekst za akcje i wypchnął go w prawy róg.

## Co robi pakiet

### 1. Dodaje finalny source-of-truth

`src/styles/closeflow-page-header-final-lock.css`

Ten plik:
- nie zgaduje już akcji po `:last-child`,
- copy zawsze idzie w lewo,
- akcje są akcjami tylko wtedy, gdy mają:
  - `data-cf-page-header-part="actions"`
  - albo znaną klasę typu `head-actions`, `cf-page-hero-actions`, `notifications-header-actions`,
- AI jest fioletowe,
- neutralne akcje są białe z niebieskim tekstem,
- kosz/danger jest czerwony i spięty z tokenami kosza,
- duplikaty opisów w headerze są ukryte.

### 2. Importuje finalny lock w każdym ekranie

To jest ważne, bo page-level CSS chunki potrafią wejść po globalnym CSS. Dlatego finalny lock jest importowany w każdym ekranie jako ostatni CSS import.

### 3. Dopina finalny lock na końcu emergency-hotfixes

Dodatkowe zabezpieczenie przed starymi adapterami.

### 4. Oznacza copy w headerach

Dodaje `data-cf-page-header-part="copy"` do pierwszego bloku headera.

### 5. Czyści duble opisów

Usuwa powtórzone `PAGE_HEADER_CONTENT.*.description` w TSX, a CSS ukrywa powtórki awaryjnie.

### 6. Kalendarz

Dodaje w headerze kalendarza:
- `Dodaj zadanie`
- `Dodaj wydarzenie`

Oba używają istniejących stanów:
- `setIsNewTaskOpen(true)`
- `setIsNewEventOpen(true)`

## Czego nie rusza

- API
- Supabase
- logiki zapisu
- modali
- list
- metryk
- routingu

## Ręczny test po wdrożeniu

1. `/activity`
   - tekst ma być po lewej, nie po prawej.

2. `/today`
   - ma zostać jak wzór.

3. `/calendar`
   - header ma mieć akcje `Dodaj zadanie` i `Dodaj wydarzenie`.

4. `/response-templates`, `/ai-drafts`, `/notifications`
   - brak podwójnego opisu.

5. AI buttons:
   - fiolet.

6. Kosz:
   - czerwony.

7. Billing:
   - brak zielonej ikonki w header action.
