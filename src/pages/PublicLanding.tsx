import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BellRing,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Mail,
  Mic,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import '../styles/closeflow-public-landing.css';

const FEATURES = [
  {
    icon: Clock3,
    title: 'Widok Dziś',
    text: 'Otwierasz aplikację i widzisz leady, zadania, spotkania oraz sprawy, które wymagają ruchu teraz.',
  },
  {
    icon: CheckCircle2,
    title: 'Następny krok przy leadzie',
    text: 'Każdy kontakt może mieć konkretny ruch: telefon, wiadomość, oferta, spotkanie albo przypomnienie.',
  },
  {
    icon: Users,
    title: 'Lead → klient → sprawa',
    text: 'Po sprzedaży temat nie znika. Przechodzi w obsługę, zadania, terminy i historię działań.',
  },
  {
    icon: CalendarDays,
    title: 'Google Calendar',
    text: 'Spotkania i wydarzenia mogą pracować razem z Twoim kalendarzem Google. Wpisujesz w jednym miejscu, widzisz w drugim.',
  },
  {
    icon: BellRing,
    title: 'Konflikty terminów',
    text: 'Jeśli kilka rzeczy wpada na ten sam czas, aplikacja wyciąga to na wierzch, zanim dzień zacznie się sypać.',
  },
  {
    icon: Mail,
    title: 'Poranny digest',
    text: 'Mail z tym, co dziś wymaga uwagi: follow-upy, zadania, spotkania i sprawy, których nie warto zostawiać na później.',
  },
  {
    icon: Mic,
    title: 'Szybki szkic',
    text: 'Wklejasz albo dyktujesz notatkę po rozmowie. Szkic trafia do sprawdzenia, a Ty później porządkujesz go w leadzie, zadaniu albo sprawie.',
  },
  {
    icon: ShieldCheck,
    title: 'Bez automatycznego bałaganu',
    text: 'AI może pomóc przygotować szkic, ale finalne dane zatwierdzasz Ty. Nic ważnego nie zapisuje się samo za Twoimi plecami.',
  },
];

const WORKFLOW = [
  {
    step: '01',
    title: 'Dodajesz leada',
    text: 'Kontakt, źródło, krótki opis i informacja, co trzeba zrobić dalej.',
  },
  {
    step: '02',
    title: 'Ustawiasz następny ruch',
    text: 'Telefon, wiadomość, oferta, spotkanie albo przypomnienie na konkretny dzień.',
  },
  {
    step: '03',
    title: 'Wracasz do Dziś',
    text: 'Nie przekopujesz maila i notatek. Widzisz to, co wymaga reakcji.',
  },
  {
    step: '04',
    title: 'Prowadzisz sprawę po sprzedaży',
    text: 'Klient, zadania, spotkania i historia zostają w jednym procesie.',
  },
];

const AUDIENCE = [
  'freelancerzy',
  'małe studia web/design',
  'marketing i reklamy',
  'SEO i social media',
  'konsultanci i wdrożeniowcy',
  'lokalne firmy usługowe',
];

const FAQ = [
  {
    question: 'Mam już Excel, Notion albo Trello. Po co mi CloseFlow?',
    answer: 'Arkusz i tablica przechowują informacje. CloseFlow ma codziennie pokazać, kto czeka, co zalega i który lead nie ma następnego ruchu.',
  },
  {
    question: 'Czy to jest klasyczny CRM?',
    answer: 'Nie próbujemy robić kombajnu do wszystkiego. CloseFlow skupia się na codziennym pilnowaniu leadów, follow-upów, zadań, kalendarza i spraw po sprzedaży.',
  },
  {
    question: 'Czy muszę od razu wszystko konfigurować?',
    answer: 'Nie. Najlepszy start to kilka prawdziwych leadów, następne kroki i pierwszy dzień pracy w widoku Dziś.',
  },
  {
    question: 'Czy AI tworzy coś automatycznie?',
    answer: 'Nie. AI pomaga w szkicach i porządkowaniu notatek, ale finalne rekordy zatwierdzasz sam.',
  },
];

