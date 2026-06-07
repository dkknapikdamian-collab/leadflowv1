# Stage227E4R2 — Lead Detail Decision View Simplification run report

Data: 2026-06-07 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Cel
Uprościć panel po Stage227E4: zamienić ciężki "Sygnał sprzedażowy" na lekki "Kontekst sprzedażowy" i usunąć z niego duplikaty danych technicznych typu źródło/status.

## Zakres
- Zmieniono sekcję na "Kontekst sprzedażowy".
- Usunięto duże pole "Powód kontaktu" z panelu decyzyjnego.
- Usunięto fallback helpera do input.sourceLabel.
- Usunięto fallback helpera do lead.status.
- Zostawiono tylko pola sterujące ruchem: potrzeba/problem, termin/pilność, budżet/potencjał, decyzja, blokada.
- Odchudzono CSS panelu.

## Testy
Skrypt uruchamia E4R2 guard/test, zaktualizowany E4 guard/test, regresję E2/E3 oraz npm run build.

## Audyt ryzyk
- Ryzyko: użytkownik może nadal potrzebować źródła/statusu podczas scrolla; decyzja: nie pokazywać ich jako dużych pól decyzyjnych, ale zostawić w headerze/danych leada.
- Ryzyko: brak dedykowanych pól w bazie oznacza część kart jako "Brak danych"; to celowe, bo panel ma ujawniać braki, a nie udawać pełne dane.
- Nie ruszano E2 top cards, E3 QuickActionsBar, CaseDetail, SQL ani Supabase.
