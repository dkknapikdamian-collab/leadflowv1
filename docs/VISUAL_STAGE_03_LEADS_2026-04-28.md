# Visual Stage 03 — Leady

## Cel
Przepiecie ekranu Leadów na docelowy system wizualny z HTML-a: page-head, grid-5, search, lista, prawa karta Najcenniejsze relacje oraz mobile polish. Repo zostaje zrodlem prawdy dla danych i funkcji.

## Tabela mapowania

| Funkcja obecna w repo | Gdzie jest teraz | Gdzie bedzie w HTML UI | Czy zachowana | Uwagi |
|---|---|---|---|---|
| Lista leadow | `src/pages/Leads.tsx` | lista/table-card | Tak | Dane bez zmian. |
| Dodaj leada | `isNewLeadOpen`, `handleCreateLead` | page-head i global-bar | Tak | Formularz i Supabase zostaja. |
| Globalne `+ Lead` | `consumeGlobalQuickAction() === 'lead'` | globalny pasek akcji | Tak | Otwiera obecny modal. |
| Wyszukiwarka | `searchQuery` | search | Tak | Szuka po nazwie, telefonie, mailu, firmie, zrodle i sprawie. |
| Sugestie | `leadSearchSuggestions` | lista pod search | Tak | Link do realnego LeadDetail. |
| Metryki | `StatShortcutCard` | grid-5 | Tak | Wszystkie, Aktywne, Wartosc, Zagrozone, Historia. |
| Kosz | `showTrash`, `toggleTrashView` | akcja w naglowku | Tak | Archiwizacja i restore zostaja. |
| Archiwizuj | `handleArchiveLead` | akcja rekordu | Tak | `updateLeadInSupabase` bez zmian. |
| Przywroc | `handleRestoreLead` | akcja w koszu | Tak | Status przywracania bez zmian. |
| Najcenniejsze relacje | `mostValuableRelations` | right-card | Tak | Realne dane z relacji. |
| HTML: panel AI | Stage 18 | Nie w tym etapie | Nie dodano nowej logiki AI. |

## Nie zmieniaj
Supabase, API, auth, billing, modelu danych, flow kosza, flow lead -> sprawa.

## Reczne sprawdzenie
`/leads`, dodanie leada, search, sugestie, metryki, kosz, archiwizacja, przywracanie, klik w rekord, prawa karta relacji, mobile ponizej 760 px.