function HeroMockup() {
  return (
    <div className="public-landing-mockup" aria-label="Podgląd widoku Dziś w CloseFlow">
      <div className="public-landing-mockup-topbar">
        <span>CloseFlow</span>
        <strong>Dziś</strong>
      </div>
      <div className="public-landing-mockup-header">
        <p>Centrum pracy na dziś</p>
        <h2>4 ruchy wymagają uwagi</h2>
      </div>
      <div className="public-landing-metrics">
        <article>
          <span>Leady do ruchu</span>
          <strong>3</strong>
        </article>
        <article>
          <span>Zadania dziś</span>
          <strong>5</strong>
        </article>
        <article>
          <span>Spotkania</span>
          <strong>2</strong>
        </article>
      </div>
      <div className="public-landing-list">
        <div>
          <span className="public-landing-dot public-landing-dot-blue" />
          <p>
            <strong>Oddzwonić do klienta po wycenie</strong>
            <small>Dzisiaj, 10:30</small>
          </p>
        </div>
        <div>
          <span className="public-landing-dot public-landing-dot-amber" />
          <p>
            <strong>Oferta czeka od 3 dni</strong>
            <small>Follow-up zaległy</small>
          </p>
        </div>
        <div>
          <span className="public-landing-dot public-landing-dot-green" />
          <p>
            <strong>Nowa sprawa po sprzedaży</strong>
            <small>Przygotować następny krok</small>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PublicLanding() {
  return (
    <main className="public-landing-page">
      <header className="public-landing-nav">
        <Link to="/" className="public-landing-brand" aria-label="CloseFlow">
          <span>CF</span>
          <strong>CloseFlow</strong>
        </Link>
        <nav aria-label="Menu strony startowej">
          <a href="#jak-dziala">Jak działa</a>
          <a href="#funkcje">Funkcje</a>
          <a href="#cena">Cena</a>
          <Link to="/login?tab=login">Zaloguj się</Link>
        </nav>
      </header>

      <section className="public-landing-hero">
        <div className="public-landing-hero-copy">
          <div className="public-landing-pill">
            <Sparkles className="h-4 w-4" />
            <span>Panel dnia dla leadów, follow-upów i spraw</span>
          </div>
          <h1>Wiesz, kogo dziś ruszyć.</h1>
          <p className="public-landing-lead">
            CloseFlow pokazuje, które leady, zadania, spotkania i sprawy wymagają ruchu dzisiaj.
            Jeden widok zamiast pamiętania o wszystkim w mailu, Messengerze, notatkach i kalendarzu.
          </p>
          <div className="public-landing-actions">
            <Link to="/login?tab=register" className="public-landing-primary-cta">
              Utwórz konto <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/login?tab=login" className="public-landing-secondary-cta">
              Zaloguj się
            </Link>
          </div>
          <p className="public-landing-microcopy">
            Zacznij od 21 dni dostępu. Plan Pro po okresie próbnym: 39 zł miesięcznie.
          </p>
        </div>
        <HeroMockup />
      </section>

      <section className="public-landing-problem" aria-labelledby="problem-title">
        <div>
          <p className="public-landing-kicker">Problem</p>
          <h2 id="problem-title">Leady rzadko giną od razu. One cichną po drodze.</h2>
        </div>
        <div className="public-landing-problem-grid">
          <article>
            <h3>Zapytanie wpada z kilku miejsc</h3>
            <p>Telefon, mail, formularz, Messenger, polecenie. Każde źródło zaczyna żyć osobno.</p>
          </article>
          <article>
            <h3>Follow-up miał być jutro</h3>
            <p>Najpierw pamiętasz. Potem wpada kolejna robota. Po kilku dniach temat leży pod warstwą dnia.</p>
          </article>
          <article>
            <h3>Po sprzedaży zaczyna się kolejny etap</h3>
            <p>Klient wygrany, ale dalej trzeba dowieźć zadania, terminy, notatki i ustalenia.</p>
          </article>
        </div>
      </section>

      <section id="funkcje" className="public-landing-section">
        <div className="public-landing-section-head">
          <p className="public-landing-kicker">Co dostajesz</p>
          <h2>Jedno miejsce na ruchy, które normalnie uciekają między narzędziami.</h2>
        </div>
        <div className="public-landing-feature-grid">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="public-landing-feature-card">
                <span>
                  <Icon className="h-5 w-5" />
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="jak-dziala" className="public-landing-workflow">
        <div className="public-landing-section-head public-landing-section-head-light">
          <p className="public-landing-kicker">Jak działa</p>
          <h2>Najprostszy rytm pracy: lead, następny krok, widok Dziś.</h2>
        </div>
        <div className="public-landing-workflow-grid">
          {WORKFLOW.map((item) => (
            <article key={item.step}>
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="public-landing-audience">
        <div>
          <p className="public-landing-kicker">Dla kogo</p>
          <h2>Dla osób, które same sprzedają i same pilnują realizacji.</h2>
          <p>
            CloseFlow pasuje tam, gdzie lead wpada dzisiaj, oferta idzie jutro, follow-up jest za kilka dni,
            a po sprzedaży nadal trzeba dopilnować sprawy.
          </p>
        </div>
        <div className="public-landing-audience-tags">
          {AUDIENCE.map((item) => <span key={item}>{item}</span>)}
        </div>
      </section>

      <section id="cena" className="public-landing-pricing">
        <div className="public-landing-price-card">
          <div>
            <p className="public-landing-kicker">Start</p>
            <h2>21 dni dostępu</h2>
            <p>Dodaj kilka prawdziwych leadów, ustaw następne kroki i sprawdź, czy widok Dziś porządkuje Twoją pracę.</p>
          </div>
          <div className="public-landing-price-box">
            <span>Pro</span>
            <strong>39 zł</strong>
            <small>miesięcznie po okresie próbnym</small>
            <Link to="/login?tab=register" className="public-landing-primary-cta">
              Utwórz konto <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="public-landing-faq">
        <div className="public-landing-section-head">
          <p className="public-landing-kicker">Pytania</p>
          <h2>Krótko i konkretnie.</h2>
        </div>
        <div className="public-landing-faq-list">
          {FAQ.map((item) => (
            <article key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="public-landing-final-cta">
        <FileText className="h-8 w-8" />
        <h2>Zacznij od kilku realnych leadów.</h2>
        <p>Pierwszy dzień w CloseFlow jest prosty: kontakty, zadania, terminy i sprawy w jednym widoku.</p>
        <div className="public-landing-actions public-landing-actions-center">
          <Link to="/login?tab=register" className="public-landing-primary-cta">
            Utwórz konto <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/login?tab=login" className="public-landing-secondary-cta public-landing-secondary-cta-dark">
            Zaloguj się
          </Link>
        </div>
      </section>
    </main>
  );
}
