# CLOSEFLOW_PAGE_HEADER_STAGE6_FINAL_LOCK_2026-05-11

## Cel

Naprawić etap, który wizualnie „nic nie zmienił”, bo część aktywnych nagłówków nadal szła przez stare klasy i stare adaptery CSS.

## Co ten pakiet robi

1. Dodaje finalny import CSS na końcu `src/styles/emergency/emergency-hotfixes.css`, po starych adapterach i wcześniejszych warstwach.
2. Dodaje `src/styles/closeflow-page-header-stage6-final-lock.css`.
3. Ten CSS obejmuje:
   - `[data-cf-page-header="true"]`,
   - `.cf-page-header`,
   - `.page-head`,
   - `header.billing-header`,
   - `header.support-header`,
   - `header.settings-header`,
   - `.activity-page-header`,
   - `.ai-drafts-page-header`,
   - `.notifications-page-header`.
4. Ustawia jedno źródło prawdy dla:
   - tła kafelka headera,
   - układu copy po lewej,
   - akcji po prawej w jednym rzędzie,
   - tytułu,
   - opisu,
   - badge/kickera,
   - koloru przycisków,
   - fioletu dla AI,
   - czerwieni dla kosza/usuwania,
   - ikon dziedziczących kolor przycisku.
5. Czyści copy:
   - Biblioteka odpowiedzi bez dubla i bez końcówki o CRM,
   - Szkice AI bez końcówki o CRM,
   - Powiadomienia bez nadmiarowej kropki/dubla,
   - Konfiguracja AI jako techniczna diagnostyka.
6. Dodaje `Nowe zadanie` do headera `/tasks`.
7. Próbuje dodać `Dodaj wydarzenie` i `Dodaj zadanie` do headera `/calendar`, jeśli aktualny plik nadal ma `.head-actions`.

## Czego nie zmienia

- Nie rusza modalów.
- Nie zmienia położenia zakładek/formularzy.
- Nie zmienia logiki danych.
- Nie usuwa starych adapterów, tylko nadpisuje je finalną warstwą na końcu kaskady.

## Pliki

- `src/styles/closeflow-page-header-stage6-final-lock.css`
- `src/styles/emergency/emergency-hotfixes.css`
- `src/lib/page-header-content.ts`
- `src/pages/ResponseTemplates.tsx`
- `src/pages/Templates.tsx`
- `src/pages/TasksStable.tsx`
- `src/pages/Calendar.tsx`
- `scripts/check-closeflow-page-header-stage6-final-lock.cjs`
- `package.json`
