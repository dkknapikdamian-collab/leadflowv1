# STAGE232C_CLIENTS_RELATION_TILE_SOURCE_OF_TRUTH - audit / run decision

Data: 2026-06-15 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Status: DOCS_PREPARED / DO_WDROZENIA
Tryb: audit-first / source-of-truth / no runtime changes in this package

## Scan proof

Przeczytane pliki repo:

- `src/App.tsx`
- `src/pages/Clients.tsx`
- `src/pages/Leads.tsx` jako porównanie stylu i kafelków
- `src/components/StatShortcutCard.tsx`
- `src/styles/clients-next-action-layout.css`
- `src/styles/closeflow-record-list-source-truth.css`
- `src/lib/client-value.ts`
- `src/lib/owner-control/contact-cadence-grid.ts`
- `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`
- `_project/04_KIERUNEK_ROZWOJU_APLIKACJI.md`

Lokalnego Obsidiana nie aktualizowano bezpośrednio z tego pakietu. Payload do synchronizacji jest w `_project/obsidian_updates/`.

## Fakty z kodu

- `/clients` używa `Clients` z `src/pages/Clients.tsx`.
- `Clients.tsx` pobiera klientów, leady, sprawy, płatności, zadania i wydarzenia.
- Główna lista klientów startuje z `clients`, nie z leadów.
- `activeCount` liczy wszystkich niearchiwalnych klientów.
- `clientsWithoutCases` liczy klientów bez spraw.
- `staleClients` liczy klientów bez leadów, co nie jest poprawną definicją `bez ruchu`.
- `contactCadenceGrid` dla klientów jest budowany bez `relatedRecordsById`.
- Kafelek `Bez sprawy` i prawy filtr `Bez sprawy` nie ustawiają realnego filtra bez spraw; wywołują tylko `setShowArchived(false)`.
- `Prowizja` i `Najwyższa prowizja` wymagają ujednolicenia definicji z aktywną prowizją w wierszu klienta.
- Kolorystyka kafelków idzie przez `StatShortcutCard`, co jest dobrym kierunkiem, ale semantyka tonu musi odpowiadać danym.
- Lista klientów korzysta ze wspólnego `closeflow-record-list-source-truth.css`, co wspiera spójność z LeadListCard.

## Decyzja produktu

Zakładka `Klienci` nie ma być katalogiem kontaktów. Ma być relacyjnym panelem kontroli:

- kto jest aktywny,
- kto nie ma sprawy,
- gdzie jest aktywna prowizja,
- kto wymaga kontaktu,
- co jest najbliższym ruchem.

## Wdrożenie R1

Patrz etap `STAGE232C_CLIENTS_RELATION_TILE_SOURCE_OF_TRUTH` w `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`.

## Ryzyka

- Zmiana definicji `Bez ruchu` może zmienić liczby widoczne użytkownikowi; trzeba opisać to w changelogu.
- Ujednolicenie prowizji może obniżyć lub podwyższyć licznik względem starego fallbacku; to poprawka prawdy danych, ale wymaga testu ręcznego.
- Related records dla klientów mogą być kosztowniejsze obliczeniowo; robić jako memoized mapy, nie filtrować wielokrotnie w renderze.
- Nie usuwać starych CSS klientów bez guardu, bo część reguł jest legacy, ale nadal może chronić mobile/wide layout.

## Guardy do dodania

- `scripts/check-stage232c-clients-relation-tiles.cjs`
- `tests/stage232c-clients-relation-tiles.test.cjs`

## Test ręczny

Zobacz sekcję etapu w `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`.
