# VISUAL_STAGE23_LEADS_HTML_PARITY_FIX_2026-04-29

## Cel

Domkniecie zakladki **Leady** wizualnie pod HTML `closeflow_full_app_modern_5s_ui_concept.html` bez zmiany logiki aplikacji.

## Zakres

- page head ma byc jak w HTML: bez duzej bialej karty, z kickerem, H1 i opisem,
- metryki maja byc prostokatne `grid-5`, bez efektu okraglych/polamanych kart,
- search ma miec ksztalt HTML `.search`,
- prawy panel ma byc w tym samym miejscu co w HTML,
- lista leadow ma byc czytelna, bez ucinania tekstu,
- mobile ma zostac czytelny i bez rozjezdzania.

## Tabela mapowania

| Funkcja obecna w repo | Gdzie jest teraz | Gdzie bedzie w HTML UI | Czy zachowana | Uwagi |
|---|---|---|---|---|
| Dodaj leada | `src/pages/Leads.tsx`, header, Dialog | Page head, prawy gorny przycisk | Tak | Dziala ten sam `handleCreateLead`. |
| Kosz leadow | `toggleTrashView`, header | Page head obok dodawania | Tak | Nie zmieniono logiki kosza. |
| Metryki | `StatShortcutCard` grid | HTML `grid-5` / `metric` | Tak | Stage23 wymusza prostokatne karty. |
| Filtr aktywne/wartosc/zagrozone/historia | klikane metryki | te same metryki | Tak | Nie zmieniono stanu ani handlerow. |
| Wyszukiwarka | `Input` + `datalist` | HTML `.search` | Tak | Zachowane sugestie i wyszukiwanie. |
| Sugestie wyszukiwania | `leadSearchSuggestions` | Pod search | Tak | Bez zmiany danych. |
| Lista leadow | karty/lista z linkiem do `LeadDetail` | HTML `table-card` / `row` | Tak | Stage23 usuwa wizualne ucinanie tekstu. |
| Najcenniejsze relacje | `data-stage32-leads-value-rail` | Prawy panel `right-card` | Tak | Zostaje po prawej jak w HTML. |
| Link do szczegolu leada | `/leads/:id` | klik w rekord | Tak | Routing bez zmian. |
| Statusy/badge | `Badge` | HTML `pill/statusline` | Tak | Tylko styl. |

## Elementy z HTML, ktore nie sa osobna funkcja w repo

- HTML pokazuje statyczna strukture row/table, ale repo ma realne karty z danymi i linkami.
- Nie podmieniono danych na statyczne.
- Nie dodano atrap akcji.

## Nie zmieniono

- API,
- Supabase,
- modelu danych,
- auth,
- billing/access,
- routingu,
- formularza dodawania leada,
- kosza,
- filtrowania,
- wyszukiwarki,
- linkow do `LeadDetail`.

## Weryfikacja

- `node scripts/check-visual-stage23-leads-html-parity-fix.cjs`
- `node scripts/check-polish-mojibake.cjs`
- `npm.cmd run build`
