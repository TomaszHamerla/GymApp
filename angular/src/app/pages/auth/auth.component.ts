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

  onLogin(): void {
    if (!this.loginEmail || !this.loginPassword) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Uwaga',
        detail: 'Wypełnij wszystkie pola'
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
          detail: 'Zalogowano pomyślnie!'
        });
        setTimeout(() => this.router.navigate(['/dashboard']), 1000);
      },
      error: (err) => {
        this.loginLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd logowania',
          detail: err.error?.message || err.error || 'Nieprawidłowy email lub hasło'
        });
      }
    });
  }

  onRegister(): void {
    if (!this.registerEmail || !this.registerPassword || !this.registerConfirmPassword) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Uwaga',
        detail: 'Wypełnij wszystkie pola'
      });
      return;
    }

    if (this.registerPassword !== this.registerConfirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Błąd',
        detail: 'Hasła nie są identyczne'
      });
      return;
    }

    this.registerLoading = true;
    const request: RegisterRequest = {
      email: this.registerEmail,
      password: this.registerPassword
    };

    this.authService.register(request).subscribe({
      next: (message) => {
        this.registerLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Rejestracja udana',
          detail: message
        });
        this.registerEmail = '';
        this.registerPassword = '';
        this.registerConfirmPassword = '';
        this.activeTabIndex = 0;
      },
      error: (err) => {
        this.registerLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd rejestracji',
          detail: err.error?.message || err.error || 'Nie udało się zarejestrować'
        });
      }
    });
  }
}
