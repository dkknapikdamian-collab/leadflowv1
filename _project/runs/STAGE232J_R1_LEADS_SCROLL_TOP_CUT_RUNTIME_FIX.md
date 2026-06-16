# STAGE232J_R1_LEADS_SCROLL_TOP_CUT_RUNTIME_FIX

- data i godzina: 2026-06-17 01:05 Europe/Warsaw
- status: PASS_LOCAL_DO_SPRAWDZENIA
- typ: runtime bugfix / layout-scroll
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze

## R1-R1
Pierwsza paczka zatrzymala sie przed WROTE przez zla kotwice Layout marker. R1-R1 uzywa robust regex anchor po faktycznym komentarzu VISUAL_HTML_THEME_V14_LAYOUT oraz robust anchor po STAGE209 end.

## Zmiana runtime
- /leads only: location.pathname !== '/leads' return.
- Single inner content scroll owner: data-stage232j-r1-leads-scroll-owner.
- Snap near-top fractional scrollTop do 0.
- Reset document/html/body scroll fallback do 0.
- CSS route-scoped for leads shell.

## Manual smoke
1. Wejdz na /leads.
2. Scroll lekko w dol.
3. Wroc do samej gory.
4. Header/filtry/pierwsza karta nie sa uciete.
5. Nie ma drugiego scrollbara.
6. Sidebar nie skacze.
7. Sprawdz /clients, /cases, /today tylko gdy globalny shell wyglada podejrzanie.
