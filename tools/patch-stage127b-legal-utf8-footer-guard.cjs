const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const stage = 'stage127b_legal_utf8_footer_guard';

function p(rel) {
  return path.join(repo, rel);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function read(rel) {
  return fs.readFileSync(p(rel), 'utf8');
}

function write(rel, content) {
  ensureDir(path.dirname(p(rel)));
  fs.writeFileSync(p(rel), content, 'utf8');
}

function backup(rel) {
  const src = p(rel);
  if (!fs.existsSync(src)) return;
  const dst = p(path.join('_project/backups', stage, rel.replaceAll('\\', '/')));
  ensureDir(path.dirname(dst));
  fs.copyFileSync(src, dst);
}

[
  'src/pages/LegalPrivacy.tsx',
  'src/pages/LegalTerms.tsx',
  'src/pages/legal-public-pages.css',
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
        <p className="cf-legal-kicker">CloseFlow</p>
        <h1>Polityka prywatności</h1>
        <p className="cf-legal-muted">Ostatnia aktualizacja: {updatedAt}</p>

        <p>
          CloseFlow to aplikacja do zarządzania leadami, sprawami, zadaniami, kalendarzem,
          klientami, komunikacją operacyjną i powiadomieniami. Ta strona opisuje, jakie dane
          mogą być przetwarzane przez aplikację i w jakim celu.
        </p>

        <h2>Administrator i kontakt</h2>
        <p>
          W sprawach dotyczących prywatności, dostępu do danych albo usunięcia danych możesz
          skontaktować się z administratorem aplikacji pod adresem e-mail wskazanym w ekranie
          zgody Google OAuth oraz w konfiguracji aplikacji.
        </p>

        <h2>Jakie dane przetwarzamy</h2>
        <ul>
          <li>dane konta użytkownika, takie jak adres e-mail, identyfikator użytkownika i podstawowe informacje profilowe,</li>
          <li>dane wprowadzane w aplikacji, w tym leady, klienci, sprawy, zadania, notatki, wydarzenia i historia aktywności,</li>
          <li>dane techniczne potrzebne do działania aplikacji, logowania, bezpieczeństwa, integracji i diagnostyki błędów,</li>
          <li>dane z integracji Google, jeżeli użytkownik sam połączy konto Google z CloseFlow.</li>
        </ul>

        <h2>Dane Google Calendar</h2>
        <p>
          Jeżeli użytkownik połączy konto Google, CloseFlow może uzyskać dostęp do danych Google
          Calendar wyłącznie w zakresie wymaganym do synchronizacji wydarzeń kalendarza.
          Aplikacja używa tej integracji do tworzenia, odczytu i aktualizacji wydarzeń związanych
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
          Dostęp do danych jest ograniczany przez mechanizmy uwierzytelniania, role użytkowników,
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

        <div className="cf-legal-actions">
          <Link to="/" className="cf-legal-back-link">Wróć do strony głównej</Link>
          <Link to="/terms" className="cf-legal-secondary-link">Warunki korzystania</Link>
        </div>
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
        <p className="cf-legal-kicker">CloseFlow</p>
        <h1>Warunki korzystania</h1>
        <p className="cf-legal-muted">Ostatnia aktualizacja: {updatedAt}</p>

        <p>
          Niniejsze warunki opisują podstawowe zasady korzystania z aplikacji CloseFlow. Korzystając
          z aplikacji, użytkownik potwierdza, że będzie używać jej zgodnie z prawem, przeznaczeniem
          systemu i zasadami bezpieczeństwa.
        </p>

        <h2>Opis usługi</h2>
        <p>
          CloseFlow jest aplikacją operacyjną do zarządzania leadami, klientami, sprawami, zadaniami,
          kalendarzem, powiadomieniami, historią aktywności i wybranymi integracjami, w tym Google
          Calendar.
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

        <div className="cf-legal-actions">
          <Link to="/" className="cf-legal-back-link">Wróć do strony głównej</Link>
          <Link to="/privacy" className="cf-legal-secondary-link">Polityka prywatności</Link>
        </div>
      </section>
    </main>
  );
}

export default LegalTerms;
`;

const legalCss = `.cf-legal-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.12), transparent 34%),
    linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
  color: #111827;
  padding: 48px 16px;
}

.cf-legal-card {
  width: min(920px, 100%);
  margin: 0 auto;
  border: 1px solid #e4e7ec;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 18px 60px rgba(15, 23, 42, 0.08);
  padding: clamp(24px, 4vw, 48px);
}

