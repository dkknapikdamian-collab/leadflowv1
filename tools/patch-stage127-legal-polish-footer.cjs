const fs = require('fs');
const path = require('path');

const root = process.cwd();
const required = ['package.json', 'src/App.tsx', 'src/pages/PublicLanding.tsx'];
for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) {
    throw new Error(`Stage127 must run from CloseFlow repo root. Missing: ${file}`);
  }
}

const backupDir = path.join(root, '_project', 'backups', 'stage127_legal_polish_footer');
fs.mkdirSync(backupDir, { recursive: true });

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function write(rel, content) {
  fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
  fs.writeFileSync(path.join(root, rel), content.replace(/^\uFEFF/, ''), 'utf8');
}

function backup(rel) {
  const src = path.join(root, rel);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(backupDir, `${path.basename(rel)}.before-stage127`));
  }
}

[
  'src/pages/LegalPrivacy.tsx',
  'src/pages/LegalTerms.tsx',
  'src/pages/PublicLanding.tsx',
  'src/styles/closeflow-public-landing.css',
].forEach(backup);

const privacy = `import { Link } from 'react-router-dom';
import './legal-public-pages.css';

export function LegalPrivacy() {
  const updatedAt = '21 maja 2026';

  return (
    <main className="cf-legal-page">
      <section className="cf-legal-card">
        <Link to="/" className="cf-legal-back-link">← Wróć do strony głównej</Link>
        <p className="cf-legal-kicker">CloseFlow</p>
        <h1>Polityka prywatności</h1>
        <p className="cf-legal-muted">Ostatnia aktualizacja: {updatedAt}</p>

        <p>
          CloseFlow to aplikacja do zarządzania leadami, klientami, sprawami, zadaniami,
          kalendarzem, komunikacją operacyjną i powiadomieniami. Ta polityka opisuje,
          jakie dane mogą być przetwarzane przez aplikację i w jakim celu.
        </p>

        <h2>Administrator i kontakt</h2>
        <p>
          W sprawach dotyczących prywatności, dostępu do danych lub usunięcia danych możesz
          skontaktować się z administratorem aplikacji pod adresem e-mail wskazanym w ekranie
          zgody Google OAuth albo w ustawieniach konta użytkownika.
        </p>

        <h2>Jakie dane przetwarzamy</h2>
        <ul>
          <li>dane konta użytkownika, takie jak adres e-mail, identyfikator użytkownika i podstawowe informacje profilowe,</li>
          <li>dane wprowadzane w aplikacji: leady, klienci, sprawy, zadania, notatki, wydarzenia i historia aktywności,</li>
          <li>dane techniczne potrzebne do logowania, bezpieczeństwa, diagnostyki błędów i działania integracji,</li>
          <li>dane z integracji Google Calendar, jeżeli użytkownik sam połączy konto Google z CloseFlow.</li>
        </ul>

        <h2>Dane Google Calendar</h2>
        <p>
          Jeżeli użytkownik połączy konto Google, CloseFlow może uzyskać dostęp do danych Google
          Calendar wyłącznie w zakresie wymaganym do synchronizacji wydarzeń kalendarza.
          Aplikacja używa integracji do tworzenia, odczytu i aktualizacji wydarzeń związanych
          z pracą operacyjną użytkownika w CloseFlow.
        </p>
        <p>
          Dane Google Calendar nie są sprzedawane, udostępniane reklamodawcom ani używane do
          trenowania modeli AI. Dostęp do Google Calendar można odłączyć w ustawieniach aplikacji
          albo w ustawieniach bezpieczeństwa konta Google.
        </p>

        <h2>Cel przetwarzania danych</h2>
        <ul>
          <li>zapewnienie działania konta użytkownika i aplikacji,</li>
          <li>zarządzanie leadami, klientami, sprawami, zadaniami i kalendarzem,</li>
          <li>synchronizacja wydarzeń z Google Calendar po wyrażeniu zgody przez użytkownika,</li>
          <li>utrzymanie bezpieczeństwa, diagnostyka błędów i ochrona przed nadużyciami,</li>
          <li>obsługa komunikacji systemowej, powiadomień i potwierdzeń.</li>
        </ul>

        <h2>Przechowywanie i bezpieczeństwo</h2>
        <p>
          Dane są przechowywane w usługach backendowych skonfigurowanych dla aplikacji CloseFlow.
          Dostęp do danych jest ograniczany przez uwierzytelnianie, role użytkowników,
          uprawnienia przestrzeni roboczej i zabezpieczenia dostawców infrastruktury.
        </p>

        <h2>Udostępnianie danych</h2>
        <p>
          Dane mogą być przekazywane dostawcom technicznym wyłącznie w zakresie potrzebnym do
          działania aplikacji, na przykład hostingowi, bazie danych, obsłudze e-maili, płatności,
          logowania lub integracji Google. Dane nie są sprzedawane.
        </p>

        <h2>Prawa użytkownika</h2>
        <p>
          Użytkownik może poprosić o dostęp do swoich danych, ich poprawienie, usunięcie albo
          ograniczenie przetwarzania, o ile pozwalają na to obowiązujące przepisy i wymagania
          bezpieczeństwa systemu.
        </p>

        <h2>Zmiany polityki</h2>
        <p>
          Polityka prywatności może być aktualizowana wraz z rozwojem aplikacji, integracji i
          wymagań prawnych. Aktualna wersja jest publikowana pod tym adresem.
        </p>
      </section>
    </main>
  );
}

export default LegalPrivacy;
`;

