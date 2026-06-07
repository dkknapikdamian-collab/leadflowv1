# STAGE227C2_MISSING_ITEM_QUICK_ACTION_MODAL

Data: 2026-06-07 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: local-only

## Cel

Dodać mały, współdzielony kontrakt modala dla szybkiej akcji Brak.

## Decyzja

Brak pozostaje lekką szybką akcją:
- bez SQL,
- bez nowej tabeli,
- bez checklisty,
- bez rozbudowanego workflow,
- bez bezpośredniego zapisu do Supabase w komponencie modala.

## Zakres C2

- wspólny kontrakt danych modala,
- wspólny komponent MissingItemQuickActionModal,
- wymagane pole: Czego brakuje?,
- opcjonalne pole: Notatka,
- przygotowanie pod późniejsze podpięcie w LeadDetail, ClientDetail i CaseDetail.

## Routing zapisu

- Lead/Client: późniejszy zapis przez istniejący task/activity jako missing_item/blocker.
- Case: późniejszy zapis przez istniejące case_items.

## Czego nie robić

- Nie tworzyć migracji.
- Nie tworzyć tabel.
- Nie robić pełnego systemu braków.
- Nie mieszać braku z notatką.
- Nie pisać bezpośrednio do Supabase z modala.

## Testy

- check:stage227c2-missing-item-quick-action-modal
- test:stage227c2-missing-item-quick-action-modal
- npm run build
