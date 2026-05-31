# STAGE211H - Canvas layer source truth no regex

## Cel
Ujednolicić kolor pierwszej warstwy tła aplikacji operatora, także przy sidebarze i między kafelkami.

## Decyzja
Kolor źródłowy: `#f8fafc`.

Powód: to kolor najbliższy wzorcowi z zakładki `Dziś` i istniejącym tokenom aplikacji. Wymaga najmniej zmian wizualnych.

## Mapa warstw
- L0 root: `html`, `body`, `#root`
- L1 shell: `.app`, `.cf-html-shell`
- L2 operator content: `.main`, `[data-shell-main="true"]`, `.view.active`, `[data-shell-content="true"]`
- L3 route root: `.cf-route-work-root`, `.cf-html-view`, `[class*="-vnext-page"]`, `[class*="main-"][class*="-html"]`
- L4 inner wrappers: `[class*="-vnext-shell"]`, `[class*="-layout"]`, calendar wrappers

## Zakres zmian
- Dodano `src/styles/closeflow-canvas-layer-source-truth-stage211h.css`
- Podpięto import w `src/index.css`
- Podpięto import w `src/components/Layout.tsx`
- Spiêto `--cf-operator-bg` i `--cf-operator-bg-soft` z `--cf-canvas-bg`
- Dodano guard `scripts/check-stage211h-canvas-layer-source-truth-no-regex.cjs`

## Czego nie ruszano
- Supabase
- RLS
- routing
- dane
- formularze
- listy
- deployment
- push

## Testy
- `node scripts/check-stage211h-canvas-layer-source-truth-no-regex.cjs`
- `npm run build`
