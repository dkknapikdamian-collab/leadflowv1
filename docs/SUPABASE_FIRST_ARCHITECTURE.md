# CloseFlow — Supabase-first architecture

## Status

Ten dokument obowiązuje dla repo CloseFlow na branchu `dev-rollout-freeze`.

A21 blokuje kierunek architektury: CloseFlow jest produktem Supabase-first. Firebase może zostać w repo tylko jako warstwa legacy kompatybilności, dopóki kod jej jeszcze potrzebuje, ale nowe funkcje danych nie mogą wracać do Firestore.

## Decyzja

Supabase jest docelowym źródłem prawdy dla danych biznesowych, autoryzacji aplikacyjnej, workspace, storage, portalu klienta, szkiców AI, szablonów, aktywności i przyszłych endpointów backendowych.

Firebase / Firestore jest warstwą legacy/decommission.

Nie wolno tworzyć dwóch równoległych źródeł prawdy.

## Co oznacza Supabase-first

1. Nowe funkcje biznesowe zapisują i czytają dane przez Supabase albo backendowe API używające Supabase.
2. Ekrany aplikacji nie mogą dostawać nowych runtime importów Firestore.
3. Firestore nie może być używany jako nowe miejsce zapisu leadów, klientów, spraw, zadań, wydarzeń, szkiców AI, billingów, portalu ani szablonów.
4. Jeżeli istniejąca ścieżka legacy wymaga naprawy, etap musi opisać ją jako legacy i nie wolno jej rozszerzać ponad konieczną naprawę.
5. Supabase schema i backend API są kierunkiem kontraktu danych.

## Firebase, którego jeszcze nie usuwamy

Nie usuwamy Firebase na siłę, jeżeli kod nadal zależy od:

- Firebase Auth w istniejących miejscach kompatybilności,
- konfiguracji startowej,
- plików legacy,
- reguł historycznych,
- helperów oznaczonych jako legacy.

To nie daje zgody na nowe użycia Firestore w runtime.

## Zakaz zaufania klientowi

Backend nie może ufać danym przesłanym przez frontend jako źródłu autoryzacji, w szczególności:

- `x-user-id`,
- `x-user-email`,
- `x-workspace-id`,
- query paramom admina,
- body z podstawionym emailem lub rolą.

Tożsamość, workspace i uprawnienia muszą wynikać z backendowo zweryfikowanej sesji oraz z danych w Supabase.

## AI i zapis danych

AI nie może zapisywać finalnych danych bez potwierdzenia użytkownika.

Dozwolone są szkice, podpowiedzi, transkrypcje i propozycje. Finalny zapis leada, zadania, wydarzenia, notatki, klienta albo sprawy wymaga jawnego workflow zatwierdzenia, chyba że etap opisuje bezpieczny, celowy wyjątek, taki jak notatka głosowa zapisywana po dyktowaniu.

## Weryfikacja

Guard architektury:

```powershell
npm.cmd run verify:architecture:supabase-first
```

Guard ma łapać nowe runtime użycia Firestore w `src/` i `api/`, ale nie ma usuwać Firebase jako zależności legacy, jeśli aplikacja nadal jej potrzebuje.

## Kryterium zakończenia

Repo mówi jednym głosem: CloseFlow jest Supabase-first, a Firestore jest legacy/decommission i nie jest miejscem nowych zapisów.
