# Jak uruchomić preview TSX/CSS u siebie

CSS sam nie otwiera się jak HTML. TSX też nie otwiera się bez aplikacji. Najprościej dodać tymczasową trasę preview do aplikacji.

## 1. Skopiuj pliki do repo

```powershell
$Repo = "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
$Pack = "$HOME\Downloads\closeflow_transfer_pack"

Copy-Item "$Pack\src\styles\closeflow-vnext-ui-contract.css" "$Repo\src\styles\closeflow-vnext-ui-contract.css" -Force
Copy-Item "$Pack\src\pages\UiPreviewVNext.tsx" "$Repo\src\pages\UiPreviewVNext.tsx" -Force
```

## 2. Dodaj import CSS

Na końcu `src/index.css` dodaj:

```css
@import "./styles/closeflow-vnext-ui-contract.css";
```

## 3. Dodaj trasę preview w `src/App.tsx`

Przy innych lazy importach:

```tsx
const UiPreviewVNext = lazy(() => import('./pages/UiPreviewVNext'));
```

W `<Routes>` dodaj tymczasowo:

```tsx
<Route path="/ui-preview-vnext" element={<UiPreviewVNext />} />
```

## 4. Uruchom

```powershell
Set-Location $Repo
npm.cmd run dev
```

Otwórz:

```text
http://localhost:3000/ui-preview-vnext
```
