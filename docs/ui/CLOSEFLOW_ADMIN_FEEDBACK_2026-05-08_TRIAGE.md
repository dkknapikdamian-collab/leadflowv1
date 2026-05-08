# CloseFlow admin feedback triage — 2026-05-08

Etap 0 zamyka aktualny stan delete/danger i porządkuje feedback admina jako źródło prawdy do kolejnych etapów. Ten dokument nie zmienia UI; klasyfikuje problemy i wskazuje, czy naprawa ma iść przez globalny kontrakt, czy lokalny wyjątek.

## Źródła prawdy

- Feedback admina: `C:\Users\malim\Downloads\closeflow_admin_feedback_2026-05-08_13-04.json`
- Eksport: `version=admin_tools_v1`, `generatedAt=2026-05-08T11:04:16.064Z`, `commit=9a52f6e68e0701f4987d537f6ee77f7693e8df4f`
- Mapa UI: `docs/ui/CLOSEFLOW_UI_MAP.generated.md`
- Mapa stylów: `docs/ui/CLOSEFLOW_STYLE_MAP.generated.md`
- Kontrakt delete/danger: `src/components/entity-actions.tsx`, `src/styles/closeflow-action-tokens.css`, `scripts/check-closeflow-danger-style-contract.cjs`

## Zasada triage

Jeżeli problem dotyczy powtarzalnego znaczenia wizualnego, nie naprawiamy go lokalnie na ekranie. Najpierw wskazujemy albo tworzymy jedno źródło prawdy: komponent, helper, token CSS albo globalny kontrakt z guardem.

## Tabela triage

