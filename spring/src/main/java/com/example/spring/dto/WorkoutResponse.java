package com.example.spring.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WorkoutResponse {
    private Long id;
    private ExerciseResponse exercise;
    private Integer sets;
    private Integer reps;
    private Double weight;
    private LocalDateTime createdAt;
}
