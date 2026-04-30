# CloseFlow — plan funkcji zwiększających wartość bez przeciążania aplikacji

**Data:** 2026-04-30  
**Repo:** `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`  
**Branch:** `dev-rollout-freeze`  
**Tryb:** plan wdrożeniowy do dalszej budowy etapami  

---

# 0. Decyzja produktowa

Nie dokładamy ciężkich modułów ani kolejnych ekranów tam, gdzie wystarczy szybka akcja w istniejącym miejscu.

Aplikacja ma dostać realną wartość w codziennej pracy:

1. **dyktowanie notatek** przy leadzie, kliencie i sprawie,
2. **zamiana chaotycznej notatki w uporządkowaną notatkę + propozycje zadań/wydarzeń**,
3. **szybki follow-up z notatki**,
4. **ostatnie ruchy / historia kontaktu w kontekście rekordu**,
5. **szablony odpowiedzi jako osobna lekka zakładka**,
6. **generowanie odpowiedzi z wybranego szablonu**,
7. **raport tygodniowy na e-mail** zamiast dokładania dużego dashboardu,
8. **asystent AI i Szkice AI V2 od podstaw**, bo obecna wersja jest zbyt głupia, oparta o sztywne reguły i nie rozumie aplikacji wystarczająco dobrze.

Ważne: widok `Zagrożone / Brak działań` już istnieje, więc **nie wdrażamy go od zera**. Można go później tylko dopracować jako źródło danych dla AI i raportów.

---

# 1. Zasady ogólne dla wszystkich etapów

## Nie przeciążać UI

Nowe funkcje mają być dostępne jako:

- przycisk w istniejącym kontekście,
- modal,
- panel boczny,
- mała sekcja w istniejącym ekranie,
- jedna nowa zakładka tylko dla szablonów odpowiedzi.

Nie robić z tego osobnego CRM-u, kombajnu automatyzacji ani drugiego panelu administracyjnego.

## Nie tworzyć finalnych rekordów bez potwierdzenia

AI może przygotować:

- notatkę,
- szkic zadania,
- szkic wydarzenia,
- szkic odpowiedzi,
- propozycję powiązania z leadem/klientem/sprawą.

Finalny zapis wymaga kliknięcia użytkownika, chyba że akcja jest zwykłą notatką zapisaną świadomie przez użytkownika.

## Nie opierać jakości na gotowych szablonach AI

Asystent AI nie ma udawać inteligencji listą twardych odpowiedzi.

Szablony odpowiedzi mają być normalnymi danymi użytkownika w aplikacji:

- użytkownik może dodać własny szablon,
- użytkownik może edytować szablon,
- użytkownik może wyszukać szablon po nazwie/tagach,
- AI może użyć wybranego szablonu jako materiału do wygenerowania odpowiedzi,
- ale AI nie ma mieć zaszytych na sztywno gotowych tekstów sprzedażowych w kodzie.

---

# 2. Jak aplikacja ma łapać chaotyczne mówienie użytkownika

Użytkownik będzie mówił chaotycznie. To normalne.

Przykład:

```text
No zapisz mi tam tego Marka, chyba z Facebooka, dzwonił o działkę, w sumie nie wiem czy dziś czy jutro mam oddzwonić, mówił coś o Siedliskach i że chce cenę, wpisz że pilne.
```

Aplikacja nie ma udawać, że wszystko wie. Ma działać warstwowo.

## Pipeline V1

1. **Surowa notatka**  
   Zachować pełny tekst do momentu zatwierdzenia albo anulowania.

2. **Czyszczenie transkrypcji**  
   Usunąć duplikaty fragmentów, pauzy, przypadkowe powtórzenia, ale nie usuwać informacji biznesowych.

3. **Rozpoznanie kandydatów**  
   Wyłapać możliwe dane:
   - osoba/firma,
   - telefon,
   - e-mail,
   - temat,
   - lokalizacja,
   - termin,
   - kwota/wartość,
   - źródło,
   - zadanie,
   - wydarzenie,
   - powiązany lead/klient/sprawa.

