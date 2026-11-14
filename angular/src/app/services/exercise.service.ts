import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ExerciseResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private readonly apiUrl = `${environment.apiUrl}/api/exercises`;

  constructor(private http: HttpClient) {}

  /**
   * GET /api/exercises
   * Retrieves all available exercises.
   * @returns list of ExerciseResponse
   */
  getAllExercises(): Observable<ExerciseResponse[]> {
    return this.http.get<ExerciseResponse[]>(this.apiUrl);
  }
}
