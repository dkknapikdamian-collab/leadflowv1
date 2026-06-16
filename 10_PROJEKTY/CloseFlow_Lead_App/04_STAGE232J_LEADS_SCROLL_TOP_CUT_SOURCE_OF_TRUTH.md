# STAGE232J - Leads scroll top cut / shell scroll source of truth

Data: 2026-06-16 Europe/Warsaw
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Status: DO_WDROZENIA / DODANE_DO_REPO_JAKO_04_KIERUNEK
Typ: 04_KIERUNEK_DO_WDROZENIA / bug layout-scroll

## 1. Problem Damiana

Na widoku `https://closeflowapp.vercel.app/leads` po lekkim scrollu w dół góra ekranu zostaje ucięta i użytkownik nie może normalnie wrócić na samą górę. Na screenie widać, że górna część listy/paska jest przycięta, a widok wygląda jak przesunięty pod górną krawędź.

To jest błąd produkcyjny użyteczności. Lista leadów nie może tracić góry widoku po scrollu.

## 2. Fakty ze skanu repo

- Aktywny widok leadów używa `src/pages/Leads.tsx` i importuje globalny `Layout` oraz style canvas/listy:
  - `closeflow-record-list-source-truth.css`,
  - `closeflow-unified-page-canvas-stage211c.css`,
  - `closeflow-canvas-source-truth-stage211e.css`.
- `Layout.tsx` ma runtime enforcer `STAGE209_CENTER_SCROLL_RUNTIME_ENFORCER`.
- Na desktopie `Layout.tsx` ustawia `html`, `body`, `#root` na `overflow: hidden`.
- Shell aplikacji jest skalowany przez `transform: scale(var(--cf-stage201-app-scale, 0.75))` oraz sztuczne `scaledHeight`/`scaledWidth`.
- Scroll jest przeniesiony na wewnętrzny content: `main[data-shell-main="true"] > div.view.active[data-shell-content="true"]` z `overflow-y: auto`.

Wniosek: błąd prawdopodobnie dotyczy kontraktu scroll owner / scaled shell / content top offset. Nie wolno naprawiać tego przez losowe `padding-top` na samej liście leadów bez sprawdzenia shellu, bo może wrócić na innych ekranach.

## 3. Kontrakt produkcyjny

Widok listy leadów musi spełniać:

```txt
- po scrollu użytkownik może wrócić do pozycji 0,
- góra widoku nie jest ucięta,
- top bar / header / filter strip nie nachodzą na listę,
- scroll owner jest jeden i jawny,
- desktop shell i wewnętrzny content nie walczą o scroll,
- sidebar może mieć własny scroll, ale nie może psuć scrolla main content,
- ten sam kontrakt powinien działać na Leads, Clients, Cases i Today, albo etap musi jasno ograniczyć scope do Leads.
```

## 4. Etap runtime do wdrożenia

```txt
STAGE232J_R1_LEADS_SCROLL_TOP_CUT_RUNTIME_FIX
```

### Cel R1

Naprawić sytuację, w której po scrollu w `/leads` górna część widoku zostaje ucięta i nie da się wrócić na początek.

### Zakres R1

1. Zmapować aktualny scroll owner:
   - `html`,
   - `body`,
   - `#root`,
   - `.app.closeflow-visual-stage01.cf-html-shell`,
   - `main[data-shell-main="true"]`,
   - `div.view.active[data-shell-content="true"]`,
   - wrappers użyte w `Leads.tsx`.
2. Sprawdzić, czy problem dotyczy tylko `/leads`, czy też `/clients`, `/cases`, `/today`.
3. Naprawić bez tworzenia drugiego scroll ownera.
4. Nie zmieniać funkcji leadów, filtrów, Supabase, danych, statusów ani kart.
5. Dodać marker/guard na kontrakt scroll owner.
6. Dodać manualny test scroll-to-top.

### Pliki do audytu

```txt
src/components/Layout.tsx
src/pages/Leads.tsx
src/styles/closeflow-unified-page-canvas-stage211c.css
src/styles/closeflow-canvas-source-truth-stage211e.css
src/styles/closeflow-record-list-source-truth.css
src/styles/closeflow-compact-top-shell-source-truth.css
src/styles/closeflow-operator-top-trim-source-truth.css
```

### Pliki do dotknięcia w R1

Dozwolone po audycie:

```txt
src/components/Layout.tsx
src/pages/Leads.tsx
src/styles/closeflow-unified-page-canvas-stage211c.css
src/styles/closeflow-canvas-source-truth-stage211e.css
src/styles/closeflow-record-list-source-truth.css
scripts/check-stage232j-leads-scroll-top-cut.cjs
tests/stage232j-leads-scroll-top-cut.test.cjs
_project/runs/STAGE232J_R1_LEADS_SCROLL_TOP_CUT_RUNTIME_FIX.md
_project/obsidian_updates/2026-06-16_STAGE232J_R1_LEADS_SCROLL_TOP_CUT_RUNTIME_FIX.md
```

Zakazane bez osobnej decyzji:

```txt
Supabase
SQL
finanse/prowizje
Braki/Blokady
Owner Control contact silence
Google Calendar
routing główny
billing/trial
```

## 5. Guard/test wymagany

```powershell
node scripts/check-stage232j-leads-scroll-top-cut.cjs
node --test tests/stage232j-leads-scroll-top-cut.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

`verify:closeflow:quiet` może dalej paść wyłącznie na stary, niezwiązany CaseDetail guard. Jeśli tak, raport ma jawnie wpisać `SKIP_UNRELATED_CASEDETAIL_GUARD`, nie udawać PASS.

## 6. Test ręczny Damiana

1. Wejdź na `/leads`.
2. Przewiń lekko w dół.
3. Spróbuj wrócić na samą górę.
4. Sprawdź, czy:
   - góra nie jest ucięta,
   - header/filtry/karty są dostępne,
   - prawy rail nie rozjeżdża layoutu,
   - sidebar nadal działa,
   - problem nie pojawia się po zmianie zoomu/przeskalowania.
5. Powtórz na `/clients`, `/cases`, `/today`, jeśli R1 rusza globalny shell.

## 7. Ryzyka

- Globalny fix w `Layout.tsx` może zmienić scroll na wielu ekranach.
- Lokalny fix tylko w `Leads.tsx` może ukryć przyczynę i zostawić bug na innych ekranach.
- `transform: scale(...)` może powodować błędne odczucie wysokości/scroll range.
- `overflow: hidden` na `html/body/root` oznacza, że jeśli wewnętrzny content zgubi scroll position, użytkownik nie ma fallbacku.
- Ręczny test jest obowiązkowy, bo statyczny guard nie zobaczy realnego scrollowania w przeglądarce.

## 8. Relacja do poprzednich etapów

- STAGE232D: kontakt/cisza Owner Control — osobny etap, nie mieszać.
- STAGE232I: Braki/Blokady w sprawie i kliencie — osobny etap, nie mieszać.
- STAGE232J: shell/list scroll — aktualny bug UI z ekranu `/leads`.

## 9. Następny krok

Przygotować ZIP runtime:

```txt
STAGE232J_R1_LEADS_SCROLL_TOP_CUT_RUNTIME_FIX
```

Najpierw audyt shell scroll owner, potem patch, guard, build, manual scroll test i selektywny push po PASS.
