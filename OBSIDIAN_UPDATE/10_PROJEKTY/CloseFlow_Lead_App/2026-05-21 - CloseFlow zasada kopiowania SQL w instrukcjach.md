# 2026-05-21 - CloseFlow zasada kopiowania SQL w instrukcjach

## Routing

- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- public app: https://closeflowapp.vercel.app
- new Supabase project ref: amrxiaetdocrywnnkoct
- Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App
- entity_id/workspace_id/project_id: DO_POTWIERDZENIA

## Decyzja Damiana

Każdy SQL, który Damian ma ręcznie uruchomić w Supabase Dashboard albo innym panelu, ma być podany w odpowiedzi jako pełny blok do skopiowania.

Nie wystarczy podać samej ścieżki do pliku, np. `supabase/migrations/...sql`.

## Zasada wykonawcza dla kolejnych etapów

Jeżeli etap wymaga ręcznego SQL:

1. Najpierw podaj dokładną lokalizację, gdzie wkleić SQL, np. `Supabase Dashboard -> SQL Editor -> New query`.
2. Następnie podaj kompletny blok SQL do skopiowania.
3. Dopiero potem podaj ścieżkę pliku w repo jako źródło prawdy.
4. Jeżeli SQL dotyczy konkretnego projektu Supabase, podaj project ref i ostrzeż, żeby nie uruchamiać go w złym projekcie.
5. Jeżeli SQL ma być uruchomiony po deployu albo przed deployem, napisz to jawnie.
6. Jeżeli są testy po SQL, podaj je jako gotowe komendy albo kroki ręczne.

## Stage129 przykład

Dla Stage129 SQL dotyczy nowego Supabase:

```text
amrxiaetdocrywnnkoct
```

SQL źródłowy:

```text
supabase/migrations/20260502_portal_uploads_storage_bucket.sql
```

W odpowiedzi dla Damiana SQL musi być pokazany jako gotowy blok do skopiowania.

## Status

- status zapisu: przygotowano w repo jako aktualizacja Obsidiana
- czego nie ruszano: Google Calendar, import leadów, Stripe, Resend, AI
- następny krok: uruchomić SQL Stage129 w Supabase SQL Editor dla projektu `amrxiaetdocrywnnkoct`
