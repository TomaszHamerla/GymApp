package com.example.spring.service;

import com.example.spring.dto.ExerciseResponse;
import com.example.spring.repository.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;

    public List<ExerciseResponse> getAllExercises() {
        return exerciseRepository.findAll().stream()
                .map(exercise -> ExerciseResponse.builder()
                        .id(exercise.getId())
                        .name(exercise.getName())
                        .build())
                .collect(Collectors.toList());
    }
}
