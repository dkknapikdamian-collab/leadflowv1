# Stage23A — ClientDetail cases visibility + contrast

## Źródło

Admin feedback z 2026-05-07 22:28 dla commita `0a61b5f108eda4f7c942493465340e7358adbd0b`.

## Cel

Naprawić regresje po Stage22A:

- niewidoczne ikonki kopiowania telefonu/e-maila,
- nieczytelne przyciski `Dodaj notatkę` i `Dyktuj`,
- pusta zakładka `Sprawy`.

## Zrobione

- Wymuszono widoczność przycisków kopiowania w danych klienta.
- Wymuszono kontrast ikon `Copy`.
- Poprawiono kontrast przycisków w karcie `Krótka notatka`.
- Panel `Sprawy` przestał używać ukrywanego atrybutu `data-client-relations-acquisition-only`.
- Panel listy spraw dostał jawny atrybut `data-client-cases-list-panel`.
- Copy przy przejściu do sprawy zmieniono na `Wejdź w sprawę`.

## Decyzja bezpieczeństwa

Nie dodano jeszcze destrukcyjnego `Usuń sprawę` bezpośrednio z karty klienta.

Powód: usuwanie sprawy musi mieć:
- potwierdzenie,
- backendowe uprawnienia,
- usunięcie/powiązanie aktywności,
- ochronę przed utratą danych.

W tej paczce użytkownik może wejść w sprawę i tam prowadzić edycję/dalsze akcje. Pełne rename/delete z poziomu klienta powinno wejść jako osobny Stage23B po sprawdzeniu endpointów spraw.

## Weryfikacja

```bash
node scripts/check-stage23a-client-detail-cases-visibility-contrast.cjs
```