const terms = `import { Link } from 'react-router-dom';
import './legal-public-pages.css';

export function LegalTerms() {
  const updatedAt = '21 maja 2026';

  return (
    <main className="cf-legal-page">
      <section className="cf-legal-card">
        <Link to="/" className="cf-legal-back-link">← Wróć do strony głównej</Link>
        <p className="cf-legal-kicker">CloseFlow</p>
        <h1>Warunki korzystania</h1>
        <p className="cf-legal-muted">Ostatnia aktualizacja: {updatedAt}</p>

        <p>
          Niniejsze warunki opisują podstawowe zasady korzystania z aplikacji CloseFlow.
          Korzystając z aplikacji, użytkownik potwierdza, że będzie używać jej zgodnie z prawem,
          przeznaczeniem systemu i zasadami bezpieczeństwa.
        </p>

        <h2>Opis usługi</h2>
        <p>
          CloseFlow jest aplikacją operacyjną do zarządzania leadami, klientami, sprawami,
          zadaniami, kalendarzem, powiadomieniami, historią aktywności i wybranymi integracjami,
          w tym Google Calendar.
        </p>

        <h2>Konto użytkownika</h2>
        <p>
          Użytkownik odpowiada za bezpieczeństwo swojego konta, poprawność danych logowania oraz
          działania wykonywane z użyciem konta. Nie należy udostępniać dostępu osobom nieuprawnionym.
        </p>

        <h2>Integracja Google Calendar</h2>
        <p>
          Użytkownik może dobrowolnie połączyć konto Google w celu synchronizacji wydarzeń kalendarza.
          Zakres dostępu zależy od uprawnień zaakceptowanych na ekranie zgody Google. Użytkownik może
          odłączyć integrację w ustawieniach CloseFlow albo w ustawieniach konta Google.
        </p>

        <h2>Dozwolone korzystanie</h2>
        <ul>
          <li>nie wolno wykorzystywać aplikacji do działań niezgodnych z prawem,</li>
          <li>nie wolno próbować omijać zabezpieczeń, limitów, ról ani uprawnień,</li>
          <li>nie wolno wprowadzać danych, do których użytkownik nie ma prawa,</li>
          <li>nie wolno zakłócać działania aplikacji ani infrastruktury dostawców.</li>
        </ul>

        <h2>Dane i odpowiedzialność użytkownika</h2>
        <p>
          Użytkownik odpowiada za treści i dane wprowadzane do aplikacji. CloseFlow ma pomagać w pracy
          operacyjnej, ale nie zastępuje samodzielnej kontroli danych, decyzji biznesowych ani weryfikacji
          poprawności informacji.
        </p>

        <h2>Dostępność i zmiany</h2>
        <p>
          Aplikacja może być rozwijana, aktualizowana i czasowo niedostępna z powodów technicznych,
          konserwacyjnych lub bezpieczeństwa. Funkcje mogą się zmieniać wraz z rozwojem produktu.
        </p>

        <h2>Ograniczenie odpowiedzialności</h2>
        <p>
          Aplikacja jest dostarczana jako narzędzie wspierające pracę. W maksymalnym zakresie dozwolonym
          przez prawo odpowiedzialność za decyzje biznesowe, działania operacyjne i poprawność danych
          pozostaje po stronie użytkownika albo organizacji korzystającej z systemu.
        </p>

        <h2>Kontakt</h2>
        <p>
          W sprawach dotyczących działania aplikacji, warunków korzystania lub dostępu do danych należy
          kontaktować się z administratorem aplikacji pod adresem e-mail wskazanym w ekranie zgody Google OAuth.
        </p>
      </section>
    </main>
  );
}

export default LegalTerms;
`;

