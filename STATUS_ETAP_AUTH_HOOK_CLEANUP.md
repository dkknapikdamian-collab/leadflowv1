# Etap: wyjście z react-firebase-hooks i sprzątanie paczek

## Co robi ta paczka
- `src/hooks/useFirebaseSession.ts`
  - dodaje lekki własny hook oparty o `onAuthStateChanged`
- `src/App.tsx`
  - przestaje używać `react-firebase-hooks/auth`
  - korzysta już z lokalnego hooka sesji
- `package.json`
  - usuwa nieużywane zależności:
    - `react-firebase-hooks`
    - `firebase-admin`

## Efekt
- kolejny kawałek auth jest prostszy i bardziej pod naszą kontrolą
- mniej zbędnych zależności w projekcie
- następne odpinanie Firebase auth będzie prostsze

## Co dalej
- dalej największy etap: `LeadDetail.tsx`
- potem można zejść z samego `firebase/auth`
