package com.example.spring.service;

import com.example.spring.dto.ExerciseResponse;
import com.example.spring.dto.WorkoutRequest;
import com.example.spring.dto.WorkoutResponse;
import com.example.spring.model.Exercise;
import com.example.spring.model.User;
import com.example.spring.model.Workout;
import com.example.spring.repository.ExerciseRepository;
import com.example.spring.repository.UserRepository;
import com.example.spring.repository.WorkoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final ExerciseRepository exerciseRepository;
    private final UserRepository userRepository;

    public WorkoutResponse addWorkout(WorkoutRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Exercise exercise = exerciseRepository.findById(request.getExerciseId())
                .orElseThrow(() -> new IllegalArgumentException("Exercise not found"));

        Workout workout = Workout.builder()
                .user(user)
                .exercise(exercise)
                .sets(request.getSets())
                .reps(request.getReps())
                .weight(request.getWeight())
                .build();

        workoutRepository.save(workout);

        return mapToResponse(workout);
    }

    public WorkoutResponse getLatestWorkout() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return workoutRepository.findFirstByUserOrderByCreatedAtDesc(user)
                .map(this::mapToResponse)
                .orElseThrow(() -> new IllegalArgumentException("No workouts found for user"));
    }

    private WorkoutResponse mapToResponse(Workout workout) {
        return WorkoutResponse.builder()
                .id(workout.getId())
                .exercise(ExerciseResponse.builder()
                        .id(workout.getExercise().getId())
                        .name(workout.getExercise().getName())
                        .build())
                .sets(workout.getSets())
                .reps(workout.getReps())
                .weight(workout.getWeight())
                .createdAt(workout.getCreatedAt())
                .build();
    }
}
