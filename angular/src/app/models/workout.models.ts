import { ExerciseResponse } from './exercise.models';

export interface WorkoutRequest {
  exerciseId: number;
  sets: number;
  reps: number;
  weight: number;
}

export interface WorkoutResponse {
  id: number;
  exercise: ExerciseResponse;
  sets: number;
  reps: number;
  weight: number;
  createdAt: string;
}
