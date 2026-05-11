# CLOSEFLOW CASE NOTE ACTIONS - ETAP 3

## Cel
Notatka w roadmapie sprawy ma być realnym rekordem z akcjami: podgląd, edycja, usunięcie i potwierdzenie usunięcia.

## Zakres
- Dodano centralny render akcji notatki w `ActivityRoadmap`.
- Dodano `ActivityItemPreviewDialog`.
- Dodano `EditActivityNoteDialog`.
- Dodano `updateActivityInSupabase` i `deleteActivityFromSupabase`.
- Dodano `check:closeflow-case-note-actions`.
- Repair preflight domyka `formatRoadmapActivityTitle`, jeśli ETAP 2 nie zapisał zmian w repo.

## Źródło prawdy
Akcja działa na rekordzie `activities` wskazanym przez `sourceId` itemu roadmapy. UI po edycji aktualizuje lokalny item, a po usunięciu ukrywa go bez reloadu.

## Bez migracji
Nie zmieniono tabel ani starych rekordów w bazie.
