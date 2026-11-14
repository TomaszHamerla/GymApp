import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private cookieService: CookieService) {}

  getToken(): string | null {
    const token = this.cookieService.get(this.TOKEN_KEY);
    return token || null;
  }

  setToken(token: string): void {
    // Cookie expires in 1 day (matching backend JWT expiration of 86400000ms)
    this.cookieService.set(this.TOKEN_KEY, token, {
      expires: 1,
      path: '/',
      sameSite: 'Lax',
      secure: false // set to true in production with HTTPS
    });
  }

  removeToken(): void {
    this.cookieService.delete(this.TOKEN_KEY, '/');
  }

  isLoggedIn(): boolean {
    return this.cookieService.check(this.TOKEN_KEY);
  }
}
