# CloseFlow — mapa źródeł danych

## Status

Mapa obowiązuje od etapu 00 na branchu `dev-rollout-freeze`.

Cel: kolejne etapy nie mają zgadywać, gdzie zapisywać i skąd czytać dane.

## Decyzja główna

Docelowym źródłem prawdy jest Supabase.

Wszystkie obecne ścieżki Firebase / Firestore są oznaczone jako legacy do migracji.

## Mapa ekranów

| Ekran / moduł | Aktualny stan | Docelowe źródło prawdy | Status |
|---|---|---|---|
| Today | Supabase / częściowo helpery legacy zależnie od ścieżki | Supabase | docelowo Supabase |
| Leads | Supabase / możliwe ślady legacy | Supabase | legacy do migracji tam, gdzie występuje |
| LeadDetail | Supabase / możliwe ślady legacy | Supabase | legacy do migracji tam, gdzie występuje |
| Tasks | Supabase / możliwe ślady legacy | Supabase | legacy do migracji tam, gdzie występuje |
| Calendar | Supabase / możliwe ślady legacy | Supabase | legacy do migracji tam, gdzie występuje |
| Cases | Supabase | Supabase | docelowo Supabase |
| CaseDetail | Supabase / możliwe ślady legacy | Supabase | legacy do migracji tam, gdzie występuje |
| Clients | Supabase / możliwe ślady legacy | Supabase | legacy do migracji tam, gdzie występuje |
| ClientDetail | Supabase / możliwe ślady legacy | Supabase | legacy do migracji tam, gdzie występuje |
| Templates | Supabase | Supabase | docelowo Supabase |
| AI Drafts | Supabase | Supabase | docelowo Supabase |
| Billing | Supabase + Stripe | Supabase + Stripe | docelowo Supabase + Stripe |
| ClientPortal | Supabase + Supabase Storage | Supabase + Supabase Storage | docelowo Supabase + Storage |
| Activity | Supabase | Supabase | docelowo Supabase |
| Settings | Supabase | Supabase | docelowo Supabase |

## Mapa domen danych

| Domena | Docelowe źródło | Uwagi |
|---|---|---|
| Workspace | Supabase | Jeden workspace na użytkownika w V1. |
| Auth | Supabase Auth | Firebase Auth jest legacy do wygaszenia po migracji. |
| Leady | Supabase | Nie dopisywać nowych pól/flow do Firestore. |
| Klienci | Supabase | Klient jest rekordem wspólnym w tle. |
| Sprawy | Supabase | Sprawa jest głównym miejscem pracy po pozyskaniu tematu. |
| Zadania | Supabase | Jedno źródło dla Today, Tasks, Calendar i detali rekordów. |
| Wydarzenia | Supabase | Jedno źródło dla Today, Calendar i detali rekordów. |
| Aktywność | Supabase | Oś aktywności operatora i rekordów. |
| Szkice AI | Supabase | AI tworzy szkice, nie finalne rekordy. |
| Szablony | Supabase | Szablony użytkownika/workspace. |
| Billing | Supabase + Stripe | Supabase trzyma stan dostępu, Stripe obsługuje płatność. |
| Portal klienta | Supabase + Supabase Storage | Walidacja dostępu serwerowa, storage poza Firebase. |
| Pliki / uploady | Supabase Storage | Firebase Storage jest legacy do migracji. |

## Ścieżki legacy do migracji

Poniższe pliki należy traktować jako miejsca audytu i stopniowego wygaszania, nie jako miejsca rozwoju nowych funkcji:

- `src/firebase.ts`,
- `firestore.rules`,
- `storage.rules`,
- bezpośrednie importy `firebase/firestore`,
- bezpośrednie importy `firebase/storage`,
- bezpośrednie zapisy/odczyty Firestore w ekranach.

## Reguła dla kolejnych etapów

Jeśli etap dodaje nową funkcję danych, musi używać Supabase.

Jeśli etap naprawia istniejącą ścieżkę legacy, ma:

1. oznaczyć ją jako legacy,
2. nie rozszerzać jej ponad konieczną naprawę,
3. opisać docelową migrację do Supabase.

## Czego nie robi etap 00

Etap 00 nie przepina kodu i nie zmienia schematu.

To jest blokada decyzyjna, żeby kolejne etapy nie rozbudowywały Firestore i nie tworzyły drugiego źródła prawdy.
