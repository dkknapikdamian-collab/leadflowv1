# CloseFlow — Data source map

## Decyzja główna

Docelowym źródłem prawdy jest Supabase.

Firestore/Firebase jest legacy do migracji i nie jest miejscem nowych funkcji danych.

## Mapa ekranów

| Ekran / moduł | Źródło docelowe | Uwagi |
|---|---|---|
| Today | Supabase | Dane agregowane z leadów, zadań, wydarzeń, spraw i szkiców. |
| Leads | Supabase | Leady sprzedażowe i statusy z kontraktu domenowego. |
| LeadDetail | Supabase | Dane leada, notatki, zadania, wydarzenia, aktywność. |
| Tasks | Supabase | Zadania operatora i follow-upy. |
| Calendar | Supabase | Zadania i wydarzenia w jednej osi czasu. |
| Cases | Supabase | Sprawy po sprzedaży. |
| CaseDetail | Supabase | Operacyjny hub sprawy, checklisty i aktywność. |
| Clients | Supabase | Klienci i relacje z leadami/sprawami. |
| ClientDetail | Supabase | Dane klienta, relacje, notatki i historia. |
| Templates | Supabase | Szablony odpowiedzi i checklist. |
| AI Drafts | Supabase | Szkice AI do zatwierdzenia. |
| Billing | Supabase + Stripe | Supabase trzyma stan dostępu, Stripe obsługuje płatności. |
| Portal | Supabase + Supabase Storage | Dostęp serwerowy, dane i pliki poza Firestore. |
| ClientPortal | Supabase + Supabase Storage | Alias dokumentacyjny dla portalu klienta. |
| Activity | Supabase | Oś aktywności operatora i rekordów. |
| Settings | Supabase | Ustawienia workspace i użytkownika. |

## Mapa domen danych

| Domena | Źródło docelowe | Status |
|---|---|---|
| Auth | Supabase Auth | Firebase Auth zostaje tylko jako legacy kompatybilność do wygaszenia. |
| Workspace | Supabase | Jeden kontrakt workspace. |
| Profiles / role admin | Supabase | Role z `profiles.role` / `profiles.is_admin`. |
| Leady | Supabase | Brak nowych zapisów Firestore. |
| Klienci | Supabase | Brak nowych zapisów Firestore. |
| Sprawy | Supabase | Brak nowych zapisów Firestore. |
| Zadania | Supabase | Brak nowych zapisów Firestore. |
| Wydarzenia | Supabase | Brak nowych zapisów Firestore. |
| Szkice AI | Supabase | AI zapisuje szkice, nie finalne rekordy bez zatwierdzenia. |
| Szablony | Supabase | Szablony workspace. |
| Billing | Supabase + Stripe | Stripe jako provider płatności, Supabase jako stan dostępu. |
| Portal klienta | Supabase + Supabase Storage | Storage plików w Supabase Storage. |
| Uploady / pliki | Supabase Storage | Firebase Storage legacy/decommission. |

## Pliki legacy do pilnowania

Te miejsca mogą istnieć, ale nie są kierunkiem rozwoju nowych funkcji danych:

- `src/firebase.ts`,
- `firebase-applet-config.json`,
- `firestore.rules`,
- `storage.rules`,
- `src/lib/firebase-utils.ts`,
- dokumenty w `docs/legacy/`.

## Reguła wykonawcza

Każdy kolejny etap, który dodaje lub modyfikuje dane runtime, musi wskazać Supabase/API jako źródło danych. Jeżeli dotyka Firebase/Firestore, musi oznaczyć to jako legacy i nie może rozszerzać tego kierunku.