4. **Pewność pola**  
   Każde pole ma mieć stan:
   - `pewne`,
   - `do sprawdzenia`,
   - `brak`.

5. **Ekran sprawdzenia**  
   Użytkownik widzi:
   - oryginalną notatkę,
   - uporządkowaną notatkę,
   - wykryte pola,
   - propozycje zadań/wydarzeń,
   - ostrzeżenia `AI nie jest pewne`.

6. **Zapis bez wymuszania perfekcji**  
   Jeśli AI nie rozumie terminu albo osoby, zapisuje po prostu notatkę i oznacza brakujące pola.

## Zasada kluczowa

AI nie musi idealnie zrozumieć chaotycznej mowy.  
AI ma **nie zgubić treści** i **pomóc użytkownikowi szybko ją uporządkować**.

---

# ETAP 1 — Dyktafon notatek przy leadzie, kliencie i sprawie

## Cel

Dodać możliwość szybkiego podyktowania lub wpisania notatki bezpośrednio w kontekście:

- leada,
- klienta,
- sprawy.

To nie ma być tylko globalny `Szybki szkic`. Użytkownik często jest już w konkretnym leadzie/sprawie i chce dopisać notatkę po rozmowie.

## Pliki do sprawdzenia

- `src/pages/LeadDetail.tsx`
- `src/pages/ClientDetail.tsx`
- `src/pages/CaseDetail.tsx`
- `src/components/QuickAiCapture.tsx`
- `src/components/GlobalQuickActions.tsx`
- `src/lib/ai-capture.ts`
- `src/lib/ai-drafts.ts`
- `src/lib/supabase-fallback.ts`
- `api/system.ts`
- `src/server/ai-capture.ts`
- `api/activities.ts` albo aktualny endpoint aktywności
- `tests/*ai*`
- `tests/*activity*`

## Zmień

1. Dodać wspólny komponent:

```text
src/components/VoiceNoteCapture.tsx
```

2. Komponent ma przyjmować propsy:

```ts
recordType: 'lead' | 'client' | 'case'
recordId: string
recordLabel?: string
mode?: 'note_only' | 'note_with_suggestions'
onSaved?: () => void
```

3. Dodać przycisk w szczegółach leada:

```text
🎙️ Podyktuj notatkę
```

4. Dodać przycisk w szczegółach klienta:

```text
🎙️ Podyktuj notatkę
```

5. Dodać przycisk w szczegółach sprawy:

```text
🎙️ Podyktuj notatkę
```

6. Modal powinien mieć:

- duże pole tekstowe,
- przycisk `Dyktuj`, jeśli przeglądarka wspiera Web Speech API,
- przycisk `Zapisz jako notatkę`,
- przycisk `Uporządkuj notatkę`,
- informację, że aplikacja nie nagrywa rozmowy telefonicznej.

7. Po kliknięciu `Zapisz jako notatkę`:

- zapisać aktywność/notatkę do rekordu,
- nie tworzyć zadań automatycznie,
- odświeżyć historię.

8. Po kliknięciu `Uporządkuj notatkę`:

- użyć parsera/AI,
- pokazać ekran sprawdzenia,
- zaproponować zadania/wydarzenia,
- pozwolić zatwierdzić tylko wybrane elementy.

## Nie zmieniaj

- Nie usuwaj istniejącego `QuickAiCapture`.
- Nie zmieniaj obecnego flow lead → sprawa.
- Nie zapisuj finalnych zadań/wydarzeń bez potwierdzenia.
- Nie nagrywaj audio do pliku w V1.
- Nie zapisuj surowej transkrypcji po zatwierdzeniu, jeśli użytkownik zatwierdził już uporządkowaną notatkę.

## Po wdrożeniu sprawdź

