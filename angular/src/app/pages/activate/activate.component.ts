import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { AuthService } from '../../services';

type ActivationState = 'loading' | 'success' | 'error';

@Component({
  selector: 'app-activate',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, ProgressSpinnerModule],
  templateUrl: './activate.component.html',
  styleUrl: './activate.component.scss'
})
export class ActivateComponent implements OnInit {
  state: ActivationState = 'loading';
  message = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (!token) {
        this.state = 'error';
        this.errorMessage = 'Brak tokenu aktywacyjnego w adresie URL. Upewnij się, że używasz pełnego linku z wiadomości e-mail.';
        return;
      }

      this.activateAccount(token);
    });
  }

  private activateAccount(token: string): void {
    this.state = 'loading';
    this.authService.activate(token).subscribe({
      next: (response) => {
        this.state = 'success';
        this.message = response || 'Twoje konto zostało pomyślnie aktywowane!';
      },
      error: (err) => {
        this.state = 'error';
        this.errorMessage =
          err?.error?.error ||
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : null) ||
          'Nie udało się aktywować konta. Token mógł wygasnąć lub konto zostało już wcześniej aktywowane.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth']);
  }
}
