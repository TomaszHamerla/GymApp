import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';

import { AuthService } from '../../services';
import { LoginRequest, RegisterRequest } from '../../models';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    TabViewModule,
    ToastModule,
    DividerModule,
    FloatLabelModule
  ],
  providers: [MessageService],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  activeTabIndex = 0;

  loginEmail = '';
  loginPassword = '';
  loginLoading = false;

  registerEmail = '';
  registerPassword = '';
  registerConfirmPassword = '';
  registerLoading = false;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

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

  onLogin(): void {
    if (!this.loginEmail || !this.loginPassword) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Uwaga',
        detail: 'Podaj adres e-mail oraz hasło'
      });
      return;
    }

    this.loginLoading = true;
    const request: LoginRequest = {
      email: this.loginEmail,
      password: this.loginPassword
    };

    this.authService.login(request).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sukces',
          detail: 'Zalogowano pomyślnie! Przekierowywanie...'
        });
        setTimeout(() => this.router.navigate(['/dashboard']), 1000);
      },
      error: (err) => {
        this.loginLoading = false;
        const detailMsg = this.extractErrorMessage(
          err,
          'Nieprawidłowy adres e-mail lub hasło (upewnij się, że konto zostało aktywowane przez e-mail).'
        );
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd logowania',
          detail: detailMsg
        });
      }
    });
  }

  onRegister(): void {
    if (!this.registerEmail || !this.registerPassword || !this.registerConfirmPassword) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Uwaga',
        detail: 'Wypełnij wszystkie wymagane pola formularza'
      });
      return;
    }

    if (this.registerPassword !== this.registerConfirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Błąd walidacji',
        detail: 'Wprowadzone hasła nie są identyczne'
      });
      return;
    }

    this.registerLoading = true;
    const request: RegisterRequest = {
      email: this.registerEmail,
      password: this.registerPassword
    };

    this.authService.register(request).subscribe({
      next: (backendMsg) => {
        this.registerLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Rejestracja udana!',
          detail: backendMsg || 'Twoje konto zostało utworzone! Wysłaliśmy e-mail z linkiem aktywacyjnym. Kliknij w niego, aby aktywować konto.'
        });
        this.loginEmail = this.registerEmail;
        this.registerEmail = '';
        this.registerPassword = '';
        this.registerConfirmPassword = '';
        this.activeTabIndex = 0; // Przełącz na zakładkę logowania
      },
      error: (err) => {
        this.registerLoading = false;
        const detailMsg = this.extractErrorMessage(
          err,
          'Nie udało się zarejestrować konta. Spróbuj ponownie później.'
        );
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd rejestracji',
          detail: detailMsg
        });
      }
    });
  }
}