write('src/pages/LegalPrivacy.tsx', privacy);
write('src/pages/LegalTerms.tsx', terms);

let legalCss = read('src/pages/legal-public-pages.css');
if (!legalCss.includes('.cf-legal-back-link')) {
  legalCss += `

.cf-legal-back-link {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  margin-bottom: 18px;
  border: 1px solid #dbeafe;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  padding: 8px 12px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 850;
}

.cf-legal-back-link:hover {
  border-color: #bfdbfe;
  background: #dbeafe;
}
`;
  write('src/pages/legal-public-pages.css', legalCss);
}

let landing = read('src/pages/PublicLanding.tsx');
if (!landing.includes('public-landing-footer')) {
  const footer = `

      <footer className="public-landing-footer" aria-label="Informacje prawne CloseFlow">
        <div>
          <Link to="/" className="public-landing-footer-brand">CloseFlow</Link>
          <span>© 2026 CloseFlow. Wszystkie prawa zastrzeżone.</span>
        </div>
        <nav aria-label="Linki prawne">
          <Link to="/privacy">Polityka prywatności</Link>
          <Link to="/terms">Warunki korzystania</Link>
        </nav>
      </footer>`;
  const needle = '\n    </main>';
  if (!landing.includes(needle)) throw new Error('Cannot find PublicLanding </main> anchor');
  landing = landing.replace(needle, `${footer}${needle}`);
  write('src/pages/PublicLanding.tsx', landing);
}

let landingCss = read('src/styles/closeflow-public-landing.css');
if (!landingCss.includes('.public-landing-footer')) {
  const footerCss = `

.public-landing-footer {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 0 0 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  color: #667085;
  font-size: 13px;
  font-weight: 750;
}

.public-landing-footer div,
.public-landing-footer nav {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.public-landing-footer a {
  color: #475467;
  text-decoration: none;
  font-weight: 900;
}

.public-landing-footer a:hover {
  color: #1d4ed8;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.public-landing-footer-brand {
  color: #0f172a !important;
  letter-spacing: -0.03em;
}

@media (max-width: 720px) {
  .public-landing-footer {
    width: min(100% - 24px, 1180px);
    align-items: flex-start;
    flex-direction: column;
    padding-bottom: 26px;
  }
}
`;
  landingCss += footerCss;
  write('src/styles/closeflow-public-landing.css', landingCss);
}

