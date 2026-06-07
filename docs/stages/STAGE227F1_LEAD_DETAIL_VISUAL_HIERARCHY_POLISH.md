# Stage227F1 â€” Lead Detail Visual Hierarchy Polish

Data: 2026-06-07 Europe/Warsaw
Tryb: local-only, bez pushu do czasu akceptacji.

## Cel

DopolerowaÄ‡ hierarchiÄ™ wizualnÄ… LeadDetail po Stage227E0-E6.

## Zasady

- 4 kafelki decyzji majÄ… byÄ‡ jednym dashboardem w gĂłrze widoku.
- `CO ROBIMY TERAZ?` znika z runtime.
- GĹ‚Ăłwny nagĹ‚Ăłwek pracy zostaje jako `DziaĹ‚ania leada`.
- NiĹĽsze sekcje majÄ… byÄ‡ wizualnie spokojniejsze od dashboardu decyzji.
- Nie ruszano SQL, Supabase, modelu danych, notatek, historii ani logiki work center.

## Testy

- `npm run check:stage227f1-lead-detail-visual-hierarchy-polish`
- `npm run test:stage227f1-lead-detail-visual-hierarchy-polish`
- regresje Stage227E6-E0
- `npm run build`
- `git diff --check`