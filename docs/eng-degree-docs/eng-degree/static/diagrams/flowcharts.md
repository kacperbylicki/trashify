Diagram sekwencji logowania

```mermaid
graph LR
    Start((Start)) -- Login --> Walidacja{Walidacja danych}
    Walidacja -- Błędne hasło\nbądź email --> Odrzuć[Odrzuć żądanie] --> End((Stop))
    Walidacja -- Email nie potwierdzony --> Odrzuć --> End
    Walidacja -- Dane poprawne --> Email{Email potwierdzony}
    Email -- Nie --> Odrzuć --> End
    Email -- Tak --> Tworzenie[Stwórz tokeny autoryzacyjne]
    Tworzenie --> Zwrotka[Zwróć tokeny] --> End
```

Diagram sekwencji zmiany adresu email

```mermaid
graph LR
    Start((Start)) --> Formularz{Formularz zmiany\nadresu email}
    Formularz -- Email zajęty --> Odrzuć[Odrzuć żądanie] --> End((Stop))
    Formularz -- Email nie jest zajęty --> Wiadomość{Wyślij wiadomość email\nna nowe konto}
    Wiadomość -- Czas na potwierdzenie minął --> Odrzuć
    Wiadomość -- Czas na potwierdzenie nie minął --> Zaakceptuj
    Zaakceptuj --> End
```

Diagram sekwencji resetu hasła

```mermaid
graph TD
    Start((Start)) --> Formularz{Formularz resetu\n hasła użytkownika}
    Formularz -- Adres email nie istnieje --> End((Stop))
    Formularz -- Adres email istnieje --> Wiadomość{Wyślij wiadomość email}
    Wiadomość -- Czas na zmianę hasła minął --> Odrzuć[Odrzuć żądanie] --> End
    Wiadomość -- Czas na zmianę hasła nie minął --> FormularzHasła{Formularz zmiany hasła}
    FormularzHasła -- Hasło spełnia wymogi skomplikowania --> PowtórzenieHasła{Powtórzone hasło}
    FormularzHasła -- Hasło nie spełnia wymogów skomplikowania --> Odrzuć
    PowtórzenieHasła -- Powtórzone hasło nie jest identyczne z wpisanym hasłem --> Odrzuć
    PowtórzenieHasła -- Powtórzone hasło jest identyczne --> Zmień[Zmień hasło użykownika] --> End
```

Diagram sekwencji rejestracji użytkownika

```mermaid
graph TD
    Start((Start)) --> Formularz{Formularz rejestracji}
    Formularz -- Adres email istnieje --> Odrzuć[Odrzuć żądanie] --> End((Stop))
    Formularz -- Powtórzone hasło jest niepoprawne --> Odrzuć[Odrzuć żądanie]
    Formularz -- Dane są poprawne --> Wiadomość[Wyślij wiadomość\nemail na potwierdzenie]
    Wy --> Wiadomość
    Wiadomość --> Potwierdź[Email potwierdzony]
    Potwierdź --> End
```

Diagram sekwencji pobierania danych o śmietnikacz

```mermaid
graph LR
    Start((Start)) --> Autoryzacja{Użytkownik jest zalogowany}
    Autoryzacja -- Nie --> Odrzuć[Odrzuć żądanie] --> End((Stop))
    Autoryzacja -- Tak --> Pobieranie[Pobierz dane z bazy danych]
    Pobieranie --> Zwrotka[Zwróć dane] --> End
```
