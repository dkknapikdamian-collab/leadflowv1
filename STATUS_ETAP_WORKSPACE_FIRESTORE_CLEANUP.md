# Etap: czyszczenie workspace.ts z Firestore

## Co robi ta paczka
- `src/lib/workspace.ts`
  - usuwa zależność od `firebase/auth`
  - usuwa zależność od `firebase/firestore`
  - helper workspace opiera już tylko o snapshot klienta i zapisane `workspaceId`

## Co to daje
- kolejny plik przestaje być zależny od starego modelu Firestore
- porządkuje warstwę pomocniczą przed pełnym wycięciem Firebase auth
- zmniejsza liczbę miejsc, które jeszcze trzeba później pruć

## Co dalej
- największy etap nadal: `LeadDetail.tsx` bez `MutationObserver`
- potem pełne przepięcie auth/session poza Firebase
