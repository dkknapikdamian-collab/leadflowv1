# P0 Post-fix Release Smoke Gate — 2026-05-03

## Po co ten etap

Po naprawie zapisu leadów nie dokładamy kolejnej funkcji w ciemno. Ten etap dodaje mały, twardy smoke gate dla rdzenia aplikacji: lead CRUD, workspace access, AI draft-only i routing API przez `api/system`.

## Korekta v2

Pierwsza wersja guarda sprawdzała `vercel.json` przez dosłowny fragment tekstu z formatowaniem spacji. To było zbyt kruche. W repo rewrite istnieje jako poprawny JSON:

- `/api/assistant` -> `/api/system?kind=ai-assistant`
- `/api/assistant-context` -> `/api/system?kind=assistant-context`

V2 parsuje `vercel.json` jako JSON i sprawdza pary `source/destination`, zamiast wymagać konkretnego układu spacji.

## Pliki

- `scripts/check-p0-postfix-release-smoke-gate.cjs`
- `docs/release/P0_POSTFIX_RELEASE_SMOKE_GATE_2026-05-03.md`

## Co sprawdza guard

- hotfix `P0_WORKSPACE_WRITE_ACCESS_STATUS_COMPAT_2026_05_03` nadal istnieje,
- `api/leads.ts` nadal używa server-side workspace scope, access gate, limit gate i scoped row guard,
- AI operator nadal działa jako read/draft-only i ma kontrakt no-auto-write,
- osobne endpointy `api/assistant.ts` i `api/assistant-context.ts` nie wróciły,
- rewrite w `vercel.json` prowadzi asystenta przez `/api/system`,
- narzędzia release evidence i quiet verify są nadal dostępne.

## Ręczny smoke po deployu

1. Zaloguj się.
2. Dodaj leada.
3. Odśwież stronę i sprawdź, czy lead nadal jest widoczny.
4. Dodaj zadanie albo wydarzenie.
5. Sprawdź, czy `Dziś` pokazuje właściwe dane bez ręcznego obchodzenia aplikacji.
6. Przenieś leada do sprawy.
7. Zapytaj AI o dane z aplikacji i sprawdź, czy nie wymyśla rekordów.
