# STAGE173 Main Search Source Truth — raport

Data: 2026-05-23  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / main search bars / source truth

## Cel

Naprawić paski wyszukiwania w głównych sekcjach:
- jeden visual source truth,
- pasek nie ma rozciągać się przez cały ekran,
- ma kończyć się mniej więcej w okolicy trzeciego kafelka / lewej kolumny roboczej,
- dekoracyjna lupka albo stary znak nie może zasłaniać tekstu.

## FAKTY

- Stage172 został zastosowany lokalnie i build przeszedł.
- W `Clients.tsx` pasek wyszukiwania jest w `div.search` i ma ikonę `Search` w `span aria-hidden`.
- W `Leads.tsx` pasek wyszukiwania jest w `div.search` i ma stary widoczny marker `?`.
- `closeflow-record-list-source-truth.css` już jest źródłem prawdy dla list leadów/klientów, ale nie dla głównego search bara.

## DECYZJE DAMIANA

- Poprawić pasek wyszukiwania wszędzie.
- Podpiąć go do jednego źródła prawdy wizualnej.
- Pasek ma kończyć się mniej więcej przy trzecim kafelku, nie lecieć przez całą stronę.
- Lupka nie może zasłaniać napisu.
- Każda poprawka ma mieć guard.
- Lokalnie, bez pusha/deploya.

## HIPOTEZY AI

- Najbezpieczniej nie usuwać importów ikon w wielu plikach, tylko ukryć dekoracyjne ikony w search-source CSS.
- Trzeba oznaczyć search bary markerem `data-cf-main-search-source="stage173"`, żeby guard łapał regresje.
- Desktop width 1060px powinien trzymać pasek w okolicy trzeciego kafelka przy obecnym układzie.

## Pliki

- `src/App.tsx`
- `src/styles/closeflow-main-search-source-truth-stage173.css`
- `scripts/apply-stage173-main-search-source-truth.cjs`
- `scripts/check-stage173-main-search-source-truth.cjs`
- `docs/ui/CLOSEFLOW_STAGE173_MAIN_SEARCH_SOURCE_TRUTH.md`
- `docs/ui/CLOSEFLOW_STAGE173_RUNTIME_MAIN_SEARCH_AUDIT.js`
- `_project/STAGE173_MAIN_SEARCH_SOURCE_TRUTH_REPORT.md`
- `_project/STAGE173_MAIN_SEARCH_TOUCHED_FILES.txt`
- `OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage173 main search source truth.md`

## Testy automatyczne

```powershell
node scripts/check-stage173-main-search-source-truth.cjs
npm.cmd run build
```

## Testy ręczne

Sprawdzić:
- `/clients`,
- `/leads`,
- `/cases`,
- `/tasks`,
- `/templates`, jeśli mają widoczny search.

Warunki:
- pasek kończy się w lewym obszarze roboczym, nie wjeżdża pod prawy rail,
- placeholder nie jest zasłonięty,
- tekst wpisany w search jest czytelny,
- sugestie leadów mają tę samą szerokość co pasek.

## Czego nie ruszano

- push
- deploy
- auth
- Supabase schema
- Google Calendar
- Stripe
- AI
