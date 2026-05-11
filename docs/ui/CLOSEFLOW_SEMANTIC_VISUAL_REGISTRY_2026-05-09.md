# CloseFlow Semantic Visual Registry

**Data:** 2026-05-09  
**Etap:** VS-2D â€” Semantic visual registry  
**Status:** centralny rejestr znaczeĹ„ kolorĂłw i tonĂłw, bez migracji ekranĂłw

## Cel

VS-2D ustala, co znaczÄ… kolory i tony w CloseFlow.

NajwaĹĽniejsza zasada: **kolor nie jest dekoracjÄ…**. Kolor ma znaczenie operacyjne.

Developer ma wiedzieÄ‡, kiedy czerwony oznacza:

- usuwanie danych,
- wylogowanie,
- bĹ‚Ä…d systemowy,
- zalegĹ‚y termin,
- zalegĹ‚Ä… pĹ‚atnoĹ›Ä‡.

To nie sÄ… te same przypadki i nie wolno ich mieszaÄ‡ lokalnymi klasami bez znaczenia.

## Plik ĹşrĂłdĹ‚owy

```text
src/components/ui-system/semantic-visual-registry.ts
```

## Minimalne uĹĽycie

```ts
import { getCloseflowSemanticVisualClasses } from '../components/ui-system';

const classes = getCloseflowSemanticVisualClasses('status-overdue');
```

## Semantyki minimum

| Semantyka | Znaczenie | Czego nie oznacza |
|---|---|---|
| `danger-delete` | akcja usuwa albo przenosi dane do kosza | bĹ‚Ä…d, overdue, logout |
| `session-logout` | zakoĹ„czenie sesji uĹĽytkownika | delete, bĹ‚Ä…d API, zalegĹ‚oĹ›Ä‡ |
| `alert-error` | bĹ‚Ä…d systemu, API albo walidacji | delete, overdue, priorytet |
| `alert-warning` | ostrzeĹĽenie, niepeĹ‚na konfiguracja, ryzyko | bĹ‚Ä…d krytyczny, sukces, pĹ‚atnoĹ›Ä‡ po terminie |
| `status-open` | rekord aktywny i otwarty | encja, pĹ‚atnoĹ›Ä‡, zakoĹ„czenie |
| `status-done` | zadanie/akcja/status ukoĹ„czony | pĹ‚atnoĹ›Ä‡ zapĹ‚acona, prowizja pobrana |
| `status-overdue` | termin pracy minÄ…Ĺ‚ | delete, bĹ‚Ä…d systemowy, pĹ‚atnoĹ›Ä‡ po terminie |
| `entity-client` | identyfikacja encji klienta | status, bĹ‚Ä…d, pĹ‚atnoĹ›Ä‡ |
| `entity-lead` | identyfikacja encji leada | alert, payment, delete |
| `entity-case` | identyfikacja encji sprawy | alert, payment, delete |
| `payment-paid` | pĹ‚atnoĹ›Ä‡ klienta zapĹ‚acona | zwykĹ‚e done, prowizja |
| `payment-due` | pĹ‚atnoĹ›Ä‡ klienta naleĹĽna, ale nie po terminie | warning ogĂłlny, prowizja, overdue |
| `payment-overdue` | pĹ‚atnoĹ›Ä‡ klienta po terminie | zwykĹ‚y task overdue, delete, error |
| `commission-due` | prowizja/fee do pobrania | pĹ‚atnoĹ›Ä‡ klienta, warning ogĂłlny |
| `commission-paid` | prowizja/fee pobrana | zwykĹ‚e done, payment-paid |

## Czerwony nie jest jeden

Czerwony w CloseFlow ma rĂłĹĽne znaczenia:

```text
danger-delete     = usuwasz dane
alert-error       = system nie moĹĽe wykonaÄ‡ akcji
status-overdue    = termin pracy minÄ…Ĺ‚
payment-overdue   = pieniÄ…dze sÄ… po terminie
session-logout    = koĹ„czysz sesjÄ™, ale nie usuwasz danych
```

JeĹ›li ekran uĹĽywa `text-red-*` albo `bg-red-*`, developer musi umieÄ‡ wskazaÄ‡ jednÄ… z powyĹĽszych semantyk.

## PrzykĹ‚ady poprawnego wyboru

### Kosz / usuĹ„ rekord

```ts
getCloseflowSemanticVisualClasses('danger-delete')
```

### BĹ‚Ä…d API

```ts
getCloseflowSemanticVisualClasses('alert-error')
```

### Zadanie po terminie

```ts
getCloseflowSemanticVisualClasses('status-overdue')
```

### PĹ‚atnoĹ›Ä‡ po terminie

```ts
getCloseflowSemanticVisualClasses('payment-overdue')
```

### Wylogowanie

```ts
getCloseflowSemanticVisualClasses('session-logout')
```

## Czego nie robi VS-2D

- Nie przepina hurtowo aktywnych ekranĂłw.
- Nie usuwa lokalnych klas Tailwind z legacy pages.
- Nie zmienia wyglÄ…du Today, LeadDetail, ClientDetail ani CaseDetail.
- Nie miesza tego etapu z migracjÄ… action icons albo entity icons.
- Nie usuwa dotychczasowych hotfixĂłw wizualnych.

## Zasada dla kolejnych etapĂłw

KaĹĽda nowa migracja koloru powinna wybraÄ‡ semantykÄ™ z rejestru. JeĹ›li nie ma pasujÄ…cej semantyki, nie dopisuj lokalnego koloru na skrĂłty. Najpierw rozszerz registry i dokument.

## Weryfikacja

```bash
npm run check:closeflow-semantic-visual-registry
npm run build
```

## Kryterium zakoĹ„czenia

VS-2D jest zakoĹ„czony, gdy:

1. `SEMANTIC_VISUAL_MAP` istnieje,
2. zawiera wszystkie semantyki minimum,
3. dokument jasno rozrĂłĹĽnia delete, error, overdue, payment-overdue i logout,
4. `src/components/ui-system/index.ts` eksportuje `semantic-visual-registry`,
5. check przechodzi,
6. build przechodzi.