| route | selectorHint | className | problem | grupa problemu | etap docelowy | czy globalny kontrakt / czy lokalny fix |
|---|---|---|---|---|---|---|
| `/settings` | `section.right-card.settings-right-card` | `right-card settings-right-card` | Czarne tło w prawym panelu do usunięcia. | surface / right-card / right-rail | Etap 1 | globalny kontrakt powierzchni |
| `/settings/ai` | `div.view.active` | `view active` | Tło zlewa się z tekstem, zawartość nieczytelna. | surface / page readability | Etap 1 po mapowaniu selektora docelowego | globalny kontrakt powierzchni; lokalny fix tylko jeśli brak wspólnej klasy |
| `/help` | `aside.support-right-rail` | `support-right-rail` | Czarne tło i słaba widoczność tekstu szybkich linków. | surface / right-card / right-rail | Etap 1 | globalny kontrakt powierzchni |
| `/billing` | `section.right-card.billing-right-card` | `right-card billing-right-card` | Czarne tło w prawym panelu do usunięcia. | surface / right-card / right-rail | Etap 1 | globalny kontrakt powierzchni |
| `/notifications` | `aside.notifications-right-rail` | `notifications-right-rail` | Czarne tło w prawym panelu do usunięcia. | surface / right-card / right-rail | Etap 1 | globalny kontrakt powierzchni |
| `/ai-drafts` | `button.cf-metric-tile.cf-top-metric-tile.cf-today-metric-lock` | `cf-metric-tile cf-top-metric-tile cf-today-metric-lock ... is-active` | Ikony w kafelkach nie mają spójnego koloru. | kafelki / metryki / ikony | Etap 2 | globalny kontrakt metric tile / icon token |
| `/ai-drafts` | `div` | `` | Polskie znaki i inny styl. | copy / typography consistency | Etap 3 | lokalny fix copy po ustaleniu źródła stylu tekstu |
| `/ai-drafts` | `aside.ai-drafts-right-rail` | `ai-drafts-right-rail` | Czarne tło w prawym panelu do usunięcia. | surface / right-card / right-rail | Etap 1 | globalny kontrakt powierzchni |
| `/activity` | `section.right-card.activity-right-card` | `right-card activity-right-card` | Czarne tło za kartami w prawym panelu. | surface / right-card / right-rail | Etap 1 | globalny kontrakt powierzchni |
| `/response-templates` | `div.view.active` | `view active` | Tekst zlewa się z tłem w wielu kafelkach. | surface / card readability | Etap 1/2 po mapowaniu komponentu | globalny kontrakt powierzchni lub kafelków |
| `/templates` | `div.p-6.flex.min-h-[260px]` | `p-6 flex min-h-[260px] flex-col items-center justify-center gap-4 px-6 py-16 text-center` | Tekst zlewa się z tłem. | empty-state / card readability | Etap 2 | globalny kontrakt empty state/card; lokalny fix tylko dla unikalnego stanu pustego |
| `/calendar` | `aside.right-card.calendar-week-filter` | `right-card calendar-week-filter` | Tekst zlewa się z tłem w filtrze tygodnia. | surface / right-card / right-rail | Etap 1 | globalny kontrakt powierzchni |
| `/calendar` | `section.right-card.calendar-week-plan` | `right-card calendar-week-plan` | Tekst zlewa się z tłem w planie tygodnia. | surface / right-card / right-rail | Etap 1 | globalny kontrakt powierzchni |
| `/calendar` | `div.mt-8.rounded-3xl.border` | `mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5` | Kolory w sekcji notatek/wpisów zlewają się. | card readability | Etap 2 | globalny kontrakt card/readability, nie lokalny kolor |
| `/tasks` | `div.rounded-xl.border.bg-card` | `rounded-xl border bg-card text-card-foreground border-slate-100 shadow-sm tasks-stage48-task-card` | Przyciski i treść są niewidoczne, białe na białym. | buttons / card contrast | Etap 2 | globalny kontrakt button/card contrast |
| `/tasks` | `button.inline-flex.items-center.justify-center` | `inline-flex items-center justify-center ... bg-white text-slate-950 ...` | Przycisk jest niewidoczny na białym tle. | buttons / action visibility | Etap 2 | globalny kontrakt przycisku; lokalny fix tylko dla unikalnej semantyki |
| `/tasks` | `button.cf-metric-tile.cf-top-metric-tile.cf-today-metric-lock` | `cf-metric-tile cf-top-metric-tile cf-today-metric-lock ...` | Kafelki mają inny wygląd; ikony z kolorem mogą być wzorcem. | kafelki / metryki / ikony | Etap 2 | globalny kontrakt metric tile / icon token |
| `/cases` | `aside.right-card.cases-shortcuts-rail-card` | `right-card cases-shortcuts-rail-card` | Problem kolorów w prawym panelu skrótów. | surface / right-card / right-rail | Etap 1 | globalny kontrakt powierzchni |
| `/cases` | `div.row.case-row` | `row case-row` | Postęp bez koloru, dane klienta zlewają się. | list rows / status color | Etap 2/3 | globalny kontrakt status/progress color; lokalny fix tylko dla danych sprawy |
| `/cases` | `div.grid-4` | `grid-4` | Ikony bez koloru. | ikonki / metric grid | Etap 2 | globalny kontrakt ikon |
| `/clients` | `aside.right-card` | `right-card` | Białe na białym, treść niewidoczna. | surface / right-card / right-rail | Etap 1 | globalny kontrakt powierzchni |
| `/clients` | `div.grid-4` | `grid-4` | Ikony bez kolorów; potrzebny wspólny kolor i źródło prawdy. | ikonki / metric grid | Etap 2 | globalny kontrakt ikon |
| `/clients` | `aside.right-card` | `right-card` | Tekst niewidoczny, biały na białym. | surface / right-card / right-rail | Etap 1 | globalny kontrakt powierzchni |
| `/leads` | `div.layout-list.xl:grid-cols-[minmax(0,1fr)_300px]` | `layout-list xl:grid-cols-[minmax(0,1fr)_300px]` | Wartość obok telefonu do usunięcia, telefon powinien mieć wyróżniający kolor. | list rows / contact field / icon color | Etap 3 | lokalna decyzja treści + globalny kontrakt ikon kontaktu |
| `/leads` | `aside.right-card.lead-right-card.lead-top-relations` | `right-card lead-right-card lead-top-relations` | Kolory w prawym panelu relacji. | surface / right-card / right-rail | Etap 1 | globalny kontrakt powierzchni |
| `/leads` | `div.page-head` | `page-head` | Styl nagłówka nie jest jednolity. | page header consistency | Etap 3 | globalny kontrakt page-head |
| `/` | `div.flex.flex-col.gap-3` | `flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between` | Styl sekcji nie jest jednolity. | dashboard / section header consistency | Etap 3 | globalny kontrakt sekcji lub lokalny fix po ustaleniu wzorca |
| globalnie | `Trash2`, `Usuń`, `.cf-entity-action-danger` | `cf-entity-action-danger`, `cf-entity-action-icon`, `cf-entity-action-button` | Delete/danger/kosz nie może mieć lokalnych `text-red-*`, `text-rose-*`, `bg-red-*`, `bg-rose-*`. | destructive / delete / kosz | Etap 0 zamknięty | globalny kontrakt: `actionIconClass`, `EntityActionButton`, `EntityActionIcon`, tokeny `--cf-action-danger-*` |

## Kolejność etapów po triage

1. Etap 1: surface / right-card / right-rail, bo to największa powtarzalna grupa P1 i wymaga globalnego kontraktu z guardem.
2. Etap 2: kafelki, metryki, ikony i button contrast, bo zgłoszenia powtarzają się na `/ai-drafts`, `/tasks`, `/cases`, `/clients`.
3. Etap 3: page header, copy/typografia i lokalne decyzje treści, tylko po odseparowaniu problemów globalnych.

## Status Etapu 0

- Delete/danger/kosz ma jedno źródło prawdy w `src/components/entity-actions.tsx` i `src/styles/closeflow-action-tokens.css`.
- Guard `scripts/check-closeflow-danger-style-contract.cjs` blokuje lokalne style danger przy `Trash2` / `Usuń`.
- Ten etap nie wprowadza kolejnych zmian UI; dokumentuje mapę problemów i zakres następnych kontraktów.
