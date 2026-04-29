# Visual Stage 05 — Klienci

Tabela mapowania i zakres etapu są zgodne z instrukcją przebudowy UI. Etap przenosi wizualnie ekran Klienci na system HTML bez zmiany Supabase, API, modelu danych, formularza, kosza, archiwizacji, przywracania, wyszukiwarki i linków do ClientDetail.

| Funkcja obecna w repo | Gdzie jest teraz | Gdzie będzie w HTML UI | Czy zachowana | Uwagi |
|---|---|---|---|---|
| Lista klientów | `src/pages/Clients.tsx` | `table-card` / karta listy | Tak | Dane i sortowanie bez zmian. |
| Dodaj klienta | `Dialog`, `createClientInSupabase` | `page-head` / przycisk główny | Tak | Formularz zostaje. |
| Wyszukiwarka | `search`, `filtered` | `search` | Tak | Logika bez zmian. |
| Kosz | `showArchived` | akcja w nagłówku | Tak | Archiwizacja i restore zostają. |
| Powiązane leady/sprawy/rozliczenia | `countersByClientId` | badge/liczniki | Tak | Realne dane. |
| Klik w klienta | `Link to=/clients/:id` | rekord klienta | Tak | Routing bez zmian. |

Ręcznie sprawdź: `/clients`, dodanie klienta, kosz, restore, wyszukiwarkę, link do karty klienta i mobile.
