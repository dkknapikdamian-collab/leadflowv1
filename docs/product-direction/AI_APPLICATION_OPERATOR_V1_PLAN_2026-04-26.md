# CloseFlow AI Application Operator V1 — plan budowy

Data: 2026-04-26
Zakres: Asystent AI w CloseFlow ma przestać działać jak szablon komend, a zacząć działać jak operator danych aplikacji.

## Cel

Asystent ma działać w dwóch prostych trybach:

1. **Czytanie aplikacji** — gdy użytkownik pyta normalnie, bez komendy zapisu.
2. **Szkic do sprawdzenia** — gdy użytkownik mówi `zapisz`, `dodaj`, `utwórz`, `mam leada` albo podobną komendę tworzenia.

Nie tworzymy finalnych rekordów bez potwierdzenia użytkownika. AI przygotowuje szkic, użytkownik zatwierdza.

## Dlaczego obecnie to nie działało

Globalny przycisk `Asystent AI` był renderowany w górnym pasku i dostawał puste tablice:

```tsx
<TodayAiAssistant leads={[]} tasks={[]} events={[]} cases={[]} />
```

Efekt: użytkownik pytał `co jutro`, ale asystent nie widział zadań ani wydarzeń z aplikacji.

Drugi problem: Web Speech API na telefonie potrafi oddawać narastające fragmenty mowy:

```text
Zapisz
Zapisz mi
Zapisz mi zadanie
Zapisz mi zadanie jutro
```

Aplikacja dopisywała każdy fragment jako nową treść, więc szkic wyglądał jak powtórzone spaghetti.

## Etap 1 — wdrażany w paczce v69

### Cel

Naprawić realny dostęp globalnego asystenta do danych aplikacji oraz naprawić dublowanie dyktowania.

### Pliki do sprawdzenia

- `src/components/GlobalQuickActions.tsx`
- `src/components/GlobalAiAssistant.tsx`
- `src/components/TodayAiAssistant.tsx`
- `src/server/ai-assistant.ts`
- `src/lib/ai-drafts.ts`
- `src/pages/AiDrafts.tsx` albo aktualny ekran szkiców AI

### Zmień

1. W górnym pasku zastąpić puste dane komponentem `GlobalAiAssistant`.
2. `GlobalAiAssistant` ma pobierać:
   - leady,
   - zadania,
   - wydarzenia,
   - sprawy,
   - klientów.
3. `TodayAiAssistant` ma scalać fragmenty mowy zamiast je dopisywać bez kontroli.
4. Po zakończeniu finalnego dyktowania ma sam wysłać pytanie po krótkiej pauzie.
5. Komendy zapisu mają iść do Szkiców AI, nie do finalnych rekordów.

### Nie zmieniaj

- Nie twórz finalnych leadów/zadań/wydarzeń automatycznie.
- Nie usuwaj istniejących ekranów.
- Nie zmieniaj modelu trial/billing.
- Nie zmieniaj zasad dostępu.
- Nie podpinaj jeszcze drogiego LLM jako obowiązkowego elementu.

### Po wdrożeniu sprawdź

1. Na ekranie `Szkice AI` kliknij `Asystent AI` i powiedz:

```text
Co mam jutro?
```

Oczekiwane: asystent widzi realne zadania/wydarzenia z aplikacji.

2. Powiedz:

```text
Zapisz mi zadanie na 28.05 12:00 rozgraniczenie
```

Oczekiwane: w Szkicach AI pojawia się jedna normalna treść, bez powtórek typu `Zapisz Zapisz mi Zapisz mi zadanie`.

3. Powiedz:

```text
Dorota Kołodziej
```

Oczekiwane: asystent szuka w aplikacji, nie zapisuje szkicu.

### Kryterium zakończenia

- `npm.cmd run lint` przechodzi.
- `npm.cmd run verify:closeflow:quiet` przechodzi.
- Globalny asystent poza ekranem `Dziś` widzi dane aplikacji.
- Dyktowany szkic nie dubluje narastających fragmentów mowy.

## Etap 2 — następny większy etap

### Cel

Zbudować prawdziwy tryb `AI Application Operator`, czyli backendowy operator aplikacji.

### Zmień

1. Backend tworzy snapshot danych aplikacji przed odpowiedzią.
2. Snapshot zawiera tylko dane z workspace użytkownika:
   - leady,
   - klienci,
   - sprawy,
   - zadania,
   - wydarzenia,
   - szkice AI,
   - statusy,
   - terminy,
   - wartości,
   - powiązania lead/klient/sprawa.
3. AI dostaje instrukcję systemową:
   - odpowiada tylko na podstawie danych z aplikacji,
   - nie wymyśla danych,
   - jeśli czegoś nie ma w danych, mówi wprost,
   - bez komendy zapisu nie zapisuje niczego,
   - komenda zapisu tworzy szkic do sprawdzenia.
4. AI zwraca wynik w JSON:

```json
{
  "mode": "read" | "draft",
  "answer": "tekst dla użytkownika",
  "items": [],
  "draft": null
}
```

### Przykład zapisu zadania

Wejście:

```text
zapisz mi zadanie na 28.05 12:00 rozgraniczenie
```

Oczekiwany szkic:

```json
{
  "draftType": "task",
  "title": "Rozgraniczenie",
  "scheduledAt": "2026-05-28T12:00:00",
  "rawText": "zapisz mi zadanie na 28.05 12:00 rozgraniczenie",
  "status": "pending_review"
}
```

## Etap 3 — zatwierdzanie szkiców do finalnych rekordów

### Cel

Szkice AI mają umieć stać się finalnie:

- leadem,
- zadaniem,
- wydarzeniem,
- notatką do klienta/leada/sprawy.

### Zmień

1. Ekran Szkice AI pokazuje typ szkicu.
2. Użytkownik może poprawić pola.
3. Przycisk `Przejrzyj i zatwierdź` tworzy właściwy rekord.
4. Po zatwierdzeniu szkic przechodzi do `Zatwierdzone`.

## Etap 4 — jakość odpowiedzi i pamięć konwersacji w ramach sesji

### Cel

Asystent ma rozumieć krótką rozmowę w ramach jednego otwartego okna.

Przykład:

```text
Co mam jutro?
A które z tego jest najważniejsze?
Przypomnij mi to rano.
```

### Zmień

1. Przechowuj ostatnie pytanie i odpowiedź w stanie okna asystenta.
2. Nie zapisuj tej pamięci na stałe w bazie na V1.
3. Używaj jej tylko do doprecyzowania następnego pytania.

## Etap 5 — bezpieczne użycie prawdziwego LLM

### Cel

Dopiero po stabilizacji reguł podpiąć model AI jako warstwę rozumienia języka.

### Zasada

Model nie ma dostępu do internetu ani danych poza aplikacją. Dostaje tylko snapshot CloseFlow i instrukcję operatora.
