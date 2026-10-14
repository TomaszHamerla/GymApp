package com.example.spring.repository;

import com.example.spring.model.User;
import com.example.spring.model.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {
    Optional<Workout> findFirstByUserOrderByCreatedAtDesc(User user);
}
