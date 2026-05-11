# CLOSEFLOW_ACTIVITY_ROADMAP_LABELS_REPAIR_2026-05-10

## Cel

ETAP 2 usuwa z UI bezwartościowy opis `Dodano ruch w sprawie` i wprowadza centralny formatter tytułów roadmapy.

## Zakres

- `src/lib/activity-roadmap.ts`
  - dodaje `formatRoadmapActivityTitle(item: ActivityRoadmapItem): string`,
  - utrzymuje stare dane bez migracji bazy,
  - formatuje wpisy roadmapy według rodzaju aktywności.
- `src/components/ActivityRoadmap.tsx`
  - renderuje tytuł przez `formatRoadmapActivityTitle(item)`, a nie bezpośrednio przez `item.title`.
- `src/pages/CaseDetail.tsx`
  - nie może renderować ani trzymać UI fallbacku `Dodano ruch w sprawie`.
- `scripts/check-closeflow-activity-roadmap-labels.cjs`
  - pilnuje formattera, renderu i package scriptu.

## Reguły tytułów

- `note` -> `Dodano notatkę`
- `task_created` -> `Dodano zadanie: {title}`
- `task_done` -> `Wykonano zadanie: {title}`
- `event_created` -> `Dodano wydarzenie: {title}`
- `event_done` -> `Zakończono wydarzenie: {title}`
- `payment_added` -> `Dodano wpłatę {amount} PLN`
- `payment_removed` -> `Usunięto wpłatę {amount} PLN`
- `payment_updated` -> `Zmieniono wpłatę {amount} PLN`
- `case_created` -> `Utworzono sprawę`
- `case_updated` -> `Zmieniono sprawę`
- `case_deleted` -> `Usunięto sprawę`
- `missing_item_added` -> `Dodano brak: {title}`
- `missing_item_done` -> `Uzupełniono brak: {title}`
- `status_changed` -> `Zmieniono status: {from} → {to}`
- `unknown` -> `Zaktualizowano sprawę`

## Test danych ręczny

1. Dodaj wpłatę `3500 PLN` do sprawy.
   - Oczekiwane: `Dodano wpłatę 3 500 PLN`.
2. Dodaj notatkę.
   - Oczekiwane: `Dodano notatkę`.
3. Usuń albo zasymuluj usunięcie wpłaty.
   - Oczekiwane: `Usunięto wpłatę 3 500 PLN`.
4. Dodaj zadanie.
   - Oczekiwane: `Dodano zadanie: ...`.
5. Odśwież stronę.
   - Oczekiwane: tytuły pozostają czytelne bez migracji starych rekordów.

## Nie zmieniono

- Nie ma migracji starych rekordów w bazie.
- Nie ma zmiany nazw tabel.
- Nie ma przebudowy globalnej zakładki Aktywność.
