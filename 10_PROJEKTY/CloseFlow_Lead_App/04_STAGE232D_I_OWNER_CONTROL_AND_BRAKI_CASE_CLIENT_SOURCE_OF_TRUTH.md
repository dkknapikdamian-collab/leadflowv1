# STAGE232D + STAGE232I - Owner Control cisza kontaktu oraz Braki/Blokady w sprawie i kartotece klienta

Data: 2026-06-16 Europe/Warsaw
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Status: DO_WDROZENIA / DODANE_DO_REPO_JAKO_SOURCE-OF-TRUTH_NOTE
Typ: 04_KIERUNEK_DO_WDROZENIA / etap naprawczy

## 1. STAGE232D_OWNER_CONTROL_CONTACT_SILENCE_SOURCE_OF_TRUTH

### Problem Damiana

W kafelku Today / Owner Control `Cisza / ryzyko` po kliknięciu `Kontakt wykonany` nadal widać stary komunikat typu `11 dni bez ruchu`. To jest błąd kontraktu produktu.

### Decyzja produktowa

`Kontakt wykonany` musi liczyć się od dnia kliknięcia i resetować ciszę kontaktową dla konkretnego leada.

Trzeba rozdzielić:

```txt
Kontakt = realna interakcja z leadem/klientem.
Ruch operacyjny = coś zrobiono w systemie, ale niekoniecznie był kontakt.
Follow-up = zaplanowany przyszły ruch, nie wykonany kontakt.
```

### Reguły

- `Kontakt wykonany` zapisuje jawny kontakt i aktualizuje `lastContactAt` albo równoważne trwałe pole.
- Zwykła notatka nie resetuje ciszy kontaktowej.
- Notatka może resetować ciszę tylko, jeśli użytkownik jawnie zaznaczy, że to był kontakt.
- Przyszły follow-up daje następny ruch, ale nie jest kontaktem.
- Przyszłe spotkanie z leadem = następny ruch.
- Wykonane spotkanie/telefon/email z leadem = kontakt.
- Szkic AI nie jest kontaktem.
- Wysłany email może być kontaktem tylko, jeśli system zapisze go jako wysłaną aktywność.
- Płatność, dokument, upload, koszt, zmiana statusu i edycja rekordu nie są kontaktem.

### ENTITY-SCOPED CONTACT RULE

Kontakt resetuje ciszę tylko dla encji, do której jest jawnie przypięty.

```txt
Spotkanie z leadem A -> resetuje ciszę leada A.
Spotkanie z leadem B -> nie wpływa na leada A.
Spotkanie ogólne w kalendarzu -> nie resetuje ciszy żadnego leada.
Spotkanie z klientem -> resetuje tylko tego klienta / powiązaną sprawę / powiązanego leada, jeśli relacja jest jawna.
Spotkanie z inną osobą z tej samej firmy -> nie resetuje automatycznie ciszy leada, chyba że użytkownik oznaczy: dotyczy tego leada.
```

Kontakt liczy się dla leada tylko gdy:

1. ma typ kontaktowy: telefon / spotkanie / email / SMS / rozmowa / manual contact done,
2. jest wykonany, nie przyszły,
3. ma jawne powiązanie: `leadId`, `caseId`, `clientId` z relacją do tego leada,
4. nie jest ogólnym wydarzeniem kalendarza.

### Etap runtime do wdrożenia

```txt
STAGE232D_R1_OWNER_CONTROL_CONTACT_DONE_RUNTIME_FIX
```

Zakres R1:

- znaleźć akcję `Kontakt wykonany`,
- zrobić z niej trwały contact event,
- ustawić `lastContactAt` / `last_contact_at`,
- odświeżyć Today bez reloadu,
- rozdzielić UI `bez kontaktu`, `bez ruchu`, `brak następnego kroku`,
- dodać guard, że zwykła notatka i przyszły follow-up nie resetują ciszy kontaktowej,
- dodać guard, że wydarzenia ogólne i spotkania z inną osobą nie resetują ciszy aktualnego leada.

---