1. Wejdź w leada i podyktuj notatkę.
2. Sprawdź, czy notatka pojawia się w historii leada.
3. Wejdź w klienta i podyktuj notatkę.
4. Sprawdź, czy notatka nie tworzy nowego leada bez potwierdzenia.
5. Wejdź w sprawę i podyktuj notatkę.
6. Sprawdź, czy notatka jest przypięta do sprawy, nie do losowego leada.
7. Sprawdź mobile.

## Kryterium zakończenia

- Notatkę można dodać głosem/tekstem do leada, klienta i sprawy.
- Zapis jest kontekstowy.
- UI nie jest przeładowane.
- Nie ma auto-zapisu zadań/wydarzeń bez potwierdzenia.

---

# ETAP 2 — Zamiana notatki w zadania i wydarzenia

## Cel

Po rozmowie użytkownik może podyktować chaotyczną notatkę, a aplikacja wyciąga z niej propozycje:

- notatka do historii,
- zadanie follow-up,
- wydarzenie w kalendarzu,
- ewentualne ostrzeżenie, że czegoś nie rozumie.

## Pliki do sprawdzenia

- `src/components/VoiceNoteCapture.tsx`
- `src/lib/ai-capture.ts`
- `src/server/ai-capture.ts`
- `src/lib/scheduling.ts`
- `src/lib/schedule-conflicts.ts`
- `src/lib/supabase-fallback.ts`
- `src/pages/LeadDetail.tsx`
- `src/pages/ClientDetail.tsx`
- `src/pages/CaseDetail.tsx`

## Zmień

1. Dodać typ wyniku analizy notatki:

```ts
type VoiceNoteSuggestion = {
  cleanedNote: string;
  confidence: number;
  warnings: string[];
  tasks: Array<{
    title: string;
    scheduledAt?: string | null;
    priority?: 'low' | 'medium' | 'high';
    confidence: 'high' | 'medium' | 'low';
  }>;
  events: Array<{
    title: string;
    startAt?: string | null;
    endAt?: string | null;
    confidence: 'high' | 'medium' | 'low';
  }>;
  unresolved: string[];
};
```

2. Dodać ekran sprawdzenia:

```text
Sprawdź notatkę

Notatka:
[pole edycji]

Proponowane zadania:
[ ] Oddzwonić do Marka — jutro 10:00
[ ] Wysłać cenę działki — bez terminu

Proponowane wydarzenia:
[ ] Spotkanie z klientem — piątek 12:00

[Zapisz wybrane]
```

3. Jeżeli termin jest niepewny, pokazać:

```text
Nie jestem pewien terminu. Wybierz datę ręcznie.
```

4. Jeżeli osoba/rekord jest niepewny, ale użytkownik jest już w leadzie/kliencie/sprawie, domyślnie przypiąć do aktualnego rekordu.

5. Jeżeli użytkownik jest w globalnym trybie `Po rozmowie`, pokazać wybór:

- utwórz nowego leada,
- przypnij do istniejącego leada,
- przypnij do klienta,
- przypnij do sprawy,
- tylko zapisz jako notatkę.

## Nie zmieniaj

- Nie usuwaj obecnego parsera.
- Nie rób obowiązkowego AI dla każdego zapisu.
- Nie twórz automatycznie wielu rekordów, jeśli confidence jest niski.
- Nie blokuj zwykłego zapisu notatki, gdy AI nie działa.

## Po wdrożeniu sprawdź

Testowe notatki:

```text
Klient chce ofertę do piątku, mam wysłać cennik i zadzwonić w poniedziałek.
```

```text
Marek z Siedlisk pytał o działkę, oddzwonić jutro po 10, nie wiem czy chce cenę brutto czy netto.
```

```text
Zapisz tylko notatkę: klient mówił, że wróci do tematu za jakiś czas.
```

## Kryterium zakończenia

