import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { AuthService, ExerciseService, WorkoutService } from '../../services';
import { ExerciseResponse, WorkoutRequest, WorkoutResponse } from '../../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    ToolbarModule,
    DropdownModule,
    InputNumberModule,
    ToastModule,
    TagModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  exercises: ExerciseResponse[] = [];
  selectedExerciseId: number | null = null;
  sets: number | null = 3;
  reps: number | null = 10;
  weight: number | null = 50;

  savingWorkout = false;
  loadingData = true;

  latestWorkout: WorkoutResponse | null = null;
  noLatestWorkout = false;

  constructor(
    private authService: AuthService,
    private exerciseService: ExerciseService,
    private workoutService: WorkoutService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadExercises();
    this.loadLatestWorkout();
  }

  loadExercises(): void {
    this.exerciseService.getAllExercises().subscribe({
      next: (data) => {
        this.exercises = data;
        if (data.length > 0 && !this.selectedExerciseId) {
          this.selectedExerciseId = data[0].id;
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd',
          detail: 'Nie udało się pobrać listy ćwiczeń'
        });
      }
    });
  }

  loadLatestWorkout(): void {
    this.loadingData = true;
    this.workoutService.getLatestWorkout().subscribe({
      next: (data) => {
        this.latestWorkout = data;
        this.noLatestWorkout = !data;
        this.loadingData = false;
      },
      error: (err) => {
        this.loadingData = false;
        // 404 or empty if no workout exists yet
        if (err.status === 404) {
          this.noLatestWorkout = true;
          this.latestWorkout = null;
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Informacja',
            detail: 'Brak wcześniejszych treningów do wyświetlenia.'
          });
        }
      }
    });
  }

  onSaveWorkout(): void {
    if (!this.selectedExerciseId || !this.sets || !this.reps || this.weight === null) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Uwaga',
        detail: 'Wypełnij wszystkie pola formularza treningowego'
      });
      return;
    }

    this.savingWorkout = true;
    const request: WorkoutRequest = {
      exerciseId: this.selectedExerciseId,
      sets: this.sets,
      reps: this.reps,
      weight: this.weight
    };

    this.workoutService.addWorkout(request).subscribe({
      next: (saved) => {
        this.savingWorkout = false;
        this.latestWorkout = saved;
        this.noLatestWorkout = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Sukces',
          detail: 'Trening został pomyślnie zapisany!'
        });
      },
      error: (err) => {
        this.savingWorkout = false;
        const detailMsg =
          err?.error?.error ||
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : null) ||
          'Nie udało się zapisać treningu. Spróbuj ponownie.';
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd zapisu',
          detail: detailMsg
        });
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
