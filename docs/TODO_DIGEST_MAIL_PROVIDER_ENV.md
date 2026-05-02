# TODO: mail provider / digest env przed realna wysylka

Status na teraz:

- Kod digestu, raportu tygodniowego, PWA i notification runtime jest wdrozony.
- Nie trzeba jeszcze kupowac domeny ani Resend, zeby isc dalej z aplikacja.
- Bez realnego mail providera digest moze przejsc logike aplikacji, ale fizyczny e-mail nie zostanie wyslany.
- Sekretow nigdy nie wpisujemy do repo. Ustawiamy je tylko w Vercel Environment Variables.

## Do ustawienia pozniej w Vercel

Przed pierwszym realnym testem wysylki digestu ustawic:

```env
RESEND_API_KEY=
DIGEST_FROM_EMAIL=
CRON_SECRET=
APP_URL=https://closeflowapp.vercel.app
DIGEST_ENFORCE_WORKSPACE_HOUR=true
```

## Skad to wziac

### RESEND_API_KEY

- Z konta mail providera, obecnie zakladany Resend.
- Dopiero gdy bedziemy gotowi na realna wysylke e-maili.
- Nie dawac do `.env.example` z realna wartoscia.
- Nie dawac do zadnego pliku w repo.

### DIGEST_FROM_EMAIL

- Adres nadawcy digestu, np. `CloseFlow <powiadomienia@twojadomena.pl>`.
- Wymaga domeny lub poprawnie zweryfikowanego nadawcy u providera maili.
- Na etapie bez domeny mozna zostawic nieustawione.

### CRON_SECRET

- Losowy sekret do recznego odpalania endpointow cron/test.
- Generowac lokalnie w PowerShell:

```powershell
-join ((48..57)+(65..90)+(97..122) | Get-Random -Count 48 | ForEach-Object {[char]$_})
```

### APP_URL

- Produkcyjny adres aplikacji.
- Aktualnie:

```env
APP_URL=https://closeflowapp.vercel.app
```

### DIGEST_ENFORCE_WORKSPACE_HOUR

- Powinno byc `true`, zeby digest respektowal godzine i timezone workspace.

```env
DIGEST_ENFORCE_WORKSPACE_HOUR=true
```

## Minimalny test po ustawieniu mail providera

1. Vercel -> projekt -> Settings -> Environment Variables.
2. Dodac zmienne z sekcji powyzej dla Production.
3. Zrobic Redeploy.
4. W aplikacji wejsc w Ustawienia -> Powiadomienia -> Digest e-mail.
5. Kliknac `Sprawdz konfiguracje`.
6. Kliknac `Wyslij test teraz`.
7. Sprawdzic, czy mail doszedl.
8. Sprawdzic, czy ponowny cron nie wysyla duplikatu dla tego samego dnia.

## Kryterium zakonczenia tego TODO

- Diagnostyka digestu pokazuje gotowosc wysylki.
- Testowy digest dochodzi na wybrany adres.
- Free / nieaktywny dostep nie dostaje digestu.
- Cron dzienny nie wysyla duplikatow.
- Raport tygodniowy jest testowo wysylany tylko tam, gdzie plan na to pozwala.

## Decyzja na teraz

Nie kupujemy jeszcze domeny ani mail providera tylko dla tego etapu.
Najpierw domykamy aplikacje do testow. Mail provider ustawiamy przed realnym testem digestu z uzytkownikiem.