- Chaotyczna notatka nie musi być idealnie zrozumiana.
- Surowa treść nie ginie.
- Użytkownik widzi propozycje.
- Użytkownik zatwierdza tylko to, co chce.

---

# ETAP 3 — Szybki follow-up z notatki

## Cel

Po dodaniu notatki aplikacja ma szybko pomagać ustawić następny ruch bez otwierania osobnego formularza zadań.

## Pliki do sprawdzenia

- `src/pages/LeadDetail.tsx`
- `src/pages/ClientDetail.tsx`
- `src/pages/CaseDetail.tsx`
- `src/components/VoiceNoteCapture.tsx`
- `src/lib/supabase-fallback.ts`
- `src/lib/scheduling.ts`

## Zmień

1. Po zapisaniu notatki pokazać opcję:

```text
Ustaw follow-up
[Dziś] [Jutro] [Za 2 dni] [Za tydzień] [Własny termin]
```

2. Kliknięcie tworzy zadanie typu `follow_up` przypięte do aktualnego rekordu.

3. Tytuł zadania domyślny:

```text
Follow-up: {nazwa rekordu}
```

4. Jeśli notatka zawiera słowa typu:

- oddzwonić,
- przypomnieć,
- wysłać,
- sprawdzić,
- klient ma wrócić,
- brak odpowiedzi,

aplikacja pokazuje follow-up jako mocniejszą sugestię.

## Nie zmieniaj

- Nie usuwaj istniejących formularzy dodawania zadań.
- Nie twórz follow-upu automatycznie bez kliknięcia.

## Po wdrożeniu sprawdź

1. Dodaj notatkę przy leadzie.
2. Kliknij `Jutro`.
3. Sprawdź, czy zadanie jest widoczne w leadzie, zadaniach, kalendarzu/Today, jeśli tam powinno wpadać.
4. Zrób to samo przy sprawie.

## Kryterium zakończenia

- Użytkownik po rozmowie może w 2 kliknięcia zapisać notatkę i follow-up.

---

# ETAP 4 — Ostatnie 5 ruchów przy leadzie, kliencie i sprawie

## Cel

Użytkownik po wejściu w rekord ma od razu widzieć, co ostatnio działo się z klientem/leadem/sprawą.

## Pliki do sprawdzenia

- `src/pages/LeadDetail.tsx`
- `src/pages/ClientDetail.tsx`
- `src/pages/CaseDetail.tsx`
- `src/pages/Activity.tsx`
- `src/lib/supabase-fallback.ts`
- `api/activities.ts`

## Zmień

1. Dodać mały panel:

```text
Ostatnie ruchy
```

2. Pokazać maksymalnie 5 ostatnich aktywności:

- notatka,
- zadanie dodane,
- zadanie zrobione,
- wydarzenie,
- zmiana statusu,
- przejście lead → sprawa,
- wygenerowana odpowiedź z szablonu.

3. Dodać link:

```text
Zobacz całą aktywność
```

## Nie zmieniaj

- Nie zastępuj istniejącej zakładki Aktywność.
- Nie pokazuj całej historii w tym panelu.
- Nie dokładaj filtrów w tym miejscu.

## Po wdrożeniu sprawdź

1. Dodaj notatkę.
2. Dodaj zadanie.
3. Oznacz zadanie jako zrobione.
4. Sprawdź, czy panel pokazuje ostatnie ruchy w dobrej kolejności.

## Kryterium zakończenia

- Użytkownik w 5 sekund widzi kontekst ostatniego kontaktu.

---

# ETAP 5 — Zakładka Szablony odpowiedzi

## Cel

Dodać lekką zakładkę `Szablony`, gdzie użytkownik może tworzyć, edytować i wyszukiwać własne szablony odpowiedzi.

To nie mają być gotowe szablony zaszyte w AI. To mają być dane użytkownika.

## Pliki do sprawdzenia

