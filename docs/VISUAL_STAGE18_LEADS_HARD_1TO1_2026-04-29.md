# Visual Stage18: Leady hard 1:1

Cel: przepiąć zakładkę **Leady** pod system wizualny z `closeflow_full_app_modern_5s_ui_concept.html`, bez zmiany logiki aplikacji.

## Mapowanie funkcji

| Funkcja obecna w repo | Gdzie jest teraz | Gdzie będzie w HTML UI | Czy zachowana | Uwagi |
|---|---|---|---|---|
| Lista leadów | `src/pages/Leads.tsx` | `layout-list` + `table-card` + `row` | Tak | Dane nadal pochodzą z obecnych fetchy/Supabase. |
| Dodanie leada | przycisk/modal w `Leads.tsx` | `page-head` / `head-actions` jako przycisk primary | Tak | Nie zmieniam formularza ani zapisu. |
| Kosz / historia | istniejący przełącznik/kontrolka w `Leads.tsx` | `head-actions` albo drugi przycisk w nagłówku | Tak | CSS nie zmienia działania. |
| Wyszukiwarka | input/sugestie Stage31 | `search` nad listą | Tak | Zachowany datalist/suggestions. |
| Metryki leadów | górne kafle statystyk | `grid-5` + `metric` | Tak | Tylko skóra CSS. |
| Top relacji / wartość | prawy rail Stage32 | `right-card` + `quick-list` | Tak | Zachowana obecna zawartość. |
| Link do karty leada | `Link` w wierszu | klik w `row` | Tak | Routing bez zmian. |
| Archiwizacja / przywracanie | akcje obecne w wierszach/modalu | obecne miejsce, ostylowane jako przycisk/akcja | Tak | Bez ruszania logiki. |
| AI dla leadów | istniejący trigger globalny/kontekstowy | `btn soft-blue` | Tak | Nie dodajemy nowego AI. |
| Mobile | obecne klasy responsywne | układ 1 kolumna + 2 kolumny metryk | Tak | Tylko CSS. |

## Zakres zmian

- `src/styles/visual-stage18-leads-hard-1to1.css`
- `src/index.css`
- `src/pages/Leads.tsx` tylko marker etapu, bez zmiany logiki
- `src/components/Layout.tsx` tylko kompatybilność shell, jeśli brakuje klasy HTML skin
- `package.json` tylko guard script i dopięcie do lint
- `scripts/check-visual-stage18-leads-hard-1to1.cjs`

## Poza zakresem

- Supabase
- API
- auth
- billing
- model danych
- formularze i modale
- zachowanie kliknięć i routing

## Kryterium zakończenia

- `npm run check:visual-stage18-leads-hard-1to1`
- `npm run check:visual-stage01-shell`
- `npm run check:visual-stage03-leads`
- `npm run check:polish`
- `npm run build`
- `npm run lint`
- `npm run verify:closeflow:quiet`