const test = `const fs = require('fs');
const path = require('path');

const root = process.cwd();
const files = {
  privacy: path.join(root, 'src/pages/LegalPrivacy.tsx'),
  terms: path.join(root, 'src/pages/LegalTerms.tsx'),
  landing: path.join(root, 'src/pages/PublicLanding.tsx'),
  landingCss: path.join(root, 'src/styles/closeflow-public-landing.css'),
  legalCss: path.join(root, 'src/pages/legal-public-pages.css'),
};

function read(file) {
  return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const privacy = read(files.privacy);
const terms = read(files.terms);
const landing = read(files.landing);
const landingCss = read(files.landingCss);
const legalCss = read(files.legalCss);
const joined = [privacy, terms, landing, landingCss, legalCss].join('\n');

const mojibakeTokens = ['Ä', 'Ĺ', 'Ă', 'Å', 'Â', '�'];
for (const token of mojibakeTokens) {
  assert(!joined.includes(token), 'Stage127 found mojibake token: ' + token);
}

for (const phrase of [
  'Polityka prywatności',
  'zarządzania leadami',
  'użytkownik',
  'bezpieczeństwa',
  'Warunki korzystania',
  'Dozwolone korzystanie',
]) {
  assert(joined.includes(phrase), 'Stage127 missing proper Polish phrase: ' + phrase);
}

assert(privacy.includes("import { Link } from 'react-router-dom';"), 'Privacy page must expose back link via React Router Link');
assert(terms.includes("import { Link } from 'react-router-dom';"), 'Terms page must expose back link via React Router Link');
assert(landing.includes('className="public-landing-footer"'), 'Public landing must include legal footer');
assert(landing.includes('to="/privacy"'), 'Public landing footer must link to /privacy');
assert(landing.includes('to="/terms"'), 'Public landing footer must link to /terms');
assert(landing.includes('Polityka prywatności'), 'Public landing footer must show privacy label');
assert(landing.includes('Warunki korzystania'), 'Public landing footer must show terms label');
assert(landingCss.includes('.public-landing-footer'), 'Public landing CSS must style legal footer');
assert(legalCss.includes('.cf-legal-back-link'), 'Legal CSS must style back link');

console.log('[Stage127] OK: legal pages are Polish-clean and public landing has legal footer links');
`;
write('tests/stage127-legal-polish-footer.test.cjs', test);

const report = `# Stage127 - legal Polish text + public landing footer links

## Status

LOCAL-ONLY PATCH PREPARED/APPLIED BY SCRIPT.

## Cel

- Naprawić mojibake / błędne polskie znaki na publicznych stronach prawnych.
- Dodać profesjonalne linki do Polityki prywatności i Warunków korzystania na publicznej stronie głównej.
- Ułatwić konfigurację Google Auth Platform / OAuth Branding.

## Zmienione pliki

- src/pages/LegalPrivacy.tsx
- src/pages/LegalTerms.tsx
- src/pages/legal-public-pages.css
- src/pages/PublicLanding.tsx
- src/styles/closeflow-public-landing.css
- tests/stage127-legal-polish-footer.test.cjs

## Backup

- _project/backups/stage127_legal_polish_footer/LegalPrivacy.tsx.before-stage127
- _project/backups/stage127_legal_polish_footer/LegalTerms.tsx.before-stage127
- _project/backups/stage127_legal_polish_footer/PublicLanding.tsx.before-stage127
- _project/backups/stage127_legal_polish_footer/closeflow-public-landing.css.before-stage127

## Testy

- node tests/stage127-legal-polish-footer.test.cjs
- npm run build

## Czego nie ruszano

- Google Calendar auth bridge
- Supabase schema/env
- Vercel env
- Storage
- Resend
- Stripe
- AI
- import leadów

## Następny krok

Po deployu sprawdzić:

- https://closeflowapp.vercel.app/
- https://closeflowapp.vercel.app/privacy
- https://closeflowapp.vercel.app/terms

Następnie wpisać URL-e w Google Auth Platform -> Branding.
`;
write('_project/runs/2026-05-21_stage127_legal_polish_footer.md', report);

console.log('Stage127 legal polish + footer patch applied.');
`;