- `src/App.tsx`
- `src/components/Layout.tsx`
- `src/pages/*`
- `src/lib/supabase-fallback.ts`
- `api/system.ts` albo osobny endpoint `api/response-templates.ts`
- migracje Supabase
- testy routingu

## Zmień

1. Dodać route:

```text
/templates
```

2. Dodać stronę:

```text
src/pages/ResponseTemplates.tsx
```

3. Dodać model:

```ts
type ResponseTemplate = {
  id: string;
  workspaceId: string;
  name: string;
  category?: string;
  tags: string[];
  body: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
};
```

4. Dodać CRUD:

- lista szablonów,
- szukaj po nazwie,
- filtr po tagu/kategorii,
- dodaj szablon,
- edytuj,
- archiwizuj,
- kopiuj treść.

5. Dodać proste zmienne:

```text
{{client_name}}
{{lead_name}}
{{case_title}}
{{my_name}}
{{company_name}}
{{next_step}}
```

6. UI ma być prosty:

- lewa kolumna: lista/szukaj,
- prawa kolumna: edycja/podgląd,
- bez buildera automatyzacji.

## Nie zmieniaj

- Nie dodawaj automatycznej wysyłki maila w tym etapie.
- Nie wkładaj stałych gotowych szablonów do kodu jako źródła prawdy.
- Nie mieszaj szablonów z AI Drafts.

## Po wdrożeniu sprawdź

1. Dodaj szablon `Przypomnienie po braku odpowiedzi`.
2. Wyszukaj go po nazwie.
3. Edytuj treść.
4. Skopiuj treść.
5. Zarchiwizuj.

## Kryterium zakończenia

- Użytkownik ma własną bibliotekę odpowiedzi bez przeciążenia UI.

---

# ETAP 6 — Generowanie odpowiedzi z wybranego szablonu

## Cel

Przy leadzie, kliencie i sprawie użytkownik może wybrać swój szablon i wygenerować odpowiedź dopasowaną do kontekstu.

## Pliki do sprawdzenia

- `src/pages/LeadDetail.tsx`
- `src/pages/ClientDetail.tsx`
- `src/pages/CaseDetail.tsx`
- `src/pages/ResponseTemplates.tsx`
- `src/components/TemplateReplyGenerator.tsx`
- `src/server/ai-assistant.ts` albo nowy `src/server/template-reply.ts`
- `api/system.ts`

## Zmień

1. Dodać przycisk w rekordach:

```text
Wygeneruj odpowiedź
```

2. Po kliknięciu otworzyć modal:

- wyszukaj szablon,
- wybierz szablon,
- pokaż dane, które zostaną podstawione,
- pole dodatkowych instrukcji,
- przycisk `Wygeneruj`.

3. Wynik:

- tekst odpowiedzi,
- `Kopiuj`,
- `Zapisz jako szkic odpowiedzi`,
- `Dodaj do aktywności`.

4. AI ma używać:

- wybranego szablonu,
- danych aktualnego rekordu,
- instrukcji użytkownika.

5. AI nie ma wybierać szablonu z magicznej listy zaszytej w kodzie. Może tylko pracować na szablonach użytkownika.

## Nie zmieniaj

- Nie wysyłaj maila automatycznie.
- Nie zapisuj odpowiedzi jako kontaktu z klientem, dopóki użytkownik nie kliknie.
- Nie mieszaj tego z AI Drafts V1.

## Po wdrożeniu sprawdź

1. Utwórz szablon.
2. Wejdź w leada.
3. Wybierz szablon.
4. Wygeneruj odpowiedź.
5. Skopiuj odpowiedź.
6. Zapisz odpowiedź do aktywności.

## Kryterium zakończenia

- Użytkownik może szybko wygenerować ludzką odpowiedź z własnego szablonu.

---

# ETAP 7 — Raport tygodniowy na e-mail

## Cel

Nie dodawać dużego dashboardu. Dodać prosty raport tygodnia wysyłany e-mailem.

To ma być wartość premium i poczucie kontroli bez przeciążania aplikacji.