## 2. STAGE232I_CASE_CLIENT_MISSING_BLOCKER_SYSTEM_SOURCE_OF_TRUTH

### Problem Damiana

W leadzie powstał system `Brak / Blokada`, ale w sprawie i w kartotece klienta nie ma tego samego systemu 1:1. Trzeba go przenieść produkcyjnie na:

- sprawę,
- kartotekę klienta,

ale nie ślepo. Ma być dostosowany do funkcji i danych danej encji.

### FAKTY z obecnego kodu / aktualnego modelu

- `ContextActionDialogsHost` jest wspólnym hostem dla akcji kontekstowych `task`, `event`, `note`, `blocker`.
- `Brak` jest wykrywany po przycisku/labelu i otwiera `MissingItemQuickActionModal`.
- Modal ma pola: `title`, `note`, `missingKind`, `blocksProgress`, `blockScope`.
- Dla lead/client ścieżka tworzy task/work item typu `missing_item`, zapisuje `blocksProgress`, `missingKind`, `blockScope`, tworzy activity `missing_item_created` i emituje no-flicker mutation.
- Dla case obecna ścieżka jest inna: tworzy `case item` (`insertCaseItemToSupabase`) ze statusem `missing`, potem activity `item_added`. To nie jest jeszcze 1:1 system z leadem.
- Dla client ścieżka zapisu taska istnieje, ale kartoteka klienta musi dostać produkcyjny widok aktywnych braków/blokad oraz podsumowanie braków z powiązanych leadów i spraw.

### Mapa systemu Brak/Blokada, który mamy w leadzie

#### Dane

```txt
missing_item:
- title
- note
- missingKind
- blocksProgress
- blockScope
- entityType
- entityId
- leadId/clientId/caseId
- status: missing_item albo blocking_missing_item
- priority: medium/high
- payload marker/source
```

#### UI

```txt
Modal:
- Czego brakuje?
- Typ braku
- Blokuje dalszy ruch
- Co blokuje?
- Notatka
```

#### Logika

```txt
Brak = aktywny element pracy, który czegoś wymaga.
Blokada = brak, który realnie zatrzymuje następny ruch.
Historia = dziennik, nie źródło aktywnych braków.
Aktywne Braki = work items/tasks typu missing_item.
Aktywne Blokady = subset Braków z blocksProgress=true.
```

#### Czego nie wolno zgubić

- nie zgadywać blokady po tytule,
- nie liczyć aktywnych braków z historii,
- nie dublować tej samej listy w kilku panelach,
- nie tworzyć drugiego źródła prawdy obok task/work item bez jasnej decyzji.

---

## 3. Co przenieść do sprawy 1:1

### Musi wejść do CaseDetail

- przycisk/akcja `Brak`,
- ten sam modal wizualny i logiczny,
- `missingKind`, `blocksProgress`, `blockScope`,
- aktywna lista `Braki`,
- aktywna lista / top status `Blokady`,
- historia `Brak:` / `Blokada:`,
- możliwość rozwiązania/usunięcia braku,
- no-flicker po dodaniu,
- hard refresh bez rozjazdu.

### Dostosowanie do sprawy

Zakresy blokady dla sprawy powinny być inne niż w leadzie:

```txt
case_start = blokuje start sprawy
case_progress = blokuje dalszą obsługę
case_completion = blokuje zamknięcie sprawy
client_decision = czekamy na decyzję klienta
missing_document = brakuje dokumentu
payment = blokuje płatność/prowizję/rozliczenie
checklist = blokuje checklistę sprawy
other = inne
none = nie blokuje
```

Typy braków w sprawie:

```txt
document
information
decision
payment
meeting
signature
access
case_data
other
```

### Ważna decyzja źródła prawdy dla sprawy

Rekomendacja: `Braki` w sprawie powinny iść przez ten sam model task/work item `missing_item` z `caseId`, a `case_items` powinny zostać dla checklisty/dokumentów/elementów sprawy.

Nie przenosić ślepo obecnej ścieżki `insertCaseItemToSupabase` jako jedynego źródła braków, bo wtedy lead/client/case będą miały różne modele i AI znów się pogubi.

