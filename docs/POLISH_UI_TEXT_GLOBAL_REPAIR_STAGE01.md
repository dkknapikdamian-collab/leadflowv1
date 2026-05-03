# Global UI text repair Stage01

Cel: globalnie wykrywać i naprawiać uszkodzone kodowanie polskich znaków w widocznych tekstach aplikacji.

Zakres:
- automatyczna naprawa typowych sekwencji uszkodzonego kodowania UTF-8/Windows,
- raport podejrzanych słów ASCII bez polskich znaków,
- guard dla plików aplikacji: strony, komponenty, hooki, biblioteki frontu i API,
- techniczne testy oraz guardy mogą zawierać wzorce wykrywania błędów i nie są traktowane jako UI.

Ważne: brak polskich znaków typu `uzytkownik` jest raportowany, ale nie jest ślepo zamieniany globalnie, bo może występować w identyfikatorach, kluczach, ścieżkach lub danych technicznych.
