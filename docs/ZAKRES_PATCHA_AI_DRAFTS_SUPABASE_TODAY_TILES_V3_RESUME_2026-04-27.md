# CloseFlow patch v3 resume — AI Drafts Supabase + Today tiles

Data: 2026-04-27
Repo: `dkknapikdamian-collab/leadflowv1`
Branch: `dev-rollout-freeze`

## Dlaczego powstał v3 resume

Paczka v2 zatrzymała się na `src/lib/ai-usage-guard.ts`, bo patcher szukał zbyt sztywnego fragmentu `AiUsageOptions block`.
Ten patch jest wznowieniem po częściowo wykonanej paczce v2.

## Zakres

1. Kończy patch po przerwanym v2.
2. Przepina Szkice AI na Supabase z lokalnym fallbackiem.
3. Dodaje `/api/ai-drafts`.
4. Dodaje `/api/assistant-context`.
5. Daje asystentowi kontekst: leady, zadania, wydarzenia, sprawy, klienci, szkice.
6. Poprawia kafelki na ekranie `Dziś`, żeby otwierały właściwe sekcje.
7. Resetuje pole dyktowania przy nowej sesji, żeby nie dopisywać starych tekstów.
8. Dodaje `VITE_AI_USAGE_UNLIMITED=true` do `.env.local` i `.env.example`.

## SQL

Uruchom w Supabase SQL Editor:

```text
sql/2026-04-27_ai_drafts_supabase.sql
```

## Testy po wdrożeniu

```powershell
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
npm.cmd run build
```

## Kontrola ręczna

- `Dziś` → kliknięcie kafelków u góry przewija do odpowiedniej sekcji.
- `Szkice AI` → szkic zostaje po odświeżeniu strony.
- Asystent AI → nowe dyktowanie nie dziedziczy poprzedniej treści.
- Pytania typu `co mam jutro?` korzystają z kontekstu aplikacji.

## Ważne

AI nadal nie zatwierdza finalnych rekordów samodzielnie. Zapis przez AI trafia jako szkic do sprawdzenia.
