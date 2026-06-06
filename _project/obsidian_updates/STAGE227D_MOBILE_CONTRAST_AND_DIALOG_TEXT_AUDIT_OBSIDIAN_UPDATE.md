# OBSIDIAN UPDATE — STAGE227D — Mobile Contrast & Dialog Text Audit Backlog

Data: 2026-06-06 16:05 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Folder Obsidiana: `10_PROJEKTY/CloseFlow_Lead_App`
Status: DO WPISANIA DO OBSIDIANA / MANIFEST

## Docelowe pliki Obsidiana

Zaktualizować centralne pliki projektu:

- `03_AKTYWNE_DECYZJE - CloseFlow Lead App.md`
- `04_KIERUNEK_DO_WDROZENIA - CloseFlow Lead App.md`
- `09_TESTY_DO_WYKONANIA_I_WYNIKI - CloseFlow Lead App.md`
- `11_RYZYKA_BUGI_I_DLUG_TECHNICZNY - CloseFlow Lead App.md`
- `08_HISTORIA_ZMIAN - CloseFlow Lead App.md`
- `07_SCIAGA_PLIKOW - CloseFlow Lead App.md`

## Treść wpisu

### STAGE227D — Mobile Contrast & Dialog Text Audit Backlog

Data: 2026-06-06 16:05 Europe/Warsaw
Status: FUTURE STAGE / DO WDROŻENIA PO AKTUALNYCH ETAPACH OPERACYJNYCH

#### Powód

Damian zgłosił problem wizualny na mobile: w `Dodaj zadanie` oraz prawdopodobnie w innych formularzach/dialogach pojawiają się białe litery na białym albo zbyt jasnym tle.

To trzeba zweryfikować dokładnie, bo problem może dotyczyć wspólnego wzorca pól, selectów, placeholderów, buttonów lub dialogów, a nie tylko jednego modala.

#### Decyzja

Dodać osobny etap audytu kontrastu mobile. Nie łatać pojedynczego miejsca bez sprawdzenia source of truth. Naprawa ma iść przez wspólne klasy/tokens, a nie przypadkowe inline style.

#### Zakres audytu

Sprawdzić minimum:

- `Dodaj zadanie`
- `Dodaj wydarzenie`
- `Dodaj lead`
- `Dodaj klienta`
- `Szybki szkic`
- `Inbox szkiców`, jeśli zawiera formularze/akcje
- `ContextActionDialogs`
- `EventCreateDialog`
- `TaskCreateDialog`
- edycję task/event z LeadDetail
- edycję task/event z CaseDetail
- modal płatności/finansów, jeśli używa tych samych pól
- input/select/textarea/placeholder/disabled/focus/error states

#### Guardy/testy do dodania

- `scripts/check-stage227d-mobile-contrast-dialogs.cjs`
- `tests/stage227d-mobile-contrast-dialogs.test.cjs`

#### Kryteria akceptacji

- Na mobile nie ma białych liter na białym/jasnym tle w `Dodaj zadanie`.
- Na mobile nie ma białych liter na białym/jasnym tle w `Dodaj wydarzenie`.
- Główne dialogi dodawania/edycji mają czytelne inputy/selecty/textarea.
- Disabled, placeholder, focus i error states są czytelne.
- Poprawka idzie przez source of truth / wspólne klasy.
- Desktop nie jest pogorszony.
- Guard PASS.
- Test PASS.
- Build PASS.
- `verify:closeflow:quiet` PASS.
- Manual mobile smoke PASS.

#### Ryzyko

Największe ryzyko to naprawić tylko `Dodaj zadanie`, a zostawić ten sam problem w `Dodaj wydarzenie`, dialogach kontekstowych albo edycji z LeadDetail/CaseDetail. Drugi problem to poprawić mobile kosztem desktopu.

## Linkowane pliki repo

- `_project/reports/STAGE227D_MOBILE_CONTRAST_AND_DIALOG_TEXT_AUDIT_BACKLOG_REPORT.md`
- `_project/obsidian_updates/STAGE227D_MOBILE_CONTRAST_AND_DIALOG_TEXT_AUDIT_OBSIDIAN_UPDATE.md`
