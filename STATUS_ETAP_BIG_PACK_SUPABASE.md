# Duża paczka Supabase-first

## Co zawiera
- snapshot auth po stronie klienta
- App bez fallbacku profilu przez Firestore
- supabase-fallback bez czytania auth.currentUser bezpośrednio
- useWorkspace w kierunku Supabase-first
- appearance-provider spięty z tym samym snapshotem
- Login bez fallbacku tworzenia danych przez Firestore
- workspace.ts bez zależności od firebase/firestore

## Co dalej
- największy następny etap: LeadDetail.tsx bez MutationObserver i bez ukrywania UI przez DOM
- potem pełne przepięcie auth poza Firebase