Jeśli trzeba zachować kompatybilność:

```txt
R1: czytamy stare case_items status=missing jako legacy/read-only albo mapujemy do widoku.
R2: nowe Braki zapisujemy jako task/work item missing_item z caseId.
R3: ewentualna migracja legacy case_items -> missing_item po schema check.
```

---

## 4. Co przenieść do kartoteki klienta 1:1

### Musi wejść do ClientDetail / kartoteki klienta

- przycisk/akcja `Brak`,
- ten sam modal,
- client-level `Braki`,
- client-level `Blokady`,
- widok braków z powiązanych leadów i spraw jako podsumowanie,
- historia klienta `Brak:` / `Blokada:`,
- możliwość rozwiązania/usunięcia klient-level braku,
- jasne rozróżnienie: brak klienta vs brak w leadzie vs brak w sprawie.

### Dostosowanie do klienta

Typy braków klienta:

```txt
contact_details = brak danych kontaktowych
identity_data = brak danych do umowy/faktury
decision = brak decyzji klienta
document = brak dokumentu od klienta
payment = brak płatności
consent = brak zgody / formalności
relationship = problem w relacji / brak odpowiedzi
other = inne
```

Zakresy blokady klienta:

```txt
new_lead = blokuje rozpoczęcie nowego leada
case_start = blokuje start sprawy
case_completion = blokuje zamknięcie sprawy
billing = blokuje rozliczenie
contact = blokuje kontakt
relationship = blokuje dalszą relację
other = inne
none = nie blokuje
```

### Zasada agregacji w kartotece klienta

Kartoteka klienta powinna pokazywać:

1. Braki przypięte bezpośrednio do klienta.
2. Braki z leadów tego klienta.
3. Braki ze spraw tego klienta.

Ale nie wolno ich mieszać jako jednej płaskiej listy bez źródła. Każdy wpis ma mieć źródło:

```txt
[Klient] brak danych do faktury
[Lead] brak decyzji o ofercie
[Sprawa] brak podpisanej umowy
```

Top status klienta:

```txt
Brak danych klienta = tylko client-level missing.
Blokada relacji = client-level blocker albo powiązany lead/case blocker, z widocznym źródłem.
```

---

## 5. Czego nie przenosić z leada 1:1 bez zmiany

Nie przenosić dosłownie:

- `lead_next_action` jako domyślny blockScope dla sprawy/klienta,
- tekstów typu `ruch leada` do sprawy/klienta,
- top card `Blokada` bez kontekstu źródła,
- filtrowania tylko po `leadId`,
- no-flicker tylko dla leadów,
- historii jako źródła aktywnej listy,
- jednego wielkiego work center bez podziału na lead/case/client źródło,
- case_items jako aktywnego źródła braków bez decyzji migracyjnej.

---

## 6. Co warto dodać / rozwinąć

### 6.1 Źródło wpisu

Każdy brak powinien mieć source badge:

```txt
Lead / Klient / Sprawa
```

### 6.2 Wymagalność

Dodać pojęcie:

```txt
requiredFor = start | progress | close | billing | contact | none
```

albo mapować do `blockScope`.

### 6.3 Widok cross-entity

W kartotece klienta warto mieć panel:

```txt
Braki i blokady klienta
- Bezpośrednio przy kliencie
- W leadach
- W sprawach
```

### 6.4 Rozwiązanie braku

Każdy brak musi mieć akcję:

```txt
Oznacz jako uzupełnione / rozwiązane
```

Rozwiązanie nie usuwa historii.

### 6.5 Powiązanie z checklistą sprawy

W sprawie brak może opcjonalnie linkować do checklisty, ale checklisty nie mogą zastąpić systemu braków.

### 6.6 Guard antyduplikacji

Guard ma blokować sytuację, gdzie ten sam brak jest aktywnie liczony z:

- tasków,
- case_items,
- historii,

jednocześnie bez deduplikacji.

---

## 7. Kolejność wdrożenia

