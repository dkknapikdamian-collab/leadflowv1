# STAGE174 Main Search Surface and Text Normalization — raport

Data: 2026-05-23  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / main search bars / source truth refinement

## Cel

Poprawić po Stage173:
- zakładka `Sprawy` ma inny/grubszy tekst w wyszukiwarce niż Lead/Klient,
- w części pasków widać dwie warstwy,
- pasek ma być poszerzony do początku prawego/dark-grey obszaru roboczego, czyli wypełniać lewą kolumnę.

## FAKTY

- Stage173 lokalnie przeszedł guard i build.
- Stage173 dotknął m.in. `Cases.tsx`, `Clients.tsx`, `Leads.tsx`, `SupportCenter.tsx`, `UiPreviewVNext.tsx`.
- `Cases.tsx` ma `div.search` z ikoną `Search` i placeholderem `Szukaj sprawy, klienta, telefonu, maila albo statusu...`.
- `Leads/Clients` mają placeholder `Szukaj po nazwie, telefonie, e-mailu, firmie albo sprawie...`.

## DECYZJE DAMIANA

- Poprawić pasek wyszukiwania wszędzie.
- Wyszukiwarka ma mieć jedno źródło prawdy wizualnej.
- Sprawy mają wyglądać jak Lead/Klient.
- Usunąć efekt dwóch warstw.
- Poszerzyć pasek do początku ciemnoszarego/prawego obszaru.
- Każda poprawka ma mieć guard.
- Lokalnie, bez pusha/deploya.

## HIPOTEZY AI

- Efekt dwóch warstw wynika z tego, że wrapper `.search` i wewnętrzny `Input` rysują tło/border/shadow naraz.
- Rozwiązaniem jest: wrapper tylko layout, input tylko surface.
- Najbezpieczniej dodać Stage174 jako override po Stage173, nie przepisywać wszystkich search barów od nowa.

## Pliki

- `src/App.tsx`
- `src/pages/Cases.tsx`
- `src/styles/closeflow-main-search-surface-and-text-normalization-stage174.css`
- `scripts/apply-stage174-main-search-surface-and-text-normalization.cjs`
- `scripts/check-stage174-main-search-surface-and-text-normalization.cjs`
- `docs/ui/CLOSEFLOW_STAGE174_MAIN_SEARCH_SURFACE_AND_TEXT_NORMALIZATION.md`
- `docs/ui/CLOSEFLOW_STAGE174_RUNTIME_MAIN_SEARCH_AUDIT.js`
- `_project/STAGE174_MAIN_SEARCH_SURFACE_AND_TEXT_NORMALIZATION_REPORT.md`
- `OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage174 main search surface and text normalization.md`

## Testy automatyczne

```powershell
node scripts/check-stage174-main-search-surface-and-text-normalization.cjs
npm.cmd run build
```

## Testy ręczne

Sprawdzić:
- `/cases`,
- `/clients`,
- `/leads`,
- `/tasks`.

Warunki:
- placeholder w Sprawach wygląda jak Lead/Klient,
- brak dwóch warstw,
- pasek wypełnia kolumnę roboczą do początku prawego obszaru,
- lupka/znak nie zasłania tekstu,
- wpisany tekst jest czytelny.

## Czego nie ruszano

- push
- deploy
- auth
- Supabase schema
- Google Calendar
- Stripe
- AI
