package com.example.spring.controller;

import com.example.spring.dto.ExerciseResponse;
import com.example.spring.service.ExerciseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/exercises")
@RequiredArgsConstructor
@Tag(name = "Ćwiczenia", description = "Zarządzanie bazą dostępnych ćwiczeń treningowych.")
@SecurityRequirement(name = "bearerAuth")
public class ExerciseController {

    private final ExerciseService exerciseService;

    @GetMapping
    @Operation(
            summary = "Pobranie listy wszystkich ćwiczeń",
            description = "Zwraca pełną listę zdefiniowanych w systemie ćwiczeń fizycznych (np. przysiady, wyciskanie sztangi czy martwy ciąg). Dane te są wykorzystywane w aplikacji frontendowej do wyboru ćwiczenia podczas rejestrowania nowej serii. Dostęp do zasobu wymaga przekazania ważnego tokenu JWT w nagłówku zapytania."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Pomyślnie pobrano listę ćwiczeń."),
            @ApiResponse(responseCode = "401", description = "Brak autoryzacji – użytkownik nie jest zalogowany lub token wygasł.")
    })
    public ResponseEntity<List<ExerciseResponse>> getAllExercises() {
        return ResponseEntity.ok(exerciseService.getAllExercises());
    }
}