### STAGE232I0_MISSING_BLOCKER_CROSS_ENTITY_AUDIT_AND_CONTRACT

Status: DO_WDROZENIA

Cel: pełny audyt obecnego systemu braków w leadzie, case, client i ustalenie jednego kontraktu danych.

Zakres:

- `ContextActionDialogs.tsx`,
- `MissingItemQuickActionModal.tsx`,
- `LeadDetail.tsx`,
- `CaseDetail.tsx`,
- `ClientDetail.tsx`,
- `activity-timeline.ts`,
- `work-items/normalize.ts`,
- `insertTaskToSupabase`,
- `insertCaseItemToSupabase`,
- `fetchTasksFromSupabase`,
- `fetchCaseItemsFromSupabase`.

Wynik: dokumentowany kontrakt, bez runtime albo tylko minimalny guard diagnostyczny.

### STAGE232I1_CASE_DETAIL_MISSING_BLOCKER_RUNTIME

Status: DO_WDROZENIA_PO_I0

Cel: zaimplementować Braki/Blokady w sprawie na tym samym modelu co lead.

Zakres:

- aktywna lista braków w CaseDetail,
- top status blokady sprawy,
- zapis nowych braków jako `missing_item` z `caseId`,
- historia `Brak:` / `Blokada:`,
- resolve/delete,
- no-flicker,
- legacy case_items jako read-only/mapowanie, nie nowe źródło prawdy.

### STAGE232I2_CLIENT_DETAIL_MISSING_BLOCKER_RUNTIME

Status: DO_WDROZENIA_PO_I1

Cel: zaimplementować Braki/Blokady w kartotece klienta.

Zakres:

- client-level braki,
- client-level blokady,
- agregacja braków z leadów i spraw klienta,
- badge źródła wpisu,
- filtry: Klient / Leady / Sprawy / Blokady / Wszystkie,
- resolve/delete tylko w źródle wpisu.

### STAGE232I3_CROSS_ENTITY_OWNER_CONTROL_INTEGRATION

Status: DO_WDROZENIA_PO_I2

Cel: wpiąć braki/blokady z leada, klienta i sprawy do owner-control / Today bez dublowania.

Zakres:

- Today pokazuje blokady z właściwym źródłem,
- kartoteka klienta pokazuje podsumowanie bez dublowania,
- case blocker wpływa na sprawę i klienta, ale nie udaje lead blocker bez relacji,
- guard cross-entity source-of-truth.

---

## 8. Guardy/testy wymagane

Docelowo:

```powershell
node scripts/check-stage232i-missing-blocker-cross-entity-source-truth.cjs
node --test tests/stage232i-missing-blocker-cross-entity-source-truth.test.cjs
npm run build
npm run verify:closeflow:quiet
# albo jawny SKIP_UNRELATED_CASEDETAIL_GUARD, jeśli nadal pada tylko stary guard CaseDetail
git diff --check
```

Guard ma sprawdzać:

- lead/client/case korzystają ze wspólnego kontraktu `missing_item`,
- aktywne braki nie są liczone z historii,
- case nie tworzy nowego braku wyłącznie jako `case_item`, jeśli źródłem prawdy ma być work item,
- klient pokazuje źródło wpisu,
- blokady są po `blocksProgress`, nie po tytule,
- zwykłe checklisty/dokumenty sprawy nie udają braków bez jawnej flagi.

## 9. Ryzyka

- Można przypadkowo zrobić trzy różne modele braków: lead task, case item, client task.
- Można dublować ten sam brak w kliencie, leadzie i sprawie bez źródła.
- Można utracić legacy case_items status=missing.
- Można pomieszać checklistę sprawy z brakami operacyjnymi.
- Można fałszywie podbić owner-control, jeśli jeden blocker liczy się kilka razy.
- Może być potrzebny schema check albo SQL, jeśli task/work item nie przechowuje metadata dla case/client.

## 10. Decyzja robocza

Nie wdrażać od razu runtime dla sprawy i klienta bez I0. Najpierw zrobić audyt i kontrakt cross-entity, bo obecny case path jest inny niż lead/client path.

