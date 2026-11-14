import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { WorkoutRequest, WorkoutResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private readonly apiUrl = `${environment.apiUrl}/api/workouts`;

  constructor(private http: HttpClient) {}

  /**
   * POST /api/workouts
   * Adds a new workout entry for the authenticated user.
   * @returns the created WorkoutResponse
   */
  addWorkout(request: WorkoutRequest): Observable<WorkoutResponse> {
    return this.http.post<WorkoutResponse>(this.apiUrl, request);
  }

  /**
   * GET /api/workouts/latest
   * Retrieves the latest workout for the authenticated user.
   * @returns WorkoutResponse
   */
  getLatestWorkout(): Observable<WorkoutResponse> {
    return this.http.get<WorkoutResponse>(`${this.apiUrl}/latest`);
  }
}
