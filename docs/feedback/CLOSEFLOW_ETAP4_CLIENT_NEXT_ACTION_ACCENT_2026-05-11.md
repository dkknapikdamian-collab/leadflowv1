# CLOSEFLOW_ETAP4_CLIENT_NEXT_ACTION_ACCENT — 2026-05-11

## Cel

Na widoku `/clients` sekcja `Najbliższa akcja` w karcie klienta ma być delikatnie odróżniona kolorem od reszty karty.

## Decyzja UI

Używamy spokojnego slate-blue / neutralnego akcentu:

- jasne tło,
- delikatna niebieska ramka,
- spokojny tekst,
- brak koloru ostrzegawczego,
- brak zmiany koloru całej karty klienta.

## Poprawka po pierwszej paczce

Pierwszy guard sam się wywrócił, bo szukał słowa forbidden także w komentarzu CSS. Ten finalizer:
- czyści poprzedni blok ETAP4,
- dopisuje blok bez mylących słów w komentarzu,
- utwardza guard tak, żeby sprawdzał reguły CSS, nie przypadkowe słowa w komentarzu.

## Kryterium ręczne

1. Wejdź na `/clients`.
2. Karta klienta nadal ma szeroki układ.
3. Sekcja `Najbliższa akcja` jest wizualnie odróżniona, ale spokojna.
4. Mobile: padding nie robi poziomego scrolla ani nie zjada przesadnie miejsca.

## Nie zmieniono

- danych klienta,
- relacji lead/client/case,
- treści najbliższej akcji,
- statusów,
- logiki zapisu.
