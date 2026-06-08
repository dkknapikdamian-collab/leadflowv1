# Stage228M â€” row soft-tone source truth

- Data: 2026-06-07 21:40 Europe/Warsaw
- Tryb: local-only, bez commita i bez pusha
- Cel: dopasowanie kafelkĂłw/wierszy z LeadĂłw, KlientĂłw, Spraw, AktywnoĹ›ci, SzkicĂłw, PowiadomieĹ„, ZgĹ‚oszeĹ„, UstawieĹ„ i RozliczeĹ„ do wzorca /tasks -> Filtry zadaĹ„.
- Zmiana: runtime mapper wybiera szeroki wiersz tekstowy zamiast maĹ‚ych inner-chipĂłw, czyĹ›ci stare Stage228I/J/K/L inline style, stosuje jeden kolor tekstu #334155 i szeĹ›Ä‡ miÄ™kkich tonĂłw tĹ‚a/borderu.
- Guard: npm run check:stage228m-row-soft-tone-source-truth
- Ryzyko: to nadal mapa dla legacy DOM; docelowo data-cf-soft-tone powinno byÄ‡ nadane w komponentach.
