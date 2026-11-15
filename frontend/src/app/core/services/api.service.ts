import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getExercises(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/exercises`);
  }

  addWorkout(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/workouts`, data);
  }

  getLatestWorkout(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/workouts/latest`);
  }
}