## Pliki do sprawdzenia

- `api/daily-digest.ts`
- `src/server/_digest.ts`
- `src/pages/Settings.tsx`
- `src/lib/supabase-fallback.ts`
- `vercel.json`
- `tests/*digest*`

## Zmień

1. Rozszerzyć mechanizm digestu o tryb:

```text
weekly-report
```

2. Raport tygodnia powinien zawierać:

- nowe leady,
- leady przeniesione do spraw,
- wykonane zadania,
- zaległe zadania,
- leady zagrożone / brak działań,
- nowe sprawy,
- sprawy z blokerami,
- szkice AI lub notatki do sprawdzenia,
- krótką listę `najważniejsze na następny tydzień`.

3. Dodać ustawienia:

- włącz/wyłącz raport tygodniowy,
- dzień tygodnia,
- godzina,
- odbiorca.

4. Na start UI może być ukryte lub proste w ustawieniach.

## Nie zmieniaj

- Nie buduj dużego dashboardu tygodniowego.
- Nie dodawaj wykresów, jeśli raport e-mail wystarczy.
- Nie mieszaj raportu tygodniowego z codziennym digestem bez osobnego `mode`.

## Po wdrożeniu sprawdź

1. Wyślij test raportu tygodniowego.
2. Sprawdź, czy nie wysyła duplikatu.
3. Sprawdź, czy uwzględnia tylko workspace użytkownika.
4. Sprawdź treść na telefonie.

## Kryterium zakończenia

- Użytkownik raz w tygodniu dostaje prosty raport wartości pracy w aplikacji.

---

# ETAP 8 — AI i Szkice AI V2 od podstaw

## Cel

Obecny asystent i szkice AI traktujemy jako funkcjonalny prototyp, ale nie jako docelową warstwę.

Budujemy AI V2 równolegle, za flagą, bez rozwalania obecnej aplikacji.

Najpierw AI ma umieć **bardzo dokładnie mapować aplikację**, ekrany, dane, akcje i relacje. Dopiero później dostanie twardy zakres pracy ograniczony do aplikacji.

## Decyzja tymczasowa

Na początku AI V2 może odpowiadać szeroko na pytania użytkownika, żeby testować rozmowę i rozumienie, ale:

- nie ma prawa wykonywać automatycznych zapisów bez potwierdzenia,
- nie ma prawa usuwać danych,
- nie ma prawa zmieniać planów, płatności ani ustawień bezpieczeństwa,
- każde działanie zapisu idzie jako szkic albo propozycja,
- wszystkie odpowiedzi dotyczące danych aplikacji muszą być oparte na snapshotcie aplikacji.

Czyli `bez ograniczeń` oznacza: **bez sztywnych blokad tematycznych w rozmowie na etapie budowy**, a nie brak zabezpieczeń zapisu.

## Pliki do sprawdzenia

- `src/components/GlobalAiAssistant.tsx`
- `src/components/TodayAiAssistant.tsx`
- `src/lib/ai-assistant.ts`
- `src/lib/ai-drafts.ts`
- `src/pages/AiDrafts.tsx`
- `src/server/ai-assistant.ts`
- `src/server/assistant-context.ts`
- `src/server/records.ts`
- `api/system.ts`
- `src/lib/data-contract.ts`
- `src/lib/calendar-items.ts`
- `src/lib/supabase-fallback.ts`

## Zmień

### 8.1. Dodać mapę aplikacji

Nowy plik:

```text
src/lib/ai-app-map.ts
```

Mapa ma zawierać:

- route,
- nazwa ekranu,
- cel ekranu,
- główne encje,
- dostępne akcje,
- powiązania,
- czego nie wolno robić na tym ekranie.

Przykład:

