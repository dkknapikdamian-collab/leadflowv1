# Stage70 — manualny check bocznych kart

## Cel

Dopiąć realne źródło prawdy jasnych bocznych kart operatora po audycie klas `right-card`, `lead-right-card`, `lead-top-relations`, `cases-shortcuts-rail-card`, `cases-risk-rail-card`, `clients-right-rail`.

## Co zostało spięte

Źródło prawdy:

```text
src/styles/closeflow-right-rail-source-truth.css
```

Finalny import:

```text
src/main.tsx
```

Powód: `src/index.css` ładuje stare/stage/temporary/emergency importy, więc finalny plik right rail musi wejść po nich jako ostatnia warstwa CSS z JS importu.

## Ręcznie sprawdź

### `/leads`

- prawa karta / boczny panel ma jasne tło,
- `lead-right-card` jest jasny,
- `lead-top-relations` jest jasny,
- tekst jest czytelny,
- nie ma czarnego panelu,
- lista leadów po lewej nie zmieniła układu.

### `/clients`

- boczna karta klienta ma jasne tło,
- tekst i małe opisy są czytelne,
- nie ma czarnego wrappera,
- główna lista klientów nie została popsuta.

### `/cases`

- `cases-shortcuts-rail-card` jest jasny,
- `cases-risk-rail-card` jest jasny,
- kolor ryzyka zostaje jako badge/akcent, nie jako czarne tło całej karty,
- główna lista spraw nie została popsuta.

## Kryterium zakończenia

Wszystkie boczne karty operatora na `/leads`, `/clients`, `/cases` mają jeden jasny styl z jednego miejsca: `src/styles/closeflow-right-rail-source-truth.css`.
