# CF-SCALE-5K-001 — Wymogi produktu pod 5k klientów: import, presety, owner view, trust i support

Data: 2026-06-04  
Status: decyzja produktowo-produktowa + backlog rozwoju  
Projekt: CloseFlow / LeadFlow / CaseFlow  
Repo: `dkknapikdamian-collab/leadflowv1`  
Branch: `dev-rollout-freeze`  
Local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`

---

## 1. Kontekst

Celem strategicznym jest zbudowanie CloseFlow tak, aby miał realną szansę dojść do dużej skali, docelowo nawet kilku tysięcy klientów.

Nie wystarczy dodać więcej funkcji. Produkt musi usuwać główne bariery małych firm:

- chaos danych,
- różne formaty leadów,
- różne nazewnictwo,
- dane w różnych aplikacjach,
- brak czasu na konfigurację CRM,
- brak zaufania do wrzucania danych klientów,
- brak prostego supportu i onboardingów.

---

## 2. Kluczowa decyzja: import/intake nie może być magicznym importem wszystkiego

Problem:

Każdy klient może mieć dane w innym formacie:

- Excel,
- Google Sheets,
- CSV,
- notatki,
- Gmail,
- formularze ze strony,
- eksporty z innych CRM,
- Messenger / WhatsApp / SMS,
- ręczne listy kontaktów,
- różne nazwy kolumn,
- różne statusy,
- różne style pracy.

Nie da się tego uczciwie rozwiązać jednym magicznym importem.

Finalny kierunek:

> Budujemy uniwersalny intake/import z mapowaniem pól, podglądem, aliasami i ręcznym zatwierdzeniem.  
> Nie importujemy destrukcyjnie i nie zgadujemy bez pokazania użytkownikowi podglądu.

---

## 3. Universal Lead Intake — kierunek rozwoju

CloseFlow powinien mieć moduł/kierunek:

`Universal Lead Intake`

Zakres docelowy:

1. Wklej tekst i utwórz leada.
2. Import CSV/XLSX.
3. Import z Google Sheets.
4. Import z Gmail / maili — później.
5. Import formularzy ze strony — później.
6. Mapowanie pól.
7. Podgląd przed importem.
8. Wykrywanie duplikatów.
9. Normalizacja telefonów, emaili, nazw.
10. Aliasowanie nazw kolumn.
11. Staging importu przed zapisaniem do głównych danych.
12. Raport po imporcie: co zaimportowano, co wymaga ręcznej decyzji, co odrzucono.
13. Parser danych pionowych, poziomych i wpisanych jednym ciągiem.
14. Tryb „jedna osoba” vs „wiele osób / wiele leadów”.
15. Poziom pewności rozpoznania pól i obowiązkowa korekta przy niskiej pewności.

---

## 4. Mapowanie pól i aliasy

System powinien rozumieć różne nazwy tego samego pola.

Przykłady aliasów:

```text
telefon = phone / tel / nr telefonu / mobile / komórka / kontakt
email = e-mail / mail / adres email
nazwa = name / klient / osoba / kontakt / imię i nazwisko
status = etap / pipeline / stan / faza / typ kontaktu
źródło = source / skąd / kampania / reklama / kanał
notatka = note / opis / uwagi / komentarz
termin = data / deadline / kiedy / spotkanie / follow-up
adres = address / lokalizacja / miasto / miejsce / inwestycja
budżet = kwota / cena / budzet / wartość / wycena
```

Ale AI/automat nie może zapisać tego od razu bez kontroli.

MVP:

- system proponuje mapowanie,
- użytkownik widzi podgląd,
- użytkownik zatwierdza albo poprawia,
- dopiero potem dane trafiają do systemu.

---

## 4A. Dane wpisane pionowo, poziomo albo jednym ciągiem

Problem:

Użytkownik może wkleić dane bardzo różnie.

Przykłady:

### Dane pionowo

```text
Jan Kowalski
tel. 501 222 333
jan@email.pl
chce wycenę remontu kuchni
oddzwonić jutro
```

### Dane poziomo

```text
Jan Kowalski, 501 222 333, jan@email.pl, remont kuchni, oddzwonić jutro
```

### Dane w jednym ciągu

```text
Jan Kowalski 501222333 jan@email.pl remont kuchni oddzwonić jutro po 16
```

### Kilka leadów bez tabeli

```text
Jan 501222333 remont kuchni
Anna 601333444 mieszkanie sprzedaż
Marek 721888999 wycena pompy ciepła
```

### Dane z etykietami użytkownika

```text
Klient: Anna Nowak
Kontakt: 601 333 444
Temat: mieszkanie do sprzedaży
Kolejny krok: wysłać ofertę
```

Finalna decyzja:

> CloseFlow musi mieć parser luźnego tekstu, który rozpoznaje dane pionowe, poziome i wpisane jednym ciągiem, ale zawsze pokazuje podgląd przed zapisem.

---

## 4B. Jak ogarniamy chaos formatu

Parser intake powinien działać warstwowo:

### 1. Rozpoznanie typu wejścia

System próbuje wykryć, czy użytkownik wkleił:

- tabelę CSV/TSV,
- dane z nagłówkami,
- jeden kontakt pionowo,
- jeden kontakt poziomo,
- wiele kontaktów w wielu liniach,
- luźną notatkę,
- mail / treść formularza,
- eksport z innej aplikacji.

### 2. Rozpoznanie separatorów

System wykrywa separatory:

- enter,
- przecinek,
- średnik,
- tabulator,
- myślnik,
- pionowa kreska,
- spacje między fragmentami,
- puste linie jako granice rekordów.

### 3. Rozpoznanie wzorców twardych

Najpierw rozpoznawać rzeczy najłatwiejsze:

- numer telefonu,
- email,
- URL,
- data,
- godzina,
- kwota,
- nazwa firmy,
- imię i nazwisko,
- słowa typu: oddzwonić, wysłać, spotkanie, oferta, wycena, follow-up.

### 4. Segmentacja rekordów

Jeśli danych jest więcej, system musi ustalić, czy to:

- jeden lead z wieloma liniami,
- wiele leadów po jednym wierszu,
- wiele leadów oddzielonych pustą linią,
- lista telefonów bez nazw,
- notatka do ręcznego przypisania.

Jeżeli system nie jest pewny, ma zapytać użytkownika:

```text
Czy to jest jeden lead czy kilka leadów?
[ Jeden lead ] [ Kilka leadów ] [ Pokaż podgląd ]
```

### 5. Poziom pewności

Każde rozpoznane pole powinno mieć poziom pewności:

```text
high
medium
low
```

Reguła:

- `high` może być zaproponowane jako gotowe,
- `medium` wymaga podświetlenia w podglądzie,
- `low` wymaga korekty albo ręcznej decyzji.

### 6. Podgląd jako karty, nie tylko tabela

Dla luźnego tekstu lepszy jest podgląd kart:

```text
Lead 1
Nazwa: Jan Kowalski
Telefon: 501 222 333
Email: jan@email.pl
Temat: remont kuchni
Następny krok: oddzwonić jutro
Status: nowy lead
[ Popraw ] [ Zapisz ]
```

Dla dużego importu lepsza jest tabela z kolumnami i błędami.

### 7. Zapis dopiero po zatwierdzeniu

Nie wolno zapisywać automatycznie do głównych danych po samym wklejeniu.

Użytkownik musi kliknąć:

```text
Zapisz jako lead
```

albo:

```text
Zaimportuj X leadów
```

---

## 4C. Reguła minimalnej użyteczności intake

Dla skalowania do tysięcy klientów intake musi obsłużyć minimum:

```text
imię/nazwa + telefon
imię/nazwa + email
telefon + notatka
email + notatka
luźna notatka z kontaktem
kilka kontaktów w kilku liniach
```

Jeżeli nie ma telefonu ani emaila, system może utworzyć draft leada, ale powinien pokazać ostrzeżenie:

```text
Brakuje telefonu lub emaila. Ten lead może być trudny do obsługi.
```

---

## 4D. Guardy parsera luźnego tekstu

- Nie zapisywać danych bez podglądu.
- Nie zgadywać nazwiska, jeśli nie ma pewności.
- Nie traktować każdej linii jako osobnego leada bez sprawdzenia.
- Nie mieszać danych dwóch osób w jednym leadzie.
- Jeśli wykryto kilka telefonów albo emaili, pokazać wybór.
- Jeśli wykryto kilka potencjalnych nazw, pokazać wybór.
- Zachować surowy tekst importu jako `raw_input`, żeby dało się sprawdzić, skąd wzięły się dane.
- Przy niskiej pewności zapisać jako draft / wymaga sprawdzenia, nie jako pełny lead.
- Duplikaty pokazać przed zapisem.
- AI może proponować, ale użytkownik zatwierdza.

---

## 5. Staging importu — obowiązkowy guard

Import powinien mieć warstwę pośrednią:

```text
raw_import_rows
raw_input_text
input_type_detected
parsed_entities
mapped_import_rows
import_preview
import_decision
final_imported_records
```

Guard:

- nic nie trafia masowo do głównych leadów bez podglądu,
- duplikaty oznaczać przed importem,
- błędne telefony / emaile pokazać jako wymagające uwagi,
- puste rekordy odrzucić,
- użytkownik musi wiedzieć, ile rekordów zostanie dodanych,
- dla luźnego tekstu zachować oryginalną wklejkę jako dowód/parsing source,
- przy niskiej pewności zapisywać jako draft albo wymagać korekty.

---

## 6. Import z Google / kalendarz / auto-przeniesienie

Google Calendar jest już kierunkiem, który ogarniamy i ma być częścią wartości produktu.

W rozwoju trzeba rozdzielić:

1. Google Calendar sync / wydarzenia,
2. auto-przeniesienie wydarzeń do CloseFlow,
3. powiązanie wydarzenia z leadem/klientem/sprawą,
4. wykrycie follow-upu po spotkaniu,
5. widok „Dziś” jako miejsce, gdzie trafiają zdarzenia i zadania.

Kalendarz nie jest tylko integracją. To część mechaniki powrotu użytkownika.

Zasada:

> Jeśli spotkanie jest w Google Calendar, CloseFlow powinien pomóc powiązać je z klientem/sprawą i nie pozwolić, żeby po spotkaniu zabrakło następnego kroku.

---

## 7. Presety branżowe — potrzebne, ale mogą być problemem

Presety branżowe są dobre, ale mogą stworzyć chaos, jeśli każdy segment będzie miał całkiem inną aplikację.

Finalna zasada:

> Core danych musi być wspólny, a presety mają być nakładką, nie osobnym produktem dla każdej branży.

Wspólny core:

- lead,
- klient,
- sprawa,
- zadanie,
- wydarzenie,
- follow-up,
- status,
- źródło,
- właściciel,
- priorytet,
- termin.

Preset branżowy może zmieniać:

- przykładowe statusy,
- przykładowe zadania,
- przykładowe follow-upy,
- nazwy etapów w UI,
- checklistę startową,
- szablony wiadomości.

Nie może zmieniać fundamentów danych.

---

## 8. Presety startowe do rozważenia

Pierwsze presety:

1. Pośrednik nieruchomości.
2. Remonty / budowlanka.
3. Usługi z reklam.
4. Doradca kredytowy / ubezpieczeniowy.
5. HVAC / instalator / fotowoltaika.
6. Agencja / freelancer marketingowy.

Nie wdrażać wszystkich naraz.

Najpierw 1–2 segmenty do testu.

---

## 9. Owner view / raport tygodnia — do rozwoju

To jest dobry kierunek i ma zostać zapisany jako część rozwoju produktu.

Cel:

> Właściciel ma widzieć, gdzie uciekają leady i co wymaga reakcji, bez ręcznego sprawdzania każdego klienta.

Owner view powinien pokazywać:

- nowe leady,
- leady bez follow-upu,
- kontakty po terminie,
- sprawy bez ruchu,
- oferty bez odpowiedzi,
- zadania zaległe,
- co trzeba ruszyć w tym tygodniu,
- gdzie może uciec pieniądz.

To powinien być element Pro / Owner / AI, nie tylko dekoracja dashboardu.

---

## 10. Trust / bezpieczeństwo / dane klientów — obowiązkowo zapisać

Jeśli CloseFlow ma mieć kilka tysięcy klientów, musi budować zaufanie.

Wymagane kierunki:

- regulamin,
- polityka prywatności,
- jasne zasady przetwarzania danych klientów,
- eksport danych,
- usunięcie konta / workspace’u,
- informacja, co dzieje się z danymi przy AI,
- rozdzielenie AI lokalnego/regułowego od zewnętrznych providerów,
- logi działań / audit log w przyszłości,
- role i uprawnienia w przyszłości,
- jasne komunikaty, gdy funkcja wymaga konfiguracji lub integracji.

Zasada:

> Nie udajemy, że funkcje AI/integracje są aktywne, jeśli wymagają konfiguracji. Lepiej jawnie pokazać status niż obiecać coś, co nie działa.

---

## 11. Support / help / onboarding — obowiązkowo zapisać

Przy większej skali support nie może polegać na ręcznym tłumaczeniu każdemu użytkownikowi.

Potrzebne:

- krótki help center,
- checklisty w aplikacji,
- 5 krótkich filmów 60–90 sekund,
- gotowe odpowiedzi na najczęstsze pytania,
- diagnostyka problemów: płatność / login / Google Calendar / AI / import,
- status konfiguracji integracji,
- onboarding mailowy,
- pakiet szybkiego startu,
- przykłady branżowe.

Najważniejsze materiały:

1. Jak dodać pierwszego leada.
2. Jak ustawić follow-up.
3. Jak używać widoku Dziś.
4. Jak podpiąć / używać kalendarza Google, gdy etap będzie gotowy.
5. Jak importować dane bez chaosu.

---

## 12. Co musi być w MVP przed większą skalą

Minimum przed większym marketingiem:

- szybkie dodanie leada,
- follow-up w jednym kliknięciu,
- widok Dziś jako centrum pracy,
- pakiet szybkiego startu,
- import/wklejka danych z mapowaniem,
- parser danych pionowych, poziomych i wpisanych jednym ciągiem,
- staging importu i podgląd przed zapisem,
- Google Calendar / auto-przeniesienie jako rozwijany kierunek,
- wykrywanie braku ruchu,
- owner view / raport tygodnia jako kierunek Pro/Owner,
- trust/privacy/export/delete,
- support/help/onboarding,
- metryki aktywacji.

---

## 13. Czego nie robić

Nie robić:

- magicznego importu bez podglądu,
- automatycznego tworzenia danych DEMO bez zgody,
- automatycznego zapisu luźnej wklejki bez ekranu podglądu,
- traktowania każdej linii jako osobnego leada bez potwierdzenia,
- osobnej aplikacji dla każdej branży,
- 20 presetów na start,
- ukrywania problemów integracji,
- skalowania reklam przed mierzeniem aktywacji,
- ręcznego supportu jako głównego modelu obsługi,
- AI, które zapisuje dane bez zatwierdzenia użytkownika.

---

## 14. Następny krok

Rozpisać przyszłe etapy:

1. `CF-INTAKE-001 — wklejka leadów + parser pion/poziom/ciąg + mapowanie pól + staging importu`.
2. `CF-GCAL-001 — Google Calendar auto-przeniesienie i powiązanie z klientem/sprawą`.
3. `CF-PRESETS-001 — presety branżowe jako nakładka na wspólny core`.
4. `CF-OWNER-001 — owner view i raport tygodnia`.
5. `CF-TRUST-001 — trust, privacy, export, delete, AI data rules`.
6. `CF-SUPPORT-001 — help center, checklisty, krótkie filmy i diagnostyka`.

Nie wdrażać wszystkiego naraz. Zacząć od intake/import i pierwszego efektu użytkownika.