```ts
{
  route: '/leads/:leadId',
  screen: 'LeadDetail',
  purpose: 'Praca sprzedażowa na aktywnym leadzie albo historia źródłowa po przejściu do sprawy',
  entities: ['lead', 'task', 'event', 'activity', 'case'],
  actions: ['add_note', 'add_task', 'add_event', 'start_case', 'edit_lead'],
  forbiddenWhenMovedToService: ['add_task_to_lead', 'add_event_to_lead']
}
```

### 8.2. Dodać AI snapshot V2

Backend ma budować snapshot:

```ts
type AiApplicationSnapshotV2 = {
  workspace: {...};
  appMap: AppMapEntry[];
  userContext: {...};
  leads: LeadSummary[];
  clients: ClientSummary[];
  cases: CaseSummary[];
  tasks: TaskSummary[];
  events: EventSummary[];
  activities: ActivitySummary[];
  drafts: DraftSummary[];
  templates: ResponseTemplateSummary[];
  riskSummary: {...};
  todaySummary: {...};
}
```

### 8.3. Nowy tryb rozmowy

AI V2 ma zwracać JSON:

```json
{
  "mode": "answer" | "draft" | "action_proposal",
  "answer": "tekst dla użytkownika",
  "items": [],
  "draft": null,
  "proposedActions": [],
  "usedData": [],
  "missingData": [],
  "confidence": "high" | "medium" | "low"
}
```

### 8.4. Szkice AI V2

Szkice AI V2 mają być jednym systemem dla:

- lead,
- task,
- event,
- note,
- reply_draft.

Statusy:

- `pending_review`,
- `confirmed`,
- `cancelled`,
- `expired`,
- `failed`.

Każdy szkic ma mieć:

- `draftType`,
- `source`,
- `rawText` tylko tymczasowo,
- `parsedData`,
- `targetRecordType`,
- `targetRecordId`,
- `confidence`,
- `warnings`,
- `expiresAt`.

### 8.5. Migracja ostrożna

Nie usuwać od razu starego `AiDrafts`.

Najpierw:

- dodać V2 za flagą,
- zrobić mapowanie starych statusów do nowych,
- zapewnić odczyt starych szkiców,
- dopiero potem przepiąć UI.

## Nie zmieniaj

- Nie dawaj AI automatycznego zapisu finalnych danych.
- Nie usuwaj starego asystenta przed działającym V2.
- Nie dawaj AI gotowych szablonów odpowiedzi w kodzie.
- Nie blokuj jeszcze pytań spoza aplikacji na etapie budowy V2, ale oznacz ten tryb jako testowy.
- Nie mieszaj AI V2 z billingiem w tym etapie.

## Po wdrożeniu sprawdź

1. Zapytaj:

```text
Co ta aplikacja ma w środku i gdzie co znajdę?
```

Oczekiwane: AI odpowiada na podstawie mapy aplikacji.

2. Zapytaj:

```text
Co mam dziś do zrobienia?
```

Oczekiwane: AI odpowiada na podstawie snapshotu, nie ogólników.

3. Zapytaj:

```text
Znajdź klienta Marka i pokaż co z nim ostatnio było.
```

Oczekiwane: AI szuka po klientach, leadach, sprawach i aktywnościach.

4. Powiedz:

```text
Zapisz notatkę do sprawy, że klient chce wrócić do tematu w poniedziałek.
```

Oczekiwane: AI tworzy szkic `note` + ewentualną propozycję taska, ale nic nie zapisuje finalnie bez zatwierdzenia.

## Kryterium zakończenia

- AI V2 ma mapę aplikacji.
- AI V2 ma snapshot danych.
- AI V2 nie działa jak lista szablonów.
- AI V2 tworzy propozycje i szkice, nie finalne rekordy.
- Obecna aplikacja nie traci działających funkcji.

---

# ETAP 9 — Zakres pracy AI po ustabilizowaniu V2

## Cel

Dopiero po tym, jak AI rozumie aplikację, ograniczamy je twardo do zakresu CloseFlow.

## Pliki do sprawdzenia

