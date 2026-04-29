# VISUAL_STAGE24_LEADS_HTML_DOM_PARITY_HARDFIX_2026-04-29

Cel: naprawic zakladke Leady po Stage22/Stage23, bo CSS-only lock nie dal wygladu 1:1 z HTML.

## Funkcja obecna w repo | Gdzie jest teraz | Gdzie bedzie w HTML UI | Czy zachowana | Uwagi

| Funkcja obecna w repo | Gdzie jest teraz | Gdzie bedzie w HTML UI | Czy zachowana | Uwagi |
|---|---|---|---|---|
| Dodaj leada | header Leads | prawa strona page-head | tak | Ten sam Dialog i handleCreateLead. |
| Kosz / pokaz aktywne | header Leads | prawa strona page-head | tak | Ten sam toggleTrashView. |
| Metryki Wszystkie/Aktywne/Wartosc/Zagrozone/Historia | grid StatShortcutCard | HTML grid-5 metric | tak | Zostaja klikalne. |
| Search | karta pod metrykami | HTML search w lewej kolumnie layout-list | tak | Ten sam stan searchQuery i datalist. |
| Sugestie search | pod search | pod search | tak | Ten sam leadSearchSuggestions. |
| Najcenniejsze relacje | prawy rail | HTML right-card | tak | Ten sam mostValuableRelations. |
| Lista leadow | lista kart | HTML table-card / row rhythm | tak | Linki do LeadDetail zostaja. |
| Usuwanie do kosza | przy rekordzie | przy rekordzie | tak | Ten sam handleArchiveLead. |
| Przywracanie z kosza | przy rekordzie | przy rekordzie | tak | Ten sam handleRestoreLead. |

## Czego nie zmieniac

- API
- Supabase
- auth
- billing
- routing
- formularz dodawania leada
- search
- filtry
- kosz
- linki do LeadDetail

## Co naprawia Stage24

- usuwa efekt malej, waskiej wyspy na srodku ekranu,
- przywraca proporcje HTML,
- usuwa wielki bialy box naglowka,
- usuwa zdublowany kicker,
- przywraca prostokatne kafle grid-5,
- naprawia ucinanie tekstu w lead row,
- usuwa czarne rogi/pseudo-artefakty na prawym panelu,
- spina search, liste i right rail blizej HTML.