package com.example.spring.controller;

import com.example.spring.dto.AuthResponse;
import com.example.spring.dto.LoginRequest;
import com.example.spring.dto.RegisterRequest;
import com.example.spring.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Tag(name = "Autoryzacja i Uwierzytelnianie", description = "Operacje związane z rejestracją, aktywacją konta przez e-mail oraz logowaniem użytkowników.")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(
            summary = "Rejestracja nowego użytkownika",
            description = "Tworzy nowe konto użytkownika w systemie z domyślnym statusem nieaktywnym. Na podany adres e-mail wysyłana jest wiadomość z bezpiecznym linkiem i przyciskiem do aktywacji konta. Po rejestracji wymagana jest aktywacja konta przed pierwszym logowaniem."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Użytkownik zarejestrowany pomyślnie. Wiadomość e-mail z linkiem aktywacyjnym została wysłana."),
            @ApiResponse(responseCode = "400", description = "Nieprawidłowe dane wejściowe lub użytkownik o podanym adresie e-mail już istnieje w systemie.")
    })
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok("Rejestracja zakończona pomyślnie. Sprawdź swoją skrzynkę e-mail, aby aktywować konto.");
    }

    @GetMapping({"/activate", "/api/activate"})
    @Operation(
            summary = "Aktywacja konta użytkownika",
            description = "Weryfikuje unikalny token aktywacyjny przesłany w parametrze zapytania. Po pomyślnej weryfikacji konto użytkownika zostaje aktywowane i odblokowane do logowania. W przypadku błędnego lub wygasłego tokenu zwracany jest odpowiedni błąd."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Konto zostało pomyślnie aktywowane i można się teraz zalogować."),
            @ApiResponse(responseCode = "400", description = "Nieprawidłowy, przedawniony lub już wcześniej wykorzystany token aktywacyjny.")
    })
    public ResponseEntity<String> activate(
            @Parameter(description = "Jednorazowy token aktywacyjny wygenerowany podczas rejestracji i przesłany w wiadomości e-mail.", required = true)
            @RequestParam String token
    ) {
        authService.activate(token);
        return ResponseEntity.ok("Konto zostało pomyślnie aktywowane.");
    }

    @PostMapping("/login")
    @Operation(
            summary = "Logowanie użytkownika",
            description = "Uwierzytelnia zarejestrowanego użytkownika na podstawie adresu e-mail oraz hasła. W przypadku poprawnych danych zwraca token JWT, który należy dołączać w nagłówku Authorization do wszystkich zapytań chronionych. Użytkownik musi posiadać wcześniej aktywowane konto."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Poprawne zalogowanie. Zwraca token dostępowy JWT."),
            @ApiResponse(responseCode = "401", description = "Nieprawidłowe dane logowania (błędny e-mail lub hasło)."),
            @ApiResponse(responseCode = "403", description = "Konto nie zostało jeszcze aktywowane za pomocą linku e-mail.")
    })
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
