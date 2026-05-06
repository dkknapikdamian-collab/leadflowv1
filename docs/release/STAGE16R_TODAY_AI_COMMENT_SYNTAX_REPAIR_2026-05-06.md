# Stage16R - Today AI comment syntax repair

Cel: naprawić build blocker po Stage16M/16O, gdzie statyczne markery AI w `TodayAiAssistant.tsx` mogły zostać wstrzyknięte jako linie `* ...` bez otwartego komentarza.

Zakres:
- `src/components/TodayAiAssistant.tsx`
- tylko składnia komentarzy/markerów,
- bez zmiany logiki AI,
- bez commita,
- bez pusha.

Sprawdzenie:
- `npm.cmd run build`
- `npm.cmd run check:stage16p:focused` jeśli istnieje
- fallback: `npm.cmd run check:final-qa-red-gates:collect`
