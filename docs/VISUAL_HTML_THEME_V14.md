# VISUAL HTML THEME V14

Cel: zatrzymać kruchą serię patchy JSX i wymusić realnie widoczną wizualizację zgodną z kierunkiem HTML.

Zakres:
- reset lokalnego brudnego stanu do `origin/dev-rollout-freeze`, żeby odciąć popsute v7-v13,
- globalny shell z klasą `cf-html-shell`,
- import `src/styles/visual-html-theme-v14.css`,
- mocne style zgodne z HTML: ciemny sidebar, jasne tło, sticky global bar, miękkie karty, metryki, układ spraw,
- bez ruszania logiki Supabase, routingu, auth, billing, AI i danych.

Ta paczka jest CSS-first: zmienia wygląd realnie, bez przepisywania całej logiki `Cases.tsx` regexami.
