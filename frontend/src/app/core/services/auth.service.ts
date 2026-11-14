import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'token';

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data, { responseType: 'text' });
  }

  activate(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/activate?token=${token}`, { responseType: 'text' });
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((res: any) => {
        if (res && res.token) {
          this.cookieService.set(this.tokenKey, res.token, 1, '/'); // 1 day expiration
        }
      })
    );
  }

  logout() {
    this.cookieService.delete(this.tokenKey, '/');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    const token = this.cookieService.get(this.tokenKey);
    return token ? token : null;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;
      return decoded.exp > now;
    } catch (e) {
      return false;
    }
  }
}
