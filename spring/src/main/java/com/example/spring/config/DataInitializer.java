package com.example.spring.config;

import com.example.spring.model.Exercise;
import com.example.spring.repository.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ExerciseRepository exerciseRepository;

    @Override
    public void run(String... args) {
        if (exerciseRepository.count() == 0) {
            List<Exercise> exercises = Arrays.asList(
                    Exercise.builder().name("Przysiad").build(),
                    Exercise.builder().name("Wyciskanie sztangi leżąc").build(),
                    Exercise.builder().name("Martwy ciąg").build(),
                    Exercise.builder().name("Wyciskanie żołnierskie").build(),
                    Exercise.builder().name("Podciąganie").build()
            );
            exerciseRepository.saveAll(exercises);
        }
    }
}
