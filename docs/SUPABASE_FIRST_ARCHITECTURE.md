# CloseFlow — Supabase-first architecture

## Status

Obowiązuje od etapu 00 na branchu `dev-rollout-freeze`.

Ten dokument ustala kierunek architektoniczny dla kolejnych etapów. Nie wykonuje migracji danych i nie przepina ekranów samodzielnie.

## Decyzja

Supabase jest docelowym źródłem prawdy dla:

- danych biznesowych,
- auth,
- storage,
- billing,
- portalu klienta,
- AI drafts,
- szablonów,
- aktywności,
- konfiguracji workspace,
- przyszłych endpointów backendowych.

Firebase / Firestore jest warstwą legacy i ma zostać wygaszony po migracji.

## Co oznacza Supabase-first

1. Nowe funkcje biznesowe nie mogą być dopisywane do Firebase / Firestore.
2. Nowe tabele, zapisy, odczyty, API i storage mają być projektowane pod Supabase.
3. Firestore może zostać użyty tylko do utrzymania istniejącej ścieżki legacy do czasu migracji.
4. Każdy kolejny etap ma jasno oznaczyć, czy dotyka legacy Firestore, czy docelowej ścieżki Supabase.
5. Nie wolno tworzyć dwóch równoległych źródeł prawdy dla tego samego typu danych.

## Zakaz zaufania nagłówkom z frontu

Backend nie może ufać danym przesłanym przez frontend jako źródłu autoryzacji, w szczególności:

- `x-user-id`,
- `x-user-email`,
- `x-workspace-id`,
- dowolnym podobnym nagłówkom identyfikującym użytkownika lub workspace.

Tożsamość i workspace muszą być wyprowadzane po stronie backendu z poprawnie zweryfikowanej sesji/tokena.

## AI i zapis danych

AI nie może zapisywać finalnych danych bez potwierdzenia użytkownika.

Dozwolone:

- szkic leada,
- szkic zadania,
- szkic wydarzenia,
- szkic notatki,
- sugestia odpowiedzi,
- sugestia uporządkowania danych.

Niedozwolone:

- automatyczny finalny zapis leada,
- automatyczny finalny zapis zadania,
- automatyczny finalny zapis wydarzenia,
- automatyczne nadpisanie danych klienta/sprawy bez kroku zatwierdzenia.

## Firebase / Firestore legacy

Firebase / Firestore pozostaje w repo wyłącznie jako istniejąca warstwa przejściowa.

W kolejnych etapach należy:

1. zmapować realne użycia Firestore,
2. przepinać je etapami do Supabase,
3. po migracji usunąć ścieżki legacy,
4. nie dopisywać nowych modułów do Firestore.

## Supabase schema

Jeśli etap dotyka schematu Supabase, musi zawierać:

- migrację SQL,
- instrukcję odpalenia,
- opis rollbacku albo bezpiecznego cofnięcia,
- test ręczny.

## Weryfikacja każdego etapu

Każdy etap kończy się minimum:

```powershell
npm.cmd run lint
npm.cmd run build
```

Jeśli etap dotyka architektury Supabase-first, dodatkowo można uruchomić:

```powershell
npm.cmd run verify:architecture:supabase-first
```

## Granica etapu 00

Ten etap robi tylko decyzję i dokumentację.

Nie robi:

- przepinania kodu ekranów,
- migracji danych,
- zmian UI,
- usuwania Firebase dependency,
- zmian w regułach Firestore/Storage,
- zmian w schemacie Supabase.
