# CLOSEFLOW STAGE14E REPAIR1 — Leads value dedupe badge

Cel: naprawić kartę leada na `/leads`:
- wartość nie jest doklejana do linii meta pod nazwą,
- wartość zostaje w dedykowanym bloku,
- zielone tło obejmuje tylko kwotę i PLN,
- najbliższa zaplanowana akcja nie jest przykrywana tłem wartości.

Zakres źródłowy:
- `src/pages/Leads.tsx`
- `src/styles/visual-stage20-lead-form-vnext.css`

Repair1 dodatkowo sprząta nieudane untracked pliki Stage14E z poprzedniego podejścia przed stashem, żeby `stash pop` nie wpadał w konflikt z tymi samymi plikami.
