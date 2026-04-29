# VISUAL_STAGE22_LEADS_FINAL_LOCK_2026-04-29

## Cel

Domkniecie zakladki Leady pod system wizualny z `closeflow_full_app_modern_5s_ui_concept.html` bez zmiany dzialania aplikacji.

## Zakres

Tylko warstwa wizualna:

- page head,
- metryki `grid-5`,
- przyciski w stalym miejscu,
- ikony,
- wyszukiwarka,
- sugestie wyszukiwania,
- prawa kolumna `Najcenniejsze relacje`,
- lista leadow,
- kosz,
- mobile layout.

## Funkcja obecna w repo | Gdzie jest teraz | Gdzie bedzie w HTML UI | Czy zachowana | Uwagi

| Funkcja obecna w repo | Gdzie jest teraz | Gdzie bedzie w HTML UI | Czy zachowana | Uwagi |
|---|---|---|---|---|
| Lista leadow | `src/pages/Leads.tsx` | glowna lista po lewej, rytm `table-card` / `row` | Tak | Bez zmiany danych i routingu. |
| Dodaj leada | header, `Dialog`, `handleCreateLead` | prawy przycisk w `page-head`, styl `btn.primary` | Tak | Formularz i submit zostaja. |
| Kosz / pokaz aktywne | header, `toggleTrashView` | lewy przycisk w `page-head`, styl soft button | Tak | Nie usunieto ani nie ukryto. |
| Metryka Wszystkie | `StatShortcutCard` | `grid-5` / `metric` | Tak | Klik nadal zmienia filtr. |
| Metryka Aktywne | `StatShortcutCard` | `grid-5` / `metric` | Tak | Klik nadal zmienia filtr. |
| Metryka Wartosc | `StatShortcutCard` | `grid-5` / `metric` | Tak | Klik nadal wlacza sortowanie po wartosci. |
| Metryka Zagrozone | `StatShortcutCard` | `grid-5` / `metric` | Tak | Klik nadal filtruje zagrozone. |
| Metryka Historia | `StatShortcutCard` | `grid-5` / `metric` | Tak | Klik nadal pokazuje leady przeniesione do obslugi. |
| Wyszukiwarka | input z `lead-search-suggestions-stage31` | karta search pod metrykami | Tak | Datalist i sugestie zostaja. |
| Sugestie wyszukiwania | `data-stage31-lead-search-suggestions` | lista pod search, styl `quick-list` | Tak | Linki do LeadDetail zostaja. |
| Najcenniejsze relacje | `data-stage32-leads-value-rail` | right-card po prawej | Tak | Linki i wartosci zostaja. |
| Prawa kolumna | `aside` sticky | `right-card` z HTML | Tak | Zachowane jako logiczny panel boczny. |
| Statusy i badge | `Badge`, status leadow | `pill` / statusline | Tak | Kolory znormalizowane do HTML tokenow. |
| Archiwizacja / przywrocenie | przyciski w rekordach i handlerach | zostaja przy rekordzie / akcjach rekordu | Tak | Nie ruszano handlerow. |
| Modal nowego leada | `DialogContent` | ten sam modal, zaokraglenia jak HTML | Tak | Bez zmiany pol i walidacji. |
| Mobile | CSS media queries | jednokolumnowy uklad, sidebar ukrywa shell | Tak | Bez zmian routingu. |

## Elementy z HTML, ktore nie sa nowa logika

- HTML pokazuje idealny rytm klas `page-head`, `grid-5`, `metric`, `layout-list`, `right-card`.
- W repo te elementy sa przepiete przez CSS na realne komponenty React.
- Nie dodano statycznych danych z HTML.
- Nie dodano nowego zachowania, jesli nie bylo go w repo.

## Nie zmieniono logiki

- Nie zmieniono API.
- Nie zmieniono Supabase.
- Nie zmieniono auth.
- Nie zmieniono billing/access.
- Nie zmieniono routingu.
- Nie zmieniono `handleCreateLead`.
- Nie zmieniono `toggleTrashView`.
- Nie zmieniono filtrowania, sortowania ani wyszukiwania.
- Nie zmieniono danych leadow.

## Weryfikacja

Uruchamiane przez paczke:

```text
node scripts/check-visual-stage22-leads-final-lock.cjs
node scripts/check-polish-mojibake.cjs
npm.cmd run build
```
