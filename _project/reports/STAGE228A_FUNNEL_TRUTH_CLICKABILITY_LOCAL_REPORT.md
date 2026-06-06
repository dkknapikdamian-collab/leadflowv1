# STAGE228A — Funnel Truth + Clickability — local report

Data: 2026-06-06 17:05 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Checkpoint przed etapem: 21eab806298d329e43bbff7cc69866a668e44ba3

## Cel
Naprawić błąd zaufania w `/funnel`: kafel `Pieniądze` nie może pokazywać kwoty, której użytkownik nie może znaleźć na liście.

## Zakres
- `/funnel` domyślnie pokazuje wszystkie rekordy, nie ukryty podzbiór `Do ruchu teraz`.
- Kliknięcie kafla właścicielskiego czyści filtr etapu.
- Kliknięcie etapu czyści filtr właścicielski.
- Karta z wartością/prowizją ma jawne źródło: `Prowizja sprawy` albo `Wartość leada`.
- Kafel `Pieniądze` opisuje, że kliknięcie pokazuje rekordy, z których liczona jest kwota.
- Dodano guard i test runtime dla money/source truth.

## Nie ruszano
- Supabase schema.
- RLS.
- Billing.
- AI drafts.
- Mutacje statusów/drag-drop w lejku.
- LeadDetail/ClientDetail/CaseDetail — to osobne etapy 228B/228C.

## Testy do wykonania
- `node scripts/check-stage228a-sales-funnel-truth-clickability.cjs`
- `node --test tests/stage228a-sales-funnel-truth-clickability.test.cjs`
- regresje Stage227A/B
- `npm run build`
- `npm run verify:closeflow:quiet`
- `git diff --check`

## Manual smoke
1. Wejść na `/funnel`.
2. Sprawdzić, że po wejściu widoczne są wszystkie rekordy, w tym sprawa z prowizją 1380 PLN, jeśli istnieje w danych.
3. Kliknąć `Pieniądze`.
4. Sprawdzić, że lista pokazuje rekord/y z których liczona jest kwota.
5. Kliknąć rekord i wejść w sprawę.

## Audyt ryzyk
Ryzyko główne: helper nadal liczy prowizję po sprawach, a nie po kliencie. To jest świadoma decyzja: klient ma dostać moduł `Ruch klienta` w Stage228C, a `/funnel` pokazuje ruch sprzedażowo-sprawowy, nie pełny rekord klienta.
