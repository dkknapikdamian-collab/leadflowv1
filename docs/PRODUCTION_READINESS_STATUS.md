# CloseFlow — production readiness status

**Status:** nie oznaczać jako w pełni produkcyjnie gotowe bez przejścia checklisty poniżej.

Ten dokument jest miejscem, w którym repo mówi prawdę o stanie produktu. Nie ukrywamy ostrzeżeń, bo lepiej mieć czerwone lampki na pulpicie niż pożar w silniku.

## Decyzja produktowa

CloseFlow jest aplikacją SaaS lead/case follow-up.

Główna obietnica produktu:

> CloseFlow pokazuje, kogo trzeba ruszyć, czego nie wolno przegapić i które leady/sprawy wymagają następnego kroku.

## Architektura docelowa

- Frontend: React + Vite + TypeScript.
- Hosting: Vercel.
- Auth i dane aplikacyjne: Supabase-first.
- API: endpointy w katalogu `api/`.
- AI: backend-only, bez sekretów w kliencie.
- Billing: tylko po potwierdzeniu konfiguracji providerów i webhooków.

## Supabase-first

Supabase jest docelowym źródłem prawdy dla:

- użytkownika i workspace,
- leadów,
- klientów,
- spraw,
- zadań,
- wydarzeń,
- aktywności,
- szkiców AI,
- szablonów,
- portalu klienta,
- dostępu/billing state.

## Firebase / Firestore

Firebase / Firestore jest legacy/decommission.

Zasady:

- nie dopisujemy nowych funkcji biznesowych do Firestore,
- nie przenosimy write storm z Firestore do Supabase,
- wszystkie nowe mutacje mają iść przez API/Supabase,
- dokumentacja nie może przedstawiać Firebase jako architektury docelowej.

## Gotowe / częściowo gotowe

- Podstawowe widoki aplikacji są w repo.
- Supabase Auth jest kierunkiem docelowym.
- API używa tokenu Supabase i kontekstu workspace.
- Email verification jest egzekwowane dla kont e-mail/hasło, jeśli Supabase zwraca brak potwierdzenia.
- Mutacje powinny przechodzić przez API/Supabase.
- Guardy pilnują polskich znaków, części regresji UI i architektury.

## Wymaga potwierdzenia przed sprzedażą

- komplet migracji Supabase na produkcji,
- RLS i polityki dostępu dla wszystkich tabel,
- konfiguracja env na Vercel,
- test rejestracji nowego użytkownika od zera,
- test email verification,
- test trial/access/billing,
- test checkout/webhook, jeśli billing ma być aktywny,
- test AI bez sekretów w kliencie,
- test PWA na telefonie,
- test podstawowych mutacji: lead, klient, sprawa, zadanie, wydarzenie, notatka.

## Billing

Repo może zawierać moduły billingowe, ale produkcyjny billing wymaga osobnego potwierdzenia:

- provider płatności skonfigurowany,
- webhook działa,
- plan po płatności aktualizuje workspace,
- trial i access state nie wpuszczają użytkownika w sprzeczny stan,
- błędna płatność blokuje zapisy zgodnie z zasadą produktu.

## AI

AI może być używane tylko jako backend-only.

Zasady produkcyjne:

- brak `VITE_*` dla sekretów AI,
- frontend wywołuje endpoint aplikacji,
- AI nie tworzy finalnych rekordów bez zatwierdzenia użytkownika,
- jeśli AI nie ma danych z aplikacji, nie może ich zmyślać.

## Minimalne checki przed wdrożeniem

```bash
npm run check:polish-mojibake
npm run test:critical
npm run verify:closeflow:quiet
npm run check:a18-branding-docs
```

## Kryterium ostrożnego wydania

Aplikację można pokazać testowym użytkownikom, gdy:

- logowanie działa na produkcyjnym URL,
- workspace tworzy się poprawnie,
- użytkownik może dodać i edytować lead/klienta/sprawę/zadanie/wydarzenie,
- zapisy nie lecą przy każdej zmianie inputa,
- email verification nie wpuszcza niepotwierdzonego konta do pełnego zapisu,
- dokumentacja i env nie sugerują wielu sprzecznych produktów.