.cf-legal-kicker {
  margin: 0 0 10px;
  color: #2563eb;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.cf-legal-card h1 {
  margin: 0;
  color: #0f172a;
  font-size: clamp(38px, 6vw, 64px);
  line-height: 0.96;
  letter-spacing: -0.065em;
}

.cf-legal-card h2 {
  margin: 30px 0 0;
  color: #111827;
  font-size: 21px;
  line-height: 1.2;
  letter-spacing: -0.03em;
}

.cf-legal-card p,
.cf-legal-card li {
  color: #475467;
  font-size: 15px;
  line-height: 1.72;
  font-weight: 600;
}

.cf-legal-card p {
  margin: 14px 0 0;
}

.cf-legal-card ul {
  margin: 14px 0 0;
  padding-left: 22px;
}

.cf-legal-card li + li {
  margin-top: 8px;
}

.cf-legal-muted {
  color: #667085 !important;
  font-size: 13px !important;
  font-weight: 800 !important;
}

.cf-legal-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 34px;
  padding-top: 24px;
  border-top: 1px solid #e4e7ec;
}

.cf-legal-back-link,
.cf-legal-secondary-link {
  min-height: 44px;
  border-radius: 999px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-size: 13px;
  font-weight: 900;
}

.cf-legal-back-link {
  background: #2563eb;
  color: #fff;
  box-shadow: 0 14px 28px rgba(37, 99, 235, 0.20);
}

.cf-legal-back-link:hover {
  background: #1d4ed8;
}

.cf-legal-secondary-link {
  border: 1px solid #e4e7ec;
  background: #fff;
  color: #0f172a;
}

.cf-legal-secondary-link:hover {
  border-color: #bfdbfe;
  color: #1d4ed8;
}

@media (max-width: 720px) {
  .cf-legal-page {
    padding: 24px 12px;
  }

  .cf-legal-card {
    border-radius: 24px;
  }

  .cf-legal-actions {
    flex-direction: column;
  }

  .cf-legal-back-link,
  .cf-legal-secondary-link {
    width: 100%;
  }
}
`;

write('src/pages/LegalPrivacy.tsx', privacy);
write('src/pages/LegalTerms.tsx', terms);
write('src/pages/legal-public-pages.css', legalCss);

let landing = read('src/pages/PublicLanding.tsx');
landing = landing.replace(/\n\s*<footer className="public-landing-footer"[\s\S]*?<\/footer>\s*\n\s*<\/main>/, '\n    </main>');
const footer = `
      <footer className="public-landing-footer" aria-label="Informacje prawne CloseFlow">
        <div>
          <strong>CloseFlow</strong>
          <span>Panel pracy dla leadów, follow-upów, zadań i spraw.</span>
        </div>
        <nav aria-label="Linki prawne">
          <Link to="/privacy">Polityka prywatności</Link>
          <Link to="/terms">Warunki korzystania</Link>
        </nav>
      </footer>
`;
if (!landing.includes('className="public-landing-footer"')) {
  landing = landing.replace(/\n\s*<\/main>\s*\);\s*\}\s*$/, `${footer}    </main>\n  );\n}\n`);
}
write('src/pages/PublicLanding.tsx', landing);

let landingCss = read('src/styles/closeflow-public-landing.css');
landingCss = landingCss.replace(/\n\/\* STAGE127B_LEGAL_FOOTER_START \*\/[\s\S]*?\/\* STAGE127B_LEGAL_FOOTER_END \*\/\n?/g, '\n');
landingCss += `
/* STAGE127B_LEGAL_FOOTER_START */
.public-landing-footer {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto 28px;
  border: 1px solid #e4e7ec;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.78);
  padding: 18px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  color: #667085;
  box-shadow: 0 8px 22px rgba(16, 24, 40, 0.04);
}

.public-landing-footer div {
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
}

.public-landing-footer strong {
  color: #0f172a;
  font-size: 14px;
  font-weight: 900;
  letter-spacing: -0.03em;
}

.public-landing-footer span {
  font-size: 13px;
  font-weight: 700;
}

.public-landing-footer nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.public-landing-footer a {
  border-radius: 999px;
  color: #475467;
  padding: 8px 11px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 850;
}

.public-landing-footer a:hover {
  background: #eff6ff;
  color: #1d4ed8;
}

@media (max-width: 720px) {
  .public-landing-footer {
    width: min(100% - 24px, 1180px);
    align-items: flex-start;
    flex-direction: column;
  }

  .public-landing-footer nav {
    justify-content: flex-start;
  }
}
/* STAGE127B_LEGAL_FOOTER_END */
`;
write('src/styles/closeflow-public-landing.css', landingCss);

console.log('[Stage127B] OK: legal UTF-8 pages and public footer patched');
