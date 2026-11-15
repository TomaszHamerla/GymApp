import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { AuthService } from '../../services';
import { ResetPasswordRequest } from '../../models';

type ResetState = 'form' | 'success' | 'error';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    PasswordModule,
    FloatLabelModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  state: ResetState = 'form';
  token = '';

  newPassword = '';
  confirmPassword = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      if (!this.token) {
        this.state = 'error';
        this.errorMessage = 'Brak tokenu resetującego hasło w adresie URL. Upewnij się, że używasz pełnego linku z otrzymanej wiadomości e-mail.';
      }
    });
  }

  private extractErrorMessage(err: any, fallback: string): string {
    if (err?.error) {
      if (typeof err.error === 'string') {
        return err.error;
      }
      if (err.error.error) {
        return err.error.error;
      }
      if (err.error.message) {
        return err.error.message;
      }
    }
    return fallback;
  }

  onSubmit(): void {
    if (!this.newPassword || !this.confirmPassword) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Uwaga',
        detail: 'Wypełnij oba pola z hasłem'
      });
      return;
    }

    if (this.newPassword.length < 6) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Uwaga',
        detail: 'Hasło musi mieć co najmniej 6 znaków'
      });
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Błąd walidacji',
        detail: 'Wprowadzone hasła nie są identyczne'
      });
      return;
    }

    this.loading = true;
    const request: ResetPasswordRequest = {
      token: this.token,
      newPassword: this.newPassword
    };

    this.authService.resetPassword(request).subscribe({
      next: (msg) => {
        this.loading = false;
        this.state = 'success';
        this.successMessage = msg || 'Twoje hasło zostało pomyślnie zmienione!';
      },
      error: (err) => {
        this.loading = false;
        const detailMsg = this.extractErrorMessage(
          err,
          'Nie udało się zresetować hasła. Link mógł wygasnąć lub został już wcześniej wykorzystany.'
        );
        this.errorMessage = detailMsg;
        this.state = 'error';
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd',
          detail: detailMsg
        });
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth']);
  }
}
