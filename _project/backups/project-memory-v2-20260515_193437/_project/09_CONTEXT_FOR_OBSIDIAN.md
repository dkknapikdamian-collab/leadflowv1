# KONTEKST PROJEKTU - CloseFlow lead app

## Tożsamość projektu
CloseFlow / Lead app to aplikacja operacyjna do leadów, klientów, spraw, zadań, kalendarza, follow-upów, szkiców AI i codziennego pilnowania ruchu sprzedażowo-operacyjnego.

Nie jest to klasyczny ciężki CRM. Produkt ma codziennie odpowiadać użytkownikowi: kogo trzeba ruszyć, czego nie wolno przegapić, gdzie lead albo sprawa utknęły i co jest najbliższą realną akcją.

## Repo i ścieżki
- App repo lokalne: `C:\\Users\malim\Desktop\biznesy_ai\2.closeflow`
- App repo GitHub: `dkknapikdamian-collab/leadflowv1`
- App branch: `dev-rollout-freeze`
- Obsidian vault: `C:\\Users\malim\Desktop\biznesy_ai\00_OBSIDIAN_VAULT`
- Obsidian sekcja: `10_PROJEKTY\\CloseFlow_Lead_App`
- Obsidian repo: `dkknapikdamian-collab/obsidian-vault`
- Obsidian branch: `main`

## Główny użytkownik
- solo usługodawca,
- freelancer,
- małe studio / mała firma usługowa,
- osoba sama ogarniająca sprzedaż, follow-up, terminy i obsługę klienta.

Drugi ważny tor: nieruchomości, bo Damian ma własne doświadczenie i kanały w tym segmencie. Segmenty służą do priorytetyzacji i personalizacji, nie do ograniczania produktu.

## Kierunek produktu
1. Ekran `Dziś` ma być centrum decyzji, nie ozdobnym dashboardem.
2. Lead aktywny jest miejscem pracy sprzedażowej.
3. Sprawa jest miejscem pracy operacyjnej po pozyskaniu tematu.
4. Klient jest rekordem w tle, który łączy wiele tematów.
5. Zamiast tekstowego pola `Następny krok` system ma opierać się o najbliższą zaplanowaną akcję z zadań, wydarzeń i innych terminowych elementów.
6. AI może pomagać, porządkować, szukać i tworzyć szkice, ale finalny zapis danych wymaga potwierdzenia użytkownika.
7. Produkt ma być prosty w codziennej pracy, z małą liczbą pól obowiązkowych i bez przeciążania UI.

## Obowiązujące decyzje produktowe
- CloseFlow nie powinien być pozycjonowany jako zwykły CRM.
- Najmocniejszy rdzeń: `Dziś`, leady, zadania, wydarzenia, przypomnienia, szkice z głosu/tekstu, AI z kontekstem aplikacji, PWA, później Google Calendar.
- Free nie jest pełną darmową aplikacją, tylko demo i trybem awaryjnym po trialu.
- W aktualnych materiałach jest decyzja o trialu Pro/AI 21 dni, Free jako ograniczone demo, Basic 19 zł, Pro 39 zł, AI 49 zł regularnie / 39 zł launch promo. Uwaga: jeśli w repo lub decyzjach Damiana istnieje nowsze 7 dni trial, konflikt trzeba opisać zamiast zgadywać.
- AI nie zapisuje finalnych leadów, zadań, wydarzeń ani notatek bez potwierdzenia, poza zwykłą świadomą notatką wpisaną przez użytkownika.
- Google Calendar jest wartościowy, ale dopiero po ustabilizowaniu tasków i eventów.
- Nie budować teraz natywnej aplikacji mobile, automatycznego podsłuchiwania rozmów, scrapingu sociali, WhatsApp integration, team managementu ani enterprise CRM.

## Ważne konflikty do pilnowania
- W starszych materiałach występował model `next step`; nowsza specyfikacja usuwa tekstowe pole `Następny krok` z głównej logiki i zastępuje je `Najbliższą zaplanowaną akcją`.
- W niektórych ustaleniach występuje 7-dniowy trial, a w dokumencie planów z 2026-04-26 jest trial 21 dni. Nie wolno tego rozstrzygać po cichu. Trzeba sprawdzić najnowsze pliki repo i decyzje Damiana.
- Publiczny audyt wskazywał ryzyko niespójności domen, billing truth, security copy i braku dowodu z kodu. To nie jest sign-off release'u, tylko lista ryzyk do weryfikacji.

## Co traktować jako fakty po analizie repo
Faktem jest tylko to, co wynika z:
- kodu,
- aktualnych plików `_project/`,
- aktualnego Obsidiana,
- wyników testów,
- aktualnej decyzji Damiana.

Wszystko inne z tej paczki, jeśli nie potwierdzi się w repo, oznacz jako `HIPOTEZA / DO SPRAWDZENIA`, nie jako pewny stan aplikacji.
