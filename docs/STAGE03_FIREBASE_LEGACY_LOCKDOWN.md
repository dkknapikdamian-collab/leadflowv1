# ETAP 03 — Awaryjne zamknięcie Firestore i Firebase Storage

## Status

Ten etap zamyka ryzyko publicznych ścieżek Firebase na czas migracji do Supabase.

Firebase / Firestore / Firebase Storage pozostają traktowane jako legacy. Nie są docelowym backendem aplikacji.

## Wymaga ingerencji właściciela projektu

Tak.

AI deweloper może przygotować reguły i guardy w repo, ale osoba z dostępem do Firebase musi wdrożyć reguły w Firebase Console albo Firebase CLI.

## Co zmienia etap

### Firestore

Plik:

```text
firestore.rules
```

Zmiany:

- usunięto publiczne `allow get: if true`,
- usunięto model `isValidClientToken(caseId)`,
- usunięto autoryzację przez samo istnienie dokumentu `client_portal_tokens/{caseId}`,
- `client_portal_tokens` są owner-only,
- `cases`, `cases/{caseId}/items`, `activities` nie są publiczne dla portalu,
- catch-all blokuje nieopisane kolekcje.

### Firebase Storage

Plik:

```text
storage.rules
```

Zmiany:

- dodano brakujący plik reguł Storage,
- publiczne odczyty i uploady są zablokowane,
- ścieżki `cases/{caseId}/...` są jawnie zamknięte,
- ścieżki portalowe są jawnie zamknięte,
- dopuszczona jest tylko prywatna legacy ścieżka `users/{userId}/...` dla zalogowanego właściciela,
- catch-all blokuje resztę.

### Firebase deploy config

Plik:

```text
firebase.json
```

Dodano wskazanie:

```json
{
  "firestore": {
    "rules": "firestore.rules"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

## Czego etap nie robi

- nie rozwija Firestore,
- nie przenosi nowych funkcji do Firestore,
- nie zmienia UI,
- nie przebudowuje portalu klienta,
- nie usuwa Firebase dependency,
- nie zastępuje Supabase.

## Test automatyczny

```powershell
npm.cmd run verify:security:firebase-stage03
npm.cmd run lint
npm.cmd run build
```

## Wdrożenie reguł przez Firebase CLI

Najpierw sprawdź projekt:

```powershell
firebase projects:list
firebase use
```

Jeżeli projekt jest ustawiony poprawnie:

```powershell
firebase deploy --only firestore:rules,storage
```

Jeśli Storage nie jest jeszcze skonfigurowany w projekcie Firebase i deploy Storage rules zwróci błąd, wdroż najpierw Firestore:

```powershell
firebase deploy --only firestore:rules
```

A Storage ustaw ręcznie w Firebase Console po włączeniu Firebase Storage.

## Wdrożenie reguł ręcznie w Firebase Console

### Firestore

1. Firebase Console.
2. Firestore Database.
3. Rules.
4. Wklej zawartość `firestore.rules`.
5. Publish.

### Storage

1. Firebase Console.
2. Storage.
3. Rules.
4. Wklej zawartość `storage.rules`.
5. Publish.

## Test ręczny po wdrożeniu

W Firebase Rules Playground sprawdź:

### Firestore anonim

Te operacje mają być `Denied`:

```text
GET /client_portal_tokens/{caseId}
GET /cases/{caseId}
GET /cases/{caseId}/items/{itemId}
GET /activities/{activityId}
```

### Firestore zalogowany nie-właściciel

Te operacje mają być `Denied`:

```text
GET /cases/{caseId}
GET /cases/{caseId}/items/{itemId}
GET /client_portal_tokens/{caseId}
```

### Firestore właściciel

Dla dokumentów z `ownerId == request.auth.uid`:

```text
GET /leads/{leadId}
GET /tasks/{taskId}
GET /events/{eventId}
GET /cases/{caseId}
```

ma być `Allowed`.

### Storage anonim

Te operacje mają być `Denied`:

```text
READ /cases/{caseId}/{itemId}/plik.pdf
WRITE /cases/{caseId}/{itemId}/plik.pdf
READ /portal/{anything}
WRITE /client_portal/{anything}
```

### Storage właściciel prywatnej ścieżki

Dla `request.auth.uid == userId`:

```text
READ /users/{userId}/legacy/test.pdf
WRITE /users/{userId}/legacy/test.pdf
```

ma być `Allowed`, jeśli plik ma mniej niż 10 MB.

## Rollback / bezpieczne cofnięcie

Kodowo:

```powershell
git revert <SHA_ETAPU_03>
git push origin dev-rollout-freeze
```

Reguły trzeba wtedy ponownie wdrożyć:

```powershell
firebase deploy --only firestore:rules,storage
```

Nie zaleca się przywracania publicznego portalu Firestore. Docelowy portal powinien działać przez Supabase z walidacją tokenu po backendzie.

## Kryterium zakończenia

- anonim nie czyta `client_portal_tokens`,
- anonim nie czyta `cases`,
- anonim nie czyta `cases/{caseId}/items`,
- portal klienta nie działa już przez stary publiczny model Firestore,
- Firebase Storage nie pozwala na publiczne uploady,
- Firebase jest zabezpieczony jako legacy do migracji.
