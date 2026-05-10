# CLOSEFLOW_FB1_COPY_NOISE_CLEANUP_2026_05_09

## Cel

Usunąć przegadane teksty i zbędne panele oznaczone jako „kasujemy”, bez zmiany logiki aplikacji.

## Zakres

| Route | Screen | Zmiana | Status |
|---|---|---|---|
| `/settings` | Settings | Usunięcie opisu „Konto, workspace, powiadomienia i preferencje aplikacji.” oraz zbędnego prawego panelu dostępu, jeśli występował w pliku. | FB-1 |
| `/help` / `/support` | SupportCenter / Help | Skrócenie nagłówka i usunięcie opisów: „Wszystkie Twoje zgłoszenia widoczne w tym workspace.”, „Tematy, które wymagają dalszej obsługi.”, „Krótkie odpowiedzi bez ściany tekstu.”, „Co sprawdzić najpierw”, „Najczęstsze pytania”. | FB-1 |
| `/billing` | Billing | Usunięcie opisu nagłówka i zdania „Masz aktywny dostęp do pracy w aplikacji.”. Podsumowanie rozliczeń uproszczone do planu oraz następnej płatności / statusu płatności. | FB-1 |
| `/calendar` | Calendar | Usunięcie tekstu „Oś czasu pokazuje ostatnie działania w czytelnej kolejności.”. | FB-1 |

## Nie zmieniać access gate

Nie zmieniać access gate, useWorkspace, access, workspace, ani logiki ograniczeń dostępu.

## Nie zmieniać billing truth

Nie zmieniać billing truth, statusów subskrypcji, Stripe checkout, webhooków, planów ani logiki blokad.

## Nie zmieniać Google Calendar sync

Nie zmieniać Google Calendar sync, danych kalendarza, tworzenia wydarzeń ani synchronizacji.

## Dowód

Dodany guard:

```bash
npm run check:closeflow-fb1-copy-noise-cleanup
```

Wdrożenie musi przejść również:

```bash
npm run check:billing-truth
npm run check:google-calendar-env-truth
npm run check:polish-mojibake
npm run build
```

Jeśli któryś z dodatkowych skryptów nie istnieje lokalnie, paczka go pominie i wypisze ostrzeżenie, ale FB-1 oraz build są obowiązkowe.
