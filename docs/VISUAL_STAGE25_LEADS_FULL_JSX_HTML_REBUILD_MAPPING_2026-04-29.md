# Visual Stage25 — Leady full JSX HTML rebuild mapping

| Funkcja obecna w repo | Gdzie jest teraz | Gdzie będzie w HTML UI | Czy zachowana | Uwagi |
|---|---|---|---|---|
| Tytuł zakładki `Leady` | `src/pages/Leads.tsx` header | `.page-head h1` | Tak | Bez zmiany routingu. |
| Opis pod tytułem | `src/pages/Leads.tsx` / poprzednie CSS pseudo | `.page-head .lead-copy` | Tak | Opis jest widoczny, nie pseudo-elementem. |
| Przycisk `Kosz` | header actions | `.head-actions .btn` | Tak | Zachowany `toggleTrashView`. |
| Licznik kosza | header button span | `.head-actions .pill` | Tak | Pokazuje `stats.trash` albo `stats.total`. |
| Przycisk `Dodaj leada` | header dialog trigger | `.head-actions .btn.primary` | Tak | Nadal otwiera ten sam `Dialog`. |
| Modal dodawania leada | `Dialog` | bez zmian w modal body | Tak | Zachowane pola i submit. |
| Pole `name` | formularz dialogu | `DialogContent` | Tak | Bez zmiany handlera. |
| Pole `company` | formularz dialogu | `DialogContent` | Tak | Bez zmiany handlera. |
| Pole `email` | formularz dialogu | `DialogContent` | Tak | Bez zmiany handlera. |
| Pole `phone` | formularz dialogu | `DialogContent` | Tak | Bez zmiany handlera. |
| Pole `dealValue` | formularz dialogu | `DialogContent` | Tak | Bez zmiany handlera. |
| Pole `source` | formularz dialogu | `DialogContent select` | Tak | Korzysta z `SOURCE_OPTIONS`. |
| Submit formularza dodania leada | `handleCreateLead` | `DialogFooter Button` | Tak | Nie rusza Supabase. |
| Kafelek `Wszystkie` | `StatShortcutCard` | `.grid-5 button.metric` | Tak | Usunięto zależność od starego DOM karty. |
| Kafelek `Aktywne` | `StatShortcutCard` | `.grid-5 button.metric` | Tak | Zachowany `toggleQuickFilter('active')`. |
| Kafelek `Wartość` | `StatShortcutCard` | `.grid-5 button.metric` | Tak | Zachowany `toggleValueSorting`. |
| Kafelek `Zagrożone` | `StatShortcutCard` | `.grid-5 button.metric` | Tak | Zachowany filtr `at-risk`. |
| Kafelek `Historia` | `StatShortcutCard` | `.grid-5 button.metric` | Tak | Zachowany filtr `history`. |
| Klik kafelka `Wszystkie` | `onClick` | `button.metric` | Tak | Czyści trash i sortowanie. |
| Klik kafelka `Aktywne` | `onClick` | `button.metric` | Tak | Bez zmiany logiki. |
| Klik kafelka `Wartość` | `onClick` | `button.metric` | Tak | Bez zmiany logiki. |
| Klik kafelka `Zagrożone` | `onClick` | `button.metric` | Tak | Bez zmiany logiki. |
| Klik kafelka `Historia` | `onClick` | `button.metric` | Tak | Bez zmiany logiki. |
| Search input | `Card/Input` | `.search input` | Tak | Zachowane `searchQuery`. |
| Datalist/sugestie wyszukiwania | `leadSearchSuggestions` | `.suggestions` + `datalist` | Tak | Linki do leadów zostają. |
| Lista leadów | stare karty/lista | `.table-card` | Tak | Nowy DOM zgodny z HTML. |
| Link do `/leads/:id` | link w rekordzie | `.row a.title` i `.btn.ghost` | Tak | Zachowane przejście do szczegółów. |
| Numer porządkowy wiersza | element rekordu | `.index` | Tak | Liczony z map index. |
| Nazwa leada | rekord listy | `.title` | Tak | Nie łamie tekstu pionowo. |
| Meta kontaktu | rekord listy | `.sub` | Tak | `buildLeadCompactMeta`. |
| Badge statusu | rekord listy | `.pill.blue` | Tak | `STATUS_OPTIONS`. |
| Badge źródła | rekord listy | `.pill` | Tak | `formatLeadSourceLabel`. |
| Wartość leada | rekord listy | `.lead-value-cell` | Tak | `dealValue`. |
| Najbliższa akcja | rekord listy | `.lead-action-cell` | Tak | `buildNextActionMeta`. |
| Komunikat `Brak zaplanowanych działań` | `buildNextActionMeta` | `.lead-action-cell strong` | Tak | Nie zmieniono helpera. |
| Przycisk przejścia do szczegółów | rekord listy | `.lead-actions .btn.ghost` | Tak | Link do `/leads/:id`. |
| Przycisk przeniesienia do kosza | rekord listy | `.lead-actions button` | Tak | Zachowany `handleArchiveLead`. |
| Restore z kosza | rekord listy | `.lead-actions button` | Tak | Zachowany `handleRestoreLead`. |
| Prawy panel `Najcenniejsze relacje` | aside/card | `.right-card` | Tak | Zachowane `mostValuableRelations`. |
| Linki z prawego panelu | relation board links | `.quick-list a` | Tak | Zachowane `entry.href`. |
| Wartość lejka razem | badge w panelu | `.pill.dark` | Tak | `formatRelationValue(relationFunnelValue)`. |
| Stan ładowania | lista | `.row.row-empty` | Tak | `loading || workspaceLoading`. |
| Stan błędu odczytu | lista | `.row.row-empty` | Tak | `loadError`. |
| Stan braku danych | lista | `.row.row-empty` | Tak | Zależny od `showTrash`. |
| Trial/access blokujący dodanie | `handleCreateLead` | bez zmian w handlerze | Tak | `hasAccess` zostaje. |
| `workspaceReady` | dialog trigger / submit | bez zmian | Tak | Nadal blokuje dodanie. |
| `hasAccess` | handler create/archive/restore | bez zmian | Tak | Nie ruszono dostępu. |
| `loadLeads` | logika komponentu | bez zmian | Tak | Nadal odświeża dane. |
| `handleCreateLead` | logika komponentu | bez zmian | Tak | Nadal zapisuje przez Supabase. |
| `handleArchiveLead` | logika komponentu | bez zmian | Tak | Nadal przenosi do kosza. |
| `handleRestoreLead` | logika komponentu | bez zmian | Tak | Nadal przywraca z kosza. |

## Decyzja wykonawcza

Stare CSS-y Stage22, Stage23 i Stage24 nie są dalej importowane, bo konfliktowały ze strukturą ekranu. Stage25 opiera się na prawdziwych klasach HTML: `page-head`, `grid-5`, `layout-list`, `search`, `table-card`, `row`, `right-card`, `quick-list`.
