import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  /**
   * POST /register
   * Registers a new user account.
   * @returns message string on success
   */
  register(request: RegisterRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/register`, request, {
      responseType: 'text'
    });
  }

  /**
   * GET /activate?token=...
   * Activates a user account via email activation token.
   * @returns message string on success
   */
  activate(token: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/activate`, {
      params: { token },
      responseType: 'text'
    });
  }

  /**
   * POST /login
   * Authenticates a user and stores the JWT token in a cookie.
   * @returns AuthResponse with JWT token
   */
  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        this.tokenService.setToken(response.token);
      })
    );
  }

  /**
   * Logs out the user by removing the token cookie.
   */
  logout(): void {
    this.tokenService.removeToken();
  }

  /**
   * Checks if the user is currently authenticated.
   */
  isAuthenticated(): boolean {
    return this.tokenService.isLoggedIn();
  }
}
