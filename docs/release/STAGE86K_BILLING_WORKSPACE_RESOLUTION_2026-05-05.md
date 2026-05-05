# Stage86K - Billing workspace resolution

Data: 2026-05-05  
Branch: dev-rollout-freeze

## Problem

Po deployu billing checkout zwracaĹ‚:

`WORKSPACE_ID_REQUIRED`

Przyczyna: checkout i cancel/resume uĹĽywaĹ‚y `requireAuthContext(req).workspaceId`. W obecnej architekturze workspace moĹĽe nie byÄ‡ bezpoĹ›rednio w Supabase auth context, ale jest wysyĹ‚any przez klienta jako header/body i musi przejĹ›Ä‡ przez `resolveRequestWorkspaceId(req, body)`.

## Zmiana

- checkout uĹĽywa `resolveRequestWorkspaceId(req, body)`
- billing actions uĹĽywajÄ… `resolveRequestWorkspaceId(req, body)`
- body/header workspaceId nadal nie jest Ĺ›lepo zaufany
- mismatched body workspaceId jest blokowany przez `WORKSPACE_FORBIDDEN`
- konsolidacja Vercel Hobby z Stage86H zostaje utrzymana
- brak nowych plikĂłw w `/api`

## Nie zmieniono

- Stripe mode
- webhook handler
- Google Calendar
- Supabase schema
- plan pricing

## Kryterium zakoĹ„czenia

- Stage86K PASS
- P14 PASS
- Stage86H PASS
- Stage86B/D PASS
- build PASS
- push na `dev-rollout-freeze`

## Test rÄ™czny po deployu

1. WejdĹş `/billing`
2. Kliknij plan
3. BĹ‚Ä…d `WORKSPACE_ID_REQUIRED` ma zniknÄ…Ä‡
4. Stripe checkout ma siÄ™ otworzyÄ‡
5. Po pĹ‚atnoĹ›ci webhook ma ustawiÄ‡ `paid_active`
6. Potem test cancel/resume