package com.example.spring.controller;

import com.example.spring.dto.WorkoutRequest;
import com.example.spring.dto.WorkoutResponse;
import com.example.spring.service.WorkoutService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/workouts")
@RequiredArgsConstructor
@Tag(name = "Treningi", description = "Operacje dodawania i przeglądania historii treningów zalogowanego użytkownika.")
@SecurityRequirement(name = "bearerAuth")
public class WorkoutController {

    private final WorkoutService workoutService;

    @PostMapping
    @Operation(
            summary = "Dodanie nowego wpisu treningowego",
            description = "Zapisuje nowy wpis treningowy przypisany do aktualnie zalogowanego użytkownika (rozpoznawanego na podstawie tokenu JWT). Wymaga przekazania identyfikatora ćwiczenia, liczby serii, liczby powtórzeń oraz podniesionego ciężaru w kilogramach. Data i czas wykonania treningu rejestrowane są automatycznie na moment wywołania."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Trening został pomyślnie zapisany w bazie danych."),
            @ApiResponse(responseCode = "400", description = "Nieprawidłowe dane treningowe (np. ujemny ciężar, brakujące ID ćwiczenia)."),
            @ApiResponse(responseCode = "401", description = "Brak autoryzacji – użytkownik nie jest zalogowany lub token JWT jest niepoprawny.")
    })
    public ResponseEntity<WorkoutResponse> addWorkout(@RequestBody WorkoutRequest request) {
        return ResponseEntity.ok(workoutService.addWorkout(request));
    }

    @GetMapping("/latest")
    @Operation(
            summary = "Pobranie ostatniego wykonanego treningu",
            description = "Zwraca szczegóły ostatnio zarejestrowanego treningu dla aktualnie uwierzytelnionego użytkownika na podstawie daty wpisu. Dane te wykorzystywane są na pulpicie aplikacji do wyświetlenia podsumowania ostatniej aktywności fizycznej. Jeśli użytkownik nie ma jeszcze zapisanych żadnych treningów, zwracana jest pusta odpowiedź lub odpowiedni błąd."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Pomyślnie zwrócono ostatni trening użytkownika."),
            @ApiResponse(responseCode = "404", description = "Użytkownik nie posiada jeszcze żadnych zarejestrowanych treningów."),
            @ApiResponse(responseCode = "401", description = "Brak autoryzacji – użytkownik nie jest zalogowany.")
    })
    public ResponseEntity<WorkoutResponse> getLatestWorkout() {
        return ResponseEntity.ok(workoutService.getLatestWorkout());
    }
}
