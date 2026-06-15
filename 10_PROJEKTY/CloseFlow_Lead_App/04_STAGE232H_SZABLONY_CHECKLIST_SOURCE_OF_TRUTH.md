# STAGE232H - Szablony / Checklist Source of Truth

Data: 2026-06-15 Europe/Warsaw  
Projekt: CloseFlow / LeadFlow  
Obszar: `Szablony` / `/templates`  
Status: AUDYT ZAPISANY W OBSIDIANIE / DO WDROŻENIA TECHNICZNEGO

## Scan proof

Przeczytane źródła:

- `src/App.tsx`
- `src/pages/Templates.tsx`
- `src/pages/LeadDetail.tsx` - search pod kątem użycia template/case checklist flow
- `10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md`
- `10_PROJEKTY/CloseFlow_Lead_App/04_STAGE232_AUDYT_ZAKLADEK_SOURCE_OF_TRUTH.md`

## Aktywna trasa

`/templates` ładuje `src/pages/Templates.tsx` przez lazy page `Templates`.

## Fakty z kodu

- Widok pobiera szablony przez `fetchCaseTemplatesFromSupabase({ includeArchived: false })`.
- Liczniki górne są liczone z tablicy `templates`:
  - `Szablony` = `templates.length`,
  - `Pozycje` = suma `normalizeTemplateItems(template.items).length`,
  - `Obowiązkowe` = suma pozycji `isRequired`,
  - `Akceptacje` = suma pozycji typu `decision`.
- Search szuka po nazwie szablonu oraz po tytułach, opisach i typach pozycji.
- Zapis tworzy albo aktualizuje szablon przez `createCaseTemplateInSupabase` / `updateCaseTemplateInSupabase`.
- Duplikacja tworzy nowy szablon z nazwą `(kopia)` i `normalizeTemplateItems(template.items)`.
- Usuwanie ma dwa confirmy, jeśli szablon ma pozycje.
- Modal pozwala dodać wiele pozycji checklisty, ustawić typ, opis i `Obowiązkowe`.
- Typ `other` ma `customTypeName` w UI, ale `normalizeTemplateItems()` aktualnie go nie zachowuje.

## Najważniejszy problem

Największe ryzyko nie jest w samych kafelkach. Największe ryzyko to pytanie:

```txt
Czy szablony faktycznie są używane przy tworzeniu nowej sprawy i czy pozycje szablonu są kopiowane do checklisty sprawy?
```

Search po repo nie pokazał oczywistego, prostego powiązania `caseTemplate/templateId/selectedTemplate` w tworzeniu sprawy. To trzeba potraktować jako krytyczny punkt wdrożeniowy, nie kosmetykę UI.

## Decyzja produktu

Zakładka `Szablony` ma być biblioteką wzorców checklist spraw. To nie jest ozdobny słownik. Szablon ma realnie skracać przejście od leada/sprawy do obsługi operacyjnej.

## Kontrakt produkcyjny kafelków

1. `Szablony`
   - liczy aktywne, niearchiwalne szablony,
   - musi zgadzać się z listą przy pustym search.

2. `Pozycje`
   - liczy realne pozycje checklist we wszystkich aktywnych szablonach,
   - nie liczy pustych pozycji bez tytułu.

3. `Obowiązkowe`
   - liczy tylko pozycje `isRequired === true`,
   - ma odpowiadać badge’om `Obowiązkowe` na kartach.

4. `Akceptacje`
   - liczy pozycje typu `decision`,
   - jeśli w przyszłości pojawi się osobne pole `requiresApproval`, licznik musi przejść na to pole albo zmienić nazwę.

## Kontrakt listy szablonów

- Karta szablonu ma pokazywać:
  - nazwę,
  - liczbę pozycji,
  - liczbę obowiązkowych,
  - pozycje z typem i opisem,
  - czy pozycja jest obowiązkowa czy opcjonalna.
- Tekst `Po wybraniu szablonu pozycje zostaną skopiowane do checklisty nowej sprawy` może zostać tylko wtedy, gdy runtime naprawdę to robi.
- Jeśli runtime jeszcze tego nie robi, tekst musi być zmieniony albo etap ma natychmiast podpiąć szablony do tworzenia sprawy.

## Kontrakt modala

