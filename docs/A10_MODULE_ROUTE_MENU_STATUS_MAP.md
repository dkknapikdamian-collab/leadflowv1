# A10 Module Route/Menu Status Map

Data: 2026-05-01

## Operator menu docelowe (wdrożone)

1. Dziś
2. Leady
3. Sprawy
4. Zadania
5. Kalendarz
6. Klienci
7. Szablony
8. Aktywność
9. Rozliczenia
10. Ustawienia

## Mapa modułów

| Plik strony | Route | Pozycja menu | Status |
|---|---|---|---|
| `src/pages/Today.tsx` | `/` | `Dziś` | gotowy |
| `src/pages/Leads.tsx` | `/leads` | `Leady` | gotowy |
| `src/pages/Cases.tsx` | `/cases` | `Sprawy` | gotowy |
| `src/pages/Tasks.tsx` | `/tasks` | `Zadania` | gotowy |
| `src/pages/Calendar.tsx` | `/calendar` | `Kalendarz` | gotowy |
| `src/pages/Clients.tsx` | `/clients` | `Klienci` | gotowy |
| `src/pages/Templates.tsx` | `/templates` | `Szablony` | gotowy |
| `src/pages/Activity.tsx` | `/activity` | `Aktywność` | gotowy |
| `src/pages/Billing.tsx` | `/billing` | `Rozliczenia` | gotowy |
| `src/pages/Settings.tsx` | `/settings` | `Ustawienia` | gotowy |
| `src/pages/ClientDetail.tsx` | `/clients/:clientId` | brak (wejście kontekstowe) | gotowy, nie jest top-level |
| `src/pages/ResponseTemplates.tsx` | `/response-templates` | brak | ukryte (w trakcie porządkowania zakresu) |
| `src/pages/AiDrafts.tsx` | `/ai-drafts` | brak | ukryte/beta |
| `src/pages/SupportCenter.tsx` | `/help` | brak | ukryte (wymaga konfiguracji i final copy) |
| `src/pages/NotificationsCenter.tsx` | `/notifications` | brak | ukryte/beta |
| `src/pages/AdminAiSettings.tsx` | `/settings/ai` | brak | ukryte (admin-only) |

## Uwagi

- Route istnieją dla modułów ukrytych, ale nie są reklamowane jako gotowe funkcje w menu operatora.
- Widoczne moduły operatora mają route i nie prowadzą do pustego ekranu.
