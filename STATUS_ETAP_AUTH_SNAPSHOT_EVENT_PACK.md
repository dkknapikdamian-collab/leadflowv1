# Etap: większe spięcie auth snapshot wokół całej aplikacji

## Co robi ta paczka
- dodaje `src/hooks/useClientAuthSnapshot.ts`
- rozbudowuje `src/lib/client-auth.ts` o eventy zmian snapshotu
- `src/App.tsx`
  - używa własnego hooka sesji zamiast `react-firebase-hooks`
- `src/hooks/useWorkspace.ts`
  - nie używa już `firebase/auth`
  - działa na wspólnym snapshotcie klienta
- `src/components/appearance-provider.tsx`
  - też korzysta już ze wspólnego snapshotu

## Efekt
- mniej bezpośrednich zależności od Firebase auth w wielu miejscach
- auth context jest bardziej spójny
- następny etap pełnego zejścia z Firebase auth będzie prostszy

## Co dalej
- największy klocek nadal: `LeadDetail.tsx`
- potem pełne odpinanie logowania od Firebase