- Nie wolno zapisać szablonu bez nazwy.
- Nie wolno zapisać szablonu bez minimum jednej pozycji z tytułem.
- `customTypeName` dla typu `Inne` musi być zachowany w payloadzie albo UI nie może go obiecywać.
- Usuwanie pozycji w modalu może być bez confirmu, jeśli dotyczy niezapisanego draftu.
- Usuwanie całego szablonu musi mieć confirm i informować, że istniejące sprawy nie tracą już skopiowanych pozycji.

## Kontrakt duplikacji

- Duplikacja musi kopiować:
  - pozycje,
  - typy,
  - opisy,
  - obowiązkowość,
  - `customTypeName`, jeśli istnieje.
- Kopia nie może dostać pustej listy przez normalize.

## Kontrakt integracji ze sprawami

R1 do wdrożenia technicznego:

- przy tworzeniu sprawy z leada albo ręcznie operator może wybrać szablon,
- po wyborze szablonu jego pozycje są kopiowane do checklisty sprawy jako niezależne rekordy/elementy,
- późniejsza edycja szablonu nie zmienia automatycznie istniejących spraw,
- istniejące sprawy mają własny stan checklisty,
- wymagane pozycje mogą blokować sprawę tylko wtedy, gdy CaseDetail/checklist logic to obsługuje,
- `decision`/akceptacje muszą być spójne z etapem `Sprawy` i przyszłym checklist tabem CaseDetail.

## Ryzyka

- `customTypeName` może ginąć przez `normalizeTemplateItems()`.
- `Akceptacje` liczą typ `decision`, ale nazwa może sugerować osobny workflow akceptacji.
- Usuwanie szablonu nie sprawdza, czy szablon jest używany jako wzorzec w aktywnych sprawach.
- Kafelki są poprawne dla biblioteki, ale nie potwierdzają integracji z Case flow.
- Brak widocznego, prostego powiązania `template -> new case checklist` w search repo.
- Ekran jest wizualnie pusty przy małej liczbie szablonów; to jest akceptowalne, ale nie może wyglądać jak niedokończony moduł.

## Guardy do wymagania przy wdrożeniu technicznym

- `scripts/check-stage232h-templates-checklist-source-truth.cjs`
- `tests/stage232h-templates-checklist-source-truth.test.cjs`

Guard ma sprawdzić minimum:

- `/templates` routuje do `src/pages/Templates.tsx`,
- liczniki top cards bazują na jawnych kolekcjach,
- `Pozycje` = suma niepustych pozycji,
- `Obowiązkowe` = suma `isRequired`,
- `Akceptacje` = suma `type === 'decision'` albo jawne `requiresApproval`,
- duplikacja zachowuje typ/opis/isRequired/customTypeName,
- `normalizeTemplateItems()` nie gubi pól obiecywanych w UI,
- tekst o kopiowaniu do checklisty nowej sprawy jest prawdziwy,
- tworzenie sprawy ma jawny template handoff albo UI nie obiecuje tego flow,
- delete ma confirm i nie usuwa skopiowanych pozycji z istniejących spraw.

## Test ręczny Damiana

1. Wejdź w `/templates`.
2. Sprawdź liczby:
   - `Szablony`,
   - `Pozycje`,
   - `Obowiązkowe`,
   - `Akceptacje`.
3. Dodaj nowy szablon z minimum 2 pozycjami:
   - jedna obowiązkowa,
   - jedna opcjonalna,
   - jedna typu `Decyzja / akceptacja`, jeśli testujesz licznik akceptacji.
4. Zapisz i sprawdź, czy kafelki się zgadzają.
5. Edytuj szablon i sprawdź, czy typy/opisy/obowiązkowość nie giną.
6. Ustaw typ `Inne` z własną nazwą i sprawdź po zapisie/odświeżeniu, czy własna nazwa nie zniknęła.
7. Zduplikuj szablon i sprawdź, czy kopia ma wszystkie pozycje i metadane.
8. Usuń szablon i sprawdź confirm.
9. Utwórz nową sprawę z użyciem szablonu albo sprawdź, że takiej opcji jeszcze nie ma.
10. W CaseDetail sprawdź, czy pozycje szablonu faktycznie trafiają do checklisty sprawy.

## Następny krok techniczny

Jeśli ten audyt ma przejść do kodu, następny stage powinien brzmieć:

```txt
STAGE232H_R1_TEMPLATES_TO_CASE_CHECKLIST_RUNTIME
```

Cel R1: nie tylko poprawić ekran `Szablony`, ale przede wszystkim potwierdzić albo wdrożyć runtime `template -> new case checklist`.
