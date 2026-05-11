# CLOSEFLOW_STAGE14A_CLIENT_DETAIL_NOTES_HISTORY_2026-05-11

## Cel

Naprawić widok `src/pages/ClientDetail.tsx`, żeby karta klienta nie wyglądała jak surowy log techniczny.

Zakres etapu:

1. `Sprawy` mają być pierwszą zakładką klienta i domyślnym fallbackiem.
2. W bocznych szybkich akcjach klienta nie może być akcji `Dodaj notatkę`.
3. Osobna karta `Krótka notatka` zostaje i ma pokazywać zapisane notatki pod formularzem.
4. Historia klienta ma pokazywać realny tytuł, treść, datę i źródło, a nie `client_note`, `Aktywność klienta`, `Brak daty`.
5. Panel `Roadmapa` ma zostać nazwany `Ostatnie ruchy` i pokazywać skróty realnej treści aktywności.

## Decyzja techniczna

To jest etap lokalny dla `ClientDetail`, bez zmiany modelu klienta, API ani statusów.

W `ClientDetail.tsx` należy utworzyć jeden mały zestaw formatterów aktywności klienta:

- `getClientActivityBodyStage14A(activity)`
- `formatClientActivityTitleStage14A(activity)`
- `formatClientActivityDateStage14A(activity)`
- `formatClientActivitySourceStage14A(activity)`
- `isClientNoteActivityStage14A(activity, clientId)`

Te helpery mają być używane przez:

- listę notatek pod kartą `Krótka notatka`,
- zakładkę `Historia`,
- panel `Ostatnie ruchy`.

Nie wolno osobno formatować notatek i osobno historii, bo wtedy szybko wróci chaos.

## Pliki w etapie

- `src/pages/ClientDetail.tsx`
- `src/styles/ClientDetail.css`, jeśli istnieje
- `src/styles/visual-stage12-client-detail-vnext.css`, jeśli to aktualny styl widoku
- `src/styles/client*.css`, tylko jeżeli to realnie aktywne style klienta
- `package.json`, tylko dopisanie skryptu check
- `scripts/check-closeflow-stage14a-clientdetail-notes-history.cjs`
- `tools/repair-closeflow-stage14a-clientdetail-notes-history.cjs`

## Wymagane zmiany w `ClientDetail.tsx`

### 1. Zakładki

Jeżeli istnieje tab array, kolejność musi być:

```ts
const CLIENT_TABS = [
  { id: 'cases', label: 'Sprawy' },
  { id: 'summary', label: 'Podsumowanie' },
  { id: 'contact', label: 'Kontakt' },
  { id: 'history', label: 'Historia' },
];
```

Jeżeli w kodzie są tylko przyciski zakładek w JSX, `Sprawy` ma być pierwszym renderowanym przyciskiem.

Domyślny stan:

```ts
const [activeTab, setActiveTab] = useState<ClientTab>('cases');
```

Jeżeli tab jest czytany z URL, fallback też ma być `cases`, nie `summary`.

### 2. Boczne szybkie akcje

W sekcji z atrybutem `data-client-side-quick-actions="true"` usunąć tylko akcję:

```text
Dodaj notatkę
```

Nie usuwać:

- osobnej karty `Krótka notatka`,
- dodawania zadania,
- dodawania wydarzenia,
- finansów w sprawie.

Jeżeli po usunięciu akcja notatki była jedyną akcją, usunąć pustą sekcję.

### 3. Notatki pod formularzem

Dodać realną listę pod formularzem notatki:

```tsx
<div className="client-detail-note-list" data-client-notes-list="true">
  {clientNotes.length > 0 ? (
    clientNotes.slice(0, 5).map((note, index) => {
      const body = getClientActivityBodyStage14A(note);
      return (
        <article className="client-detail-note-row" key={note.id || index}>
          <strong>{formatClientActivityTitleStage14A(note)}</strong>
          <p title={body}>{body}</p>
        </article>
      );
    })
  ) : (
    <p>Brak zapisanych notatek dla klienta.</p>
  )}
</div>
```

Selektor notatek ma brać pod uwagę realne warianty pól istniejących w projekcie:

- `clientId`
- `client_id`
- `entityId`
- `entity_id`
- `recordId`
- `record_id`
- `payload.clientId`
- `payload.client_id`
- `payload.recordType === 'client'`

Typy notatek:

- `client_note`
- `client_note_added`
- `client_note_dictated`
- `dictated_note`
- `note_added`
- każdy typ zawierający `note`, jeśli aktywność jest przypięta do klienta.

### 4. Historia

W historii nie pokazywać jako głównej treści:

- `client_note`
- `Aktywność klienta`
- `Brak daty`

Do każdej pozycji używać:

- tytuł: `formatClientActivityTitleStage14A(activity)`
- treść: `getClientActivityBodyStage14A(activity)`
- data: `formatClientActivityDateStage14A(activity)`, tylko gdy istnieje
- źródło: `formatClientActivitySourceStage14A(activity)`, tylko gdy da się ustalić

Usunąć tekst:

```text
Lekka oś ostatnich ruchów powiązanych z klientem, leadami i sprawami.
```

### 5. Ostatnie ruchy

Nagłówek `Roadmapa` zmienić na:

```text
Ostatnie ruchy
```

Wiersze mają pokazywać skrót treści aktywności w jednym wierszu z `title`.

Fallback, gdy brak danych:

```text
Brak ostatnich ruchów.
```

Nie pokazywać `client_note`.

## CSS

Dodać albo potwierdzić:

```css
.client-detail-note-row p,
.client-detail-activity-row p,
.client-detail-recent-move-row p {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.client-detail-note-row,
.client-detail-activity-row,
.client-detail-recent-move-row {
  min-width: 0;
}
```

## Nie zmieniać

- Nie usuwać osobnej karty `Krótka notatka`.
- Nie zmieniać modelu klienta.
- Nie przenosić pracy operacyjnej ze sprawy do klienta.
- Nie dodawać nowych statusów klienta.
- Nie tworzyć fake aktywności.
- Nie dotykać billingu, AI, auth, RLS ani API poza odczytem istniejących pól.

## Test ręczny po wdrożeniu

1. Wejdź w `/clients/:id`.
2. Sprawdź, czy pierwsza zakładka to `Sprawy`.
3. Sprawdź, czy w bocznych szybkich akcjach nie ma `Dodaj notatkę`.
4. Dodaj notatkę z karty `Krótka notatka`.
5. Sprawdź, czy notatka pojawia się pod formularzem.
6. Wejdź w `Historia`.
7. Sprawdź, czy nie ma tekstu `Lekka oś ostatnich ruchów powiązanych z klientem, leadami i sprawami.`
8. Sprawdź, czy aktywność pokazuje realną treść w jednym wierszu.
9. Najedź na uciętą treść i sprawdź, czy pełna treść jest w `title`.
10. Sprawdź, czy panel po prawej nazywa się `Ostatnie ruchy` i nie pokazuje `client_note` jako treści.

## Kryterium zakończenia

Etap jest skończony dopiero wtedy, gdy klient ma czytelne zakładki, widoczne notatki i prawdziwą historię bez technicznego bełkotu.
