# CLOSEFLOW_PAGE_HEADER_CONTENT_RUNTIME_FIX_2026-05-11

## Problem

Na route `Leady` produkcyjny bundle rzucał:

```text
ReferenceError: PAGE_HEADER_CONTENT is not defined
APP_ROUTE_RENDER_FAILED
```

To oznacza, że w runtime istnieje odwołanie do `PAGE_HEADER_CONTENT`, ale moduł, który go używa, nie ma poprawnego importu runtime albo import został zmieniony na type-only.

## Przyczyna techniczna

`PAGE_HEADER_CONTENT` jest wartością runtime eksportowaną z:

```text
src/lib/page-header-content.ts
```

Nie może być importowana przez `import type`. Nie może też być zakładana jako global.

## Zakres poprawki

- naprawia bezpieczny fallback contentu nagłówka w `src/components/CloseFlowPageHeaderV2.tsx`,
- dodaje guard `scripts/check-closeflow-page-header-content-runtime.cjs`,
- pilnuje, żeby `PAGE_HEADER_CONTENT` nie było używane bez importu runtime,
- nie rusza UI listy leadów, danych ani routingu.

## Czego nie zmieniać

- nie ruszać wyglądu listy leadów,
- nie ruszać logiki leadów,
- nie zmieniać `dist` ręcznie,
- nie robić globalnego `window.PAGE_HEADER_CONTENT`, bo to maskuje błąd.

## Weryfikacja

Po wdrożeniu wymagane minimum:

```text
node scripts/check-closeflow-page-header-content-runtime.cjs
npm.cmd run build
```

Potem ręcznie wejść w aplikacji w:

```text
/leads
```

i potwierdzić, że nie ma `APP_ROUTE_RENDER_FAILED` ani `PAGE_HEADER_CONTENT is not defined`.
