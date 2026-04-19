ROOT CAUSE

Settings page crashed because Settings.tsx uses useAppearance(), but the app root did not wrap App with AppearanceProvider.

That means entering /settings throws:
useAppearance must be used within AppearanceProvider

The global ErrorBoundary then shows the generic "Coś poszło nie tak" screen.

FIX
- wrap <App /> with <AppearanceProvider> in src/main.tsx
