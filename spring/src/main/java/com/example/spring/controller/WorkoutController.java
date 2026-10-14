package com.example.spring.controller;

import com.example.spring.dto.WorkoutRequest;
import com.example.spring.dto.WorkoutResponse;
import com.example.spring.service.WorkoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/workouts")
@RequiredArgsConstructor
public class WorkoutController {

    private final WorkoutService workoutService;

    @PostMapping
    public ResponseEntity<WorkoutResponse> addWorkout(@RequestBody WorkoutRequest request) {
        return ResponseEntity.ok(workoutService.addWorkout(request));
    }

    @GetMapping("/latest")
    public ResponseEntity<WorkoutResponse> getLatestWorkout() {
        return ResponseEntity.ok(workoutService.getLatestWorkout());
    }
}
