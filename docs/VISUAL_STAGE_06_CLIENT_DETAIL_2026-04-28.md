# Visual Stage 06 — ClientDetail

Tabela mapowania i zakres etapu są zgodne z instrukcją przebudowy UI. Etap przenosi wizualnie kartę klienta na układ HTML: `layout-detail`, `person-card`, `hero-grid`, `hero.light`, `tabs`, `work-card`, `right-card`, bez zmiany logiki klienta.

| Funkcja obecna w repo | Gdzie jest teraz | Gdzie będzie w HTML UI | Czy zachowana | Uwagi |
|---|---|---|---|---|
| Karta klienta | `src/pages/ClientDetail.tsx` | `layout-detail` | Tak | Dodany scope `main-client-detail`. |
| Pobranie klienta | `fetchClientByIdFromSupabase` | ta sama karta | Tak | Supabase bez zmian. |
| Powiązane leady/sprawy/płatności | fetch z Supabase | sekcje relacji | Tak | Dane realne. |
| Zadania i wydarzenia klienta | `clientTasks`, `clientEvents` | `work-card` | Tak | Terminy i statusy bez zmian. |
| Historia aktywności | `clientActivities` | Historia / `work-card` | Tak | Bez zmiany typów. |
| Edycja klienta | `handleSave`, `contactEditing` | karta danych / szybka akcja | Tak | Sync klient → leady zostaje. |
| Multi email/telefon | `ClientMultiContactField` | karta danych kontaktowych | Tak | Add/remove zostaje. |
| Kopiuj kontakt | `copyValue` | szybka akcja | Tak | Clipboard bez zmian. |
| Nowa sprawa / nowy lead | `openNewCase`, `openNewLeadForExistingClient` | prawy panel akcji | Tak | Routing bez zmian. |

Ręcznie sprawdź: `/clients/:clientId`, edycję, zapis, anulowanie, multi kontakt, kopiowanie, otwieranie leadów/spraw, nowe sprawy/leady, zakładki i mobile.
