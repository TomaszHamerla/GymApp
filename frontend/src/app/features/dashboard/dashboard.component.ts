import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DropdownModule, InputNumberModule, ButtonModule, CardModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  workoutForm: FormGroup;
  exercises: any[] = [];
  latestWorkout: any = null;

  constructor(private fb: FormBuilder, private apiService: ApiService, public authService: AuthService) {
    this.workoutForm = this.fb.group({
      exerciseId: [null, Validators.required],
      sets: [null, [Validators.required, Validators.min(1)]],
      reps: [null, [Validators.required, Validators.min(1)]],
      weight: [null, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadExercises();
    this.loadLatestWorkout();
  }

  loadExercises() {
    this.apiService.getExercises().subscribe({
      next: (data) => this.exercises = data,
      error: (err) => console.error('Failed to load exercises', err)
    });
  }

  loadLatestWorkout() {
    this.apiService.getLatestWorkout().subscribe({
      next: (data) => this.latestWorkout = data,
      error: (err) => console.error('Failed to load latest workout', err)
    });
  }

  onSubmit() {
    if (this.workoutForm.valid) {
      this.apiService.addWorkout(this.workoutForm.value).subscribe({
        next: (data) => {
          this.latestWorkout = data;
          this.workoutForm.reset();
        },
        error: (err) => console.error('Failed to add workout', err)
      });
    }
  }

  logout() {
    this.authService.logout();
  }
}