- `src/server/ai-assistant.ts`
- `src/lib/ai-assistant.ts`
- `src/lib/ai-app-map.ts`
- `src/server/assistant-context.ts`
- testy AI

## Zmień

1. Dodać scope gate:

```ts
type AiScope =
  | 'app_question'
  | 'record_lookup'
  | 'daily_plan'
  | 'draft_creation'
  | 'template_reply'
  | 'out_of_scope';
```

2. Jeśli pytanie jest poza aplikacją:

- AI może krótko odpowiedzieć, że ten asystent służy do CloseFlow,
- nie zużywać drogiego modelu, jeśli da się to wykryć lokalnie,
- zaproponować pytanie w zakresie aplikacji.

3. Nie blokować zwykłych rozmów diagnostycznych admina w trybie developerskim.

## Nie zmieniaj

- Nie wprowadzaj scope gate przed zakończeniem mapy aplikacji.
- Nie wracaj do głupich sztywnych szablonów odpowiedzi.

## Po wdrożeniu sprawdź

1. Pytanie o aplikację przechodzi.
2. Pytanie o leady przechodzi.
3. Komenda zapisu tworzy szkic.
4. Pytanie kompletnie spoza aplikacji jest miękko odrzucane.

## Kryterium zakończenia

- AI ma wolność rozumienia języka, ale zakres pracy jest bezpieczny i związany z aplikacją.

---

# 10. Kolejność realizacji

## Najpierw

1. **ETAP 1 — Dyktafon notatek przy leadzie/kliencie/sprawie**
2. **ETAP 2 — Zamiana notatki w zadania/wydarzenia**
3. **ETAP 3 — Szybki follow-up z notatki**

To daje największą wartość użytkownikowi bez ciężkiego UI.

## Potem

4. **ETAP 4 — Ostatnie 5 ruchów**
5. **ETAP 5 — Zakładka Szablony odpowiedzi**
6. **ETAP 6 — Generowanie odpowiedzi z szablonu**

To porządkuje codzienną pracę i daje przewagę sprzedażową.

## Następnie

7. **ETAP 7 — Raport tygodniowy e-mail**

To daje wartość bez kolejnego dashboardu.

## Równolegle technicznie, ale ostrożnie

8. **ETAP 8 — AI i Szkice AI V2 od podstaw**
9. **ETAP 9 — Scope gate AI po ustabilizowaniu V2**

To trzeba robić ostrożnie, bo dotyka architektury aplikacji.

---

# 11. Co konkretnie NIE robimy teraz

- Nie budujemy dużego dashboardu analitycznego.
- Nie dokładamy kolejnych pięciu zakładek.
- Nie robimy automatycznego wysyłania wiadomości bez potwierdzenia.
- Nie robimy team managementu.
- Nie budujemy automatyzacji typu `jeśli X to Y`.
- Nie przepinamy całej aplikacji na AI.
- Nie usuwamy obecnego flow lead → sprawa.
- Nie ruszamy widoku `Zagrożone` jako nowego modułu, bo już istnieje.

---

# 12. Minimalne testy po każdym etapie

Po każdym etapie uruchomić:

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd run verify:closeflow:quiet
```

Dodatkowo ręcznie sprawdzić:

- lead detail,
- client detail,
- case detail,
- Today,
- Szkice AI,
- Aktywność,
- mobile width,
- polskie znaki,
- brak white screen.

---

# 13. Docelowy efekt dla użytkownika

Użytkownik ma po rozmowie zrobić jedno z trzech:

```text
Podyktuj notatkę
```

```text
Zamień notatkę w zadania
```

```text
Wygeneruj odpowiedź z mojego szablonu
```

I aplikacja ma go przeprowadzić przez sprawdzenie, bez chaosu i bez zgadywania.

Najprostszy komunikat sprzedażowy tej warstwy:

```text
CloseFlow pilnuje, żeby po rozmowie z klientem nic nie uciekło.
```
