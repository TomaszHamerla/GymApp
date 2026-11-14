# GymApp – System do monitorowania treningów

Aplikacja składa się z:
- **Backendu:** Spring Boot 3 (Java 21), Spring Security, JWT (tokeny w ciasteczkach Http/Lax), Hibernate/JPA, JavaMailSender + Thymeleaf (wiadomości e-mail z aktywacją konta).
- **Frontendu:** Angular 19, biblioteka UI PrimeNG 19 (motyw Aura, styled mode), ngx-cookie-service, Nginx.
- **Bazy danych:** PostgreSQL (działająca bezpośrednio na serwerze VPS).
- **Proxy:** Nginx Proxy Manager (zarządzanie ruchem HTTP/HTTPS).

---

## 🚀 Nowy proces aktywacji konta

1. Użytkownik rejestruje się w aplikacji na stronie głównej (`/auth`).
2. Backend wysyła e-mail aktywacyjny zawierający **przycisk „Aktywuj konto”** kierujący pod adres:
   `http://<ADRES_VPS>/activate?token=<JWT_TOKEN>`
3. Po kliknięciu w link użytkownik zostaje przekierowany do dedykowanego widoku `/activate`:
   - Aplikacja automatycznie wysyła żądanie do endpointu `GET /activate?token=...`.
   - Wyświetla się animacja ładowania (spinner).
   - Po poprawnej aktywacji pojawia się potwierdzenie oraz przycisk **„Przejdź do logowania”**, który przekierowuje do ekranu logowania (`/auth`).
   - W przypadku wygaśnięcia lub błędu tokenu wyświetlany jest czytelny komunikat z opcją powrotu.

---

## 📁 Architektura na serwerze VPS

```
                                  [ Klient / Przeglądarka ]
                                             │
                                      port 80 (HTTP)
                                             ▼
                             ┌───────────────────────────────┐
                             │     Nginx Proxy Manager       │ (zarządza ruchem VPS)
                             └───────────────┬───────────────┘
                                             │ proxy do portu 8081
                                             ▼
                             ┌───────────────────────────────┐
                             │       gymapp_angular          │
                             │       (Nginx + Angular)       │
                             │         Port: 8081:80         │
                             └───────────────┬───────────────┘
                             (zapytania API: │ /(api|login|register|activate)
                             wewnętrzna sieć)│ proxy do gymapp_spring:8080
                                             ▼
                             ┌───────────────────────────────┐
                             │        gymapp_spring          │
                             │      (Spring Boot JAR)        │
                             │         Port: 8080            │
                             └───────────────┬───────────────┘
                                             │ JDBC: host.docker.internal:5432
                                             ▼
                             ┌───────────────────────────────┐
                             │    PostgreSQL (Lokalny VPS)   │ (poza Dockerem)
                             └───────────────────────────────┘
```

> **Zaleta tej architektury:**
> - Frontend i backend są serwowane pod tym samym adresem i portem (przez Nginx w kontenerze Angulara).
> - **Całkowity brak problemów z CORS**.
> - Ciasteczka `auth_token` działają natywnie w tej samej domenie/adresie IP.
> - Wystarczy podpiąć Nginx Proxy Manager tylko pod jeden port kontenera Angulara (`8081`).

---

