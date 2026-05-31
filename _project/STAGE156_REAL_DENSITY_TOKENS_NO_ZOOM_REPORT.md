# STAGE156 Real Density Tokens No Zoom — raport

Data: 2026-05-23  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / real density tokens / no zoom / guard per correction

## Cel

Wdrożyć właściwy kierunek po cofnięciu Stage153/154/155:
- zmniejszyć główny panel i kafelki,
- zachować trzymanie lewej i prawej strony,
- nie używać `zoom`, `scale`, `transform`, wrapper-scale ani inverse-width,
- utrzymać Stage149 jako źródło prawdy szerokości.

## FAKTY

- Stage149 jest poprawnym źródłem prawdy szerokości.
- Stage153 zmniejszył elementy, ale popsuł szerokość, bo zoomował całą aplikację.
- Stage154/155 nadal były złe, bo wprowadzały skalowanie route/wrappera.
- Damian doprecyzował, że przy prawdziwym scroll-zoomie kafelki nadal trzymały lewą/prawą stronę.
- Wniosek: trzeba zmniejszyć realną gęstość komponentów, nie skalować kontener.

## DECYZJE DAMIANA

- Wdrożyć podejście bez skalowania.
- Skala/gęstość ma być jednym źródłem prawdy wizualnym.
- Każda poprawka ma mieć osobny guard.
- Nie psuć poprawnej szerokości Stage149.

## HIPOTEZY AI

- Najbezpieczniejsze jest szerokie, ale kontrolowane CSS source truth scoped do `data-shell-content`.
- Trzeba objąć też Tailwindowe klasy `p-6`, `gap-6`, `rounded-2xl` w route slotach, bo część ekranów nie używa prostych klas `.card`.
- Strojenie powinno odbywać się wyłącznie zmiennymi `--cf156-*`.

## Zakres Stage156

Dodaje:
- `src/styles/closeflow-real-density-tokens-no-zoom-stage156.css`
- `scripts/apply-stage156-real-density-tokens-no-zoom.cjs`
- `scripts/check-stage156-real-density-tokens-no-zoom.cjs`
- `docs/ui/CLOSEFLOW_STAGE156_REAL_DENSITY_TOKENS_NO_ZOOM.md`
- `docs/ui/CLOSEFLOW_STAGE156_RUNTIME_DENSITY_AUDIT.js`
- `_project/STAGE156_REAL_DENSITY_TOKENS_NO_ZOOM_REPORT.md`
- aktualizację Obsidiana

Modyfikuje:
- `src/App.tsx`: dodaje import Stage156, usuwa importy odrzuconych Stage153/154/155 jeśli istnieją.
- `src/components/Layout.tsx`: usuwa odrzucony wrapper Stage155 jeśli istnieje.

## Testy

```powershell
node scripts/check-stage156-real-density-tokens-no-zoom.cjs
npm.cmd run build
```

## Czego nie ruszano

- dane
- auth
- Supabase
- Google Calendar
- Stripe
- AI
- routing
- deployment
- push

## Następny krok

Sprawdzić lokalnie `/`, `/leads`, `/clients`, `/cases`, `/tasks`, `/calendar`, `/templates`, `/response-templates`, `/activity`.
Jeżeli nadal za duże, stroić wyłącznie zmienne `--cf156-*`.
